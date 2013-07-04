(function($, THREE, window, document, undefined) {	
	var FunctionElement = function(){
///////////////////////////////////////////////////////////////////////////////
		this.id = null;
		this.group = null;
		this.active = false;

		this.inboundElements = new (require("./ObjectStore"));
		this.outboundElements = new (require("./ObjectStore"));

		this.inboundCounts = {total:0};
		this.outboundCounts = {total:0};

		this.events = [];

		this.shaderAttributes = {
			lerpAlpha : { type:"f", value:0.5 },
			radius : { type:"f", value:1 },			
			outbound : { type:"f", value:0 },
			inbound : { type:"f", value:0 }
		};

		this.velocity = new THREE.Vector3(0,0,0);
		this.actionRadius = 20;

///////////////////////////////////////////////////////////////////////////////
		this.construct = function(_id){
			this.id=_id;
			var randomArea = 100;
			this.position.add(new THREE.Vector3(Math.random()*randomArea*2-randomArea,Math.random()*randomArea*2-randomArea,0));
		}
///////////////////////////////////////////////////////////////////////////////
		this.collision = function(object, hits, collisionDetection) {
			//if(this.outboundElements.get(object) !== false || this.inboundElements.get(object) !== false) return;

			var force = this.position.clone().sub(object.position);
			var length = force.length();
			var maxSpeed = 20;
			var minSpeed = 0;
			force.setLength(THREE.Math.clamp(THREE.Math.mapLinear(length, 0, this.actionRadius, maxSpeed, minSpeed),minSpeed,maxSpeed));
			this.velocity.add(force);
		}

///////////////////////////////////////////////////////////////////////////////
		this.updatePosition = function(){
			// Gravity
			// var gravity = this.position.clone().negate().multiplyScalar(0.01);
			// this.velocity.add(gravity);

			// Group Velocity
			// this.group.velocity.multiplyScalar(0.9);
			// this.velocity.add(this.group.velocity);

			// Move towards Group center 
			var force = this.group.position.clone().sub(this.position);

			if(force.length() > this.group.actionRadius)
				this.velocity.add(force.multiplyScalar(0.1));

			// Object Velocity
			this.velocity.multiplyScalar(0.1);
			this.position.add(this.velocity);


			// Make it 2D
			this.position.z = 0;
		}
///////////////////////////////////////////////////////////////////////////////
	}
///////////////////////////////////////////////////////////////////////////////
	module.exports = require("../Class.js").extend(require("./CollisionElement.js")).extend(FunctionElement);
})(jQuery, THREE, window, document)