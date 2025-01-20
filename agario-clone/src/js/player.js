class Player {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = 3; // Reduced speed for smoother movement
        this.worldWidth = window.innerWidth * 4;
        this.worldHeight = window.innerHeight * 4;
        this.minSpeed = 1;
        this.maxSpeed = 4;
    }

    move(dx, dy, distance) {
        // Adjust speed based on distance
        const speedFactor = Math.min(distance / 500, 1); // 500 = max distance for full speed
        const currentSpeed = this.minSpeed + (this.maxSpeed - this.minSpeed) * speedFactor;
        
        // Apply movement
        this.x += dx * currentSpeed;
        this.y += dy * currentSpeed;
        
        // World boundaries
        this.x = Math.max(this.size, Math.min(this.x, this.worldWidth - this.size));
        this.y = Math.max(this.size, Math.min(this.y, this.worldHeight - this.size));
    }

    grow(amount) {
        this.size += amount;
    }

    draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fillStyle = 'green';
        context.fill();
        context.closePath();
    }
}

export default Player;