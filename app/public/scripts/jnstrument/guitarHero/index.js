(function($, THREE, window, document, undefined) {	
	var guitarHeroVisual = function(){
		var eventHandler = require("../eventHandler.js")('127.0.0.1:8000');
		var env = require("./Environment.js")($("#scene"));
		
		env.elements = [];
		env.elementIndexes = {};

		eventHandler.addListener(function(data){
			if(!env.elementIndexes[data.id]) {
				var element = new (require("./FunctionElement.js"))(env, data);
				env.elementIndexes[data.id] = env.elements.push(element)-1;
			}
			var event = new (require("./EventElement.js"))(env, env.elements[env.elementIndexes[data.id]]);
			event.time = Date.now();
			env.elements[env.elementIndexes[data.id]].events.push(event);
			env.elements[env.elementIndexes[data.id]].eventCount++;
		});

		env.addRenderer("drawElements", function(now){
			for(var i =0; i<env.elements.length; i++) {
				env.elements[i].update(now);
			}
		});


		env.start();



	}
///////////////////////////////////////////////////////////////////////////////	
	module.exports = function(){
		return new guitarHeroVisual();
	}
///////////////////////////////////////////////////////////////////////////////
	$(document).ready(function(){
		module.exports(); // Start
	});
})(jQuery, THREE, window, document)