k_serpent={

direction:39,
tb_posi_l:[],
tb_posi_t:[],
tb_el:1,
tb_grille_l:[],
tb_grille_t:[],
tb_rotation:[],
posipom_t:0,
posipom_l:0,
taille_pixel:20,
vitesse:100,
cvs_intermed:'',
inter:'',
point:0,
pomme:'',
corp:'',
tete:'',
score:0,

creason:function(chemin){
		
		var audio_el=document.createElement('audio');
		
		var s_ogg=document.createElement('source');
		s_ogg.setAttribute('type','audio/ogg');
		s_ogg.setAttribute('src',chemin+'.ogg');
		audio_el.appendChild(s_ogg);
		
		var s_mp3=document.createElement('source');
		s_mp3.setAttribute('type','audio/mp3');
		s_mp3.setAttribute('src',chemin+'.mp3');
		audio_el.appendChild(s_mp3);
		return audio_el;
	},
	
aud:'',
antibug:0,
cvs:'',
ctx:''
}

function serpent_touch(evt){	// gestion du sens de deplacement en fonction des touches clavier

	evt.preventDefault();

	if(k_serpent.antibug==1){
		return false;
	}
	k_serpent.antibug=1;
	
	var touche=evt.keyCode;
	
	if(touche==39 && k_serpent.direction==37){
		return false;
	}
	if(touche==37 && k_serpent.direction==39){
		return false;
	}
	if(touche==40 && k_serpent.direction==38){
		return false;
	}
	if(touche==38 && k_serpent.direction==40){
		return false;
	}
	
	if(touche!=k_serpent.direction){
		k_serpent.direction=touche;
	}
}

function serpent_bouge(evt){	//deplacement du serpent et du corp.

	if(k_serpent.direction==39){

		k_serpent.tb_posi_l.unshift(k_serpent.tb_posi_l[0]+k_serpent.taille_pixel);
		k_serpent.tb_posi_l.pop();
		k_serpent.tb_posi_t.unshift(k_serpent.tb_posi_t[0]);
		k_serpent.tb_posi_t.pop();
		k_serpent.tb_rotation.unshift(0);
		k_serpent.tb_rotation.pop();
	}
	if(k_serpent.direction==37){

		k_serpent.tb_posi_l.unshift(k_serpent.tb_posi_l[0]-k_serpent.taille_pixel);
		k_serpent.tb_posi_l.pop();
		k_serpent.tb_posi_t.unshift(k_serpent.tb_posi_t[0]);
		k_serpent.tb_posi_t.pop();
		k_serpent.tb_rotation.unshift(180);
		k_serpent.tb_rotation.pop();
	}
	if(k_serpent.direction==38){

		k_serpent.tb_posi_t.unshift(k_serpent.tb_posi_t[0]-k_serpent.taille_pixel);
		k_serpent.tb_posi_t.pop();
		k_serpent.tb_posi_l.unshift(k_serpent.tb_posi_l[0]);
		k_serpent.tb_posi_l.pop();
		k_serpent.tb_rotation.unshift(270);
		k_serpent.tb_rotation.pop();
	}
	if(k_serpent.direction==40){

		k_serpent.tb_posi_t.unshift(k_serpent.tb_posi_t[0]+k_serpent.taille_pixel);
		k_serpent.tb_posi_t.pop();
		k_serpent.tb_posi_l.unshift(k_serpent.tb_posi_l[0]);
		k_serpent.tb_posi_l.pop();
		k_serpent.tb_rotation.unshift(90);
		k_serpent.tb_rotation.pop();
	}
	
	cadre_bord();
	
	for(var i = 1; i < k_serpent.tb_el; i++){

		if(colision_queue(i)){
			fin();
			return false;
		}
	}
	
	if(colision()){

		k_serpent.tb_posi_l.push(k_serpent.tb_posi_l[k_serpent.tb_el]);
		k_serpent.tb_posi_t.push(k_serpent.tb_posi_t[k_serpent.tb_el]);
		k_serpent.tb_el+=1;
		k_serpent.tb_rotation.push(k_serpent.tb_rotation[k_serpent.tb_el]);
		k_serpent.point+=5;
		document.getElementById('point').firstChild.nodeValue=k_serpent.point;
		k_serpent.aud.currentTime=0;
		k_serpent.aud.play();
		posi_pom();
	}
	
	
	var cvs=k_serpent.cvs;
	var ctx = k_serpent.ctx;
	var intermed=k_serpent.cvs_intermed.getContext('2d');
	
	ctx.clearRect(0, 0, cvs.width, cvs.height);
	
	for(var i = 0; i < k_serpent.tb_el; i++){
		
		intermed.save();
		intermed.translate(10, 10);
		intermed.rotate(k_serpent.tb_rotation[i]*(Math.PI/180));
		
		if(i==0){
			intermed.drawImage(k_serpent.tete,-10, -10);
		}
		else{
			intermed.drawImage(k_serpent.corp,-10, -10);
		}
		intermed.restore();
		ctx.drawImage(k_serpent.cvs_intermed,k_serpent.tb_posi_l[i],k_serpent.tb_posi_t[i]);	
	}
	intermed.clearRect(0, 0, 20, 20);
	
	ctx.drawImage(k_serpent.pomme,k_serpent.posipom_l,k_serpent.posipom_t);
	
	k_serpent.antibug=0;
}

function cadre_bord(){		//gestion de la position aux bords du canvas conteneur.

	var conteneur=document.getElementById('dvg_jeux');
	
	if(k_serpent.tb_posi_l[0] >= conteneur.width){
		
		k_serpent.tb_posi_l[0]=0;
	}
	
	else if(k_serpent.tb_posi_l[0]<0){
		
		k_serpent.tb_posi_l[0]=conteneur.width-20;
	}
	
	if(k_serpent.tb_posi_t[0] < 0){
		k_serpent.tb_posi_t[0]=conteneur.height-20;
	}

	else if(k_serpent.tb_posi_t[0] >= conteneur.height){
		k_serpent.tb_posi_t[0]=0;
	}
}

function colision(){		//gestion de la colision entre la pomme et la tete

	return(k_serpent.posipom_t == k_serpent.tb_posi_t[0] && k_serpent.tb_posi_l[0] == k_serpent.posipom_l);
}

function colision_queue(i){		//gestion de la colision entre la tete et le corps

	return(k_serpent.tb_posi_t[i] == k_serpent.tb_posi_t[0] && k_serpent.tb_posi_l[i] == k_serpent.tb_posi_l[0]);

}

function posi_pom(){	//nouvelle position de la pomme

	k_serpent.posipom_l=k_serpent.tb_grille_l[Math.floor(Math.random()*k_serpent.tb_grille_l.length)];
	k_serpent.posipom_t= k_serpent.tb_grille_t[Math.floor(Math.random()*k_serpent.tb_grille_t.length)];
	
}


function fin(){	// fin de partie; on vide les tableaux, arrete l'interval et affiche le menu.
	
	clearInterval(k_serpent.inter);
	typeof window.addEventListener == 'undefined' ? document.detachEvent("onkeydown",serpent_touch) : removeEventListener("keydown",serpent_touch, false);

	k_serpent.tb_posi_l.splice(0, k_serpent.tb_el.length);
	k_serpent.tb_posi_t.splice(0, k_serpent.tb_el.length);
	k_serpent.tb_el=1;
	k_serpent.tb_grille_l.splice(0, k_serpent.tb_el.length);
	k_serpent.tb_grille_t.splice(0, k_serpent.tb_el.length);
	k_serpent.tb_rotation.splice(0, k_serpent.tb_el.length);
	
	if(k_serpent.point > k_serpent.score){
		k_serpent.score = k_serpent.point;
	}
	
	localStorage.score=k_serpent.score;
	 
	var canvas=k_serpent.cvs;
    var ctx = k_serpent.cvs.getContext('2d');
	
    ctx.clearRect(0, 0, canvas.width, canvas.height);
     
    ctx.fillStyle = 'white';
    ctx.font = '40px sans-serif';
    
	ctx.fillText('fin de partie!', ((canvas.width / 2) - (ctx.measureText('fin de partie!').width / 2)), 100);
     
    ctx.fillText('votre score: ' + k_serpent.point, ((canvas.width / 2) - (ctx.measureText('votre score: ' + k_serpent.point).width / 2)), 200);
	
	ctx.fillText('meilleur score: ' + k_serpent.score, ((canvas.width / 2) - (ctx.measureText('meilleur score: ' + k_serpent.score).width / 2)), 250);
	
	document.getElementById('dvg_jeux').onclick=affiche_menu;
	document.getElementById('point').firstChild.nodeValue=0;
	k_serpent.point=0;
}

function affiche_menu(){
k_serpent.ctx.clearRect(0, 0, k_serpent.cvs.width, k_serpent.cvs.height);
document.getElementById('menu').style.display='block';
document.getElementById('dvg_jeux').onclick='';
}


function init_serpent(){

	document.getElementById('point').firstChild.nodeValue=0;
	document.getElementById('menu').style.display='none';
	
	if(k_serpent.cvs==''){
	 k_serpent.cvs=document.getElementById('dvg_jeux');
	 k_serpent.ctx=k_serpent.cvs.getContext('2d');
	 }
	 
	 if(localStorage.score){
	 k_serpent.score=parseInt(localStorage.score);
	 }
	
	k_serpent.tb_posi_l.push(0);

	k_serpent.tb_posi_t.push(0);
	
	k_serpent.tb_rotation.push(0);
	
	for(var i=0;i < document.getElementById('dvg_jeux').width; i+=k_serpent.taille_pixel){
		k_serpent.tb_grille_l.push(i);
	}
	
	for(var i=0;i < document.getElementById('dvg_jeux').height; i+=k_serpent.taille_pixel){
		k_serpent.tb_grille_t.push(i);
	}
	
	posi_pom();
	
	k_serpent.tete = new Image();
	k_serpent.tete.src='res/6.png';
	k_serpent.tete.onload = function(){

		k_serpent.corp = new Image();
		k_serpent.corp.src='res/5.ico';
		k_serpent.corp.onload = function(){

			k_serpent.pomme = new Image();
			k_serpent.pomme.src='res/9.png';
			k_serpent.pomme.onload = function(){

				k_serpent.inter=setInterval(serpent_bouge,k_serpent.vitesse);
			}
		}
	}

	k_serpent.cvs_intermed=document.createElement('canvas');
	k_serpent.cvs_intermed.height=20;
	k_serpent.cvs_intermed.width=20;

	k_serpent.aud=k_serpent.creason('res/son/pie');
	typeof window.addEventListener == 'undefined' ? document.attachEvent("onkeydown",serpent_touch) : addEventListener("keydown",serpent_touch, false);
}