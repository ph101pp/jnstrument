(function($, THREE, window, document, undefined) {	
	var config = require("../config.js");
	var MouseElement = function(){
		this.element;
		this.actionRadius=20;
///////////////////////////////////////////////////////////////////////////////
		var world;
		var collided = false;
///////////////////////////////////////////////////////////////////////////////	
		this.construct = function(_world){
			world = _world;
			var material = new THREE.MeshBasicMaterial({color:0x00ff00, transparent:true, opacity:0.3});
			var geometry = new THREE.CircleGeometry(this.actionRadius,8);
			this.element = new THREE.Mesh(geometry,material);
			world.scene.add(this.element);


			$(document).mousemove(function(event) {
				var y = event.pageY > world.height/2 ? 
					-(event.pageY-world.height/2):
					world.height/2-event.pageY;
	    	    this.element.position.set(event.pageX-world.width/2, y,0);
	    	    this.position = this.element.position;
	    	}.bind(this));
		}
///////////////////////////////////////////////////////////////////////////////
		this.collision = function(object, hits, collisionDetection) {
			collided = true;
		}
///////////////////////////////////////////////////////////////////////////////
		this.update = function(){

			if(collided) this.element.material.color= new THREE.Color(0xff0000);
			else this.element.material.color=new THREE.Color(0x00ff00);

			this.element.material.colorNeedsUpdate=true;

			collided=false;

		}
///////////////////////////////////////////////////////////////////////////////
	}
///////////////////////////////////////////////////////////////////////////////
	module.exports = require("../Class.js").extend(require("./CollisionElement.js")).extend(MouseElement);
})(jQuery, THREE, window, document)