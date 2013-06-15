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
				color: 0x000000,
				visible:true
			}
			geometry = geometry || new THREE.SphereGeometry( 5, 16, 16 );
			//material =  material || new THREE.MeshBasicMaterial(materialOptions);
			material =  material || new THREE.ShaderMaterial({ uniforms:this.uniforms, vertexShader:AEROTWIST.Shaders.test.vertex, fragmentShader:AEROTWIST.Shaders.test.fragment});
			face = new THREE.Mesh(geometry, material);

			this.add(face);
			console.log(face);

			this.actionRadius=10;
			
			this.update();

		}
///////////////////////////////////////////////////////////////////////////////
		this.worldReference= function(_world){
			world = _world;
		}
///////////////////////////////////////////////////////////////////////////////
		this.remap = function(){
			face.material.color = new THREE.Color(0x00FF00);
		}
		this.collision = function(object, hits, collisionDetection) {
			if(this.outboundElements.get(object) !== false || this.inboundElements.get(object) !== false) return;
			var force = this.position.clone().sub(object.position);
			var distance = force.length();
			var interactionRadius = (this.actionRadius+object.actionRadius)*2;

//			console.log(distance,this.actionRadius,object.actionRadius);
			face.material.color = new THREE.Color(0xff0000);
			if(distance > interactionRadius) return;

			var length = force.length();
			var maxSpeed = 10;
			var minSpeed = 2;
			force.setLength(THREE.Math.clamp( THREE.Math.mapLinear(length, 0, interactionRadius, maxSpeed, minSpeed) ,minSpeed,maxSpeed));
			this.velocity.add(force);
		}
///////////////////////////////////////////////////////////////////////////////
		this.calculateOutboundConnections = function() {
			var storedElements = this.inboundElements.getAll();
			var elements = storedElements.objects;
			for(var i = 0; i<elements.length; i++) {
				var distanceVector = elements[i].position.clone().sub(this.position);

				var targetDistance = (this.actionRadius+elements[i].actionRadius)+10;
				var target = distanceVector.clone().setLength(targetDistance);
				var force = target.clone().add(this.position).sub(elements[i].position);
				var length=force.length();
				var maxSpeed = 30;
				var minSpeed = 0;
				//force.setLength(THREE.Math.clamp( length/3 ,minSpeed,maxSpeed));
				
				elements[i].position.add(force.multiplyScalar(1/5));
				this.position.add(force.negate().multiplyScalar(1/3));
			}
		}
///////////////////////////////////////////////////////////////////////////////
		this.updateColors = function(){
			if(this.uniforms.lerpAlpha.value > 0.01) this.uniforms.lerpAlpha.value*=0.85;
			else this.uniforms.lerpAlpha.value = 0;
		}
///////////////////////////////////////////////////////////////////////////////
		this.updateInBoundConnections = function() {
			var storedElements = this.inboundElements.getAll();
			var elements = storedElements.objects;
			for(var i = 0; i<elements.length; i++) {
				outBoundConnection = elements[i].outboundElements.get(this);
				var distanceVector = this.position.clone().sub(elements[i].position);
				outBoundConnection.data.connection.geometry.vertices[1] = distanceVector;
				outBoundConnection.data.connection.geometry.verticesNeedUpdate = true;
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
		this.calculate = function(){

		}

		this.update = function(){
			//this.updateRadius();
			this.calculateOutboundConnections();
			this.updateInBoundConnections();
			this.updateColors();

	
			this.velocity.multiplyScalar(0.7); // friction

			var gravity = this.position.clone().multiplyScalar(0.001);
			if(this.position.length() < 100) this.velocity.add(gravity); // push from center

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