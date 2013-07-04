(function($, THREE, window, document, undefined) {	
	var config = require("../config.js");
	var mapEase = require("./mapEase.js");
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
		this.actionRadius = config.neuron.fE.actionRadius;

///////////////////////////////////////////////////////////////////////////////
		var speed = 1;

///////////////////////////////////////////////////////////////////////////////

		this.construct = function(_id){
			this.id=_id;
			var randomArea = 100;
			this.position.add(new THREE.Vector3(Math.random()*randomArea*2-randomArea,Math.random()*randomArea*2-randomArea,0));
		}
///////////////////////////////////////////////////////////////////////////////
		this.collision = function(object, hits, collisionDetection) {
			if(this.outboundElements.get(object) !== false || this.inboundElements.get(object) !== false) return;

			var actionRadius = this.actionRadius+object.actionRadius;
			var force = this.position.clone().sub(object.position);
			var length = force.length();

			if(length > actionRadius) return;

			force.setLength(mapEase( length, 0, actionRadius, config.neuron.fE.maxPushForce, config.neuron.fE.minPushForce, "easeNot"));

			force.multiplyScalar(0.5);

			this.velocity.add(force);
		}
///////////////////////////////////////////////////////////////////////////////
		this.calculateOutboundConnections = function() {
			var storedElements = this.outboundElements.getAll();
			var elements = storedElements.objects;
			for(var i = 0; i<elements.length; i++) {
				var distanceVector = elements[i].position.clone().sub(this.position);
				var targetDistance = config.neuron.fE.pairDistance;
				var target = distanceVector.clone().setLength(targetDistance);
				var force = target.clone().add(this.position).sub(elements[i].position);
				var length=force.length();

				if(length < 5) return;

				force.setLength(mapEase( length, 0, 200, config.neuron.fE.minPullForce,config.neuron.fE.maxPullForce,  "easeInQuad"));


				elements[i].velocity.add(force.clone());
				this.velocity.add(force.negate());

			}
		}
///////////////////////////////////////////////////////////////////////////////
		this.updatePosition = function(){
			this.calculateOutboundConnections();
			// Gravity
			// var gravity = this.position.clone().negate().multiplyScalar(0.01);
			// this.velocity.add(gravity);

			// Group Velocity
			// this.group.velocity.multiplyScalar(0.9);
			// this.velocity.add(this.group.velocity);

			// Move towards Group center 
			var force = this.group.position.clone().sub(this.position);

			if(force.length() > this.group.actionRadius-config.neuron.fE.actionRadius)
				this.velocity.add(force.multiplyScalar(0.4));

			// Object Velocity
			this.velocity.multiplyScalar(0.5);

			if(this.velocity.length() > speed*config.neuron.fE.maxAcceleration) this.velocity.setLength(speed*config.neuron.fE.maxAcceleration);
			else if(this.velocity.length() < 1) this.velocity.set(0,0,0);
			
			this.position.add(this.velocity);

			speed= this.velocity.length();
			if(speed <=1) speed=1;


			// Make it 2D
			this.position.z = 0;
		}
///////////////////////////////////////////////////////////////////////////////
	}
///////////////////////////////////////////////////////////////////////////////
	module.exports = require("../Class.js").extend(require("./CollisionElement.js")).extend(FunctionElement);
})(jQuery, THREE, window, document)