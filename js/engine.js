/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 */

var Engine = (function(global) {
    /* Predefine the variables used within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas1 = doc.createElement('canvas'),
        canvas2 = doc.createElement('canvas'),
        ctx1 = canvas1.getContext('2d'),
        ctx2 = canvas2.getContext('2d'),
        lastTime,
        id;
        canvas1.width = 505;
        canvas2.width = 600;
        canvas1.height = 606;
        canvas2.height = 130;
        canvas1.id = 'btmLayer';
        canvas2.id = 'topLayer';
        doc.body.appendChild(canvas1);
        doc.body.appendChild(canvas2);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get time delta information which is required for the game's
         * smooth animation.
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call update/render functions, pass along the time delta to
         * update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set lastTime variable, which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        
        if (player.status === 'won' || newScore.hits === 3) {
            player.winOrFailChk();
            player.triggerWinOrFail();
            win.cancelAnimationFrame(id); 
        } else {
            id = win.requestAnimationFrame(main);
        }
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        instantiateEnemies();
        instantiateTreats;
        instantiatePutinHeads();
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (the game loop) and itself calls all
     * of the functions which may need to update entity's data. 
     */
    function update(dt) {
        updateEntities(dt);
    }

    /* This is called by the update function and loops through all of the
     * objects within the allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for the
     * player object. 
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });

        allTreats.forEach(function(treat) {
            treat.update(dt);
        });
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. 
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/grass-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/stone-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;
        
        // Before drawing, clear existing canvas
        ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
        ctx2.clearRect(0, 0, canvas2.width, canvas2.height);

        /* Loop through the number of rows and columns defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                ctx1.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }
        renderEntities();
        newScore.render();
    }
    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions defined
     * on all enemies and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        allTreats.forEach(function(treat) {
            treat.render();
        });

        putinHeadsArr.forEach(function(putin) {
            putin.render();
        });            
        // }
        player.render();
    }

    /* This loads all of the images needed to draw the game level. 
       Then set init as the callback method, so that when
     * all of these images are properly loaded, the game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/grass-block.png',
        'images/female-reporter.png',
        'images/male-reporter.png',
        'images/char-trump.png',
        'images/trumpogger.png',
        'images/putin.png',
        'images/coke.png',
        'images/twitter.png',
        'images/kfc.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser).
     */
    global.ctx1 = ctx1;
    global.ctx2 = ctx2;
    // Commented out getter as it proved unnecessary. Note below.
    // return {
    //     init: init,
    //     getter: function() {
    //       return instantiateEnemies(), lastTime = Date.now(), main();;   // Originally, I wanted to call these IIFE methods in the `app.js` file...
    //     }
    //   }
})(this);
