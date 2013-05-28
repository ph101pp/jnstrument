(function($, THREE, window, document, undefined) {
	var FunctionElement = function(){
/*/////////////////////////////////////////////////////////////////////////////
	Private Properties
/*/////////////////////////////////////////////////////////////////////////////
		var data;
		var env;
/*/////////////////////////////////////////////////////////////////////////////
	Public Properties
/*/////////////////////////////////////////////////////////////////////////////
		this.element;
		this.eventElement;
		this.id;
		this.events = [];
		this.eventCount = 0;
/*/////////////////////////////////////////////////////////////////////////////
	Private Methods
/*/////////////////////////////////////////////////////////////////////////////
/*/////////////////////////////////////////////////////////////////////////////
	Public Methods
/*/////////////////////////////////////////////////////////////////////////////
		this.tick = function(now){
			var gap= env.width/(env.elements.length);
			this.element.position.x = gap*(env.elementIndexes[this.id]);
			
			this.eventElement.position.y += 10;
		}
/*/////////////////////////////////////////////////////////////////////////////
	Constructor
/*/////////////////////////////////////////////////////////////////////////////
		this.construct = function(_env, _data){
			env = _env;
			data = _data;
			this.id = data.id;
			var geometry = new THREE.Geometry();
			geometry.vertices.push(new THREE.Vector3(0, 0, 0));
			geometry.vertices.push(new THREE.Vector3(0, env.height, 0));

			var material = new THREE.LineBasicMaterial({
				color: 0xdddddd
			});

			this.element = new THREE.Line(geometry, material);
			this.eventElement = new THREE.Object3D();

			this.element.add(this.eventElement);
			env.scene.add(this.element);
		}
	};

	module.exports = require("../Class.js")(FunctionElement).extend(require("./tickable.js"));
})(jQuery, THREE, window, document)