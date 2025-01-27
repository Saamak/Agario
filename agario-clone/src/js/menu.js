import Game from './game.js';

let selectedSkin = null;

document.getElementById('singlePlayerButton').addEventListener('click', () => {
    startGame(1);
});

document.getElementById('multiPlayerButton').addEventListener('click', () => {
    startGame(2);
});

document.getElementById('customSkinButton').addEventListener('click', () => {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('skinMenu').style.display = 'flex';
});

document.getElementById('backButton').addEventListener('click', () => {
    document.getElementById('skinMenu').style.display = 'none';
    document.getElementById('menu').style.display = 'flex';
});

function startGame(playerCount) {
    const nickname = document.getElementById('nicknameInput').value || 'Player';
    document.getElementById('menu').style.display = 'none';
    document.getElementById('gameCanvas').style.display = 'block';
    new Game(playerCount, nickname, selectedSkin);
}

// Load skins dynamically
const skinsContainer = document.getElementById('skinsContainer');
const skinImages = ['hbelle.jpg', 'aranger.jpg', 'bcarolle.jpg', 'pythonn.jpg']; // Add your skin image filenames here

skinImages.forEach(skin => {
    const img = document.createElement('img');
    img.src = `assets/Skins/${skin}`;
    img.alt = skin;
    img.classList.add('skin-option');
    
    // Preload image
    img.onload = () => {
        console.log(`Skin ${skin} loaded successfully`);
    };
    
    img.onerror = () => {
        console.error(`Failed to load skin: ${skin}`);
    };
    
    img.addEventListener('click', () => {
        document.querySelectorAll('.skin-option').forEach(option => 
            option.classList.remove('selected'));
        img.classList.add('selected');
        selectedSkin = `assets/Skins/${skin}`; // Store relative path
    });
    
    skinsContainer.appendChild(img);
});