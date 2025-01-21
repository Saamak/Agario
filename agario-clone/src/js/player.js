class Player {
    static MAX_SIZE = 1000; // Static property for all players including AI

    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = Math.min(size, Player.MAX_SIZE);
        this.speed = 1;
        this.worldWidth = window.innerWidth * 4;
        this.worldHeight = window.innerHeight * 4;
        this.minSpeed = 1;
        this.maxSpeed = 4;
        this.score = this.size;
        this.buffEndTime = 0;
        this.hasBuff = false;
        this.buffDuration = 0;
        this.originalMinSpeed = this.minSpeed;
        this.originalMaxSpeed = this.maxSpeed;
    }

    move(dx, dy, distance) {
        const speedFactor = Math.min(distance / 500, 1);
        const currentSpeed = this.minSpeed + (this.maxSpeed - this.minSpeed) * speedFactor;
        
        this.x += dx * currentSpeed;
        this.y += dy * currentSpeed;
        
        this.x = Math.max(this.size, Math.min(this.x, this.worldWidth - this.size));
        this.y = Math.max(this.size, Math.min(this.y, this.worldHeight - this.size));
    }

    grow(amount) {
        // const roundedAmount = Math.floor(amount);
        this.size = Math.min(this.size + amount, Player.MAX_SIZE);
    }

    draw(context) {
        // Draw player circle
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fillStyle = 'green';
        context.fill();
        context.closePath();

        // Draw cooldown bar if buff is active
        if (this.hasBuff) {
            const currentTime = performance.now();
            const remainingTime = this.buffEndTime - currentTime;
            const progress = remainingTime / this.buffDuration;
            
            if (progress > 0) {
                // Draw outer cooldown arc
                context.beginPath();
                context.arc(
                    this.x, 
                    this.y, 
                    this.size + 5,  // Slightly larger than player
                    -Math.PI/2,     // Start at top
                    -Math.PI/2 + (2 * Math.PI * progress), // Progress angle
                    false          // Clockwise
                );
                context.strokeStyle = '#00FFFF';
                context.lineWidth = 5;
                context.stroke();
                context.closePath();
            } else {
                this.hasBuff = false;
            }
        }

        // Draw score
        context.fillStyle = 'white';
        context.font = `${Math.max(12, this.size/3)}px Arial`;
        context.textAlign = 'center';
        context.textBaseline = 'middle'; 
        context.fillText(this.score.toString(), this.x, this.y);
    }

    addScore(points) {
        const roundedPoints = Math.floor(points);
        this.score = Math.min(this.score + roundedPoints, Player.MAX_SIZE);
    }
}

export default Player;