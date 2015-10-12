Mad Science, Bro!
=================

### Introduction
This is an entry to https://itch.io/jam/js48-1 made with [Phaser](http://phaser.io/). Our (me and  [RustiSub](https://github.com/RustiSub)) submission can be found at https://itch.io/jam/js48-1/rate/39200. The design, all code and all assets were created in under 48 hours.  
**The code is far from clean for obvious reasons :)**

### Building locally
You'll need [node and npm](https://nodejs.org/) to build this locally. Then:

 - ``` $ npm install ``` in the project root
 - ``` $ gulp ``` to make an unminified build and watch for changes
   - You can also ``` $ gulp build ``` to make a minified build, but you'll need to alter your ``` index.html ``` to load the minified file instead of the dev one.
 - Fire up a web server and load the index.html in your favorite browser. [**file:// won't work.**](http://phaser.io/tutorials/getting-started)
   
As Phaser is directly loaded in the ``` index.html ``` you'll need to include it in one way or another if you want to release anything.

For example, the .zip we uploaded to itch.io uploaded contained: 
 1. the ``` assets ``` folder
 2. the ``` app.min.js ``` from the ``` build ``` folder
 3. a copy of the latest ``` Phaser.min.js ```
 4. an index.html loading ``` Phaser.min.js ``` and ``` app.min.js ```

### Credits
All of the amazing art and a lot of design input was done by [RustiSub](https://github.com/RustiSub).
