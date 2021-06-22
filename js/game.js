function loop(){
	window.game.update();
	requestAnimationFrame(loop);
}

class Game{
	constructor(){
		// on créé le canvas et on le dimensionne
		this.canvasElm = document.createElement("canvas");
		this.canvasElm.width = 800;
		this.canvasElm.height = 600;
		
		this.worldSpaceMatrix = new M3x3();
		
		// On créé notre contexte
		this.gl = this.canvasElm.getContext("webgl2");
		// On donne une couleur bleuté à notre canvas pour mieux le dicerner
		this.gl.clearColor(0.4,0.6,1.0,0.0);
		
		// On doit ajouter le canvas en lui meme dans le document
		document.body.appendChild(this.canvasElm);
		
		// On veut charger nos shaders dans notre index.html
		let vs = document.getElementById("vs_01").innerHTML;
		let fs = document.getElementById("fs_01").innerHTML;
		
		// On donne les sprites à dessiner
		this.sprite1 = new Sprite(this.gl, "img/manonfire.png", vs, fs, {width:48, height:48});
		this.sprite2 = new Sprite(this.gl, "img/walker.png", vs, fs, {width:64, height:64});
		
		this.sprite1Pos = new Point();
		this.sprite2Pos = new Point();
		
		this.sprite1Frame = new Point();
		this.sprite2Frame = new Point();
	}
	
	resize(x,y){
		this.canvasElm.width = x;
		this.canvasElm.height = y;
		
		let wRatio = x / (y/240);
		this.worldSpaceMatrix = new M3x3().transition(-1, 1).scale(2/wRatio,-2/240);
	}
	
	update(){

		// On vide notre canvas
		this.gl.viewport(0,0, this.canvasElm.width, this.canvasElm.height);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
		
		// On dit a WebGL comment on veut nos alphas se mélangent (comment les images se dessinent les unes sur les autres)
		this.gl.enable(this.gl.BLEND);
		this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
		
		this.sprite1Frame.x = (new Date() * 0.006) % 3;
		this.sprite1Frame.y = (new Date() * 0.002) % 2;
		
		this.sprite2Frame.x = (new Date() * 0.006) % 3;
		this.sprite2Frame.y = (new Date() * 0.002) % 2;
		
		this.sprite2Pos.x = (this.sprite2Pos.x + 1.1) % 256;
		
		// On rend notre sprite à l'ecran
		this.sprite1.render(this.sprite1Pos, this.sprite1Frame);
		this.sprite2.render(this.sprite2Pos, this.sprite2Frame);
		
		// Permet de tout effacer
		this.gl.flush();
	}
}