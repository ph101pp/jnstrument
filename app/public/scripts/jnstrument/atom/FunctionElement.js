(function($, THREE, window, document, undefined) {


	var FunctionElement = function(){
		this.inbound;
		this.outbound;

		this.construct = function(){
			var materialOptions = {
				transparent : true,
				opacity : 0.7
			}
			var inboundGeometry = new THREE.SphereGeometry( 20, 16, 16 );
			var inboundMaterial =  new THREE.MeshBasicMaterial($.extend({}, materialOptions, {color: 0xFF3333, opacity: 0.5, side:THREE.FrontSide}));
			this.inbound = new THREE.Mesh(inboundGeometry, inboundMaterial);

			var outboundGeometry = new THREE.SphereGeometry( 15, 16, 16 );
			var outboundMaterial =  new THREE.MeshBasicMaterial($.extend({}, materialOptions, {color: 0x3333FF, opacity: 0.4, side:THREE.BackSide}));
			this.outbound = new THREE.Mesh(outboundGeometry, outboundMaterial);

			this.add(this.outbound);
			this.add(this.inbound);

			this.actionRadius= 150;
		}
///////////////////////////////////////////////////////////////////////////////
		this.collision = function(object, hits, collisionDetection) {
			console.log(object);

		}
	}
///////////////////////////////////////////////////////////////////////////////
	module.exports = require("../Class.js").extend(THREE.Object3D).extend(require("./CollisionElement.js")).extend(FunctionElement);
})(jQuery, THREE, window, document)