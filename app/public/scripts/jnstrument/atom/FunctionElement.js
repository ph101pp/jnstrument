(function($, THREE, window, document, undefined) {

	var CollisionElement = require("../Class.js").extend(THREE.Mesh).extend(require("./CollisionElement.js"));

	var FunctionElement = function(){
		this.construct = function(){
			
			
//			var geometry =  new THREE.CircleGeometry(10,16);
//			var geometry =  new THREE.CubeGeometry( 10, 10, 10 );
			var geometry =  new THREE.SphereGeometry( 5, 16, 16 );
			var material = new THREE.MeshBasicMaterial( { color: 0xFF3333} );

			this.construct= function(){this._super()};
			//this.instanceof = undefined;
			return new (CollisionElement.extend(this))(geometry, material);
		}
///////////////////////////////////////////////////////////////////////////////
		this.collision = function(object, hits, collisionDetection) {
		//	object.material.color=

		}
	}
///////////////////////////////////////////////////////////////////////////////
	module.exports = require("../Class.js").extend(FunctionElement);
})(jQuery, THREE, window, document)