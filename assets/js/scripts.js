var camera, scene, renderer;

var isUserInteracting = false,
onMouseDownMouseX = 0, onMouseDownMouseY = 0,
lon = -57.7, onMouseDownLon = 0,
lat = 62.9, onMouseDownLat = 0,
phi = 0, theta = 0,
distance = 526,
zoomMin = 1,
zoomMax = 526,
container = document.getElementById( 'view360' );

init();
animate();

function init() {
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 100, container.offsetWidth / container.offsetHeight, zoomMin, zoomMax + 550 );

	var geometry = new THREE.SphereGeometry(500, 100, 100);
	geometry.scale( -1, 1, 1 );

	var texture = new THREE.TextureLoader().load( './assets/images/360s/test-image-ricoh-theta-s.jpg' );
	
	var material   = new THREE.MeshBasicMaterial( { map: texture } );

	var mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( container.offsetWidth, container.offsetHeight );
	container.appendChild( renderer.domElement );

	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mouseup', onDocumentMouseUp, false );
	document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );
	document.addEventListener( 'MozMousePixelScroll', onDocumentMouseWheel, false );
	window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
	camera.aspect = container.offsetWidth / container.offsetHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( container.offsetWidth, container.offsetHeight );
}

function onDocumentMouseDown( event ) {
	event.preventDefault();

	isUserInteracting = true;

	onPointerDownPointerX = event.clientX;
	onPointerDownPointerY = event.clientY;

	onPointerDownLon = lon;
	onPointerDownLat = lat;
}

function onDocumentMouseMove( event ) {
	if ( isUserInteracting === true ) {
		lon = ( onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
		lat = ( onPointerDownPointerY - event.clientY ) * 0.1 + onPointerDownLat;
	}
}

function onDocumentMouseUp( event ) {
	isUserInteracting = false;
}

function onDocumentMouseWheel( event ) {
	// WebKit
	if ( event.wheelDeltaY ) {
		distance -= event.wheelDeltaY * 0.05;
	// Opera / Explorer 9
	} else if ( event.wheelDelta ) {
		distance -= event.wheelDelta * 0.05;
	// Firefox
	} else if ( event.detail ) {
		distance += event.detail * 1.0;
	}

	// make it so you can't zoom in and out too far
	if (distance < zoomMin) {
		distance = zoomMin;
	} else if (distance > zoomMax) {
		distance = zoomMax;
	}
}

function animate() {
	requestAnimationFrame( animate );
	update();
}

function update() {
	lat = Math.max( -85, Math.min( 85, lat ) );
	phi = THREE.Math.degToRad( 90 - lat );
	theta = THREE.Math.degToRad( lon - 180 );

	camera.position.x = distance * Math.sin( phi ) * Math.cos( theta );
	camera.position.y = distance * Math.cos( phi );
	camera.position.z = distance * Math.sin( phi ) * Math.sin( theta );

	camera.lookAt( scene.position );
	renderer.render( scene, camera );
}