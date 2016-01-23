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
    terrainPattern = ctx.createPattern(resources.get('img/terrain-one.png'), 'repeat');
    lastTime = Date.now();
    main();
}

resources.load([
    'img/player-sprite.png',
    'img/terrain-one.png'
]);
resources.onReady(init);

var player = {
    pos: [canvas.width/2, canvas.height/2],
    size: [64,64],
    sprite: new Sprite('img/player-sprite.png', [0, 0], [64, 64], 4, [0, 1, 2, 3]),
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
		player.sprite.pos = [0,0];
    	player.sprite.reset();
	}else{
    	if(input.isDown('DOWN') || input.isDown('s')) {
    	    player.pos[1] += player.speed * dt;
    	    player.sprite.pos = [0,0];
    	    player.sprite.update(dt);
    	}

    	if(input.isDown('UP') || input.isDown('w')) {
    	    player.pos[1] -= player.speed * dt;
    	    player.sprite.pos = [0,196];
    	    player.sprite.update(dt);
    	}

    	if(input.isDown('LEFT') || input.isDown('a')) {
    	    player.pos[0] -= player.speed * dt;
    	    player.sprite.pos = [0,64];
    	    player.sprite.update(dt);
    	}

    	if(input.isDown('RIGHT') || input.isDown('d')) {
    	    player.pos[0] += player.speed * dt;
    	    player.sprite.pos = [0,128];
    	    player.sprite.update(dt);
    	}
	}
}

function updateEntities(dt) {
    
}

function render() {
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = terrainPattern;
    ctx.fillRect(player.pos[0] - player.visibleRadius, player.pos[1] - player.visibleRadius, player.visibleRadius*2, player.visibleRadius*2);

    renderEntity(player);
}

function renderEntity(entity) {
    ctx.save();
    ctx.translate(entity.pos[0]-entity.size[0]/2, entity.pos[1]-entity.size[1]/2);
    entity.sprite.render(ctx);
    ctx.restore();
}