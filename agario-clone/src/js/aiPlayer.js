import Player from './player.js';

class AIPlayer extends Player {
    constructor(x, y, initialSize) {
        super(x, y, initialSize);
        this.targetX = x;
        this.targetY = y;
        this.updateTargetInterval = 500;
        this.lastUpdate = 0;
        this.speed = 3;
    }

    draw(ctx) {
        // Draw AI circle with different color
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'red'; // Different color for AI
        ctx.fill();
        ctx.closePath();

        // Reuse score display from parent class
        super.draw(ctx);
    }

    updateTarget(foods, time, player) {
        if (!player) return; // Add safety check
        
        if (time - this.lastUpdate > this.updateTargetInterval) {
            // Check if player is nearby and dangerous
            const dx = player.x - this.x;
            const dy = player.y - this.y;
            const distanceToPlayer = Math.sqrt(dx * dx + dy * dy);
            const dangerRadius = player.size * 3; // Detection radius
            
            if (distanceToPlayer < dangerRadius && player.size > this.size) {
                // Flee from player
                this.targetX = this.x - dx * 2; // Run in opposite direction
                this.targetY = this.y - dy * 2;
                
                // Keep within world bounds
                this.targetX = Math.max(this.size, Math.min(this.targetX, this.worldWidth - this.size));
                this.targetY = Math.max(this.size, Math.min(this.targetY, this.worldHeight - this.size));
            } else {
                // Normal food seeking behavior
                let closestFood = null;
                let minDistance = Infinity;
                
                foods.forEach(food => {
                    if (!food.active) return;
                    const dx = food.x - this.x;
                    const dy = food.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestFood = food;
                    }
                });

                if (closestFood) {
                    this.targetX = closestFood.x;
                    this.targetY = closestFood.y;
                } else {
                    this.targetX = Math.random() * this.worldWidth;
                    this.targetY = Math.random() * this.worldHeight;
                }
            }
            
            this.lastUpdate = time;
        }

        // Always move towards target
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            const dirX = dx / distance;
            const dirY = dy / distance;
            super.move(dirX, dirY, distance);
        }
    }

    addScore(points) {
        const roundedPoints = Math.floor(points);
        this.score = Math.min(this.score + roundedPoints, Player.MAX_SIZE);
        this.size = Math.min(this.size + (roundedPoints * 0.3), Player.MAX_SIZE);
    }

    grow(amount) {
        const roundedAmount = Math.floor(amount);
        const newSize = Math.min(this.size + (roundedAmount * 0.3), Player.MAX_SIZE);
        this.size = newSize;
        this.score = Math.floor(this.score + roundedAmount);
    }
}

export default AIPlayer;