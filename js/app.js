var requestAnimFrame = (function(){
    return window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();


var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 450;
canvas.height = 450;
document.body.appendChild(canvas);


var lastTime;
function main() {
    if(!isGameOver){
	   var now = Date.now();
        var dt = (now - lastTime) / 1000.0;

        update(dt);

        render();

        lastTime = now;
        requestAnimFrame(main);
    }else{
        document.getElementById('win-game').style.display = 'block';
        document.getElementById('win-game-overlay').style.display = 'block';
    }
};
function init() {
    //terrainPattern = ctx.createPattern(resources.get('img/terrain-one.png'), 'repeat');
    generateMap();
    lastTime = Date.now();
    main();
}
function generateMap() {
    var i;
    var j;
    for (i = 0; i < map.length; i++){
        for (j = 0; j < map[i].length; j++){
            switch(map[i][j]){
                case 1:
                    walls.push({
                        pos: [j*64,i*64],
                        size: [64,64],
                        sprite: new Sprite('img/wall-sprite.png', [0,0],[64,64],0),
                    });
                    break;
                case 2:
                    exits.push({
                        pos: [j*64,i*64],
                        size: [64,64],
                        sprite: new Sprite('img/exit-sprite.png', [0,0],[64,64],0),
                    });
                    break;
                case 0:
                    spaces.push({
                        pos: [j*64,i*64],
                        size: [64,64],
                        sprite: new Sprite('img/space-sprite.png', [0,0],[64,64],0),
                    });
                    break;
                default:
                    break;
            }            
        }
    }
}

resources.load([
    'img/player-sprite.png',
    'img/space-sprite.png',
    'img/wall-sprite.png',
    'img/terrain-one.png',
    'img/exit-sprite.png',
]);
resources.onReady(init);
var map = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,1,1,1,0,0,0,1,0,0,0,0,0,1,1],
    [1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1],
    [1,0,0,0,0,0,1,1,1,0,0,0,0,0,1,1],
    [1,1,1,0,0,0,0,0,0,0,0,1,1,0,1,1],
    [1,1,1,0,0,0,1,1,0,0,0,0,1,0,1,1],
    [1,1,1,1,0,1,1,1,0,1,1,0,1,0,1,1],
    [1,1,1,1,0,1,1,1,0,0,0,0,1,0,1,1],
    [1,1,0,0,0,0,0,0,0,1,1,0,1,0,1,1],
    [1,1,0,1,1,1,1,0,1,1,1,1,1,0,0,1],
    [1,1,0,0,0,1,1,0,0,0,0,0,1,0,0,1],
    [1,1,1,1,0,0,0,0,1,0,1,0,1,0,1,1],
    [1,0,1,1,0,1,1,0,1,2,1,0,1,0,1,1],
    [1,0,0,0,0,0,1,0,1,1,1,0,1,0,1,1],
    [1,1,0,1,1,0,0,0,0,0,0,0,1,0,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];
var walls = [];
var spaces = [];
var exits = [];
var player = {
    pos: [64, 64],
    size: [64,64],
    sprite: new Sprite('img/player-sprite.png', [0, 0], [64, 64], 8, [0, 1, 2, 3]),
    speed: 100,
    visibleRadius: 100,
};

var isGameOver = false;
function update(dt){
	//gameTime += dt;

    handleInput(dt);
    updateEntities(dt);

    checkWin();
}
function checkWin(){
    for(var i = 0; i < exits.length; i++) {
        if(isCollide([player.pos[0],player.pos[1]],player.size,exits[i].pos,exits[i].size)){
            WinGame();
        }
    }
}
function WinGame(){
    isGameOver = true;
}
function handleInput(dt) {
	if (input.isNothingToDo()){
		//player.sprite.pos = [0,0];
    	player.sprite.reset();
	}else{
    	if(input.isDown('DOWN') || input.isDown('s')) {
            var flag = false
            for(var i = 0; i < walls.length; i++) {
                if(isCollide([player.pos[0],player.pos[1]+player.speed*dt],player.size,walls[i].pos,walls[i].size)){
                    flag = true;
                }
            }
            if(!flag){
    	       player.pos[1] += player.speed * dt;
            }

    	    player.sprite.pos = [0,0];
    	    player.sprite.update(dt);

    	}

    	if(input.isDown('UP') || input.isDown('w')) {
            var flag = false
            for(var i = 0; i < walls.length; i++) {
                if(isCollide([player.pos[0],player.pos[1]-player.speed*dt],player.size,walls[i].pos,walls[i].size)){
                    flag = true;
                }
            }
            if(!flag){
    	       player.pos[1] -= player.speed * dt;
            }

    	    player.sprite.pos = [0,196];
    	    player.sprite.update(dt);
    	}

    	if(input.isDown('LEFT') || input.isDown('a')) {
            var flag = false
            for(var i = 0; i < walls.length; i++) {
                if(isCollide([player.pos[0]-player.speed*dt,player.pos[1]],player.size,walls[i].pos,walls[i].size)){
                    flag = true;
                }
            }
            if(!flag){
    	       player.pos[0] -= player.speed * dt;
            }

    	    player.sprite.pos = [0,64];
    	    player.sprite.update(dt);
    	}

    	if(input.isDown('RIGHT') || input.isDown('d')) {
            var flag = false
            for(var i = 0; i < walls.length; i++) {
                if(isCollide([player.pos[0]+player.speed*dt,player.pos[1]],player.size,walls[i].pos,walls[i].size)){
                    flag = true;
                }
            }
            if(!flag){
    	       player.pos[0] += player.speed * dt;
            }

    	    player.sprite.pos = [0,128];
    	    player.sprite.update(dt);
    	}
	}
}

function updateEntities(dt) {
    
}

function render() {
    
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width, canvas.height);

    renderMap();
	
    /*
	ctx.fillRect(0, 0, player.pos[0] + player.size[0]/2 - player.visibleRadius, canvas.height);
    ctx.fillRect(player.pos[0] + player.size[0]/2 - player.visibleRadius, 0, canvas.width, player.pos[1] + player.size[1]/2 - player.visibleRadius);
    ctx.fillRect(player.pos[0] + player.size[0]/2 + player.visibleRadius, 0, canvas.width, player.visibleRadius*2);
    ctx.fillRect(player.pos[0] + player.size[0]/2 - player.visibleRadius, player.pos[1] + player.size[1]/2 + player.visibleRadius, canvas.width, canvas.height);
    */
    renderEntity(player);    
}
function renderMap() {
    for(var i = 0; i < walls.length; i++) {
        if(isVisible(walls[i].pos,walls[i].size)){
            renderEntity(walls[i]);
        }
    }
    for(i = 0; i < spaces.length; i++) {
        if(isVisible(spaces[i].pos,spaces[i].size)){
            renderEntity(spaces[i]);
        }
    }
    for(i = 0; i < exits.length; i++) {
        if(isVisible(exits[i].pos,exits[i].size)){
            renderEntity(exits[i]);
        }
    }
}

function isVisible(pos,size) {
    var playerX = player.pos[0]+player.size[0]/2;
    var playerY = player.pos[1]+player.size[1]/2;

    if(playerX-player.visibleRadius <= pos[0]+size[0]/2 && playerX+player.visibleRadius >= pos[0]+size[0]/2)
        if(playerY-player.visibleRadius <= pos[1]+size[1]/2 && playerY+player.visibleRadius >= pos[1]+size[1]/2)
            return true;
    return false;
}
function isCollide(pos, size, pos2, size2){
    var entityX = pos[0]+size[0]/2;
    var entity2X = pos2[0]+size2[0]/2;
    var entityY = pos[1]+size[1]/2;
    var entity2Y = pos2[1]+size2[1]/2;
    if(Math.abs(entityX - entity2X)+10 < (size[0] + size2[0])/2)
       if(Math.abs(entityY - entity2Y)+10 < (size[1] + size2[1])/2) 
        return true;
    return false;
}

function renderEntity(entity) {
    ctx.save();
    ctx.translate( entity.pos[0] - player.pos[0] + 196, entity.pos[1] + entity.size[1] - entity.sprite.size[1] - player.pos[1] +196 );
    entity.sprite.render(ctx);
    ctx.restore();
}