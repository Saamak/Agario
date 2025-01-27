import Player from './player.js';

class AIPlayer extends Player {
    static AI_MAX_SIZE = 500; // Smaller max size than player
    static AI_MIN_SIZE = 20; // New minimum size constant
    static names = [];

    constructor(x, y, initialSize, nickname = 'AI') {
        super(x, y, initialSize);
        this.targetX = x;
        this.targetY = y;
        this.updateTargetInterval = 100;
        this.lastUpdate = 0;
        this.speed = 3;
        this.size = Math.min(initialSize, AIPlayer.AI_MAX_SIZE);
        this.nickname = this.getRandomName(); // Assign random name
        this.color = this.getRandomColor(); // Assign random color
    }

    static async loadNames() {
        const response = await fetch('../names.json');
        AIPlayer.names = await response.json();
    }

    getRandomName() {
        if (AIPlayer.names.length === 0) return 'AI';
        return AIPlayer.names[Math.floor(Math.random() * AIPlayer.names.length)];
    }

    getRandomColor() {
        const colors = ['blue', 'green', 'pink', 'black', 'orange'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    draw(ctx) {
        // Draw AI circle with random color
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color; // Use random color
        ctx.fill();
        ctx.closePath();

        // Draw nickname inside AI cell, just above the score
        ctx.fillStyle = 'white';
        ctx.font = `${Math.max(12, this.size/3)}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const nicknameOffset = this.size / 3; // Adjust this value to change position
        ctx.fillText(this.nickname, this.x, this.y - nicknameOffset);

        // Draw score below nickname
        const scoreOffset = this.size / 6; // Adjust this value to change position
        ctx.fillText(this.score.toString(), this.x, this.y + scoreOffset);
    }

    updateTarget(foods, time, player) {
        if (!player) return; // Add safety check
        
        if (time - this.lastUpdate > this.updateTargetInterval) {
            // Check if player is nearby and dangerous
            const dx = player.x - this.x;
            const dy = player.y - this.y;
            const distanceToPlayer = Math.sqrt(dx * dx + dy * dy);
            const dangerRadius = player.size * 2; // Detection radius
            
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
        this.score = Math.min(this.score + roundedPoints, AIPlayer.AI_MAX_SIZE);
        this.size = Math.max(Math.min(Math.sqrt(this.score) * 10, AIPlayer.AI_MAX_SIZE), AIPlayer.AI_MIN_SIZE);
    }

    updateSize() {
        this.size = Math.max(Math.min(Math.sqrt(this.score) * 10, AIPlayer.AI_MAX_SIZE), AIPlayer.AI_MIN_SIZE);
    }

    reduceSize(amount) {
        // Reduce score first
        this.score = Math.max(this.score - amount, AIPlayer.AI_MIN_SIZE);
        // Update size based on new score
        this.size = Math.max(Math.sqrt(this.score) * 10, AIPlayer.AI_MIN_SIZE);
    }
}

export default AIPlayer;