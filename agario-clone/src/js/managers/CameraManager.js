export default class CameraManager {
    constructor(canvas, worldWidth, worldHeight) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
        this.x = 0;
        this.y = 0;
        
        // Zoom properties
        this.zoom = 1;
        this.targetZoom = 1;
        this.minZoom = 0.15; // Allow more zoom out for larger players
        this.maxZoom = 3;  // Allow closer zoom for smaller players
        this.smoothFactor = 0.03;
    }

    lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    getWorldCoordinates(screenX, screenY) {
        return {
            x: (screenX / this.zoom) + this.x,
            y: (screenY / this.zoom) + this.y
        };
    }

    update(playerX, playerY, playerSize) {
        // Dynamic zoom based on player size
        // More zoom out as size increases
        const baseZoom = 1.5; // Starting zoom for small players
        const sizeEffect = Math.log(playerSize + 10) / Math.log(10); // Logarithmic scaling
        this.targetZoom = Math.min(
            this.maxZoom,
            Math.max(this.minZoom, baseZoom / sizeEffect)
        );
        
        // Smooth zoom transition
        this.zoom = this.lerp(this.zoom, this.targetZoom, this.smoothFactor);
        
        // Calculate viewport with zoom
        const viewportWidth = this.canvas.width / this.zoom;
        const viewportHeight = this.canvas.height / this.zoom;
        
        // Calculate target camera position
        this.targetX = playerX - (viewportWidth / 2);
        this.targetY = playerY - (viewportHeight / 2);
        
        // Apply boundaries to target
        this.targetX = Math.max(0, Math.min(this.targetX, this.worldWidth - viewportWidth));
        this.targetY = Math.max(0, Math.min(this.targetY, this.worldHeight - viewportHeight));
        
        // Smooth position transition
        this.x = this.lerp(this.x, this.targetX, this.smoothFactor);
        this.y = this.lerp(this.y, this.targetY, this.smoothFactor);
    }

    beginDraw() {
        this.ctx.save();
        // Apply zoom transformation
        this.ctx.scale(this.zoom, this.zoom);
        this.ctx.translate(-this.x, -this.y);
    }

    endDraw() {
        this.ctx.restore();
    }
}