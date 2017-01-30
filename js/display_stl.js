
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container;

// NOTE: cameraTarget will not be needed once trackball controls are used
var camera, cameraTarget, scene, renderer, controls;

init();
animate();

function openAttachment() {
    document.getElementById('attachement').click();
}

function fileSelected(input){
    document.getElementById('btnAttachment').value = "File: " + input.files[0].name
}

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 15 );
    camera.position.set( 3, 0.15, 3 );

    //cameraTarget = new THREE.Vector3( 0, -0.25, 0 );

    controls = new THREE.TrackballControls( camera );
    controls.rotateSpeed = 3.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.0;
    controls.keys = [ 65, 83, 68 ];
    controls.addEventListener( 'change', render );

    scene = new THREE.Scene();

    var fog_color = 0xfefefe;

    var file_name = './models/slotted_disk.stl';

    load_stl(file_name);

    // Binary files

    var material = new THREE.MeshPhongMaterial( { color: 0xAAAAAA, specular: 0x111111, shininess: 200 } );

    // Lights

    scene.add( new THREE.HemisphereLight( 0x000000, 0xdddddd ) ); //0xdddddd, 0xdddddd )); //0x111122)); //0x443333, 0x111122 ) );

    addShadowedLight( 10, 10, 10, 0xffffff, 1.35 );
    addShadowedLight( 5, 10, -10, 0xffffff); //0xffaa00, 1 );

    // renderer

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setClearColor( fog_color );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.renderReverseSided = false;

    container.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );

}

function addShadowedLight( x, y, z, color, intensity ) {

    var directionalLight = new THREE.DirectionalLight( color, intensity );
    directionalLight.position.set( x, y, z );
    scene.add( directionalLight );

    directionalLight.castShadow = true;

    var d = 1;
    directionalLight.shadow.camera.left = -d;
    directionalLight.shadow.camera.right = d;
    directionalLight.shadow.camera.top = d;
    directionalLight.shadow.camera.bottom = -d;

    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 4;

    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;

    directionalLight.shadow.bias = -0.005;

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
    controls.handleResize();
    render();
    
//    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

    requestAnimationFrame( animate );

    render();
    controls.update();

}

function render() {

    // var timer = Date.now() * 0.0005;

    // camera.position.x = Math.cos( timer ) * 3;
    // camera.position.z = Math.sin( timer ) * 3;

    // camera.lookAt( cameraTarget );

    renderer.render( scene, camera );

}

function load_stl(file_name) {
    var loader = new THREE.STLLoader();
    loader.load( file_name, function ( geometry ) {

	var material = new THREE.MeshPhongMaterial( { color: 0xff5533, specular: 0x111111, shininess: 200 } );
	var mesh = new THREE.Mesh( geometry, material );

	mesh.position.set( 0, - 0.25, 0.6 );
	mesh.rotation.set( 0, - Math.PI / 2, 0 );
	mesh.scale.set( 0.5, 0.5, 0.5 );

	mesh.castShadow = true;
	mesh.receiveShadow = true;

	scene.add( mesh );

	var bb = new THREE.Box3()
	bb.setFromObject(mesh);
	bb.center(controls.target);    
	
    } );

}
