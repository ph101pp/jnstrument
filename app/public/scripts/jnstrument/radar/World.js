(function($, THREE, window, document, undefined) {	
	var World = function(container){
/*/////////////////////////////////////////////////////////////////////////////
	Private Properties
/*/////////////////////////////////////////////////////////////////////////////
		var container;
/*/////////////////////////////////////////////////////////////////////////////
	Public Properties
/*/////////////////////////////////////////////////////////////////////////////
		this.renderer;
		this.camera;
		this.scene;
		this.activeScene;
		this.width;
		this.height;
/*/////////////////////////////////////////////////////////////////////////////
	Constructor
/*/////////////////////////////////////////////////////////////////////////////
		this.construct  = function(_container){
			container = $(_container);
			this.width = container.innerWidth();
			this.height = container.innerHeight();			
			this.renderer = new THREE.WebGLRenderer();
			this.renderer.setClearColor(new THREE.Color(29,29,38));
			this.renderer.setSize(this.width, this.height); 


			this.camera = new THREE.OrthographicCamera( this.width/-2, this.width/2, this.height/2, this.height/-2, 1, 10000 );
//			this.camera = new THREE.PerspectiveCamera( 60, width / height, 0.1, 10000 );
 			this.camera.position = new THREE.Vector3(0,0,1000); // move camera up
		//	this.camera.up.set(0, 0, -1); // Turn Camera
			this.camera.lookAt(new THREE.Vector3(0, 0, 0)); // face camera down
			this.camera.up= new THREE.Vector3(100, 120, 0); // Turn Camera

			this.scene = new THREE.Scene();
			this.activeScene = new THREE.Scene();


			container.append(this.renderer.domElement);
	

			//setupCameras();

			// $(window).resize(onWindowResize);

		//	this.drawCoodinateSystem(new THREE.Vector3(0,0,0));
		}
/*/////////////////////////////////////////////////////////////////////////////
	Private Methods
/*/////////////////////////////////////////////////////////////////////////////
			this.onWindowResize = (function () {
				this.width = container.innerWidth();
				this.height = container.innerHeight();

				this.camera.aspect = this.width / this.height;

				this.camera.left = this.width/-2;
				this.camera.right = this.width/2;
				this.camera.top = this.height/2;
				this.camera.bottom = this.height/-2;

				this.camera.updateProjectionMatrix();

				this.renderer.setSize( this.width, this.height );

			}).bind(this);		
/*/////////////////////////////////////////////////////////////////////////////
	Public Methods
/*/////////////////////////////////////////////////////////////////////////////
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
		// this.render = (function() {
		// 	this.renderer.render(this.scene, this.camera);
		// });
	}
///////////////////////////////////////////////////////////////////////////////	
	module.exports = require("../Class.js").extend(World);
})(jQuery, THREE, window, document)