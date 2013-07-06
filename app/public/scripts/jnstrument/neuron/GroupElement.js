(function($, THREE, window, document, undefined) {	
	var config = require("../config.js");
	var mapEase = require("./mapEase.js");
	var GroupElement = function(){
///////////////////////////////////////////////////////////////////////////////
		this.id = null;
		this.elements = new (require("./ObjectStore"));

		this.velocity = new THREE.Vector3(0,0,0);
		this.actionRadius = 6;

		this.boundingBox = {
			min : new THREE.Vector3(999999,99999,99999),
			max : new THREE.Vector3(0,0,0)
		};
///////////////////////////////////////////////////////////////////////////////
			var maxSpeed = 20;
			var minSpeed = 0;
			var world;
///////////////////////////////////////////////////////////////////////////////

		this.construct = function(_id, _position, _world){
			this.id=_id;
			world=_world;
			var randomAreaX = 200; //world.width/2;
			var randomAreaY = 200; //world.height/2;
			if(_position) this.position = _position.clone().add(new THREE.Vector3(Math.random(),Math.random(),0));
			else this.position.add(new THREE.Vector3(Math.random()*randomAreaX*2-randomAreaX,Math.random()*randomAreaY*2-randomAreaY,0));
		}
///////////////////////////////////////////////////////////////////////////////
		this.collision = function(object, hits, collisionDetection) {
			var actionRadius = this.actionRadius+object.actionRadius;
			var force = this.position.clone().sub(object.position);
			var length = force.length();

			if(length > actionRadius) return;

			force.setLength(mapEase( length, 0, actionRadius, config.neuron.gE.maxPushForce, config.neuron.gE.minPushForce, "easeInQuad"));

			force.multiplyScalar(0.5*(object.actionRadius/this.actionRadius+0.1));

			//force.multiplyScalar(0.5);

			this.velocity.add(force);
		}
///////////////////////////////////////////////////////////////////////////////
		this.hitBounds = function(top, right, bottom, left){
			return
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
		this.updatePosition = function(){
			// Gravity
			var gravity = this.position.clone().negate().multiplyScalar(this.actionRadius/1000);
			this.velocity.add(gravity);

			this.velocity.multiplyScalar(0.6);
			this.position.add(this.velocity);
		}
///////////////////////////////////////////////////////////////////////////////
		this.calculateBoundingbox =function(){
			this.boundingBox.max.set(-999999,-99999,-99999);
			this.boundingBox.min.set(999999,99999,99999);
			var elements = this.elements.getAllObjects();

			for(var k=0; k<elements.length; k++) {
				this.boundingBox.max.x = Math.max(this.boundingBox.max.x, elements[k].position.x);
				this.boundingBox.max.y = Math.max(this.boundingBox.max.y, elements[k].position.y);
				this.boundingBox.max.z = Math.max(this.boundingBox.max.z, elements[k].position.z);

				this.boundingBox.min.x = Math.min(this.boundingBox.min.x, elements[k].position.x);
				this.boundingBox.min.y = Math.min(this.boundingBox.min.y, elements[k].position.y);
				this.boundingBox.min.z = Math.min(this.boundingBox.min.z, elements[k].position.z);
			}
		}
///////////////////////////////////////////////////////////////////////////////
		this.updateActionRadius = function(){
			this.calculateBoundingbox();
			var elements = this.elements.getAllObjects();
			var radius=0;
			for(var k=0; k<elements.length; k++) {
				radius= Math.max(elements[k].position.clone().sub(this.position).length(), radius);
			}
			this.actionRadius=Math.min(radius, this.boundingBox.max.clone().sub( this.boundingBox.min ).multiplyScalar(0.5).length())+20;
		}
///////////////////////////////////////////////////////////////////////////////
		this.calculatePosition = function(){
			this.updateActionRadius();
			this.position = this.boundingBox.min.clone().add( this.boundingBox.max.clone().sub( this.boundingBox.min ).multiplyScalar(0.5) );
		}
///////////////////////////////////////////////////////////////////////////////
		this.merge = function(group2){
			var groupElements = group2.elements.getAll();

			for(var i=0; i<groupElements.objects.length; i++) {
				groupElements.objects[i].group=this;
				this.elements.store(groupElements.objects[i], groupElements.data[i]);
			}
			return this;
		}
///////////////////////////////////////////////////////////////////////////////
	}
///////////////////////////////////////////////////////////////////////////////
	module.exports = require("../Class.js").extend(require("./CollisionElement.js")).extend(GroupElement);
})(jQuery, THREE, window, document)