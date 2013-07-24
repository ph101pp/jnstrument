(function($, THREE, window, document, undefined) {
	var MeshObject = function(){


///////////////////////////////////////////////////////////////////////////////
		this.collision = function(object, hits, collisionDetection) {
			var that = this.parent;
			var object = object.parent;

						console.log("collision");


			if(that.outboundElements.get(object) !== false || that.inboundElements.get(object) !== false) return;


			var force = that.position.clone().sub(object.position);
			var length=force.length();
			var maxSpeed = 10;
			var minSpeed = 2;
			force.setLength(THREE.Math.clamp(THREE.Math.mapLinear(length, 0, this.actionRadius, maxSpeed, minSpeed),minSpeed,maxSpeed));
			that.velocity.add(force);
		}
///////////////////////////////////////////////////////////////////////////////
		this.preCollisionDetection = function(){
			this.material.side = THREE.DoubleSide;
		};
///////////////////////////////////////////////////////////////////////////////
		this.postCollisionDetection = function(){
			this.material.side = THREE.FrontSide;
		};
	}
///////////////////////////////////////////////////////////////////////////////
	module.exports = require("../Class.js").extend(THREE.Mesh).extend(require("./CollisionElement.js")).extend(MeshObject);

})(jQuery, THREE, window, document)