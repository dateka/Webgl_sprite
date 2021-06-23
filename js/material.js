class Material{
	constructor(gl, vs, fs){
		// On récupère notre webgl Context
		this.gl = gl;

		// On récupère nos shaders
		let vsShader = this.getShader(vs, gl.VERTEX_SHADER);
		let fsShader = this.getShader(fs, gl.FRAGMENT_SHADER);

		// On test si nos shaders fonctionnent
		if(vsShader && fsShader){
			// On créé notre programme
			this.program = gl.createProgram();
			// On attache nos shaders à notre programme
			gl.attachShader(this.program, vsShader);
			gl.attachShader(this.program, fsShader);
			// On reli notre programme
			gl.linkProgram(this.program);

			// On vérifie que tout est correct (que les shaders sont chargés)
			if(!gl.getProgramParameter(this.program, gl.LINK_STATUS)){
				console.error("Cannot load shader \n" + gl.getProgramInfoLog(this.program));
				return null;
			}

			// On détache nos shaders puis on les suprime
			gl.detachShader(this.program, vsShader);
			gl.detachShader(this.program, fsShader);
			gl.deleteShader(vsShader);
			gl.deleteShader(fsShader);

			gl.useProgram(null);
		}
	}

	getShader(script, type){
		let gl = this.gl;
		// On crée notre shader
		var output = gl.createShader(type);
		// On défini notre source
		gl.shaderSource(output, script);
		// On compile
		gl.compileShader(output);

		// On prend en compte s'il y a une erreur sinon rien ne s'affiche en cas d'erreur
		if(!gl.getShaderParameter(output, gl.COMPILE_STATUS)){
			console.error("Shader error: \n:" + gl.getShaderInfoLog(output));
			return null;
		}

		// On retourne notre shader
		return output;
	}
}

class Sprite{
	constructor(gl, img_url, vs, fs, opts={}){
		this.gl = gl;
		// On le met a false pour tracker l'état de chargement des sprites
		this.isLoaded = false;
		// On veut set up nos shaders
		this.material = new Material(gl,vs,fs);

		// On donne une taille par défaut à nos sprites dans le cas où la taille ne serait pas spécifié
		this.size = new Point(64,64);
		if("width" in opts){
			this.size.x = opts.width * 1;
		}
		if("height" in opts){
			this.size.y = opts.height * 1;
		}

		// On définit notre image
		this.image = new Image();
		this.image.src = img_url;
		this.image.sprite = this;
		this.image.onload = function(){
			this.sprite.setup();
		}
	}

	// Créé un tableau pour rectangle
	// On définit des valeurs par défaut
	// Vu que pour dessiner un rectangle, il faut dessiner 2 triangles, on a 6 points
	static createRectArray(x = 0, y = 0, w = 1, h = 1){
		return new Float32Array([
			x, y,
			x + w, y,
			x, y + h,
			x, y + h,
			x + w, y,
			x + w, y + h
		]);
	}

	setup(){
		let gl = this.gl;

		// On charge et on utilise notre programme
		gl.useProgram(this.material.program);
		// On créé notre texture
		this.gl_tex = gl.createTexture();

		// On bind notre texture
		gl.bindTexture(gl.TEXTURE_2D, this.gl_tex);
		// On veut qu'il soit fusionné et répété
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		// On assigne notre image à la texture de webgl
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);
		// On unbind notre texture
		gl.bindTexture(gl.TEXTURE_2D, null);

		// On récupère une valeur entre 0 et 1
		this.uv_x = this.size.x / this.image.width;
		this.uv_y = this.size.y / this.image.height;

		// On fait un buffer pour la texture
		this.tex_buff = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.tex_buff);
		gl.bufferData(gl.ARRAY_BUFFER, Sprite.createRectArray(0, 0, this.uv_x, this.uv_y), gl.STATIC_DRAW);

		// On doit rendre un rectangle donc on fait notre geometry buffer
		this.geo_buff = gl.createBuffer();
		// On bind notre buffer
		gl.bindBuffer(gl.ARRAY_BUFFER, this.geo_buff);
		// On donne des datas (on créé 2 triangles)
		gl.bufferData(gl.ARRAY_BUFFER, Sprite.createRectArray(0, 0, this.size.x, this.size.y), gl.STATIC_DRAW);

		// On récupère les variables dont on a besoin
		this.aPositionLoc = gl.getAttribLocation(this.material.program, "a_position");
		this.aTexcoordLoc = gl.getAttribLocation(this.material.program, "a_texCoord");
		this.uImageLoc = gl.getUniformLocation(this.material.program, "u_image");

		this.uFrameLoc = gl.getUniformLocation(this.material.program, "u_frame");
		this.uWorldLoc = gl.getUniformLocation(this.material.program, "u_world");
		this.uObjectLoc = gl.getUniformLocation(this.material.program, "u_object");

		// On a tout donc on arrete d'utiliser le programme
		gl.useProgram(null);
		// On défini loaded à true
		this.isLoaded = true;
	}

	render(position, frames){
		// On verifie que c'est bien loader
		if(this.isLoaded){
			let gl = this.gl;

			// On change de frame pour créer une animation.
			// On utilise Math.floor pour ne pas avoir de valeur intermédiaire entre les frames
			let frame_x = Math.floor(frames.x) * this.uv_x;
			let frame_y = Math.floor(frames.y) * this.uv_y;

			// On créé une nouvelle matrice avec une transition pour la position
			let oMat = new M3x3().transition(position.x, position.y);

			// On utilise notre programme
			gl.useProgram(this.material.program);

			// On active la texture
			gl.activeTexture(gl.TEXTURE0);
			// On la bind
			gl.bindTexture(gl.TEXTURE_2D, this.gl_tex);
			gl.uniform1i(this.uImageLoc, 0);

			// On bind notre texture buffer
			gl.bindBuffer(gl.ARRAY_BUFFER, this.tex_buff);
			gl.enableVertexAttribArray(this.aTexcoordLoc);
			gl.vertexAttribPointer(this.aTexcoordLoc, 2, gl.FLOAT, false, 0, 0);

			// On bind notre geometry buffer
			gl.bindBuffer(gl.ARRAY_BUFFER, this.geo_buff);
			gl.enableVertexAttribArray(this.aPositionLoc);
			gl.vertexAttribPointer(this.aPositionLoc, 2, gl.FLOAT, false, 0, 0);

			// On définit une valeur par notre frame
			gl.uniform2f(this.uFrameLoc, frame_x, frame_y);
			// On définit la valeur de notre matrice de espace de mouvement
			gl.uniformMatrix3fv(this.uWorldLoc, false, window.game.worldSpaceMatrix.getFloatArray());
			// On définit la valeur pour notre mouvement
			gl.uniformMatrix3fv(this.uObjectLoc, false, oMat.getFloatArray());

			// On dessine nos formes (un rectangle fait de deux triangles)
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6);

			// On arrete d'utiliser notre programme
			gl.useProgram(null);
		}
	}
}