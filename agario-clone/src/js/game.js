import Player from './player.js';
import Food from './food.js';
import AIPlayer from './aiPlayer.js';

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.mouseLerpFactor = 0.1; // Smoothing factor

        // Dimensions du monde
        this.worldWidth = window.innerWidth * 4;
        this.worldHeight = window.innerHeight * 4;

        // Configuration du canvas
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        // Caméra
        this.camera = {
            x: 0,
            y: 0
        };
        
        // Initialisation
        this.player = new Player(this.worldWidth/2, this.worldHeight/2, 20);
        this.foods = Array(200).fill().map(() => new Food(this.worldWidth, this.worldHeight));
        this.score = 0;
        
        // Add AI players with random spawn and size
        const NUM_AI_PLAYERS = 50;
        const MIN_SIZE = 15;
        const MAX_SIZE = 30;

        this.aiPlayers = Array(NUM_AI_PLAYERS).fill().map(() => {
            // Random spawn position anywhere on the map
            const x = Math.random() * this.worldWidth;
            const y = Math.random() * this.worldHeight;
            
            // Random initial size
            const initialSize = MIN_SIZE + Math.random() * (MAX_SIZE - MIN_SIZE);
            
            return new AIPlayer(x, y, initialSize);
        });

        // Gestion de la souris
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetX = this.worldWidth/2;
        this.targetY = this.worldHeight/2;
        this.screenMouseX = this.canvas.width/2;
        this.screenMouseY = this.canvas.height/2;
        this.setupEventListeners();
        
        // Démarrage du jeu
        this.gameLoop();
    }

    updateCamera() {
        // Centre la caméra sur le joueur
        this.camera.x = this.player.x - this.canvas.width/2;
        this.camera.y = this.player.y - this.canvas.height/2;
        
        // Limites de la caméra
        this.camera.x = Math.max(0, Math.min(this.camera.x, this.worldWidth - this.canvas.width));
        this.camera.y = Math.max(0, Math.min(this.camera.y, this.worldHeight - this.canvas.height));
    }
    
    setupEventListeners() {
        window.addEventListener('mousemove', (e) => {
            // Store raw screen coordinates
            this.screenMouseX = e.clientX;
            this.screenMouseY = e.clientY;
        });
    }
    
    update() {
        const worldMouseX = this.screenMouseX + this.camera.x;
        const worldMouseY = this.screenMouseY + this.camera.y;
        
        const dx = worldMouseX - this.player.x;
        const dy = worldMouseY - this.player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const dirX = dx / (distance || 1);
        const dirY = dy / (distance || 1);
        
        this.player.move(dirX, dirY, distance);
        
        this.updateCamera();
        this.checkCollisions();

        // Update AI players
        const time = performance.now();
        this.aiPlayers.forEach(ai => {
            ai.updateTarget(this.foods, time);
            const dx = ai.targetX - ai.x;
            const dy = ai.targetY - ai.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const dirX = dx / (distance || 1);
            const dirY = dy / (distance || 1);
            ai.move(dirX, dirY, distance);
        });

        // Check collisions between players
        this.checkPlayerCollisions();
    }
    
    checkCollisions() {
        this.foods = this.foods.filter((food, index) => {
            const dx = this.player.x - food.x;
            const dy = this.player.y - food.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if(distance < this.player.size) {
                this.player.grow(5);
                this.score++;
                return false;
            }
            return true;
        });
        
        // Ajout de nouvelle nourriture
        while(this.foods.length < 50) {
            this.foods.push(new Food(this.canvas));
        }
    }

    checkPlayerCollisions() {
        // Player vs AI collisions
        this.aiPlayers = this.aiPlayers.filter(ai => {
            const dx = this.player.x - ai.x;
            const dy = this.player.y - ai.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < Math.max(this.player.size, ai.size)) {
                if (this.player.size > ai.size) {
                    this.player.grow(ai.size / 2);
                    return false;
                }
            }
            return true;
        });
    }
    
    draw() {
        // Clear canvas with light gray background
        this.ctx.fillStyle = '#f0f0f0';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Save and translate for camera
        this.ctx.save();
        this.ctx.translate(-this.camera.x, -this.camera.y);
        
        // Draw white game background
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.worldWidth, this.worldHeight);
        
        // Draw world border
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 10;
        this.ctx.strokeRect(0, 0, this.worldWidth, this.worldHeight);
        
        // Draw game elements
        this.foods.forEach(food => food.draw(this.ctx));
        this.player.draw(this.ctx);
        
        // Draw AI players
        this.aiPlayers.forEach(ai => ai.draw(this.ctx));
        
        this.ctx.restore();
        
        // Draw UI
        this.ctx.fillStyle = 'black';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Score: ${this.score}`, 10, 30);
    }
    
    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Démarrage du jeu
window.onload = () => new Game();

export default Game;