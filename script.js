let canvas = document.getElementById("canvas");
let cont = canvas.getContext("2d");

let bird = new Image();
let bg = new Image();
let fg = new Image();
let pipe_u = new Image();
let pipe_b = new Image();
let flap = new Audio();
let score_sound = new Audio();

bird.src = "flappy_bird_bird.png";
bg.src = "flappy_bird_bg.png";
fg.src = "flappy_bird_fg.png";
pipe_u.src = "flappy_bird_pipeUp.png";
pipe_b.src = "flappy_bird_pipeBottom.png";
flap.src = "fly.mp3";
score_sound.src = "score.mp3";

let bird_y = canvas.height / 2;
let bird_v = -5;
let grav = 0.2;
let lift = -12;
let score = 0;
let gap = 110;
let started = false;
let end = false;

function fly_up(){
	bird_v += lift;
	flap.play();
	started = true;
	end = false;
}

let pipe = [];

pipe[0] = {
	x: canvas.width,
	y: Math.floor(Math.random() * pipe_u.height) - pipe_u.height
};

document.addEventListener("keydown", function(){
	if(event.code === "Space"){
		fly_up();
	}
});

function draw(){
	cont.drawImage(bg, 0, 0);
	for(let i = 0; i < pipe.length; i++){
		cont.drawImage(pipe_u, pipe[i].x, pipe[i].y);
		cont.drawImage(pipe_b, pipe[i].x, pipe[i].y + pipe_u.height + gap);
		pipe[i].x--;
		if(pipe[i].x === 125){
			pipe.push({
				x: canvas.width,
				y: Math.floor(Math.random() * pipe_u.height) - pipe_u.height
			});
		}
		if(pipe[i].x === 5){
			score++;
			score_sound.play();
		}
	}
	bird_v += grav;
	bird_v += 0.3;
	if(bird_y < 0){
		bird_y = 0;
	}
	if(bird_v < -7){
		bird_v = -7;
	}
	if(bird_v > 12){
		bird_v = 12;
	}
	bird_y += bird_v;
	if(bird_y > canvas.height){
		bird_y = canvas.height;
	}
	if(bird_y < 0){
		bird_y = 0;
	}
	cont.drawImage(bird, 5, bird_y);
	cont.drawImage(fg, 0, 400);
	cont.fillStyle = "#000000";
	cont.font = "24px Comic Sans MS";
	cont.fillText("Счет: " + score, 10, canvas.height - 20);
	if(collide()){
		started = false;
		end = true;
		console.log("boom");
		score = 0;
	}
	if(started && !end) {
		requestAnimationFrame(draw);
	}
	else{
		requestAnimationFrame(end_draw);
	}
}

function collide() {
	let ans = false;
	for (let i = 0; i < pipe.length; i++) {
		ans = 3 + bird.width >= pipe[i].x && 7 <= pipe[i].x + pipe_u.width && (bird_y + bird.height >= pipe[i].y + pipe_u.height + gap || bird_y <= pipe[i].y + pipe_u.height);
		if(ans){
			return true;
		}
	}
	ans = bird_y + bird.height >= 400;
	return ans;
}

function pre_draw(){
	cont.drawImage(bg, 0, 0);
	cont.drawImage(bird, 5, bird_y);
	cont.drawImage(fg, 0, 400);
	cont.fillStyle = "#000000";
	cont.font = "24px Comic Sans MS";
	cont.fillText("Счет: " + score, 10, canvas.height - 20);
	if(!started) {
		requestAnimationFrame(pre_draw);
	}
	else{
		requestAnimationFrame(draw);
	}
}

function end_draw(){
	cont.drawImage(bg, 0, 0);
	for(let i = 0; i < pipe.length; i++){
		cont.drawImage(pipe_u, pipe[i].x, pipe[i].y);
		cont.drawImage(pipe_b, pipe[i].x, pipe[i].y + pipe_u.height + gap);
	}
	cont.drawImage(bird, 5, bird_y);
	cont.drawImage(fg, 0, 400);
	cont.fillStyle = "#000000";
	if(started && !end) {
		pipe.length = 0;
		bird_y = canvas.height / 2;
		bird_v = -5;
		pipe[0] = {
			x: canvas.width,
			y: Math.floor(Math.random() * pipe_u.height) - pipe_u.height
		};
		requestAnimationFrame(draw);
	}
	else{
		requestAnimationFrame(end_draw);
	}
}

pipe_b.onload = pre_draw;