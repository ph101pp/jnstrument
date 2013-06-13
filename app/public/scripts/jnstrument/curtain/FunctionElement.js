(function($, THREE, window, document, undefined) {

	var MeshObject = require("../Class.js").extend(THREE.Mesh).extend(require("./CollisionElement.js"));

	var FunctionElement = function(){

///////////////////////////////////////////////////////////////////////////////
		var world;

///////////////////////////////////////////////////////////////////////////////
		this.uniforms = {
			lerpAlpha : { type:"f", value:0.5 },
			radius : { type:"f", value:1 },			
			outbound : { type:"f", value:0 },
			inbound : { type:"f", value:0 }
		};

		this.inboundCount = 0;
		this.outboundCount = 0;
///////////////////////////////////////////////////////////////////////////////
		this.construct = function(geometry, material){
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
		this.onWindowResize = function(e){


		}
	}
///////////////////////////////////////////////////////////////////////////////
	module.exports = require("../Class.js").extend(THREE.Object3D).extend(require("./CollisionElement.js")).extend(FunctionElement);
})(jQuery, THREE, window, document)