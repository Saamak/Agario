export default class CollisionManager {
    constructor(game) {
        this.game = game;
    }

    checkCollisions() {
        this.checkFoodCollisions();
        this.checkPowerCollisions();
        this.checkPlayerAICollisions();
        this.checkAICollisions();
        this.checkProjectileCollisions(); // Add projectile collision check
    }

    checkProjectileCollisions() {
        this.game.player.projectiles.forEach(projectile => {
            this.game.aiPlayers.forEach(ai => {
                if (projectile.checkCollision(ai)) {
                    const projectileDamage = projectile.size * 2;
                    ai.reduceSize(projectileDamage);
                    projectile.active = false;
                }
            });
        });

        this.game.player.projectiles = this.game.player.projectiles.filter(p => p.active);
    }

    checkFoodCollisions() {
        this.game.foods = this.game.foods.filter(food => {
            if (!food.active) return true;
            
            // Check player collision
            const dx = this.game.player.x - food.x;
            const dy = this.game.player.y - food.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.game.player.size) {
                food.setRespawnTimer(performance.now());
                this.game.player.addScore(1);
                return true;
            }

            // Check AI collisions
            this.game.aiPlayers.forEach(ai => {
                const dxAI = ai.x - food.x;
                const dyAI = ai.y - food.y;
                const distanceAI = Math.sqrt(dxAI * dxAI + dyAI * dyAI);
                
                if (distanceAI < ai.size) {
                    food.setRespawnTimer(performance.now());
                    ai.addScore(1);
                    return false;
                }
            });
            
            return true;
        });
    }

    checkPowerCollisions() {
        this.game.powers.forEach(power => {
            if (power.active && this.checkPowerCollision(this.game.player, power)) {
                power.collect();
                power.applyEffect(this.game.player);
                setTimeout(() => {
                    power.spawn(this.game.worldWidth, this.game.worldHeight);
                }, 5000);
            }
        });
    }

    checkPlayerAICollisions() {
        this.game.aiPlayers = this.game.aiPlayers.filter(ai => {
            const dx = this.game.player.x - ai.x;
            const dy = this.game.player.y - ai.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < Math.max(this.game.player.size, ai.size)) {
                // Need 20% size advantage to eat
                if (this.game.player.size > ai.size * 1.2) {
                    // Get 80% of victim's score
                    const gainedSize = Math.floor(ai.size * 0.5);
                    this.game.player.addScore(ai.score);
                    
                    this.game.deadAIs.push({
                        size: 20,
                        respawnTime: performance.now() + this.game.AI_RESPAWN_TIME
                    });
                    return false;
                }
            }
            return true;
        });
    }

    checkAICollisions() {
        for (let i = 0; i < this.game.aiPlayers.length; i++) {
            for (let j = i + 1; j < this.game.aiPlayers.length; j++) {
                const ai1 = this.game.aiPlayers[i];
                const ai2 = this.game.aiPlayers[j];
                
                const dx = ai1.x - ai2.x;
                const dy = ai1.y - ai2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < Math.max(ai1.size, ai2.size)) {
                    if (ai1.size > ai2.size * 1.2) {
                        // AI1 eats AI2
                        const gainedSize = Math.floor(ai2.size * 0.8);
                        ai1.addScore(ai2.score);
                        this.game.aiPlayers.splice(j, 1);
                        j--;
                    } else if (ai2.size > ai1.size * 1.2) {
                        // AI2 eats AI1
                        const gainedSize = Math.floor(ai1.size * 0.8);
                        ai2.addScore(ai1.score);
                        this.game.aiPlayers.splice(i, 1);
                        i--;
                        break;
                    }
                }
            }
        }
    }

    checkPowerCollision(player, power) {
        const points = [];
        for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
            const x = power.x + Math.cos(angle) * power.size;
            const y = power.y + Math.sin(angle) * power.size;
            points.push({x, y});
        }
        
        const checkPoint = (px, py) => {
            const dx = player.x - px;
            const dy = player.y - py;
            return Math.sqrt(dx * dx + dy * dy) < player.size;
        };
        
        return checkPoint(power.x, power.y) || points.some(p => checkPoint(p.x, p.y));
    }
}