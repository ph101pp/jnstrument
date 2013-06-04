(function($, THREE, window, document, undefined) {	
	var CollisionElement = function(){
		this.actionRadius=10;

		this.construct = function(){
			this.rotation.x = 90 * (Math.PI/180); // Turn spheres to avoid hitting the north or south pole.
		}
///////////////////////////////////////////////////////////////////////////////
		this.collision = Function; // (object, hits, collisionDetection)
	}
///////////////////////////////////////////////////////////////////////////////
	module.exports = require("../Class.js").extend.abstract(CollisionElement);
})(jQuery, THREE, window, document)