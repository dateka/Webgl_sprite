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

		// On donne les sprites à dessiner avec la largeur hauteur
		this.sprite1 = new Sprite(this.gl, "img/manonfire.png", vs, fs, {width:48, height:48});
		this.sprite2 = new Sprite(this.gl, "img/walker.png", vs, fs, {width:64, height:64});

		// test fonctionnement matrice
		// let m = new M3x3();
		// let n = new M3x3();
		// m.matrix[M3x3.M01] = 2.0;
		// m.matrix[M3x3.M11] = 5.0;

		// n.matrix[M3x3.M00] = 3.0;
		// n.matrix[M3x3.M20] = 6.0;
		// n.matrix[M3x3.M11] = 3.0;
		// n.matrix[M3x3.M21] = 4.0;

		// let c = m.multiply(n);
		// console.log(c);

		// On déclare une position pour nos deux sprites
		this.sprite1Pos = new Point();
		this.sprite2Pos = new Point();

		// On déclare une frame pour nos deux sprites
		this.sprite1Frame = new Point();
		this.sprite2Frame = new Point();
	}

	// Permet de redimensionner le canvas à la taille du canvas
	resize(x,y){
		this.canvasElm.width = x;
		this.canvasElm.height = y;

		// On calcule le ratio de largeur de l'écran
		// On divise notre largeur d'écran par la hauteur d'écran divisé par 240
		let wRatio = x / (y/240);
		// On définit notre matrice
		// On lui donne une transition de -1 à 1 (car on veut que la transition se face sur tout le canvas)
		// On met à l'échelle (on utilise 240 car beaucoup de vieux jeu utilise 240 lignes verticales)
		// On utilise -2 pour retourner notre image à l'envers. Donc au lieu d'aller entre 1 et -1, il passera de -1 à 1.
		this.worldSpaceMatrix = new M3x3().transition(-1, 1).scale(2/wRatio,-2/240);
		// canvas :
		// -----|-----
		//  -1  |  1
		// -----|-----
	}

	update(){
		// On vide notre canvas
		this.gl.viewport(0,0, this.canvasElm.width, this.canvasElm.height);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);

		// On dit a WebGL comment on veut nos alphas se mélangent (comment les images se dessinent les unes sur les autres)
		this.gl.enable(this.gl.BLEND);
		this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

		// On fait notre animation
		// On utilise la date actuel et on la mulitplie par 0.0006 pour update nos frame. Plus on augmente cette valeur plus le changement de frame se fait souvent.
		this.sprite1Frame.x = (new Date() * 0.006) % 3;
		this.sprite1Frame.y = (new Date() * 0.002) % 2;

		this.sprite2Frame.x = (new Date() * 0.006) % 3;
		this.sprite2Frame.y = (new Date() * 0.002) % 2;

		// On fait notre transition sur l'écran. On peut changer la vitesse de déplacement avec la valeur 1.1
		this.sprite2Pos.x = (this.sprite2Pos.x + 1.1) % 256;

		// On rend notre sprite à l'ecran avec une position et une frame
		this.sprite1.render(this.sprite1Pos, this.sprite1Frame);
		this.sprite2.render(this.sprite2Pos, this.sprite2Frame);

		// Permet de tout effacer
		this.gl.flush();
	}
}