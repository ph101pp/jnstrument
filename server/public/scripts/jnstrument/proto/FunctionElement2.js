(function($, THREE, window, document, undefined) {

	var MeshObject = require("../Class.js").extend(THREE.Mesh);

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

		this.inboundCount = 5;
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
			geometry = geometry || new THREE.SphereGeometry( 5, 16, 16 );
			material = material || new THREE.ShaderMaterial({ uniforms:this.uniforms, vertexShader:AEROTWIST.Shaders.FunctionElement2.vertex, fragmentShader:AEROTWIST.Shaders.FunctionElement2.fragment});
			return new (MeshObject.extend(FunctionElement).extend({
				construct : function(){
					this.inboundElements = new (require("./ObjectStore"));
					this.outboundElements = new (require("./ObjectStore"));

					this.actionRadius=1;

					this.container = new THREE.Object3D();
					this.add(this.container);

					this.update();
					this.material.uniforms= this.uniforms;
					this.material.transparent=true;
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
		this.updateRadiusScale = function(add){
			if(!add) this.scale.multiplyScalar(.95, .95, .95);
			else this.scale.add(add);
			if(this.scale.x<1) this.scale.set(1,1,1);
			this.container.scale = this.scale.clone().multiplyScalar(1/this.scale.x, 1/this.scale.y, 1/this.scale.z);
			this.actionRadius =this.scale.x;
			this.uniforms.radius.value = this.scale.x;
		}
///////////////////////////////////////////////////////////////////////////////
		this.update = function(){
			this.updateRadiusScale();
			this.updateOutBoundConnections();
			this.updateColors();

		
			// var gravity = this.position.clone().negate().multiplyScalar(0.01);
			// this.position.add(gravity);

			// this.velocity.multiplyScalar(0.1);
			// this.position.add(this.velocity);
			// this.position.z = 0;


		}
///////////////////////////////////////////////////////////////////////////////
		this.inboundEvent = function(FunctionElement){
			this.inboundCount++;
			// var element = this.inboundElements.store(FunctionElement);
			// element.data.count = element.data.count+1 || 1;
			// this.inboundElements.store(element.object, element.data);
			this.uniforms.lerpAlpha.value = 1;
			this.uniforms.inbound.value++;
			this.updateRadiusScale(new THREE.Vector3(.5, .5, .5));
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