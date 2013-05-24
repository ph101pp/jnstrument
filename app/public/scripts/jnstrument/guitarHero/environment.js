(function($, THREE, window, document, undefined) {	
	var Environment = function(container){
		container = $(container);
		var renderLoop;
		var renderer;
		var renderers = {};
		var width = container.innerWidth();
		var height = container.innerHeight();

		var scene = this.scene = new THREE.Scene();

		var camera = this.camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000);
		camera.position.z = 300;
		scene.add(camera);

		this.renderer = renderer = new THREE.WebGLRenderer();
		renderer.setSize(width, height); 
		container.append(renderer.domElement);
/*//////////////////////////////////////////////////////////////////////////////
	Private Methods
/*//////////////////////////////////////////////////////////////////////////////
		var render = function() {
			renderLoop = requestAnimationFrame(render);
			for(method in renderers) 
				renderers[method]();
			renderer.render(scene, camera);
		}
/*//////////////////////////////////////////////////////////////////////////////
	Public Methods
/*//////////////////////////////////////////////////////////////////////////////
		this.start = function() {
			render();
		}		
///////////////////////////////////////////////////////////////////////////////
		this.stop = function() {
			cancelAnimationFrame(renderLoop);	
		}
///////////////////////////////////////////////////////////////////////////////
		this.addRenderer = function(name,renderer) {
			renderers[name]=renderer;
		}
///////////////////////////////////////////////////////////////////////////////
		this.removeRenderer = function(name) {
			delete renderers[name];
		}
	}
	module.exports = function(container){
		return new Environment(container);
	}	
})(jQuery, THREE, window, document)