export default class CameraManager {
    constructor(canvas, worldWidth, worldHeight) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
        this.x = 0;
        this.y = 0;
        this.zoom = 1; // Default zoom level
        this.minZoom = 0.3;
        this.maxZoom = 1;
    }

    getWorldCoordinates(screenX, screenY) {
        return {
            x: (screenX / this.zoom) + this.x,
            y: (screenY / this.zoom) + this.y
        };
    }

    update(playerX, playerY, score) {
        // Calculate zoom based on score
        const zoomFactor = Math.max(this.minZoom, this.maxZoom - (score / 1000));
        this.zoom = Math.min(this.maxZoom, zoomFactor);
        
        // Calculate viewport with zoom
        const viewportWidth = this.canvas.width / this.zoom;
        const viewportHeight = this.canvas.height / this.zoom;
        
        // Center on player
        this.x = playerX - (viewportWidth / 2);
        this.y = playerY - (viewportHeight / 2);
        
        // Apply boundaries
        this.x = Math.max(0, Math.min(this.x, this.worldWidth - viewportWidth));
        this.y = Math.max(0, Math.min(this.y, this.worldHeight - viewportHeight));
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