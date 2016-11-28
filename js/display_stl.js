
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats;

// NOTE: cameraTarget will not be needed once trackball controls are used
var camera, cameraTarget, scene, renderer, controls;

init();
animate();

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 15 );
    camera.position.set( 3, 0.15, 3 );

    //cameraTarget = new THREE.Vector3( 0, -0.25, 0 );

    controls = new THREE.TrackballControls( camera );
    controls.rotateSpeed = 1.0;
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
    //scene.fog = new THREE.Fog( fog_color, 2, 15 ); //new THREE.Fog( 0x72645b, 2, 15 );


    // Ground

    var plane = new THREE.Mesh(
	new THREE.PlaneBufferGeometry( 40, 40 ),
	new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x101010, shininess: 400 } )
	//new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x101010 } )
    );
    plane.rotation.x = -Math.PI/2;
    plane.position.y = -0.5;

    plane.receiveShadow = true;

//    scene.add( plane );



    // ASCII file

    var loader = new THREE.STLLoader();
    loader.load( './models/slotted_disk.stl', function ( geometry ) {

	var material = new THREE.MeshPhongMaterial( { color: 0xff5533, specular: 0x111111, shininess: 200 } );
	var mesh = new THREE.Mesh( geometry, material );

	mesh.position.set( 0, - 0.25, 0.6 );
	mesh.rotation.set( 0, - Math.PI / 2, 0 );
	mesh.scale.set( 0.5, 0.5, 0.5 );

	mesh.castShadow = true;
	mesh.receiveShadow = true;

	scene.add( mesh );

    } );


    // Binary files

    var file_1 = './models/pr2_head_pan.stl';
    var file_2 = './models/pr2_head_tilt.stl';
    var file_3 = './models/colored.stl';
    var il70_part = './models/IL70\ -\ Case\ -\ Case.stl';
    
    var material = new THREE.MeshPhongMaterial( { color: 0xAAAAAA, specular: 0x111111, shininess: 200 } );

    loader.load( il70_part, function ( geometry ) {

	var mesh = new THREE.Mesh( geometry, material );

	mesh.position.set( 0, - 0.37, - 0.6 );
	mesh.rotation.set( - Math.PI / 2, 0, 0 );
	mesh.scale.set( 2, 2, 2 );

	mesh.castShadow = true;
	mesh.receiveShadow = true;

	scene.add( mesh );

    } );

    loader.load( file_2, function ( geometry ) {

	var mesh = new THREE.Mesh( geometry, material );

	mesh.position.set( 0.136, - 0.37, - 0.6 );
	mesh.rotation.set( - Math.PI / 2, 0.3, 0 );
	mesh.scale.set( 2, 2, 2 );

	mesh.castShadow = true;
	mesh.receiveShadow = true;

	scene.add( mesh );

    } );

    // Colored binary STL
    loader.load( file_3, function ( geometry ) {

	var meshMaterial = material;
	if (geometry.hasColors) {
	    meshMaterial = new THREE.MeshPhongMaterial({ opacity: geometry.alpha, vertexColors: THREE.VertexColors });
	}

	var mesh = new THREE.Mesh( geometry, meshMaterial );

	mesh.position.set( 0.5, 0.2, 0 );
	mesh.rotation.set( - Math.PI / 2, Math.PI / 2, 0 );
	mesh.scale.set( 0.3, 0.3, 0.3 );

	mesh.castShadow = true;
	mesh.receiveShadow = true;

	scene.add( mesh );

    } );


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

    // stats

    stats = new Stats();
    container.appendChild( stats.dom );

    //

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
    stats.update();
    controls.update();

}

function render() {

    // var timer = Date.now() * 0.0005;

    // camera.position.x = Math.cos( timer ) * 3;
    // camera.position.z = Math.sin( timer ) * 3;

    // camera.lookAt( cameraTarget );

    renderer.render( scene, camera );
    stats.update();

}

