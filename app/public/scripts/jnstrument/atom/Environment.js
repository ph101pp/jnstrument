(function($, THREE, window, document, undefined) {	
	var Environment = function(container){
/*/////////////////////////////////////////////////////////////////////////////
	Private Properties
/*/////////////////////////////////////////////////////////////////////////////
		var views = [
			{ 
				left: 0,
				bottom: 0.5,
				width: 1,
				height: 0.5,
				background: new THREE.Color().setRGB( 0.9, 0.9, 0.9 ),
		
				// cameraView : {
				// 	left : 0
				// 	right : 1
				// 	top : 0
				// 	bottom : 0.5
				// }
				eye: [ 0, 0, 1000 ],
				up: [ 0, 1, 0 ],
				fov: 90
			},
			{ 
				left: 0,
				bottom: 0,
				width: 1,
				height: 0.5,
				background: new THREE.Color().setRGB( 0.8, 0.8, 0.8 ),

				// cameraView : {
				// 	left : 0
				// 	right : 1
				// 	top : 0.5
				// 	bottom : 1
				// }
				eye: [ 0, 0, 1000 ],
				up: [ 0, 1, 0 ],
				fov: 45
			}
		]
/*/////////////////////////////////////////////////////////////////////////////
	Public Properties
/*/////////////////////////////////////////////////////////////////////////////
		this.renderer;
		this.scene;
		this.camera;
		this.height;
		this.width;
/*/////////////////////////////////////////////////////////////////////////////
	Private Methods
/*/////////////////////////////////////////////////////////////////////////////
		var setupCameras = function(){
			for (var ii =  0; ii < views.length; ++ii ) {
				var view = views[ii];
				camera = new THREE.PerspectiveCamera( view.fov, window.innerWidth / window.innerHeight, 1, 10000 );
				camera.position.x = view.eye[ 0 ];
				camera.position.y = view.eye[ 1 ];
				camera.position.z = view.eye[ 2 ];
				camera.up.x = view.up[ 0 ];
				camera.up.y = view.up[ 1 ];
				camera.up.z = view.up[ 2 ];
				view.camera = camera;
				camera.lookAt(new THREE.Vector3(this.width, this.height, 0));
			}
		}
///////////////////////////////////////////////////////////////////////////////
		var renderViews = function(){
			for ( var ii = 0; ii < views.length; ++ii ) {

				view = views[ii];
				camera = view.camera;

				var left   = Math.floor( this.width  * view.left );
				var bottom = Math.floor( this.height * view.bottom );
				var width  = Math.floor( this.width  * view.width );
				var height = Math.floor( this.height * view.height );
				this.renderer.setViewport( left, bottom, width, height );
				this.renderer.setScissor( left, bottom, width, height );
				this.renderer.enableScissorTest ( true );
				this.renderer.setClearColor( view.background );

				camera.aspect = width / height;
				camera.updateProjectionMatrix();

				this.renderer.render( this.scene, camera );
			}			
		}
///////////////////////////////////////////////////////////////////////////////
		
/*/////////////////////////////////////////////////////////////////////////////
	Public Methods
/*/////////////////////////////////////////////////////////////////////////////
		this.construct  = function(_container){
			var container = $(_container);
			this.width = container.innerWidth();
			this.height = container.innerHeight();			
			this.renderer = new THREE.WebGLRenderer();
			this.renderer.setSize(this.width, this.height); 

			this.camera = new THREE.OrthographicCamera( this.width/-2, this.width/2, this.height/2, this.height/-2, 1, 10000 );
			this.camera.position = new THREE.Vector3(0,0,300); // move camera up
		//	this.camera.up.set(0, 0, -1); // Turn Camera
			this.camera.lookAt(new THREE.Vector3(0, 0, 0)); // face camera down

			this.scene = new THREE.Scene();
			this.scene.add(this.camera);
			this.camera.up= new THREE.Vector3(100, 120, 0); // Turn Camera


			container.append(this.renderer.domElement);


			//setupCameras();



			this.drawCoodinateSystem(new THREE.Vector3(0,0,0));
		}
///////////////////////////////////////////////////////////////////////////////
		this.drawCoodinateSystem = function(position){
			var geometryX = new THREE.Geometry();
			geometryX.vertices.push(new THREE.Vector3(0, 0, 0));
			geometryX.vertices.push(new THREE.Vector3(100, 0, 0));

			var geometryY = new THREE.Geometry();
			geometryY.vertices.push(new THREE.Vector3(0, 0, 0));
			geometryY.vertices.push(new THREE.Vector3(0, 100, 0));

			var geometryZ = new THREE.Geometry();
			geometryZ.vertices.push(new THREE.Vector3(0, 0, 0));
			geometryZ.vertices.push(new THREE.Vector3(0, 0, 100));

			var materialX = new THREE.LineBasicMaterial({
				color: 0xFF0000
			});
			var materialY = new THREE.LineBasicMaterial({
				color: 0x00FF00
			});
			var materialZ = new THREE.LineBasicMaterial({
				color: 0x0000FF
			});

			var x = new THREE.Line(geometryX, materialX);
			var y = new THREE.Line(geometryY, materialY);
			var z = new THREE.Line(geometryZ, materialZ);

			x.position=position;
			y.position=position;
			z.position=position;

			this.scene.add(x)
			this.scene.add(y)
			this.scene.add(z)


		}

///////////////////////////////////////////////////////////////////////////////	
		this.render = (function() {
			// renderViews();
			this.renderer.render(this.scene, this.camera);
		}).bind(this);
	}
///////////////////////////////////////////////////////////////////////////////	
	module.exports = require("../Class.js").extend(Environment);
})(jQuery, THREE, window, document)