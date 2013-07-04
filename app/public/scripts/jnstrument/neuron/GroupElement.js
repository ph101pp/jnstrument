(function($, THREE, window, document, undefined) {	
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

			force.setLength(THREE.Math.clamp(THREE.Math.mapLinear(length, 0, this.actionRadius+object.actionRadius, maxSpeed, minSpeed),minSpeed,maxSpeed));
			this.velocity.add(force);
		}

///////////////////////////////////////////////////////////////////////////////
		this.updatePosition = function(){
			// Gravity
			var gravity = this.position.clone().negate().multiplyScalar(0.001);
			gravity.setLength(THREE.Math.clamp(gravity.length(), minSpeed, maxSpeed));
			this.velocity.add(gravity);

			this.velocity.multiplyScalar(0.5);
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
		this.upateActionRadius = function(){
			this.calculateBoundingbox();
			this.actionRadius = this.boundingBox.max.clone().sub( this.boundingBox.min ).multiplyScalar(0.5).length()+20;
		}
///////////////////////////////////////////////////////////////////////////////
		this.calculatePosition = function(){
			this.updateActionRadius();
			this.position = this.boundingBox.min.clone().add( this.boundingBox.max.clone().sub( this.boundingBox.min ).multiplyScalar(0.5) );
		}
///////////////////////////////////////////////////////////////////////////////
		this.merge = function(group2){
			group2= elementGroups.get(group2);
			groupElements = group2.object.elements.getAll();

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