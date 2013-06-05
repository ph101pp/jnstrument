(function($, THREE, window, document, undefined) {


	var FunctionElement = function(){

///////////////////////////////////////////////////////////////////////////////
		var world;

		var inboundColor = new THREE.Color("#FF3333");
		var inboundHighlightColor = new THREE.Color("#FFAAAA");
		var outboundColor =  new THREE.Color("#3333FF");
		var outboundHighlightColor = new THREE.Color("#AAAAFF");

		var lerpAlpha = 0;

///////////////////////////////////////////////////////////////////////////////
		this.inbound;
		this.outbound;
		this.boundingSphere;

		this.inboundElements = new (require("./ObjectStore"));
		this.outboundElements = new (require("./ObjectStore"));

		this.inboundCount = 0;
		this.outboundCount = 0;

		this.velocity = new THREE.Vector3(0,0,0);

///////////////////////////////////////////////////////////////////////////////
		var updateRadiuses = function(){
			var add = new THREE.Vector3(10,10,10);
			this.inbound.scale.set(this.inboundCount,this.inboundCount,this.inboundCount).add(add);
			this.outbound.scale.set(this.outboundCount,this.outboundCount,this.outboundCount).add(add);
			
			var boundingRadius =Math.max(this.inboundCount, this.outboundCount)+add.x+20;
			this.boundingSphere.scale.set(boundingRadius, boundingRadius, boundingRadius);
			this.actionRadius =boundingRadius;


		}.bind(this)
///////////////////////////////////////////////////////////////////////////////
		var updateColors = function(){
			if(lerpAlpha > 0.01) lerpAlpha*=0.8;
			else lerpAlpha = 0;
			this.inbound.material.color = inboundColor.clone().lerp(inboundHighlightColor, lerpAlpha);
			this.outbound.material.color = outboundColor.clone().lerp(outboundHighlightColor, lerpAlpha);
		}.bind(this)
///////////////////////////////////////////////////////////////////////////////
		var updateOutBoundConnections = function() {
			var elements = this.outboundElements.getObjects();
			for(var i = 0; i<elements.length; i++) {

				var distanceVector = elements[i].object.position.clone().sub(this.position);

				var target = distanceVector.clone().setLength(this.actionRadius+elements[i].object.actionRadius+5);
				var force = target.clone().add(this.position).sub(elements[i].object.position);
				var length=force.length();
				var maxSpeed = 10;
				var minSpeed = 0;
				force.setLength(THREE.Math.clamp(THREE.Math.mapLinear(length, 0, this.actionRadius, minSpeed, maxSpeed),minSpeed,maxSpeed));
				elements[i].object.velocity.add(force);



				elements[i].data.connection.geometry.vertices[1] = distanceVector;
				elements[i].data.connection.geometry.verticesNeedUpdate = true;
			}
		}.bind(this)
///////////////////////////////////////////////////////////////////////////////
		this.construct = function(){
			var materialOptions = {
				transparent : true,
				opacity : 0.7
			}
			var geometry = new THREE.SphereGeometry( 1, 32, 32 );

			var inboundMaterial =  new THREE.MeshBasicMaterial($.extend({}, materialOptions, {color: inboundColor, side:THREE.FrontSide}));
			this.inbound = new THREE.Mesh(geometry, inboundMaterial);
			this.inbound.rotation.x=90 * (Math.PI/180); 

			var outboundMaterial =  new THREE.MeshBasicMaterial($.extend({}, materialOptions, {color: outboundColor, side:THREE.BackSide}));
			this.outbound = new THREE.Mesh(geometry, outboundMaterial);
			this.outbound.rotation.x=90 * (Math.PI/180); 

			var boundingMaterial =  new THREE.MeshBasicMaterial({visible:false, side:THREE.DoubleSide});
			this.boundingSphere = new THREE.Mesh(geometry, boundingMaterial);
			this.boundingSphere.rotation.x=90 * (Math.PI/180); 

			this.actionRadius=1;
			updateRadiuses();

			this.add(this.outbound);
			this.add(this.inbound);
			this.add(this.boundingSphere);
		}
///////////////////////////////////////////////////////////////////////////////
		this.worldReference= function(_world){
			world = _world;
		}
///////////////////////////////////////////////////////////////////////////////
		this.collision = function(object, hits, collisionDetection) {
			if(this.outboundElements.get(object) !== false || this.inboundElements.get(object) !== false) return;
			var force = this.position.clone().sub(object.position);
			var length = force.length();
			var maxSpeed = 10;
			var minSpeed = 1;
			force.setLength(THREE.Math.clamp(THREE.Math.mapLinear(length, 0, this.actionRadius, maxSpeed, minSpeed),minSpeed,maxSpeed));
			this.velocity.add(force);
		}

///////////////////////////////////////////////////////////////////////////////
		this.update = function(){
			updateOutBoundConnections();
			updateColors();

			this.velocity.multiplyScalar(0.5);
			this.position.add(this.velocity);




		}.bind(this);
///////////////////////////////////////////////////////////////////////////////
		this.inboundEvent = function(FunctionElement){
			this.inboundCount++;
			var element = this.inboundElements.store(FunctionElement);
			element.data.count = element.data.count+1 || 1;
			this.inboundElements.store(element);
			updateRadiuses();
			lerpAlpha = 1;
		}
///////////////////////////////////////////////////////////////////////////////
		this.outboundEvent = function(FunctionElement){
			this.outboundCount++;
			var element = this.outboundElements.store(FunctionElement);
			element.data.count = element.data.count+1 || 1;
			if(typeof element.data.connection !== "object"){
				var material = new THREE.LineBasicMaterial({
					color: 0x0000ff
				});
				var geometry = new THREE.Geometry();
				geometry.vertices.push(new THREE.Vector3(0,0,0));
				geometry.vertices.push(element.object.position.clone().sub(this.position));
				element.data.connection = new THREE.Line(geometry, material);
				this.add(element.data.connection);
			}
			this.outboundElements.store(element);
			updateRadiuses();
		}
	}
///////////////////////////////////////////////////////////////////////////////
	module.exports = require("../Class.js").extend(THREE.Object3D).extend(require("./CollisionElement.js")).extend(FunctionElement);
})(jQuery, THREE, window, document)