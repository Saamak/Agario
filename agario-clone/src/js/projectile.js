class Projectile {
    constructor(x, y, dirX, dirY, speed, size) {
        this.x = x;
        this.y = y;
        this.dirX = dirX;
        this.dirY = dirY;
        this.speed = speed;
        this.size = size; // Set the size of the projectile
        this.active = true;
    }

    update() {
        this.x += this.dirX * this.speed;
        this.y += this.dirY * this.speed;
    }

    draw(ctx) {
        const laserLength = 20; // Length of laser beam
        const laserWidth = this.size;   // Width of laser beam based on size
        
        // Calculate end point of laser
        const endX = this.x + this.dirX * laserLength;
        const endY = this.y + this.dirY * laserLength;
        
        // Add glow effect
        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#FF0000';
        ctx.lineWidth = laserWidth;
        ctx.strokeStyle = '#FF0000';
        
        // Draw laser beam
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        
        ctx.restore();
    }

    checkCollision(target) {
        const dx = this.x - target.x;
        const dy = this.y - target.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < target.size;
    }
}

export default Projectile;