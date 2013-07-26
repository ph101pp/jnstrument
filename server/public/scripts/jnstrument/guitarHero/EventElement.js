(function($, THREE, window, document, undefined) {
	var EventElement = function(){
/*/////////////////////////////////////////////////////////////////////////////
	Private Properties
/*/////////////////////////////////////////////////////////////////////////////
		var env;
		var functionElement;
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
		this.tick = function(now){
			if(functionElement.eventElement.position.y - (-this.element.position.y) > env.height){
				this.detachElement();
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
///////////////////////////////////////////////////////////////////////////////
		this.attachElement = function(_functionElement) {
			functionElement = _functionElement;
			this.time = Date.now();
			this.setUnavailable();
			this.element.position.set(0,-functionElement.eventElement.position.y,0);
			functionElement.eventElement.add(this.element);
		}
///////////////////////////////////////////////////////////////////////////////
		this.detachElement = function(){
			functionElement.eventElement.remove(this.element);
			this.ticker.removeTick(this);
			functionElement = null;
			setTimeout(function(){this.setAvailable()}.bind(this), 10);
		}
///////////////////////////////////////////////////////////////////////////////		
		this.construct = function(_env){
			env = _env;
			var geometry =  new THREE.SphereGeometry(3,16,16);
			var material = new THREE.LineBasicMaterial( { color: 0xFF3333, opacity: 1.0} );
			this.element = new THREE.Mesh( geometry, material );
			// this.element.position.set(0,-functionElement.eventElement.position.y,0);
			// functionElement.eventElement.add(this.element);
		}

	};

	module.exports = require("./tickable.js").extend(require("./poolable.js")).extend(EventElement);
})(jQuery, THREE, window, document)