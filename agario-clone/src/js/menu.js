import Game from './game.js';

document.getElementById('singlePlayerButton').addEventListener('click', () => {
    startGame(1);
});

document.getElementById('multiPlayerButton').addEventListener('click', () => {
    startGame(2);
});

document.getElementById('customSkinButton').addEventListener('click', () => {
    alert('Custom Skin feature coming soon!');
});

function startGame(playerCount) {
    const nickname = document.getElementById('nicknameInput').value || 'Player';
    document.getElementById('menu').style.display = 'none';
    document.getElementById('gameCanvas').style.display = 'block';
    new Game(playerCount, nickname);
}