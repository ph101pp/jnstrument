(function($, THREE, window, document, undefined) {
	var EventElement = function(env, functionElement){
/*/////////////////////////////////////////////////////////////////////////////
	Private Properties
/*/////////////////////////////////////////////////////////////////////////////
/*/////////////////////////////////////////////////////////////////////////////
	Public Properties
/*/////////////////////////////////////////////////////////////////////////////
		this.element;
		this.time=0;
/*/////////////////////////////////////////////////////////////////////////////
	Private Methods
/*/////////////////////////////////////////////////////////////////////////////
/*/////////////////////////////////////////////////////////////////////////////
	Public Methods
/*/////////////////////////////////////////////////////////////////////////////
		this.update = function(now){
			if(functionElement.eventElement.position.y - (-this.element.position.y) > env.height){
				functionElement.eventElement.remove(this.element);
				this.element.geometry.dispose();
				this.element.material.dispose();
				//this.element.texture.dispose();
				var index = functionElement.events.indexOf(this);
				delete functionElement.events[index];
			}
			// var gap= env.width/(env.elements.length);
			// var newRadius = gap/3;
			// if(this.element.geometry.radius != newRadius) {
			// 	this.element.geometry.radius = newRadius;

			// 	this.element.geometry.verticesNeedUpdate = true;
			// 	this.element.geometry.normalsNeedUpdate = true;
			// 	this.element.geometry.dynamic = true;

			// }
		}
/*/////////////////////////////////////////////////////////////////////////////
	Constructor
/*/////////////////////////////////////////////////////////////////////////////
		var geometry =  new THREE.SphereGeometry(3,16,16);
		var material = new THREE.LineBasicMaterial( { color: 0xFF3333, opacity: 1.0} );

		this.element = new THREE.Mesh( geometry, material );
		this.element.position.set(0,-functionElement.eventElement.position.y,0);
		functionElement.eventElement.add(this.element);

	};

	module.exports = require("../pcaClass.js")(EventElement);
})(jQuery, THREE, window, document)