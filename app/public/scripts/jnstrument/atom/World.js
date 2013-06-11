(function($, THREE, window, document, undefined) {	
	var World = function(container){
/*/////////////////////////////////////////////////////////////////////////////
	Private Properties
/*/////////////////////////////////////////////////////////////////////////////
		var container;
		var renderer;
		var camera;
		var height;
		var width;

/*/////////////////////////////////////////////////////////////////////////////
	Public Properties
/*/////////////////////////////////////////////////////////////////////////////
		this.scene;
/*/////////////////////////////////////////////////////////////////////////////
	Constructor
/*/////////////////////////////////////////////////////////////////////////////
		this.construct  = function(_container){
			container = $(_container);
			width = container.innerWidth();
			height = container.innerHeight();			
			renderer = new THREE.WebGLRenderer();
			renderer.setSize(width, height); 


			camera = new THREE.OrthographicCamera( width/-2, width/2, height/2, height/-2, 1, 10000 );
//			camera = new THREE.PerspectiveCamera( 60, width / height, 0.1, 10000 );
 			camera.position = new THREE.Vector3(0,0,1000); // move camera up
		//	this.camera.up.set(0, 0, -1); // Turn Camera
			camera.lookAt(new THREE.Vector3(0, 0, 0)); // face camera down

			this.scene = new THREE.Scene();
			this.scene.add(camera);
			camera.up= new THREE.Vector3(100, 120, 0); // Turn Camera


			container.append(renderer.domElement);


			//setupCameras();

			$(window).resize(onWindowResize);

			this.drawCoodinateSystem(new THREE.Vector3(0,0,0));
		}
/*/////////////////////////////////////////////////////////////////////////////
	Private Methods
/*/////////////////////////////////////////////////////////////////////////////
			var onWindowResize = function () {
				console.log("hallo");
				width = container.innerWidth();
				height = container.innerHeight();

				camera.aspect = width / height;

				camera.left = width/-2;
				camera.right = width/2;
				camera.top = height/2;
				camera.bottom = height/-2;

				camera.updateProjectionMatrix();

				renderer.setSize( width, height );

			}		
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
		this.render = (function() {
			renderer.render(this.scene, camera);
		});
	}
///////////////////////////////////////////////////////////////////////////////	
	module.exports = require("../Class.js").extend(World);
})(jQuery, THREE, window, document)