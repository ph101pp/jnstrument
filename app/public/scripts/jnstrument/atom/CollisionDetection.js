(function($, THREE, window, document, undefined) {	
	var CollisionDetection = function(){
		var caster;
		var rays = [];
		var elements = [];

		this.construct = function(_socket, _loop){		
			caster = new THREE.Raycaster();
		}

		this.testElement = function(element){
			for(var i=0; i<rays.length; i++) {
				caster.set(element.position, rays[i]);
				var hits = caster.intersectObjects(elements);
				for(var k=0; k<hits.length; k++)
					if(hits[k].distance < element.actionRadius)
						element.collision(hits[k]);
			}
		}


		this.addRay = function(ray) {
			if(!(ray instanceof THREE.Vector3)) throw("Only instances of THREE.Vector3 can be rays.");
			rays.add(ray);
		}
		this.removeRay = function(ray){
			delete rays[rays.indexOf(ray)];
		}
		this.addCollisionElement = function(element){
			if(!element.instanceof(require("./CollisionElement.js"))) throw("Only instances of CollisionElement can be added to CollisionDetection.");
			elements.add(element);
		}
		this.removeCollisionElement = function(element){
			delete elements[elements.indexOf(element)];
		}	
	}
///////////////////////////////////////////////////////////////////////////////
	module.exports = require("../Class.js")(CollisionDetection);
})(jQuery, THREE, window, document)