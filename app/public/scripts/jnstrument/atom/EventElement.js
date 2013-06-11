(function($, THREE, window, document, undefined) {

	var MeshObject = require("../Class.js").extend(THREE.Mesh).extend(require("./CollisionElement.js"));

	var FunctionElement = function(){

///////////////////////////////////////////////////////////////////////////////
		var world;

		var inboundColor = new THREE.Color("#FF3333");
		var inboundHighlightColor = new THREE.Color("#FFAAAA");
		var outboundColor =  new THREE.Color("#3333FF");
		var outboundHighlightColor = new THREE.Color("#AAAAFF");

		var add = new THREE.Vector3(10,10,10);
		var scale = 0.3;


///////////////////////////////////////////////////////////////////////////////
		this.inboundElements;
		this.outboundElements;
		this.container;

		this.uniforms = {
			lerpAlpha : { type:"f", value:0.5 },
			radius : { type:"f", value:1 },			
			outbound : { type:"f", value:0 },
			inbound : { type:"f", value:0 }
		};

		this.inboundCount = 0;
		this.outboundCount = 0;

		this.velocity = new THREE.Vector3(0,0,0);

///////////////////////////////////////////////////////////////////////////////
		this.construct = function(geometry, material){
			var materialOptions = {
				transparent : true,
				opacity : 0.7,
				color: inboundColor,
				visible:true
			}
			geometry = geometry || new THREE.SphereGeometry( 1, 16, 16 );
			material =  material || new THREE.MeshBasicMaterial(materialOptions);
			material = new THREE.ShaderMaterial({ uniforms:this.uniforms, vertexShader:AEROTWIST.Shaders.FunctionElement1.vertex, fragmentShader:AEROTWIST.Shaders.FunctionElement1.fragment});
			return new (MeshObject.extend(FunctionElement).extend({
				construct : function(){
					this.inboundElements = new (require("./ObjectStore"));
					this.outboundElements = new (require("./ObjectStore"));

					this.actionRadius=1;

					this.container = new THREE.Object3D();
					this.add(this.container);

					this.update();
					this.material.uniforms= this.uniforms;
					console.log(this);
				}
			}))(geometry, material);

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
			var maxSpeed = 5;
			var minSpeed = 2;
			force.setLength(THREE.Math.clamp(THREE.Math.mapLinear(length, 0, this.actionRadius, maxSpeed, minSpeed),minSpeed,maxSpeed));
			this.velocity.add(force);
		}
///////////////////////////////////////////////////////////////////////////////
		this.updateColors = function(){
			if(this.uniforms.lerpAlpha.value > 0.01) this.uniforms.lerpAlpha.value*=0.85;
			else this.uniforms.lerpAlpha.value = 0;
		}
///////////////////////////////////////////////////////////////////////////////
		this.updateOutBoundConnections = function() {
			var elements = this.outboundElements.getAll();
			for(var i = 0; i<elements.length; i++) {
				var distanceVector = elements[i].object.position.clone().sub(this.position);
				distanceVector.z=0;

				var target = distanceVector.clone().setLength(this.actionRadius +elements[i].object.actionRadius+10);
				var force = target.clone().add(this.position).sub(elements[i].object.position);
				var length=force.length();
				var maxSpeed = 10;
				var minSpeed = 1;
				force.setLength(THREE.Math.clamp(THREE.Math.mapLinear(length, 0, this.actionRadius, minSpeed, maxSpeed),minSpeed,maxSpeed));
				elements[i].object.velocity.add(force);

				elements[i].data.connection.geometry.vertices[1] = distanceVector;
				elements[i].data.connection.geometry.verticesNeedUpdate = true;
			}
		}
///////////////////////////////////////////////////////////////////////////////
		this.updateRadius = function(){
			var count = Math.max(this.inboundCount, this.outboundCount);			
			var countScale = 0.3;
			var boundingRadius =count*countScale+10;
			this.scale.set(boundingRadius, boundingRadius, boundingRadius);
			this.container.scale.set(1/boundingRadius, 1/boundingRadius, 1/boundingRadius);
			this.actionRadius =boundingRadius;
			this.uniforms.radius.value = boundingRadius;
		}
///////////////////////////////////////////////////////////////////////////////
		this.update = function(){
			this.updateRadius();
			this.updateOutBoundConnections();
			this.updateColors();

		
			var gravity = this.position.clone().negate().multiplyScalar(0.01);
			this.position.add(gravity);

			this.velocity.multiplyScalar(0.1);
			this.position.add(this.velocity);
			this.position.z = 0;


		}
///////////////////////////////////////////////////////////////////////////////
		this.inboundEvent = function(FunctionElement){
			this.inboundCount++;
			// var element = this.inboundElements.store(FunctionElement);
			// element.data.count = element.data.count+1 || 1;
			// this.inboundElements.store(element.object, element.data);
			this.uniforms.lerpAlpha.value = 1;
			this.uniforms.inbound.value++;
		}
///////////////////////////////////////////////////////////////////////////////
		this.outboundEvent = function(FunctionElement){
			this.outboundCount++;
			var element=this.outboundElements.store(FunctionElement);
			element.data.count = element.data.count+1 || 1;
			if(typeof element.data.connection !== "object"){
				var material = new THREE.LineBasicMaterial({
					color: 0x0000ff
				});
				var geometry = new THREE.Geometry();
				geometry.vertices.push(new THREE.Vector3(0,0,0));
				geometry.vertices.push(element.object.position.clone().sub(this.position));
				element.data.connection = new THREE.Line(geometry, material);
				this.container.add(element.data.connection);
			}
			this.outboundElements.store(element.object, element.data);
			this.uniforms.outbound.value++;
		}
	}
///////////////////////////////////////////////////////////////////////////////
	module.exports = require("../Class.js").extend(FunctionElement);
})(jQuery, THREE, window, document)