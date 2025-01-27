import Projectile from './projectile.js';

class Player {
    static MAX_SIZE = 1000; // Static property for all players including AI

    constructor(x, y, size, nickname, skin) {
        this.x = x;
        this.y = y;
        this.size = Math.min(size, Player.MAX_SIZE);
        this.speed = 1;
        this.worldWidth = window.innerWidth * 4;
        this.worldHeight = window.innerHeight * 4;
        this.minSpeed = 1;
        this.maxSpeed = 4;
        this.score = this.size;
        this.nickname = nickname; // Add nickname property
        this.skin = skin; // Add skin property
        this.buffEndTime = 0;
        this.hasBuff = false;
        this.buffDuration = 0;
        this.originalMinSpeed = this.minSpeed;
        this.originalMaxSpeed = this.maxSpeed;
        this.canShoot = false;
        this.projectiles = [];
        this.shootCooldown = 500; // 500ms between shots 
        this.lastShootTime = 0;
        this.projectileSpeed = 15;
        this.projectileSize = 10;

        // Load the skin image
        if (this.skin) {
            this.skinImage = new Image();
            this.skinImage.src = this.skin;
            this.skinImage.onload = () => {
                console.log('Player skin loaded successfully');
            };
            this.skinImage.onerror = () => {
                console.error('Failed to load player skin');
            };
        }
    }

    move(dx, dy, distance) {
        const speedFactor = Math.min(distance / 500, 1);
        const currentSpeed = this.minSpeed + (this.maxSpeed - this.minSpeed) * speedFactor;
        
        this.x += dx * currentSpeed;
        this.y += dy * currentSpeed;
        
        this.x = Math.max(this.size, Math.min(this.x, this.worldWidth - this.size));
        this.y = Math.max(this.size, Math.min(this.y, this.worldHeight - this.size));
    }

    draw(context) {
        if (this.skin && this.skinImage && this.skinImage.complete) {
            // Draw skin image
            context.save();
            context.beginPath();
            context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            context.clip();
            context.drawImage(
                this.skinImage, 
                this.x - this.size, 
                this.y - this.size, 
                this.size * 2, 
                this.size * 2
            );
            context.restore();
        } else {
            // Fallback to default circle
            context.beginPath();
            context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            context.fillStyle = 'green';
            context.fill();
            context.closePath();
        }

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
                    this.size + 2,  // Slightly larger than player
                    -Math.PI/2,     // Start at top
                    -Math.PI/2 + (2 * Math.PI * progress), // Progress angle
                    false          // Clockwise
                );
                context.strokeStyle = '#00FFFF';
                context.lineWidth = 15;
                context.stroke();
                context.closePath();
            } else {
                this.hasBuff = false;
            }
        }

        // Draw score
        context.fillStyle = 'white';
        context.font = `${Math.max(12, this.size / 3)}px Arial`;
        context.textAlign = 'center';
        context.textBaseline = 'middle'; 
        context.fillText(this.score.toString(), this.x, this.y);

        // Draw nickname above score with adjustable offset
        const nicknameOffset = this.size - 60; // Adjust this value to change position
        context.fillText(this.nickname, this.x, this.y - nicknameOffset);
    }

    addScore(points) {
        const roundedPoints = Math.floor(points);
        this.score = Math.min(this.score + roundedPoints, Player.MAX_SIZE);
        this.size = Math.min(Math.sqrt(this.score) * 10, Player.MAX_SIZE); // Adjust size based on score
    }

    shoot(mouseX, mouseY) {
        if (!this.canShoot) return;
        
        const currentTime = performance.now();
        if (currentTime - this.lastShootTime < this.shootCooldown) return;
        
        // Calculate direction
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const dirX = dx / distance;
        const dirY = dy / distance;
        
        // Calculate spawn point at player's edge
        const spawnX = this.x + (dirX * this.size); // Start at edge
        const spawnY = this.y + (dirY * this.size);
        
        // Create new projectile from edge
        const projectile = new Projectile(
            spawnX,
            spawnY,
            dirX,
            dirY,
            this.projectileSpeed,
            this.projectileSize // Set the size of the projectile
        );
        
        this.projectiles.push(projectile);
        this.lastShootTime = currentTime;
    }
    
    updateProjectiles() {
        this.projectiles = this.projectiles.filter(projectile => {
            projectile.update();
            
            // Remove projectiles that are out of bounds
            if (projectile.x < 0 || projectile.x > this.worldWidth ||
                projectile.y < 0 || projectile.y > this.worldHeight) {
                return false;
            }
            
            return projectile.active;
        });
    }
}

export default Player;