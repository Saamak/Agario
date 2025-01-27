import Player from './player.js';
import AIPlayer from './aiPlayer.js';
import Food from './food.js';
import Power from './power.js';
import CameraManager from './managers/CameraManager.js';
import CollisionManager from './managers/CollisionManager.js';

class Game {
    constructor(playerCount, nickname, skin) {
        // Canvas setup
        this.canvas = document.getElementById('gameCanvas');
        if (!this.canvas) {
            console.error('Canvas not found');
            return;
        }
        this.ctx = this.canvas.getContext('2d');
        
        // World dimensions
        this.worldWidth = window.innerWidth * 4;
        this.worldHeight = window.innerHeight * 4;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        // Mouse position
        this.screenMouseX = 0;
        this.screenMouseY = 0;

        // Load AI names and initialize game elements
        AIPlayer.loadNames().then(() => {
            this.initializeGameElements(playerCount, nickname, skin);
            
            // Managers
            this.cameraManager = new CameraManager(this.canvas, this.worldWidth, this.worldHeight);
            this.collisionManager = new CollisionManager(this);
            
            // Start game
            this.setupEventListeners();
            this.gameLoop();
        });
    }

    initializeGameElements(playerCount, nickname, skin) {
        // Player
        this.player = new Player(this.worldWidth / 2, this.worldHeight / 2, 100, nickname, skin);
        
        // Food
        const NUM_FOODS = 1000;
        this.foods = Array(NUM_FOODS).fill().map(() => 
            new Food(this.worldWidth, this.worldHeight)
        );
        
        // Powers
        const NUM_POWERS = 50;
        this.powers = Array(NUM_POWERS).fill().map(() => 
            new Power(this.worldWidth, this.worldHeight)
        );
        
        // AI Players
        this.initAIPlayers();
        
        // AI Respawn
        this.deadAIs = [];
        this.AI_RESPAWN_TIME = 10000;
    }

    update() {
        const currentTime = performance.now();
        
        // Update positions
        this.updatePlayerPosition();
        this.updateAIPositions(currentTime);
        this.updateFood(currentTime);
        
        // Update projectiles if player can shoot
        if (this.player.canShoot) {
            this.player.updateProjectiles();
        }
        
        // Check collisions
        this.collisionManager.checkCollisions();
        
        // Update camera
        this.cameraManager.update(this.player.x, this.player.y, this.player.size);
    }

    updatePlayerPosition() {
        const worldMouse = this.cameraManager.getWorldCoordinates(
            this.screenMouseX, 
            this.screenMouseY
        );
        
        const dx = worldMouse.x - this.player.x;
        const dy = worldMouse.y - this.player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            const dirX = dx / distance;
            const dirY = dy / distance;
            this.player.move(dirX, dirY, distance);
        }
    }

    updateAIPositions(currentTime) {
        // Check for AI respawns
        this.deadAIs = this.deadAIs.filter(deadAI => {
            if (currentTime >= deadAI.respawnTime) {
                const x = Math.random() * this.worldWidth;
                const y = Math.random() * this.worldHeight;
                this.aiPlayers.push(new AIPlayer(x, y, deadAI.size));
                return false;
            }
            return true;
        });

        // Update AI movement - Pass player reference
        this.aiPlayers.forEach(ai => {
            ai.worldWidth = this.worldWidth;
            ai.worldHeight = this.worldHeight;
            ai.updateTarget(this.foods, currentTime, this.player); // Add this.player
        });
    }

    updateFood(currentTime) {
        this.foods.forEach(food => food.update(currentTime));
    }

    draw() {
        // Clear and prepare canvas
        this.ctx.fillStyle = '#f0f0f0';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.cameraManager.beginDraw();
        
        // Draw game elements
        this.foods.forEach(food => {
            if (food.active) food.draw(this.ctx);
        });
        
        this.powers.forEach(power => {
            if (power.active) power.draw(this.ctx);
        });
        
        this.aiPlayers.forEach(ai => ai.draw(this.ctx));
        this.player.draw(this.ctx);
        
        // Draw projectiles if player can shoot
        if (this.player.canShoot) {
            this.player.projectiles.forEach(p => p.draw(this.ctx));
        }
        
        this.cameraManager.endDraw();
    }

    initAIPlayers() {
        const NUM_AI_PLAYERS = 150;
        const MIN_SIZE = 15;
        const MAX_SIZE = 50;

        this.aiPlayers = Array(NUM_AI_PLAYERS).fill().map(() => {
            const x = Math.random() * this.worldWidth;
            const y = Math.random() * this.worldHeight;
            const initialSize = Math.floor(MIN_SIZE + Math.random() * (MAX_SIZE - MIN_SIZE));
            const ai = new AIPlayer(x, y, initialSize);
            ai.score = initialSize;
            return ai;
        });
    }

    setupEventListeners() {
        window.addEventListener('mousemove', (e) => {
            this.screenMouseX = e.clientX;
            this.screenMouseY = e.clientY;
        });

        // Add space key listener
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && this.player.canShoot) {
                const worldMouse = this.cameraManager.getWorldCoordinates(
                    this.screenMouseX,
                    this.screenMouseY
                );
                this.player.shoot(worldMouse.x, worldMouse.y);
            }
        });
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new Game();
});

export default Game;