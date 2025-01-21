const PowerType = {
    SPEED: 'speed',
    SIZE: 'size'
};

class Power {
    static RESPAWN_TIME = 5000; // 5 seconds respawn time
    
    constructor(worldWidth, worldHeight) {
        // Position
        this.x = Math.random() * worldWidth;
        this.y = Math.random() * worldHeight;
        
        // Properties
        this.size = 35;
        this.active = true;
        this.type = Math.random() < 0.5 ? PowerType.SPEED : PowerType.SIZE;
        this.color = this.type === PowerType.SPEED ? '#00FFFF' : '#FF69B4'; // Cyan for speed, Pink for size
        
        // Buff properties
        this.buffDuration = 3000; // Increase to 3 seconds 
        this.speedMultiplier = 1.5; // Lower multiplier for better control
        this.sizeMultiplier = 1.1;
        
        // Rotation
        this.angle = 0;
        this.rotationSpeed = 0.05; // Radians per frame

        // Glow properties
        this.glowIntensity = 10;
        this.glowMax = 20;
        this.glowSpeed = 0.1;
        this.glowDirection = 1;

        this.respawnTime = 0;
    }

    draw(ctx) {
        if (!this.active) return;
        
        // Update glow
        this.glowIntensity += this.glowSpeed * this.glowDirection;
        if (this.glowIntensity >= this.glowMax || this.glowIntensity <= 0) {
            this.glowDirection *= -1;
        }
        
        // Apply glow effect
        ctx.save();
        ctx.shadowBlur = this.glowIntensity;
        ctx.shadowColor = this.color;
        
        // Update rotation
        this.angle += this.rotationSpeed;
        
        // Draw rotating star
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.translate(-this.x, -this.y);
        
        // Star shape
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
            const x = this.x + Math.cos(angle) * this.size;
            const y = this.y + Math.sin(angle) * this.size;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath();
        
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }

    spawn(worldWidth, worldHeight) {
        this.x = Math.random() * worldWidth;
        this.y = Math.random() * worldHeight;
        this.active = true;
    }

    collect() {
        this.active = false;
    }

    applyEffect(player) {
        if (this.type === PowerType.SPEED) {
            // Store original speeds before applying buff
            const originalMinSpeed = player.minSpeed;
            const originalMaxSpeed = player.maxSpeed;
            
            // Apply speed buff
            player.minSpeed *= this.speedMultiplier;
            player.maxSpeed *= this.speedMultiplier;
            player.hasBuff = true;
            player.buffDuration = this.buffDuration;
            player.buffEndTime = performance.now() + this.buffDuration;
            
            // Reset speed after duration
            setTimeout(() => {
                player.minSpeed = originalMinSpeed;
                player.maxSpeed = originalMaxSpeed;
                player.hasBuff = false;
            }, this.buffDuration);
        } else {
            // Size buff
            const growAmount = player.size * (this.sizeMultiplier - 1);
            player.addScore(Math.floor(growAmount));
            player.grow(growAmount);
        }
    }
}

export default Power;