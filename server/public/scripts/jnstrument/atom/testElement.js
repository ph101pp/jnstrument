(function($, THREE, window, document, undefined) {

	var CollisionElement = require("../Class.js").extend(THREE.Mesh).extend(require("./CollisionElement.js"));

	var FunctionElement = function(){
		this.construct = function(geometry, material){
			geometry = geometry || new THREE.SphereGeometry( 5, 16, 16 );
			material = material || new THREE.MeshBasicMaterial( { color: 0xFF3333} );

			this.construct= function(){this._super()};
			var functionElement = new (CollisionElement.extend(this))(geometry, material);
			functionElement.actionRadius = 10;
			return functionElement;
		}
///////////////////////////////////////////////////////////////////////////////
		this.collision = function(object, hits, collisionDetection) {
			console.log("hit", object);
			//object.material.color= 0x33FF33;

		}
	}
///////////////////////////////////////////////////////////////////////////////
	module.exports = require("../Class.js").extend(FunctionElement);
})(jQuery, THREE, window, document)