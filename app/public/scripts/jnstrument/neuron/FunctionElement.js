(function($, THREE, window, document, undefined) {	
	var config = require("../config.js");
	var mapEase = require("./mapEase.js");
	var FunctionElement = function(){
///////////////////////////////////////////////////////////////////////////////

		var outputColor = new THREE.Color(config.colors.outputColor);
		var inputColor = new THREE.Color(config.colors.inputColor);
		var color = new THREE.Color(config.colors.normalDots);
		var world;
		var outline =0;
///////////////////////////////////////////////////////////////////////////////

		this.id = null;
		this.group = null;
		this.active = false;
		this.radius = config.neuron.fE.minRadius;

		this.inboundElements = new (require("./ObjectStore"));
		this.outboundElements = new (require("./ObjectStore"));

		this.inboundCounts = {total:0};
		this.outboundCounts = {total:0};

		this.events = [];

		this.shaderAttributes = {
			lerpAlpha : config.neuron.fE.opacity,
			outline : 0,	
			radius : config.neuron.fE.minRadius,	
		};

		this.velocity = new THREE.Vector3(0,0,0);
		this.actionRadius = config.neuron.fE.minRadius+config.neuron.fE.elementMargin;
		this.speed = 1;

///////////////////////////////////////////////////////////////////////////////

		this.construct = function(_id, _position, _world){
			this.id=_id;
			world=_world;
			var randomAreaX = world.width/2;
			var randomAreaY = world.height/2;
			if(_position) this.position = _position.clone().add(new THREE.Vector3(Math.random(),Math.random(),0));
			else this.position.add(new THREE.Vector3(Math.random()*randomAreaX*2-randomAreaX,Math.random()*randomAreaY*2-randomAreaY,0));
		}
///////////////////////////////////////////////////////////////////////////////
		this.collision = function(object, hits, collisionDetection) {
			if(this.outboundElements.get(object) !== false || this.inboundElements.get(object) !== false) 
				var actionRadius = this.radius+object.radius+(config.neuron.fE.pairDistance+config.neuron.fE.elementPadding)*2;
			else
				var actionRadius = this.actionRadius+object.actionRadius;
			var force = this.position.clone().sub(object.position);
			var length = force.length();

			if(length > actionRadius) return;

			force.setLength(mapEase( length, 0, actionRadius, config.neuron.fE.maxPushForce, config.neuron.fE.minPushForce, "easeNot"));
			force.multiplyScalar(1-(0.3*(this.actionRadius/object.actionRadius+0.1))); // The larger the element the more force it has
			force.multiplyScalar(0.5);

			this.velocity.add(force);
		}
///////////////////////////////////////////////////////////////////////////////
		this.hitBounds = function(top, right, bottom, left){
			return;
			if(top) this.velocity.add((new THREE.Vector3(0,-1,0)).multiplyScalar(config.neuron.boundForce));
			if(right) this.velocity.add((new THREE.Vector3(-1,0,0)).multiplyScalar(config.neuron.boundForce));
			if(bottom) this.velocity.add((new THREE.Vector3(0,1,0)).multiplyScalar(config.neuron.boundForce));
			if(left) this.velocity.add((new THREE.Vector3(1,0,0)).multiplyScalar(config.neuron.boundForce));


			// if(top) this.position.y = world.height/2-this.actionRadius;
			// if(right) this.position.x = world.width/2-this.actionRadius;
			// if(bottom) this.position.y = -world.height/2+this.actionRadius;
			// if(left) this.position.x = -world.width/2+this.actionRadius;
		}
///////////////////////////////////////////////////////////////////////////////
		this.calculateOutboundConnections = function() {
			var storedElements = this.outboundElements.getAll();
			var elements = storedElements.objects;
			for(var i = 0; i<elements.length; i++) {
				var distanceVector = elements[i].position.clone().sub(this.position);
				var targetDistance = this.radius+elements[i].radius+config.neuron.fE.pairDistance;
				var target = distanceVector.clone().setLength(targetDistance);
				var force = target.clone().add(this.position).sub(elements[i].position);
				var length=force.length();

				//if(length < 5) return;

				//force.setLength(mapEase( length, 0, 200, config.neuron.fE.minPullForce,config.neuron.fE.maxPullForce,  "easeInQuad"));
				force.multiplyScalar(0.1);

				elements[i].position.add(force.clone().add(this.velocity.clone().multiplyScalar(0.01)));
				this.position.add(force.negate().add(elements[i].velocity.clone().multiplyScalar(0.01)));

			}
		}
///////////////////////////////////////////////////////////////////////////////
		this.updateEvents = function(now){
			for(var k=0; k < this.events.length; k++) {
				// Remove old events
				if(this.events[k] < now-config.neuron.msOnScreen) {
					this.events.splice(k, this.events.length-k);
					break;
				}
			}	
		}
///////////////////////////////////////////////////////////////////////////////
		this.updatePosition = function(){

			// Gravity
			// var gravity = this.position.clone().negate().multiplyScalar(0.01);
			// this.velocity.add(gravity);

			// Group Velocity
			// this.group.velocity.multiplyScalar(0.9);
			// this.velocity.add(this.group.velocity);


			if(world.activeElement === this.id) return;

			// Move towards Group center 
			var force = this.group.position.clone().sub(this.position);

			if(force.length() > this.group.actionRadius)
				this.velocity.add(force.multiplyScalar(0.1));
			else
				this.velocity.add(force.multiplyScalar(0.01));

			// Object Velocity
			this.velocity.multiplyScalar(0.8);

			if(this.velocity.length() > this.speed*config.neuron.fE.maxAcceleration) this.velocity.setLength(this.speed*config.neuron.fE.maxAcceleration);
			else if(this.velocity.length() < 1) this.velocity.set(0,0,0);
			
			this.position.add(this.velocity);

			this.speed= this.velocity.length();
			if(this.speed <=1) this.speed=1;


			// Make it 2D
			this.position.z = 0;

		}
///////////////////////////////////////////////////////////////////////////////
		this.updateRadius = function(radius){
			// Active Radius
			this.radius =	radius || mapEase(this.events.length, 0, 400, config.neuron.fE.minRadius, config.neuron.fE.maxRadius, "easeOutQuint");
			this.radius = Math.min(config.neuron.fE.maxRadius, this.radius);

			//Add color Circle
			var div= Math.abs(this.inboundCounts.total - this.outboundCounts.total);
			var sum = this.inboundCounts.total + this.outboundCounts.total;
			outline =  config.neuron.fE.outlineMaxWidth * (div/sum);

			this.radius += outline;


			this.shaderAttributes.lerpAlpha=config.neuron.fE.maxOpacity;
			this.shaderAttributes.outline= outline +(this.inboundCounts.total > this.outboundCounts.total ? 100:0);
			this.shaderAttributes.radius= this.radius;

				


			this.actionRadius=this.radius+config.neuron.fE.elementMargin+config.neuron.fE.elementPadding;
		}
///////////////////////////////////////////////////////////////////////////////
		this.update = function(now){
			this.updatePosition();
			this.updateEvents(now);


			//shrink radius
			this.radius*=0.9;
			this.actionRadius*=0.9;
			this.shaderAttributes.lerpAlpha*=0.9;
			this.shaderAttributes.lerpAlpha = Math.max(this.shaderAttributes.lerpAlpha, config.neuron.fE.opacity);

			if(this.radius<config.neuron.fE.minRadius+outline) this.radius = config.neuron.fE.minRadius+outline;
			
			this.actionRadius = this.radius+config.neuron.fE.elementMargin+config.neuron.fE.elementPadding;
	
			this.shaderAttributes.radius = this.radius;

			this.calculateOutboundConnections();

			if(world.activeElement === this.id) this.actionRadius = 200;



		}
///////////////////////////////////////////////////////////////////////////////
	}
///////////////////////////////////////////////////////////////////////////////
	module.exports = require("../Class.js").extend(require("./CollisionElement.js")).extend(FunctionElement);
})(jQuery, THREE, window, document)