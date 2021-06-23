class Point{
	// Permet d'avoir des valeurs par defaut pour x et y
	constructor(x=0.0, y=0.0){
		this.x = x;
		this.y = y;
	}
}

class M3x3{
	constructor(){
		// On créé notre matrice de base (1,1,1 en diagonal)
		this.matrix = [
			1, 0, 0,
			0, 1, 0,
			0, 0, 1
		];
	}

	multiply(m){
		// On créé notre nouvelle matrice de résultat
		var output = new M3x3();
		output.matrix = [
			// Application de mathématiques simple de multiplication de matrices
			this.matrix[M3x3.M00] * m.matrix[M3x3.M00] + this.matrix[M3x3.M10] * m.matrix[M3x3.M01] + this.matrix[M3x3.M20] * m.matrix[M3x3.M02], // 00
			this.matrix[M3x3.M01] * m.matrix[M3x3.M00] + this.matrix[M3x3.M11] * m.matrix[M3x3.M01] + this.matrix[M3x3.M21] * m.matrix[M3x3.M02], // 01
			this.matrix[M3x3.M02] * m.matrix[M3x3.M00] + this.matrix[M3x3.M12] * m.matrix[M3x3.M01] + this.matrix[M3x3.M22] * m.matrix[M3x3.M02], // 02

			this.matrix[M3x3.M00] * m.matrix[M3x3.M10] + this.matrix[M3x3.M10] * m.matrix[M3x3.M11] + this.matrix[M3x3.M20] * m.matrix[M3x3.M12], // 10
			this.matrix[M3x3.M01] * m.matrix[M3x3.M10] + this.matrix[M3x3.M11] * m.matrix[M3x3.M11] + this.matrix[M3x3.M21] * m.matrix[M3x3.M12], // 11
			this.matrix[M3x3.M02] * m.matrix[M3x3.M10] + this.matrix[M3x3.M12] * m.matrix[M3x3.M11] + this.matrix[M3x3.M22] * m.matrix[M3x3.M12], // 12

			this.matrix[M3x3.M00] * m.matrix[M3x3.M20] + this.matrix[M3x3.M10] * m.matrix[M3x3.M21] + this.matrix[M3x3.M20] * m.matrix[M3x3.M22], // 20
			this.matrix[M3x3.M01] * m.matrix[M3x3.M20] + this.matrix[M3x3.M11] * m.matrix[M3x3.M21] + this.matrix[M3x3.M21] * m.matrix[M3x3.M22], // 21
			this.matrix[M3x3.M02] * m.matrix[M3x3.M20] + this.matrix[M3x3.M12] * m.matrix[M3x3.M21] + this.matrix[M3x3.M22] * m.matrix[M3x3.M22]  // 22
		];
		// On retourne notre nouvelle matrice
		return output;
	}

	transition(x, y){
		// On créé notre nouvelle matrice
		var output = new M3x3();
		output.matrix = [
			// La première colonne ne change pas
			this.matrix[M3x3.M00],
			this.matrix[M3x3.M01],
			this.matrix[M3x3.M02],

			// La deuxième colonne ne change pas
			this.matrix[M3x3.M10],
			this.matrix[M3x3.M11],
			this.matrix[M3x3.M12],

			// C'est la troisième colonne qui change
			x * this.matrix[M3x3.M00] + y * this.matrix[M3x3.M10] + this.matrix[M3x3.M20],
			x * this.matrix[M3x3.M01] + y * this.matrix[M3x3.M11] + this.matrix[M3x3.M21],
			x * this.matrix[M3x3.M02] + y * this.matrix[M3x3.M12] + this.matrix[M3x3.M22]
		];
		// On retourne notre nouvelle matrice
		return output;
	}

	scale(x, y){
		// On créé notre nouvelle matrice
		var output = new M3x3();
		// On multipli la 1ere colonne par x et la 2eme par y
		output.matrix = [
			this.matrix[M3x3.M00] * x,
			this.matrix[M3x3.M01] * x,
			this.matrix[M3x3.M02] * x,

			this.matrix[M3x3.M10] * y,
			this.matrix[M3x3.M11] * y,
			this.matrix[M3x3.M12] * y,

			this.matrix[M3x3.M20],
			this.matrix[M3x3.M21],
			this.matrix[M3x3.M22]
		];
		// On retourne notre nouvelle matrice
		return output;
	}

	// permet de convertir notre matrice en tableau
	getFloatArray(){
		return new Float32Array(this.matrix);
	}
}

// On définit plusieurs valeurs pour représenter les différents élements de notre tableau plus facilement (1er 0 = colonne, 2ème 0 = ligne)
//	[00  :	01  :	02]
//	[10  :	11  :	12]
//	[20  :	21  :	22]
M3x3.M00 = 0;
M3x3.M01 = 1;
M3x3.M02 = 2;
M3x3.M10 = 3;
M3x3.M11 = 4;
M3x3.M12 = 5;
M3x3.M20 = 6;
M3x3.M21 = 7;
M3x3.M22 = 8;