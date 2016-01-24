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
canvas.width = 980;
canvas.height = 450;
document.body.appendChild(canvas);


var lastTime;
function main() {
	var now = Date.now();
    var dt = (now - lastTime) / 1000.0;

    update(dt);

    render();

    lastTime = now;
    requestAnimFrame(main);
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
            if(map[i][j] == 1){
                walls.push({
                    pos: [i*64,j*64],
                    size: [64,64],
                    sprite: new Sprite('img/wall-sprite.png', [0,0],[64,64],0),
                });
            }else{
                spaces.push({
                    pos: [i*64,j*64],
                    size: [64,64],
                    sprite: new Sprite('img/space-sprite.png', [0,0],[64,64],0),
                });
            }
        }
    }
}

resources.load([
    'img/player-sprite.png',
    'img/space-sprite.png',
    'img/wall-sprite.png',
    'img/terrain-one.png',
]);
resources.onReady(init);
var map = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,1,1,1,1,1,1,1,0,0,0,0,0,1,1],
    [1,0,1,1,1,1,1,1,1,0,0,1,1,0,1,1],
    [1,0,0,0,0,0,1,1,1,0,1,1,1,0,1,1],
    [1,1,1,0,0,0,1,1,1,0,0,1,1,0,1,1],
    [1,1,1,0,0,0,1,1,0,0,0,1,1,0,1,1],
    [1,1,1,1,0,1,1,1,0,1,1,1,1,0,1,1],
    [1,1,1,1,0,1,1,1,0,1,1,1,1,0,1,1],
    [1,1,0,0,0,1,1,0,0,1,1,1,1,0,1,1],
    [1,1,0,1,1,1,1,0,1,1,1,1,1,0,1,1],
    [1,1,0,0,0,1,1,0,0,0,0,0,1,0,1,1],
    [1,1,1,1,0,1,1,1,1,0,0,0,1,0,1,1],
    [1,1,1,1,0,1,1,1,1,1,0,0,1,1,1,1],
    [1,1,1,1,0,0,1,1,1,1,1,0,1,1,1,1],
    [1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];
var walls = [];
var spaces = [];
var player = {
    pos: [64, 64],
    size: [64,64],
    sprite: new Sprite('img/player-sprite.png', [0, 0], [64, 64], 8, [0, 1, 2, 3]),
    speed: 100,
    visibleRadius: 100,
};

function update(dt){
	//gameTime += dt;

    handleInput(dt);
    updateEntities(dt);
}
function handleInput(dt) {
	if (input.isNothingToDo()){
		//player.sprite.pos = [0,0];
    	player.sprite.reset();
	}else{
    	if(input.isDown('DOWN') || input.isDown('s')) {
    	    player.pos[1] += player.speed * dt;
            for(var i = 0; i < walls.length; i++) {
                if(isCollide(walls[i],player)){
                    player.pos[1] = walls[i].pos[1]-player.size[1];
                    break;
                }
            }
            //ctx.translate(0,-player.speed * dt);
    	    player.sprite.pos = [0,0];
    	    player.sprite.update(dt);
    	}

    	if(input.isDown('UP') || input.isDown('w')) {
    	    player.pos[1] -= player.speed * dt;
            for(var i = 0; i < walls.length; i++) {
                if(isCollide(walls[i],player)){
                    player.pos[1] = walls[i].pos[1]+walls[i].size[1];break;
                }
            }
            //ctx.translate(0,player.speed * dt);
    	    player.sprite.pos = [0,196];
    	    player.sprite.update(dt);
    	}

    	if(input.isDown('LEFT') || input.isDown('a')) {
    	    player.pos[0] -= player.speed * dt;
            for(var i = 0; i < walls.length; i++) {
                if(isCollide(walls[i],player)){
                    player.pos[0] = walls[i].pos[0]+walls[i].size[0];break;
                }
            }
            //ctx.translate(player.speed * dt, 0);
    	    player.sprite.pos = [0,64];
    	    player.sprite.update(dt);
    	}

    	if(input.isDown('RIGHT') || input.isDown('d')) {
    	    player.pos[0] += player.speed * dt;
            for(var i = 0; i < walls.length; i++) {
                if(isCollide(walls[i],player)){
                    player.pos[0] = walls[i].pos[0]-player.size[0];break;
                }
            }
            //ctx.translate(-player.speed * dt,0);
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
}

function isVisible(pos,size) {
    var playerX = player.pos[0]+player.size[0]/2;
    var playerY = player.pos[1]+player.size[1]/2;

    if(playerX-player.visibleRadius <= pos[0]+size[0]/2 && playerX+player.visibleRadius >= pos[0]+size[0]/2)
        if(playerY-player.visibleRadius <= pos[1]+size[1]/2 && playerY+player.visibleRadius >= pos[1]+size[1]/2)
            return true;
    return false;
}
function isCollide(entity, entity2){
    var entityX = entity.pos[0]+entity.size[0]/2;
    var entity2X = entity2.pos[0]+entity2.size[0]/2;
    var entityY = entity.pos[1]+entity.size[1]/2;
    var entity2Y = entity2.pos[1]+entity2.size[1]/2;
    if(Math.abs(entityX - entity2X) < (entity.size[0] + entity2.size[0])/2)
       if(Math.abs(entityY - entity2Y) < (entity.size[1] + entity2.size[1])/2) 
        return true;
    return false;
}
function renderEntity(entity) {
    ctx.save();
    ctx.translate( entity.pos[0], entity.pos[1] + entity.size[1] - entity.sprite.size[1]);
    entity.sprite.render(ctx);
    ctx.restore();
}