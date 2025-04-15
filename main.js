const player = document.getElementById('playerRect');
const zones = {
	left: document.getElementById('left-zone'),
	center: document.getElementById('center-zone'),
	right: document.getElementById('right-zone'),
view : document.getElementById('zones-wrapper'),
};
const playerskin = document.getElementById('player');
const daya = document.getElementById('daya');
let canMove = true;
let mining = false;
let isClear = false;
let currentZone = 'center';
let x = 1200 - 10; // 가운데 zone 기준
let y = 300 - 10;
const speed = 2;
const playerSize = 20;
const keysPressed = {};
let power = 1;
let powerUp = 0;
let attackSpeed = 5000;
let attackSpeedUp = 0;
let nowAttacking = false;
let money = 0;
let baseValue = 1;
let baseValueUp = 0;
let baseHP = 4;
let dayaDia1 = 10000000;
let dayaDia2 = 10000000;
let dayaDia3 = 10000000;
let lastDirection = 'right'; 
let isMoving = false;

let prevX = x; // 함수 외부에서 선언

if(!localStorage.getItem('powerUp')){saveData('powerUp',0);}
if(!localStorage.getItem('attackSpeedUp')){saveData('attackSpeedUp',0);}
if(!localStorage.getItem('baseValueUp')){saveData('baseValueUp',0);}		
if(!localStorage.getItem('money')){saveData('money',0);}		
if(!localStorage.getItem('dayaDia1')){saveData('dayaDia1',10000000);}		
if(!localStorage.getItem('dayaDia2')){saveData('dayaDia2',10000000);}		
if(!localStorage.getItem('dayaDia3')){saveData('dayaDia3',10000000);}

powerUp=Number(getData('powerUp'));
attackSpeedUp=Number(getData('attackSpeedUp'));
baseValueUp=Number(getData('baseValueUp'));
money=Number(getData('money'));
dayaDia1=Number(getData('dayaDia1'));
dayaDia2=Number(getData('dayaDia2'));
dayaDia3=Number(getData('dayaDia3'));

const shopItems = [
	{ id: 'powerUp', x: 100, y: 80, img: 'powerUp.png', priceFn: () => getFibonacci(powerUp), buyFn: buyAttackUp },
	{ id: 'attackSpeedUp', x: 300, y: 80, img: 'attackspeedup.png', priceFn: () => getFibonacci(attackSpeedUp), buyFn: buyAttackSpeedUp },
	{ id: 'baseValueUp', x: 500, y: 80, img: 'baseValueup.png', priceFn: () => getFibonacci(baseValueUp), buyFn: buyValueUp }
];

const shopItemElements = [];

const centerZone = document.getElementById('center-zone');

shopItems.forEach(item => {
	const container = document.createElement('div');
	container.style.position = 'absolute';
	container.style.left = `${item.x}px`;
	container.style.top = `${item.y}px`;
	container.style.width = '200px';
	container.style.textAlign = 'center';

	const label = document.createElement('div');
	label.id = `${item.id}-label`;
	label.style.color = 'white';
	label.style.fontSize = '16px';
	label.textContent = `💎 ${item.priceFn()}`;
	container.appendChild(label);

	const el = document.createElement('img');
	el.id = item.id;
	el.src = `resource/${item.img}`;
	el.style.width = '50px';
	el.style.height = '50px';
	el.style.cursor = 'pointer';
	container.appendChild(el);

	centerZone.appendChild(container);
	
	shopItemElements.push({ element: container, id: item.id, buyFn: item.buyFn });
});
power = powerCalculator();
attackSpeed = attackSpeedCalculator();
console.log(attackSpeed);
baseHP = baseValueCalculator();
baseValue = baseValueCalculator();

function isColliding(a, b) {
	return !(
		a.right < b.left ||
		a.left > b.right ||
		a.bottom < b.top ||
		a.top > b.bottom
	);
}

document.addEventListener('keydown', (e) => {
	if (e.code === 'Space' && currentZone === 'center') {
		const playerRect = playerskin.getBoundingClientRect();
		for (const item of shopItemElements) {
			const itemRect = item.element.getBoundingClientRect();
			if (isColliding(playerRect, itemRect)) {
				console.log(itemRect);
				item.buyFn(); // 💰 해당 아이템 구매 실행
			}
		}
	}
});

function getFibonacci(n) {
	if (n <= 1) return 1;
	let a = 1, b = 2;
	for (let i = 2; i <= n; i++) {
		[a, b] = [b, a + b];
	}
	return a;
}


let workFrame = 0;
let workInterval = null;
function saveData(key,value){
	localStorage.setItem(key,value);
}

function getData(key){
	return localStorage.getItem(key);
}
function targetPosition(){
	return [x-11,y-5]
}


attack(50,260,1000,0,dayaDia1,"dayaDia1");
attack(50,280,1000,0,dayaDia2,"dayaDia2");
attack(50,300,1000,0,dayaDia3,"dayaDia3");	

function updateMoney(m){
	document.getElementById("moneyValue").textContent = parseInt(m); 	
}
updateMoney(money);
document.addEventListener('keydown', (e) => {
	keysPressed[e.key.toLowerCase()] = true;
});

document.addEventListener('keyup', (e) => {
	keysPressed[e.key.toLowerCase()] = false;
});

let lastMoveTime = performance.now();
function updatePosition(nowTime) {
	isMoving = false;
	const elapsed = nowTime - lastMoveTime;
	const delta = elapsed/10 * speed
	lastMoveTime = nowTime;
	if(!canMove){
		requestAnimationFrame(updatePosition);
		return true;
	}
	let orix = x;
	let oriy = y;
	const zone = zones['view'];

	if (keysPressed['w'] || keysPressed['arrowup']){
		y -= delta;
		isMoving = true;
	}
	if (keysPressed['s'] || keysPressed['arrowdown']){
		y += delta;
		isMoving = true;
	}
	if (keysPressed['a'] || keysPressed['arrowleft']){
		x -= delta;
		lastDirection = 'left';
		isMoving = true;
	}
	if (keysPressed['d'] || keysPressed['arrowright']){
		x += delta;
		lastDirection = 'right';
		isMoving = true;
	}


	// 경계 체크 및 구역 전환
	if (x > 770 && x < 810) {
		if(y> 350 || y < 250){
			x=orix;
		}			
		else if (currentZone === 'center') {
			switchZone('left');
			x = 760;
		}
		else if (currentZone === 'left') {
			switchZone('center');
			x = 820;
		}
	}
	if (x > 1570 && x < 1610) {
		if (currentZone === 'right') {
			switchZone('center');
			x = 1560;
		}
		else if (currentZone === 'center') {
			x = 1570;
		}
	}
	if(currentZone === 'left'){
		if(y > 300 || y< 230){
			x = Math.min(x,710);
		}
	}
	if(!isClear){
		
	}
	//console.log(x,y)
	// 내부 경계 제한
	x = Math.max(70, Math.min(zone.clientWidth - playerSize, x));
	y = Math.max(90, Math.min(zone.clientHeight - playerSize, y));
	y = Math.min(500, y);

	player.style.left = `${x}px`;
	player.style.top = `${y}px`;
	requestAnimationFrame(updatePosition);
}


const zonesWrapper = document.querySelector('.zones-wrapper');

const zoneOrder = ['left', 'center', 'right']; // ✅ 순서 기반 이동 정의

function switchZone(target) {
	const index = zoneOrder.indexOf(target); // ✅ 대상 zone의 인덱스 확인

	currentZone = target;
	if(target === 'left'){
		attackStart();
	}
	else{
		zzalStop = true;
	}
	zonesWrapper.style.transform = `translateX(-${index * 800}px)`; // ✅ 슬라이드 이동 핵심!
}

requestAnimationFrame(updatePosition);

function gameOver() {
	canMove = false;
	zzalStop = true;
	const startTime = performance.now();
	const duration = 3000; // 3초
	const startX = x;
	const startY = y;
	const endX = 2000;
	const endY = 300;
	const startScrollX = zoneOrder.indexOf(currentZone) * -800;
	const endScrollX = -1600;
	let scrollX = startScrollX;
	const height = -900; // 최고점 y (포물선)
	zonesWrapper.style.transition = `none`;
	function animate(currentTime) {
		const elapsed = currentTime - startTime;
		const t = elapsed/1000;

		x = startX + (endX - startX) * t/3;
		scrollX = startScrollX + (endScrollX - startScrollX) * t/3;
		
		if(t<1.5){
			y = startY + (height - startY) * Math.sqrt(t/1.5);
		}
		else{
			let rt = 3 - t;
			if(rt<0)rt = 0;
			y = endY - (endY - height) * Math.sqrt(rt/1.5);
		}

		player.style.left = `${x}px`;
		player.style.top = `${y}px`;

		if (t < 3) {
			zonesWrapper.style.transform = `translateX(${scrollX}px)`;
			requestAnimationFrame(animate);
		} else {
			zonesWrapper.style.transform = `translateX(-1600px)`; 
			zonesWrapper.style.transition = `transform 0.6s ease`;
			currentZone = 'right'
			canMove = true; // 끝나면 다시 이동 가능
		}
	}

	requestAnimationFrame(animate);
}
const attxSize = 40;
const attySize = 30;
const diaySize = 60;
function attack(attx, atty, delay, value = 1, hp = 4, id="") {
	const layer = document.getElementById('left-zone');

	// danger 이미지 생성
	const attackDom = document.createElement('div');
	attackDom.className = 'attack-indicator';
	attackDom.style.left = `${attx}px`;
	attackDom.style.top = `${atty}px`;
	attackDom.style.transition = `opacity ${delay/1000}s ease-in`;
	layer.appendChild(attackDom);
	
	requestAnimationFrame(() => {
		attackDom.style.opacity = '1';
	});
	attackDom.style.backgroundImage = 'url("resource/danger.png")';

	// delay 후 danger 제거 + attack 이미지 표시
	setTimeout(() => {
		if(Math.abs((x+playerSize/2)-(attx+attxSize/2))<attxSize/2 && 
		Math.abs((y+playerSize/2)-(atty+attySize/2))<attySize/2){
			gameOver();
		}
		
		attackDom.className = 'attack-indicator can-collect';
		attackDom.style.backgroundImage = 'url("resource/diamondAttack.png")';
		attackDom.style.height = '0px';
		attackDom.style.top = `${atty+attySize}px`;
		requestAnimationFrame(() => {
			attackDom.style.transition = `height 0.3s linear,top 0.3s linear`;
			attackDom.style.height = `${diaySize}px`; 
			attackDom.style.top = `${atty+attySize-diaySize}px`;
		});
		let nowTime = performance.now();
		let attacked = false;
		let collidingInterval = (currentTime)=>{			
			const diamondRect = attackDom.getBoundingClientRect();
			const playerRect = player.getBoundingClientRect();
			const isColliding = !(
				playerRect.right < diamondRect.left ||
				playerRect.left > diamondRect.right ||
				playerRect.bottom < diamondRect.top ||
				playerRect.top > diamondRect.bottom
			);
			mining |= isColliding;
			if(nowAttacking == false){
				attacked = false;
			}else{					
				if(attacked == false && isColliding){
					attacked = true;
					hp = Math.max(hp - powerCalculator(),0);
					attackDom.style.opacity = hp/baseHP;
					if(id!=""){
						localStorage.setItem(id,hp);
					}
				}
			}
			nowTime = currentTime;
			if(hp<=0){
				attackDom.remove();
				money += valueCalculator(value);
				updateMoney(money);
				saveData("money", money);
				return;
			}
			else requestAnimationFrame(collidingInterval);
		};
		requestAnimationFrame(collidingInterval);
		
		
	}, delay);
}
function powerCalculator(){
	return power;
}
function valueCalculator(value){
	return value;
}
att = attack;
let zzalPause = false;
let zzalStop = false;
let zzalCool = 1000;
let coolReduceInterval;

let phase = 0;
let phaseTime = [10000, 30000,60000,90000];
let attackStartTime = performance.now();

function crossAttack(){
	
}
function daegakAttack(){
}

function pattern1(seed = 0){
	let v = Math.random();
	if(seed == -1){
		v = 1;
	}
	else if(seed == 1){
		v = -1;
	}
	let [tarx,tary] = targetPosition();
	attack(tarx,tary,1000,baseValue,baseHP);
	if(Math.random()<0.5){
		for(let i=1;i<5;i++){
			attack(tarx-30*i,tary,1000,baseValue,baseHP);
			attack(tarx+30*i,tary,1000,baseValue,baseHP);
			attack(tarx,tary-30*i,1000,baseValue,baseHP);
			attack(tarx,tary+30*i,1000,baseValue,baseHP);
		}
	}
	else{
		for(let i=1;i<5;i++){
			attack(tarx-30*i,tary-30*i,1000,baseValue,baseHP);
			attack(tarx+30*i,tary+30*i,1000,baseValue,baseHP);
			attack(tarx+30*i,tary-30*i,1000,baseValue,baseHP);
			attack(tarx-30*i,tary+30*i,1000,baseValue,baseHP);
		}		
	}
}

function pattern2(){
	let [tarx,tary] = targetPosition();
	attack(tarx,tary,1000,baseValue,baseHP);
	for(let i=1;i<5;i++){
		let j=i*2;
		for(let q=0;q<j;q++){
			setTimeout(()=>{
				attack(tarx-25*i+25*q,tary-25*i,1000,baseValue,baseHP);
				attack(tarx+25*i,tary-25*i+25*q,1000,baseValue,baseHP);
				attack(tarx+25*i-25*q,tary+25*i,1000,baseValue,baseHP);
				attack(tarx-25*i,tary+25*i-25*q,1000,baseValue,baseHP);
			},100*i);
		}
	}
}

function pattern3(){
	zzalPause = true;
	for(let i = 0;i<8;i++){
		setTimeout(()=>{pattern1(-1 + (i%2*2));},i*300);
	}
	setTimeout(()=>{zzalPause = false;},2400);
}

function attackStart(){
	phase = 0;
	zzalPause = false;
	zzalStop = false;
	zzalCool = 1000;
	attackStartTime = performance.now();
	requestAnimationFrame(zzal);
	coolReduceInterval = setInterval(()=>{zzalCool = Math.max(100, zzalCool-1)},200);
	
	function phaseCheck(){
		if(zzalStop)return;
		if(performance.now() - attackStartTime > phaseTime[phase]){
			phase++;
		}		
		requestAnimationFrame(phaseCheck);
	}
	phaseCheck();
}
let oriTime = performance.now();
function zzal(nowTime){
	if(zzalStop){
		clearMine();
		clearInterval(coolReduceInterval);
		return;
	}
	if(!zzalPause){
		if(zzalCool < nowTime - oriTime){
			if(Math.random()*20<1){
				attack(x-11,y-5,1000,baseValue,baseHP);
			}
			else attack(Math.random()*630+50,Math.random()*410+90,1000,baseValue,baseHP);
			
			if(phase > 0){
				if(Math.random()*3<1){
					if(phase==1)pattern1();
					else{
						if(Math.random()*2<1){
							pattern2();
						}
						else{
							pattern3();
						}
					}
				}
			}
			oriTime = nowTime;
		}
	}
	requestAnimationFrame(zzal);
}
function clearMine(){
	let mines = document.getElementsByClassName('attack-indicator');
	for (let i = mines.length - 1; i >= 3; i--) {
		mines[i].remove();
	}
}
let miningStartTime = performance.now();
let mined = false;

function gyojuMotionChange(state){
	let path = "resource/"+state+".png";
	playerskin.src=path;
}

	let stillmining = false;
function miningMotion(nowTime){
	if(mining || stillmining){
		console.log("aa", nowTime-miningStartTime);
		mining = false;
		if((nowTime - miningStartTime) < attackSpeed/2){
			console.log("miningup", nowTime-miningStartTime);
			gyojuMotionChange("miningup");
			mined = false;
		}else if(nowTime - miningStartTime < attackSpeed){
			stillmining = true;
			console.log("miningdown", nowTime-miningStartTime);
			gyojuMotionChange("miningdown");
			if(!mined){
				console.log("down");
				mined = true;
				nowAttacking = true;
				stopWorkAnimation(); // 멈춤 💡
			}else{
				nowAttacking = false;
			}
		}else{
			stillmining = false;
			miningStartTime = nowTime;
		}
	}
	else{
		miningStartTime = nowTime;
		startWorkAnimation(); // 시작 💡
	}
	
	requestAnimationFrame(miningMotion);
}
miningMotion();

function playerMove(){
	playerskin.style.left = `${x-15}px`;
	playerskin.style.top = `${y-70}px`;
	requestAnimationFrame(playerMove);
}
playerMove();

function startWorkAnimation() {
	if (workInterval) return; // 이미 실행 중이면 중복 방지
	if (!isMoving) {
		stopWorkAnimation(); // 💡 움직이지 않으면 프레임 넘기지 않음
		return;
	}	
	workFrame = (workFrame + 1) % 2;
	const frame = workFrame + 1; // 1 또는 2
	const direction = lastDirection === 'left' ? 'leftwork' : 'rightwork';
	playerskin.src = `resource/${direction}${frame}.png`;
	workInterval = setInterval(() => {	
		if (!isMoving) {
			stopWorkAnimation(); // 💡 움직이지 않으면 프레임 넘기지 않음
			return;
		}	
		
		workFrame = (workFrame + 1) % 2;
		const frame = workFrame + 1; // 1 또는 2
		const direction = lastDirection === 'left' ? 'leftwork' : 'rightwork';
		playerskin.src = `resource/${direction}${frame}.png`;
	}, 700);
}

function stopWorkAnimation() {
	clearInterval(workInterval);
	workInterval = null;
}

function buyAttackUp() {
	const price = getFibonacci(powerUp);
	if (money < price) {
		return;
	}
	
	money -= price;
	updateMoney(money);

	powerUp += 1;
	saveData('powerUp', powerUp);
	saveData('money', money);

	updatePriceLabel('powerUp', getFibonacci(powerUp)); 
	power = powerCalculator();
}
function buyAttackSpeedUp() {
	const price = getFibonacci(attackSpeedUp);
	if (money < price) {
		return;
	}
	
	money -= price;
	updateMoney(money);

	attackSpeedUp += 1;
	saveData('attackSpeedUp', attackSpeedUp);
	saveData('money', money);

	updatePriceLabel('attackSpeedUp', getFibonacci(attackSpeedUp)); 
	attackSpeed = attackSpeedCalculator(); // 5% 감소
}
function buyValueUp() {
	const price = getFibonacci(baseValueUp);
	if (money < price) {
		return;
	}
	
	money -= price;
	updateMoney(money);

	baseValueUp += 1;
	saveData('baseValueUp', baseValueUp);
	saveData('money', money);

	updatePriceLabel('baseValueUp', getFibonacci(baseValueUp)); 
	baseHP *=1.3;
	baseValue *=1.3;
}

function updatePriceLabel(itemId, value) {
	const label = document.getElementById(`${itemId}-label`);
	if (label) {
		label.textContent = `💎 ${value}`;
	}
}

function powerCalculator() {
	return Math.floor(powerUp * (powerUp + 3) / 2) + 1;
}

function attackSpeedCalculator() {
	return 500*Math.pow(0.9,attackSpeedUp);
}

function baseValueCalculator(){
	return 4*baseValueUp + Math.pow(1.05, baseValueUp);
}
/*
const bgm = {
	left: new Audio("resource/left.mp3"),
	center: new Audio("resource/center.mp3"),
	right: new Audio("resource/right.mp3"),
	phase2: new Audio("resource/phase2.mp3"),
	hardPhase: new Audio("resource/hardPhase.mp3")
};

for (const zone in bgm) {
	bgm[zone].loop = true;
}
*/
