const PowerType = {
    SPEED: 'speed',
    SIZE: 'size',
    SHOOT: 'shoot' // Add new power type
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
        this.type = this.getRandomType();
        this.color = this.getColorForType();
        
        // Buff properties
        this.buffDuration = 3000; // Normal buff duration
        this.buffDurationShoot = 3000; // Shoot buff duration
        this.speedMultiplier = 1.5; // Lower multiplier for better control
        this.sizeMultiplier = 35; // Increase to 50
        
        // Rotation
        this.angle = 0;
        this.rotationSpeed = 0.05; // Radians per frame

        // Glow properties
        this.glowIntensity = 50;
        this.glowMax = 100;
        this.glowSpeed = 0.9;
        this.glowDirection = 5;

        this.respawnTime = 0;

        // Add shoot properties
        this.projectiles = [];
        this.canShoot = false;
        this.shootCooldown = 300; // Faster shooting while buffed
        this.lastShootTime = 0;
    }

    getRandomType() {
        const types = Object.values(PowerType);
        return types[Math.floor(Math.random() * types.length)];
    }

    getColorForType() {
        switch(this.type) {
            case PowerType.SPEED: return '#00FFFF';
            case PowerType.SIZE: return '#FF69B4';
            case PowerType.SHOOT: return '#FF0000';
            default: return '#FFFFFF';
        }
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
        if (this.type === PowerType.SHOOT) {
            // Store original cooldown
            const originalCooldown = player.shootCooldown;
            
            // Enable shooting with faster cooldown
            player.canShoot = true;
            player.hasBuff = true;
            player.buffDuration = this.buffDurationShoot;
            player.buffEndTime = performance.now() + this.buffDurationShoot;
            player.shootCooldown = this.shootCooldown;
            
            // Reset projectiles array
            player.projectiles = [];
            
            // Disable shooting and restore original cooldown after duration
            setTimeout(() => {
                player.canShoot = false;
                player.hasBuff = false;
                player.shootCooldown = originalCooldown;
                player.projectiles = [];
            }, this.buffDurationShoot);
        } else if (this.type === PowerType.SPEED) {
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
        } else if (this.type === PowerType.SIZE) {
            // Size buff
            player.addScore(Math.floor(this.sizeMultiplier));
        }
    }
}
export default Power;