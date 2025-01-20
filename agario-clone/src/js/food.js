export default class Food {
    constructor(worldWidth, worldHeight) {
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
        this.size = 5;
        this.spawn();
    }

    getRandomColor() {
        const colors = [
            '#FF0000', // Rouge
            '#00FF00', // Vert
            '#0000FF', // Bleu
            '#FFFF00', // Jaune
            '#FF00FF', // Magenta
            '#00FFFF', // Cyan
            '#FFA500', // Orange
            '#800080', // Violet
            '#FFC0CB', // Rose
            '#40E0D0'  // Turquoise
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    spawn() {
        this.x = Math.random() * this.worldWidth;
        this.y = Math.random() * this.worldHeight;
        this.color = this.getRandomColor();
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}