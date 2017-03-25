var FPS = 60;
var clock = 0;
var bgImg = document.createElement("img");
var enemyImg = document.createElement("img");
var btnImg = document.createElement("img");
var towerImg = document.createElement("img");
var HP = 100;
var crosshairImg = document.createElement("img")
var score = 0
var money = 100

// 設定這個元素的要顯示的圖片
bgImg.src = "images/map.png";
enemyImg.src = "images/rukia.gif";
btnImg.src = "images/tower-btn.png";
towerImg.src = "images/jason.gif";
crosshairImg.src = "images/crosshair.png";
// 找出網頁中的 canvas 元素
var canvas = document.getElementById("game-canvas");

// 取得 2D繪圖用的物件
var ctx = canvas.getContext("2d");

function draw(){
	clock++;
	if (clock%10 == 0) {
		var newEnemy = new Enemy();
		enemies.push(newEnemy);
	}
	
	// 將背景圖片畫在 canvas 上的 (0,0) 位置
	ctx.drawImage(bgImg,0,0);
	ctx.fillText("HP:"+HP,32,32);
	ctx.fillText("score:"+score,32,64)
	ctx.fillText("money:"+money,288,32)
	for(var i = 0;i < enemies.length;i++){
		if(enemies[i].HP <= 0){
			enemies.splice(i,1);
			score += 10
			money += 10
		}else{
			enemies[i].move();
		    ctx.drawImage(enemyImg,enemies[i].x,enemies[i].y);
		}
	}

	ctx.drawImage(btnImg,640-64,480-64,64,64)
	if(isBuilding ==true){
   		ctx.drawImage(towerImg,cursor.x,cursor.y)
	}
	for (var i = 0; i < towers.length; i++) {
		ctx.drawImage(towerImg,towers[i].x,towers[i].y);
		towers[i].searchEnemy();
		if(towers[i].aimingEnemyId != null){
			var id = towers[i].aimingEnemyId;
			ctx.drawImage(crosshairImg, enemies[id].x,enemies[id].y)
		}
	}
	if(HP < 0){
		clearInterval(intervalID)
		ctx.font = "64px Arial"
		ctx.fillText("LOSER",192,224)
		ctx.fillText("YOU GOT",160,288)
		ctx.fillText(score,224,352)
	} 
}

	ctx.font = "24px Arial";
    ctx.fillStyle ="white";


// 執行 draw 函式
var intervalID = setInterval(draw, 1000/FPS);


var enemyPath =  [
{x: 96, y: 64},
{x: 384, y: 64},
{x: 384, y: 192},
{x: 224, y: 192},
{x: 224, y: 320},
{x: 544, y: 320},
{x: 544, y: 96},
]


function Enemy () {
	this.x= 96;
	this.y= 480-32;
	this.HP = 1
	this.speedX= 0;
	this.speedY= -64;
	this.pathDes= 0;
	this.move= function(){
		if(isCollided(enemyPath[this.pathDes].x,enemyPath[this.pathDes].y,this.x,this.y, 64/FPS, 64/FPS)){
			this.x = enemyPath[this.pathDes].x;
			this.y = enemyPath[this.pathDes].y;
			this.pathDes++;
			if(this.pathDes == enemyPath.length){
				this.HP = 0;
				HP -= 10;
				return;
			}
			if (enemyPath[this.pathDes].y < this.y){
				this.speedX = 0;
				this.speedY = -64;
			}else if (enemyPath[this.pathDes].x > this.x){
				this.speedX = 64;
				this.speedY = 0;
			}else if (enemyPath[this.pathDes].y > this.y){
				this.speedX = 0;
				this.speedY = 64;
			}else if (enemyPath[this.pathDes].x < this.x){
                this.speedX = -64;
				this.speedY = 0;
			}
		}else{
			this.x += this.speedX /FPS;
		    this.y += this.speedY /FPS
		}

		
	}
}
var enemies = []

var cursor = {
	x:100,
	y:200
}

function Tower(){
	this.x=0;
	this.y=0;
	this.range=100;
	this.aimingEnemyId=null;
	this.searchEnemy=function(){
		this.readyToShootTime-= 1/FPS
		for(var i=0; i<enemies.length; i++){
			var distance = Math.sqrt(Math.pow(this.x-enemies[i].x,2) + Math.pow(this.y-enemies[i].y,2));
			if (distance<=this.range) {
				this.aimingEnemyId = i;
				if(this.readyToShootTime <= 0){
					this.shoot(i);
					this.readyToShootTime = this.fireRate;
				}
				return;
			}
		}
		this.aimingEnemyId = null;
	};
	this.shoot=function(id){
		ctx.beginPath();
		ctx.moveTo(this.x+16,this.y);
		ctx.lineTo(enemies[id].x+16,enemies[id].y+16);
		ctx.strokeStyle = 'orange';
		ctx.lineWidth = 9;
		ctx.stroke();
		enemies[id].HP -= this.damage;
	};
	this.fireRate = 1;
	this.readyToShootTime=1;
	this.damage=5;
}
var towers = [];
$("#game-canvas").on("mousemove",mousemove)
function mousemove(event){
	cursor.x = event.offsetX
	cursor.y = event.offsetY
}

var isBuilding = false;

$("#game-canvas").on("click",mouseclick)
function mouseclick(){
	if (cursor.x>576 && cursor.y>416){
		isBuilding = true;
	}else{
		if(isBuilding == true){
			if (money >= 10){
				var newTower = new Tower
				newTower.x=cursor.x-cursor.x%32;
				newTower.y=cursor.y-cursor.y%32;
				towers.push(newTower)
				money -= 10
        	} 
		}
		isBuilding = false;
	}
}

function isCollided(pointX,pointY,targetX,targetY,targetwidth,targetHeight){
	if (targetX <= pointX &&
		           pointX <= targetX + targetwidth &&
		targetY <= pointY &&
		           pointY <= targetY + targetHeight ) {
		return true;
	}else{
		return false;
	}
}