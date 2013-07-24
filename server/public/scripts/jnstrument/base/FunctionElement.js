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

		var face;


///////////////////////////////////////////////////////////////////////////////
		this.inboundElements;
		this.outboundElements;

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
			this.inboundElements = new (require("./ObjectStore"));
			this.outboundElements = new (require("./ObjectStore"));		
			var materialOptions = {
				transparent : true,
				opacity : 0.7,
				color: inboundColor,
				visible:true
			}
			geometry = geometry || new THREE.SphereGeometry( 1, 16, 16 );
			// material =  material || new THREE.MeshBasicMaterial(materialOptions);
			material =  material || new THREE.ShaderMaterial({ uniforms:this.uniforms, vertexShader:AEROTWIST.Shaders.test.vertex, fragmentShader:AEROTWIST.Shaders.test.fragment});
			face = new THREE.Mesh(geometry, material);

			this.add(face);

			this.actionRadius=1;
			
			this.update();

		}
///////////////////////////////////////////////////////////////////////////////
		this.worldReference= function(_world){
			world = _world;
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
		this.updateColors = function(){
			if(this.uniforms.lerpAlpha.value > 0.01) this.uniforms.lerpAlpha.value*=0.85;
			else this.uniforms.lerpAlpha.value = 0;
		}
///////////////////////////////////////////////////////////////////////////////
		this.updateOutBoundConnections = function() {
			var storedElements = this.outboundElements.getAll();
			var elements = storedElements.objects;
			for(var i = 0; i<elements.length; i++) {
				var distanceVector = elements[i].position.clone().sub(this.position);
				// distanceVector.z=0;
				// var targetDistance = this.actionRadius +elements[i].actionRadius+10;
				// var target = distanceVector.clone().setLength(targetDistance);
				// var force = target.clone().add(this.position).sub(elements[i].position);
				// var length=force.length();
				// var maxSpeed = 20;
				// var minSpeed = 0;
				// force.setLength(THREE.Math.clamp( length/(2*this.actionRadius) ,minSpeed,maxSpeed));
				// elements[i].velocity.add(force);

				storedElements.data[i].connection.geometry.vertices[1] = distanceVector;
				storedElements.data[i].connection.geometry.verticesNeedUpdate = true;
			}
		}
///////////////////////////////////////////////////////////////////////////////
		this.updateRadius = function(){
			var count = Math.max(this.inboundCount, this.outboundCount);			
			var countScale = 0.3;
			var boundingRadius =count*countScale+10;
			face.scale.set(boundingRadius, boundingRadius, boundingRadius);
			this.actionRadius = boundingRadius+40;
			this.uniforms.radius.value = boundingRadius;
		}
///////////////////////////////////////////////////////////////////////////////
		this.update = function(){
			this.updateRadius();
			this.updateOutBoundConnections();
			this.updateColors();

		
			var gravity = this.position.clone().negate().multiplyScalar(0.001);
			this.position.add(gravity);

			this.velocity.multiplyScalar(0.1);
			this.position.add(this.velocity);
			this.position.z = 0;
		}
///////////////////////////////////////////////////////////////////////////////
		this.inboundEvent = function(FunctionElement){
			this.inboundCount++;
			var element = this.inboundElements.store(FunctionElement);
			element.data.count = element.data.count+1 || 1;
			this.inboundElements.store(element.object, element.data);
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
				this.add(element.data.connection);
			}
			this.outboundElements.store(element.object, element.data);
			this.uniforms.outbound.value++;
		}
	}
///////////////////////////////////////////////////////////////////////////////
	module.exports = require("../Class.js").extend(THREE.Object3D).extend(require("./CollisionElement.js")).extend(FunctionElement);
})(jQuery, THREE, window, document)