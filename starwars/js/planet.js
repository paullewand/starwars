var renderer, scene, camera, mesh;

function init(){
        // on initialise le moteur de rendu
        renderer = new THREE.WebGLRenderer();

        // si WebGL ne fonctionne pas sur votre navigateur vous pouvez utiliser le moteur de rendu Canvas à la place
        // renderer = new THREE.CanvasRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.getElementById('container').appendChild(renderer.domElement);

        // on initialise la scène
        scene = new THREE.Scene();

        // on initialise la camera que l’on place ensuite sur la scène
        camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.set(0, 0, 1000);
        scene.add(camera);
}

function create_planet(){
    // on crée la sphère 
    var geometry = new THREE.SphereGeometry( 200, 35, 35 );
    var material = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture('img/coruscant.jpg', undefined), overdraw: true } );
    mesh = new THREE.Mesh( geometry, material );
    mesh.position.setX(0);
    scene.add( mesh );
    // on effectue le rendu de la scène
    renderer.render( scene, camera );
}
      
function animate(){
    requestAnimationFrame( animate );
    mesh.rotation.y += 0.01;
    renderer.render( scene, camera );
}