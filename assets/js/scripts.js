var thetaGallery = (function(){
	var camera, scene, renderer;
	var isUserInteracting = false,
	onMouseDownMouseX = 0, onMouseDownMouseY = 0,
	lon = -57.7, onMouseDownLon = 0,
	lat = 62.9, onMouseDownLat = 0,
	phi = 0, theta = 0,
	distance = 526,
	zoomMin = 1,
	zoomMax = 526,
	zoomSpeed = 0.25,
	galleryId = 'view360',
	viewer = $( '#' + galleryId ),
	viewerDomElement = viewer[0],
	defaultImage = './assets/images/360s/test-image-ricoh-theta-s.jpg';

	var init = function () {
		// initalise the scene and camera
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera( 100, viewerDomElement.offsetWidth / viewerDomElement.offsetHeight, zoomMin, zoomMax + 550 );

		var geometry = new THREE.SphereGeometry(500, 100, 100);
		geometry.scale( -1, 1, 1 );

		var texture = new THREE.TextureLoader().load( defaultImage );
		var material = new THREE.MeshBasicMaterial( { map: texture } );
		var mesh = new THREE.Mesh( geometry, material );
		scene.add( mesh );

		// render the 360 viewer
		renderer = new THREE.WebGLRenderer({
			preserveDrawingBuffer: true
		});
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( viewerDomElement.offsetWidth, viewerDomElement.offsetHeight );
		viewerDomElement.appendChild( renderer.domElement );

		// set up user interaction events
		viewer.on('mousedown', onMouseDown);
		viewer.on('mousemove', onMouseMove);
		viewer.on('mouseup', onMouseUp);
		viewer.on('mousewheel', onMouseWheel);
		$(window).on('resize', onWindowResize);
		
		animate();
	};

	var onWindowResize = function () {
		camera.aspect = viewerDomElement.offsetWidth / viewerDomElement.offsetHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( viewerDomElement.offsetWidth, viewerDomElement.offsetHeight );
	};

	var onMouseDown = function ( event ) {
		event.preventDefault();

		isUserInteracting = true;

		onPointerDownPointerX = event.clientX;
		onPointerDownPointerY = event.clientY;

		onPointerDownLon = lon;
		onPointerDownLat = lat;
	};

	var onMouseMove = function ( event ) {
		if ( isUserInteracting === true ) {
			lon = ( onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
			lat = ( onPointerDownPointerY - event.clientY ) * 0.1 + onPointerDownLat;
		}
	};

	var onMouseUp = function ( event ) {
		isUserInteracting = false;
	};

	var onMouseWheel = function ( event ) {
		distance -= event.deltaY * event.deltaFactor * zoomSpeed;

		// Limit zooming between max and min values
		if (distance < zoomMin) {
			distance = zoomMin;
		} else if (distance > zoomMax) {
			distance = zoomMax;
		}
	};

	var animate = function () {
		requestAnimationFrame( animate );
		update();
	};

	var update = function () {
		lat = Math.max( -85, Math.min( 85, lat ) );
		phi = THREE.Math.degToRad( 90 - lat );
		theta = THREE.Math.degToRad( lon - 180 );

		camera.position.x = distance * Math.sin( phi ) * Math.cos( theta );
		camera.position.y = distance * Math.cos( phi );
		camera.position.z = distance * Math.sin( phi ) * Math.sin( theta );

		camera.lookAt( scene.position );
		renderer.render( scene, camera );
	};

	var saveImage = function () {
		// pull image data from div
		// send ajax request to save image
	};

	return {
		init: init
	};
})();

$(function() {
	thetaGallery.init();
});