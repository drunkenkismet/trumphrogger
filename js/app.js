class Enemy {
    constructor(x, y, speed) {
        const enemyImgs = ['male-reporter.png', 'female-reporter.png'];
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.path = 'images/';
        this.sprite = `${this.path}${enemyImgs[Math.floor(Math.random() * enemyImgs.length)]}`;
        this.collisionBool();
    };
    collisionBool() {
        this.collisionCheck = false;
    }

    update(dt) {
        this.x += this.speed * dt;
        if (this.x > 550) {
            this.x = -100;
            this.speed = 100 + Math.floor(Math.random() * 512);
        }
        ((player.x < this.x + 60) &&
        (player.x + 37 > this.x) &&
        (player.y < this.y + 25) &&
        (30 + player.y > this.y)) ? this.collideReset() : undefined; 
    };
    collideReset() {
        this.collisionBool.collisionCheck = true;
        enemy.collideSound();
        player.x = player.initX;
        player.y = player.initY;
        newScore.update();
        this.collisionBool.collisionCheck = false;
    }
    
    render() {
        ctx1.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    collideSound() {
        const fakeNewsOne = new Audio('sounds/fake-news-1.mp3');
        const fakeNewsTwo = new Audio('sounds/fake-news-2.mp3');
        const fakeNewsThree = new Audio('sounds/fake-news-3.mp3');
        const fakeNewsFour = new Audio('sounds/fake-news-4.mp3');
        const soundArr = [fakeNewsOne, fakeNewsTwo, fakeNewsThree, fakeNewsFour];
        let genSound = Math.floor(Math.random() * soundArr.length);
        soundArr[genSound].play();
    }
};

class Score {  
    constructor(){
      this.y = 35;
      this.netWorth = 0;
      this.scoreDisplay = 'Net Worth: $' + this.netWorth;
      this.banner = 'images/trumpogger.png';
      this.putinPoints = 'images/putin.png';
    }
  
    update() {
        if (enemy.collisionCheck !== true) {
            this.netWorth -= 1;
            this.scoreDisplay = 'Net Work: $' + this.netWorth + ' million';
        }
    }
  
    render() {  
      ctx2.font= "20px sans-serif";
      ctx2.fillStyle = 'rgba(244, 134, 66, 0.8)'
      this.x = ctx2.measureText(this.scoreDisplay).width - 150;
      ctx2.fillText(this.scoreDisplay, 505 - this.x, this.y + 70);
      ctx2.drawImage(Resources.get(this.banner), 80, 45, 325, 95);
      const putinOne = ctx2.drawImage(Resources.get(this.putinPoints), 630, 30, 40, 50);
      const putinTwo = ctx2.drawImage(Resources.get(this.putinPoints), 585, 30, 40, 50);
      const putinThree = ctx2.drawImage(Resources.get(this.putinPoints), 540, 30, 40, 50);
    }
  }

class Player {
    constructor() {
        this.hor = 101;
        this.ver = 83;
        this.initX = this.hor * 2;
        this.initY = (this.ver * 5) - 50;
        this.x = this.initX;
        this.y = this.initY;
        this.sprite = 'images/char-trump.png';
    }
    render() {
        ctx1.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    handleInput(input) {
        switch(input) {
            case 'left':
                if (this.x > 0) {
                    this.x -= this.hor;
                    // console.log(this.x);
                }
                break;
            case 'up':
                if (this.y > 0) {
                    // console.log(this.y);
                    this.y -= this.ver;
                }
                break;
            case 'right':
                if (this.x < this.hor * 4) {
                    // console.log(this.x);
                    this.x += this.hor;
                }
                break;
            case 'down':
                if (this.y < this.ver * 4) {
                    // console.log(this.y);
                    this.y += this.ver;
                } 
                break;
        }
    }
}

const newScore = new Score();
const allEnemies = [];
let enemy;
function instantiateEnemies() {
    const enemiesPos = [35, 120, 200, 285];
    enemiesPos.forEach(function(initY) {
        enemy = new Enemy(0, initY, 100 + Math.floor(Math.random() * 512));
        return allEnemies.push(enemy);
    });
}

const player = new Player();

console.log(`${player.x}, ${player.y}`);

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});


(function soundLoop() {
    const audioTag = document.querySelector('#gameLoop');
    audioTag.innerHTML = `<audio autoplay src='sounds/tetris.mp3' type='audio/mpeg' id='gameAudio'>Your browser does not support HTML5 audio!</audio>`;
    const gameAudio = document.querySelector('#gameAudio');
    gameAudio.volume = 0.15;
    gameAudio.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);
    gameAudio.play();
})();