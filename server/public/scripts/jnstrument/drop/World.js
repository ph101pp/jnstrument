(function($, THREE, window, document, undefined) {	
	var World = function(container){
/*/////////////////////////////////////////////////////////////////////////////
	Private Properties
/*/////////////////////////////////////////////////////////////////////////////
		var container;
		var renderer;
		var camera;
/*/////////////////////////////////////////////////////////////////////////////
	Public Properties
/*/////////////////////////////////////////////////////////////////////////////
		this.scene;
		this.width;
		this.height;
/*/////////////////////////////////////////////////////////////////////////////
	Constructor
/*/////////////////////////////////////////////////////////////////////////////
		this.construct  = function(_container){
			container = $(_container);
			this.width = container.innerWidth();
			this.height = container.innerHeight();			
			renderer = new THREE.WebGLRenderer();
			renderer.setClearColor(0x333333);
			renderer.setSize(this.width, this.height); 

			camera = new THREE.OrthographicCamera( this.width/-2, this.width/2, this.height/2, this.height/-2, 1, 10000 );
//			camera = new THREE.PerspectiveCamera( 60, width / height, 0.1, 10000 );
 			camera.position = new THREE.Vector3(0,0,10); // move camera up
		//	this.camera.up.set(0, 0, -1); // Turn Camera
			camera.lookAt(new THREE.Vector3(0, 0, 0)); // face camera down

			this.scene = new THREE.Scene();
			this.scene.add(camera);
			camera.up= new THREE.Vector3(100, 120, 0); // Turn Camera


			container.append(renderer.domElement);


			//setupCameras();

		//	this.drawCoodinateSystem(new THREE.Vector3(0,0,0));
		}
/*/////////////////////////////////////////////////////////////////////////////
	Private Methods
/*/////////////////////////////////////////////////////////////////////////////
/*/////////////////////////////////////////////////////////////////////////////
	Public Methods
/*/////////////////////////////////////////////////////////////////////////////
		this.onWindowResize = function () {
			this.width = container.innerWidth();
			this.height = container.innerHeight();

			camera.aspect = this.width / this.height;

			camera.left = this.width/-2;
			camera.right = this.width/2;
			camera.top = this.height/2;
			camera.bottom = this.height/-2;

			camera.updateProjectionMatrix();

			renderer.setSize( this.width, this.height );

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
			renderer.render(this.scene, camera);
		});
	}
///////////////////////////////////////////////////////////////////////////////	
	module.exports = require("../Class.js").extend(World);
})(jQuery, THREE, window, document)