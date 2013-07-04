(function($, THREE, window, document, undefined) {	
	var CollisionElement = function(){
		this.actionRadius=0;
		this.position = this.position || new THREE.Vector3(0,0,0);

		this.construct = function(){
			//this.rotation.x = 90 * (Math.PI/180); // Turn spheres to avoid hitting the north or south pole.
		}
///////////////////////////////////////////////////////////////////////////////
		this.collision = Function; // (object, hits, collisionDetection)
		this.hitBounds = function(){};
		this.preCollisionDetection = function(){};
		this.postCollisionDetection = function(){};
	}
///////////////////////////////////////////////////////////////////////////////
	module.exports = require("../Class.js").extend.abstract(CollisionElement);
})(jQuery, THREE, window, document)