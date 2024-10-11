let score = 0;
let highScore = 0;
let timeLeft = 30;
let gameInterval;
let dropInterval;
let isPaused = false;
let comboCounter = 0;
let lastClickTime = 0;
const gameArea = document.getElementById('gameArea');
const scoreDisplay = document.getElementById('scoreCount');
const highScoreDisplay = document.getElementById('highScoreCount');
const timeDisplay = document.getElementById('timeCount');
const blocks = [];
let backgroundAudio;
const requiredScore = 10;
const soundToggle = document.getElementById('soundToggle');
const comboDisplay = document.getElementById('comboCount');

function createBlock() {
    if (isPaused) return;
    
    const block = document.createElement('div');
    block.className = 'block';
    block.style.backgroundColor = getRandomColor();
    const leftPosition = Math.random() * (gameArea.clientWidth - 50);

    for (let existingBlock of blocks) {
        const existingBlockRect = existingBlock.getBoundingClientRect();
        if (Math.abs(existingBlockRect.left - leftPosition) < 60) {
            return createBlock();
        }
    }

    block.style.left = `${leftPosition}px`;
    block.style.top = '0px';
    gameArea.appendChild(block);
    blocks.push(block);
    dropBlock(block);
}

function dropBlock(block) {
    let position = 0;
    const speed = getDropSpeed();
    dropInterval = setInterval(() => {
        if (isPaused) return;
        
        position += 7;
        block.style.top = `${position}px`;

        if (position >= gameArea.clientHeight) {
            clearInterval(dropInterval);
            block.remove();
            blocks.splice(blocks.indexOf(block), 1);
            decreaseScore();
        }
    }, speed);

    block.onclick = function() {
        score++;
        scoreDisplay.textContent = score;
        clearInterval(dropInterval);
        block.remove();
        blocks.splice(blocks.indexOf(block), 1);
        playSound('click');
        updateCombo();
        checkLevelUp();
    };
}

function updateCombo() {
    const currentTime = new Date().getTime();
    if (currentTime - lastClickTime < 1000) {
        comboCounter++;
        score += comboCounter;
        comboDisplay.textContent = `x${comboCounter}`;
        comboDisplay.style.display = 'block';
        setTimeout(() => {
            comboDisplay.style.display = 'none';
        }, 1000);
    } else {
        comboCounter = 0;
    }
    lastClickTime = currentTime;
    scoreDisplay.textContent = score;
}

function decreaseScore() {
    score = Math.max(0, score - 1);
    scoreDisplay.textContent = score;
}

function checkLevelUp() {
    if (score % 10 === 0) {
        playSound('levelup');
        showLevelUpMessage();
    }
}

function showLevelUpMessage() {
    const message = document.createElement('div');
    message.textContent = 'Level Up!';
    message.style.position = 'absolute';
    message.style.top = '50%';
    message.style.left = '50%';
    message.style.transform = 'translate(-50%, -50%)';
    message.style.fontSize = '24px';
    message.style.color = '#FFD700';
    message.style.textShadow = '2px 2px 4px #000000';
    gameArea.appendChild(message);
    setTimeout(() => message.remove(), 2000);
}

function getDropSpeed() {
    const difficulty = document.getElementById('difficulty').value;
    if (difficulty === 'easy') return 800;  
    if (difficulty === 'medium') return 600; 
    if (difficulty === 'hard') return 400;   
}

function getCreationInterval() {
    const difficulty = document.getElementById('difficulty').value;
    if (difficulty === 'easy') return 1500;  
    if (difficulty === 'medium') return 1000; 
    if (difficulty === 'hard') return 600;   
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function startGame() {
    score = 0;
    timeLeft = 30;
    isPaused = false;
    scoreDisplay.textContent = score;
    highScoreDisplay.textContent = highScore;
    document.getElementById('startScreen').style.display = 'none';
    gameArea.style.display = 'block';
    document.getElementById('score').style.display = 'block';
    document.getElementById('highScore').style.display = 'block';
    document.getElementById('timer').style.display = 'block';
    document.getElementById('pauseBtn').style.display = 'block';

    const creationInterval = getCreationInterval();
    gameInterval = setInterval(createBlock, creationInterval);
    startTimer();

    if (soundToggle.checked) {
        backgroundAudio = new Audio('background.mp3'); 
        backgroundAudio.loop = true; 
        backgroundAudio.play();
    }
}

function startTimer() {
    const timerInterval = setInterval(() => {
        if (isPaused) return;
        
        timeLeft--;
        timeDisplay.textContent = timeLeft;
        document.getElementById('timeBar').style.width = `${(timeLeft / 30) * 100}%`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000);
}

function endGame() {
    clearInterval(gameInterval);
    gameArea.innerHTML = '';
    blocks.length = 0;
    if (backgroundAudio) {
        backgroundAudio.pause();
    }
    if (score > highScore) {
        highScore = score;
        highScoreDisplay.textContent = highScore;
    }
    playSound('gameover');

    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOverScreen').style.display = 'block';
    document.getElementById('gameArea').style.display = 'none';
    document.getElementById('score').style.display = 'none';
    document.getElementById('highScore').style.display = 'none';
    document.getElementById('timer').style.display = 'none';
    document.getElementById('pauseBtn').style.display = 'none';
}

function playSound(type) {
    if (!soundToggle.checked) return;
    let audio;
    if (type === 'click') {
        audio = new Audio('zapsplat_technology_studio_speaker_active_power_switch_click_003_68875.mp3');
    } else if (type === 'gameover') {
        audio = new Audio('gameover.mp3');
    } else if (type === 'levelup') {
        audio = new Audio('levelup.mp3');
    }
    audio.play();
}

document.getElementById('restartBtn').onclick = function() {
    document.getElementById('gameOverScreen').style.display = 'none';
    startGame();
};

document.getElementById('backToMenuBtn').onclick = function() {
    document.getElementById('gameOverScreen').style.display = 'none';
    document.getElementById('startScreen').style.display = 'flex';
};

document.getElementById('startBtn').onclick = startGame;

document.getElementById('instructionsBtn').onclick = function() {
    const instructions = document.getElementById('instructions');
    instructions.style.display = instructions.style.display === 'none' ? 'block' : 'none';
};

document.getElementById('settingsBtn').onclick = function() {
    const settings = document.getElementById('settings');
    settings.style.display = settings.style.display === 'none' ? 'block' : 'none';
};

document.getElementById('pauseBtn').onclick = function() {
    isPaused = !isPaused;
    if (isPaused) {
        clearInterval(gameInterval);
        document.getElementById('pauseScreen').style.display = 'block';
    } else {
        gameInterval = setInterval(createBlock, getCreationInterval());
        document.getElementById('pauseScreen').style.display = 'none';
    }
};

document.getElementById('resumeBtn').onclick = function() {
    isPaused = false;
    gameInterval = setInterval(createBlock, getCreationInterval());
    document.getElementById('pauseScreen').style.display = 'none';
};

// إضافة وظيفة تبديل النمط الداكن
function toggleDarkMode() {
    document.body.classList.toggle('dark-theme');
}

document.getElementById('darkModeToggle').onchange = toggleDarkMode;