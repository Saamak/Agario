class Canvas {
    constructor(canvasElement) {
        this.canvas = canvasElement;
        this.context = this.canvas.getContext('2d');
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawPlayer(player) {
        this.context.fillStyle = 'blue';
        this.context.beginPath();
        this.context.arc(player.x, player.y, player.size, 0, Math.PI * 2);
        this.context.fill();
    }

    drawFood(food) {
        this.context.fillStyle = 'green';
        this.context.beginPath();
        this.context.arc(food.x, food.y, food.size, 0, Math.PI * 2);
        this.context.fill();
    }
}