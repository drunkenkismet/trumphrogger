/*
The following class is used to build the bases for each instantiated enemy (the reporters).
*/

class Enemy {
    // Parameters are for x and y coordinates, as well as speed. All other properties are fairly straightforward.
    constructor(x, y, speed) {
        const enemyImgs = ['male-reporter.png', 'female-reporter.png'];
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.path = 'images/';
        this.sprite = `${this.path}${enemyImgs[Math.floor(Math.random() * enemyImgs.length)]}`;
        this.type = 'enemy';
    }
    // Called by the Engine.js file; maintains consistent speed regardless of device, but is also used as the basic collision detection for enemies.
    update(dt) {
        this.x += this.speed * dt;
        if (this.x > 550) {
            // Moves the enemy leftward offscreen after hitting the right edge of the canvas.
            this.x = -100;
            this.speed = 100 + Math.floor(Math.random() * 512);
        }
        if ((player.x < this.x + 60) && (player.x + 37 > this.x) && (player.y < this.y + 25) && (player.y + 30 > this.y)) {
            this.collideReset();
        }
    }
    // Resets Trumphrogger, as well as triggers score and sounds events.
    collideReset() {
        newScore.updateLoss(this);
        newSounds.collideSound(this);
        player.x = player.initX;
        player.y = player.initY;
    }
    // Basic per-tick repaint of the enemy based on updated x and y coordinates
    render() {
        ctx1.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

/*
Treats -- could've used Enemy class with 'extends' considering they're quite similar (about 80-85%). TODO: `class Treats extends Enemy`...
*/

class Treats {
    constructor(x, y, speed) {
        const treatImgs = ['kfc.png', 'coke.png', 'twitter.png'];
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.path = 'images/';
        this.sprite = `${this.path}${treatImgs[Math.floor(Math.random() * treatImgs.length)]}`;
        this.type = 'treat';
    }
    //Treats are each randomly drawn at one of four y positions, and the speed was tuned somewhat. TODO: improve treat speed.
    update(dt) {
        this.x += this.speed * dt;
        if (this.x > 550) {
            this.x = -50;
            this.y = treatsPos[Math.floor(Math.random() * treatsPos.length)];
            this.speed = 100 + Math.floor(Math.random() * 512) / 1.2;
        }
        if ((player.x < this.x + 60) && (player.x + 37 > this.x) && (player.y < this.y + 25) && (player.y + 30 > this.y)) {
            newScore.updateGain(this);
            newSounds.collideSound(this);
            this.x = -100;
            this.y = -100;
            this.speed = 0;
            // This presented some unexpected behaviors, but the game still seems to function without much of a hiccup.
            allTreats.splice(allTreats[this], 1);
        }
    }
    render() {
        ctx1.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}
/*
Score class is very unnecessary, but it was good practice for learning to implement a layered canvas.
*/
class Score {
    constructor(){
        this.y = 35;
        this.netWorth = 0;
        this.scoreDisplay = `Net Worth: ($${this.netWorth})`;
        this.banner = 'images/trumpogger.png';
        this.hits = 0;
        this.treats = 0;
    }
    // Called with the enemy object instance to confirm type before updating the scoreboard.
    updateLoss(obj) {
        if (obj.type === 'enemy') {
            this.netWorth -= 130000;
            this.scoreDisplay = `Net Worth: $${(this.netWorth).toLocaleString('en')}`;
            this.hits = this.hits + 1;
            // The top-right Putin heads are a visual indicator of collision (not collusion).
            putin.update();
        }
    }
    // Called with the treat object instance to confirm type before updating the scoreboard.
    updateGain(obj) {
        if (obj.type === 'treat') {
            this.netWorth = this.netWorth + 130000;
            this.scoreDisplay = `Net Worth: $${(this.netWorth).toLocaleString('en')}`;
            this.treats += 1;
        }
    }
    render() {
        ctx2.font= "20px sans-serif";
        ctx2.fillStyle = 'rgba(244, 134, 66, 0.8)';
        this.x = ctx2.measureText(this.scoreDisplay).width - 50;
        ctx2.fillText(this.scoreDisplay, 505 - this.x, this.y + 70);
        ctx2.drawImage(Resources.get(this.banner), 0, 35, 325, 95);
    }
}
/*
The Player class -- includes initial position, speed, sprite path, and initial status, .
*/
class Player {
    constructor() {
        this.hor = 101;
        this.ver = 83;
        this.initX = this.hor * 2;
        this.initY = (this.ver * 5) - 55;
        this.x = this.initX;
        this.y = this.initY;
        this.sprite = 'images/char-trump.png';
        this.status = 'playing';
    }
    render() {
        ctx1.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    // This method is used to move Trumphrogger around the board, but it also calls the object's `winOrFailChk` method. TODO: figure out a way to
    // do this without hogging so many resources.
    handleInput(input) {
        switch(input) {
            case 'left':
                if (this.x > 0) {
                    this.x -= this.hor;
                    this.winOrFailChk();
                }
                break;
            case 'up':
                if (this.y > 0) {
                    this.y -= this.ver;
                    this.winOrFailChk();
                }
                break;
            case 'right':
                if (this.x < this.hor * 4) {
                    this.x += this.hor;
                    this.winOrFailChk();
                }
                break;
            case 'down':
                if (this.y < this.ver * 4) {
                    this.y += this.ver;
                    this.winOrFailChk();
                }
                break;
        }
    }
    // As noted above, this method only serves to change the player instance's status. Probably could've just implemented a couple of nested `if` statements elsewhere...
    winOrFailChk() {
        if (this.y === -55) {
            this.status = 'won';
        }
        if (newScore.hits === 3) {
            this.status = 'lost';
        }
    }
    triggerWinOrFail() {
        // Very basic win or lose modal trigger, which also loads the requisite restart elements.
        if (this.status === 'won' || newScore.hits === 3) {
            newSounds.winSoundChk();
            const overlay = document.createElement('div');
            overlay.id = 'overlay';
            const failModal = document.createElement('div');
            failModal.id = 'failModal';
            document.body.appendChild(overlay);
            overlay.appendChild(failModal);
            const innerModal = document.createElement('p');
            failModal.appendChild(innerModal);
            overlay.style.display = 'block';
            overlay.classList.add('opacity');
            failModal.style.display = 'block';
            failModal.innerHTML = `<div id='modal-content'><p id='modal-content'>You ${this.status}!</p>
                                    <p>Putin Heads: ${putin.putinHeads}</p>
                                    <p>Net Worth: $${newScore.netWorth.toLocaleString('en')}</p>
                                    <p>Treats collected: ${newScore.treats}</p>
                                    <img src='images/ms-icon-150x150.png'>
                                    </div>
                                    <button type='button' id='restart-button'>Replay?</button>`;
            const restartBtn = document.querySelector('#restart-button');
            restartBtn.addEventListener('click', function() {
                location.reload();
            });
        }
    }
}
/*
Yes, I went a bit too class happy. This class is used to instantiate all of the associated sound effects and the main game audio loop.
DOM elements are implemented when this class is instantiated, including volume control for all audio elements.
*/
class AllTheSounds {
    constructor() {
        this.audio1 = document.createElement('DIV');
        document.body.appendChild(this.audio1);
        this.audioLoopTag = document.createElement('DIV');
        this.audioLoopTag.innerHTML = `<audio autoplay src='sounds/tetris.mp3' type='audio/mpeg' id='game-audio'>Your browser does not support HTML5 audio!</audio>`;
        this.audio1.appendChild(this.audioLoopTag);
        this.winMusicTag = document.createElement('DIV');
        this.winMusicTag.innerHTML = `<audio src='sounds/win.mp3' type='audio/mpeg' id='win-music'>Your browser does not support HTML5 audio!</audio>`;
        this.audio1.appendChild(this.winMusicTag);
        this.loseMusicTag = document.createElement('DIV');
        this.loseMusicTag.innerHTML = `<audio src='sounds/loser.mp3' type='audio/mpeg' id='lose-music'>Your Browser does not support HTML5 audio!</audio>`;
        this.audio1.appendChild(this.loseMusicTag);
        this.gameAudio = document.querySelector('#game-audio');
        this.winAudio = document.querySelector('#win-music');
        this.loseAudio = document.querySelector('#lose-music');
        this.volumeConEl = document.createElement('DIV');
        this.volumeConEl.id = 'volume-div';
        this.canvasTop = document.querySelector('#topLayer');
        document.body.appendChild(this.volumeConEl);
        this.volumeConEl.innerHTML = `<input type='range' min-'0' max='100' step='1' id='volume-slider' value='15'>
                                        <div id='volume-text'>Volume: <span id='volume-readout'>15%</span></div>`;
        this.volSlider = document.querySelector('#volume-slider');
        this.volReadout = document.querySelector('#volume-readout');
        this.fakeNewsOne = new Audio('sounds/fake-news-1.mp3');
        this.fakeNewsTwo = new Audio('sounds/fake-news-2.mp3');
        this.fakeNewsThree = new Audio('sounds/fake-news-3.mp3');
        this.fakeNewsFour = new Audio('sounds/fake-news-4.mp3');
        this.bingBingOne = new Audio('sounds/bing-bing-1.mp3');
        this.bingBingTwo = new Audio('sounds/bing-bing-2.mp3');
        this.bingBingThree = new Audio('sounds/bing-bing-3.mp3');
        this.bingBingFour = new Audio('sounds/bing-bing-4.mp3');
        // Each of these two sound arrays are used for different parts of the `collideSound(obj)` check below.
        this.soundArr = [this.fakeNewsOne, this.fakeNewsTwo, this.fakeNewsThree, this.fakeNewsFour];
        this.bingArr = [this.bingBingOne, this.bingBingTwo, this.bingBingThree, this.bingBingFour];
        // This concatenated sound array allows for the end-game pause to cue specific other audio, as well as for implementing the volume controls.
        this.allSoundsArr = this.soundArr.concat(this.bingArr);
        // Calls the below methods as soon as the object is instantiated.
        this.soundLoop();
        this.volumeControls();
    }
    collideSound(obj) {
        // Plays from a random selection of audio if collision is with an enemy.
        if (obj.type === 'enemy') {
            this.genSound = Math.floor(Math.random() * this.soundArr.length);
            this.soundArr[this.genSound].play();
        // Plays from a random selection of audio if collision is with a treat.
        } else if (obj.type === 'treat') {
            this.genBing = Math.floor(Math.random() * this.bingArr.length);
            this.bingArr[this.genBing].play();
        }
    }
    // So long as Trumphrogger's status is 'playing', the sound loop continues.
    soundLoop() {
        this.gameAudio.volume = 0.15;
        if (player.status === 'playing') {
            this.gameAudio.addEventListener('ended', function() {
                this.currentTime = 0;
                this.play();
            }, false);
            this.gameAudio.play();
        }
    }
    // End-game sound check: status change to `won` cues up the win sequence, and while I could've just made the second conditional `player.status === 'lost'`,
    // I went with `newScore.hits`. TODO: Continue removing unnecessary/unused code throughout, including as indicated by this method.
    winSoundChk() {
        this.gameAudio = document.querySelector('#game-audio');
        if (player.status === 'won') {
            this.gameAudio.pause();
            this.pauseAllSounds();
            const that = this;
            setTimeout(function() {
                that.winAudio.volume = 0.3;
                that.winAudio.play();
            }, 50);
            setTimeout(function() {
                this.doAnything = new Audio('sounds/you-can-do-anything.mp3').play();
            }, 2500);
        }
        if (newScore.hits === 3) {
            this.gameAudio.pause();
            this.pauseAllSounds();
            const that = this;
            setTimeout(function() {
                that.loseAudio.play();
            }, 1000);
        }
    }
    // Simple method for pausing all sound effects indicated in arrays.
    pauseAllSounds() {
        this.allSoundsArr.forEach(function(sound) {
            sound.pause();
        });
    }
    // Volume controller that offers a straightforward readout and manages all game audio.
    volumeControls() {
        const that = this;
        this.volSlider.addEventListener('input', function() {
            that.volReadout.innerHTML = `${that.volSlider.value}%`;
            that.gameAudio.volume = (that.volSlider.value / 100);
            that.winAudio.volume = (that.volSlider.value / 100);
            const thine = that;
            that.allSoundsArr.forEach(function(sound) {
                sound.volume = (thine.volSlider.value / 100);
            });
        });
    }
}
/*
The PutinHeads class was a strange, complicated thing, and it was only added at the last minutes.
I realized that modifying the canvas Putin heads was a bit easier if, as most everything else in this game,
they were in an array -- I initially instantiated them through adding another canvas layer and pulling some
really silly workarounds. Then it dawned on me: wait, this doesn't have to be so difficult.
*/
class PutinHeads {
    constructor(x) {
        this.putinX = x;
        this.putinY = 30;
        this.putinSprite = 'images/putin.png';
        this.putinHeads = 3;
    }
    update() {
        if (newScore.hits === 1 || newScore.hits === 2 || newScore.hits === 3) {
            this.remove(putinHeadsArr, (putinHeadsArr.length - 1));
        }
    }
    /*
    This approach courtesy of a thread at Stackoverflow: https://stackoverflow.com/questions/5767325/how-do-i-remove-a-particular-element-from-an-array-in-javascript
    */
    remove(arr, el) {
        const index = arr.indexOf(el);
        arr.splice(index, 1);
    }
    render() {
        ctx2.drawImage(Resources.get(this.putinSprite), this.putinX, this.putinY);
    }
}
// Basic directional-keys input handler -->
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

/*
The following array, variable, and functions create the globally available entity arrays.
Each one required slightly different approaches, though, which is why they look somewhat different.
*/

const allEnemies = [];
let enemy;
function instantiateEnemies() {
    const enemiesPos = [35, 120, 200, 285];
    enemiesPos.forEach(function(y) {
        enemy = new Enemy(0, y, 100 + Math.floor(Math.random() * 512));
        return allEnemies.push(enemy);
    });
}

const allTreats = [];
let treat;
const treatsPos = [35, 120, 200, 285];
// Didn't want to clutter the canvas with treats, so these are created only periodically and when the `allTreats` array is of a certain size.
const instantiateTreats = setInterval(function() {
    if (allTreats.length > 2) {
        allTreats.pop();
    } else {
        // Really proud of this single-line approach to instantiating treats. Maybe I shouldn't be? TODO: Figure out if I should be...
        return allTreats.push(treat = new Treats(0, treatsPos[Math.floor(Math.random() * treatsPos.length)], 100 + Math.floor(Math.random() * 512)));
    }
}, 5000);

const putinHeadsArr = [];
let putin;
function instantiatePutinHeads() {
    // Since the Putin heads are all on the same y-coordinate line, this array (similar in concept to the allEnemies array above) creates them
    // based on their array x-coordinate values, which are each passed as an argument to the PutinHeads constructor.
    const putinPos = [520, 470, 420];
    putinPos.forEach(function(putinX) {
        putin = new PutinHeads(putinX);
        return putinHeadsArr.push(putin);
    });
}

const newScore = new Score();
const player = new Player();
const newSounds = new AllTheSounds();
const newTreats = new Treats();

// TODO: Turn this file into an IIFE, and decide the best location across the JS files from which to instantiate these entities.
