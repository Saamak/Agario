import Player from './player.js';

class AIPlayer extends Player {
    constructor(x, y, size) {
        super(x, y, size);
        this.targetX = x;
        this.targetY = y;
        this.updateTargetInterval = 2000; // Change direction every 2s
        this.lastUpdate = 0;
        this.speed = 2; // Slower than player
    }

    updateTarget(foods, time) {
        if (time - this.lastUpdate > this.updateTargetInterval) {
            // Find closest food
            let closestFood = foods.reduce((closest, food) => {
                const dx = food.x - this.x;
                const dy = food.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                return distance < closest.distance ? {food, distance} : closest;
            }, {food: null, distance: Infinity}).food;

            if (closestFood) {
                this.targetX = closestFood.x;
                this.targetY = closestFood.y;
            } else {
                // Random movement if no food found
                this.targetX = Math.random() * this.worldWidth;
                this.targetY = Math.random() * this.worldHeight;
            }
            this.lastUpdate = time;
        }
    }
}

export default AIPlayer;