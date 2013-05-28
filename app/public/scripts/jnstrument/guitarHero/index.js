(function($, THREE, window, document, undefined) {	
	var guitarHeroVisual = function(){			
		var loop = 			new (require("./Loop.js"))();
		var globalTick = 	new (require("./GlobalTicker.js"))();
		var eventHandler = 	new (require("../EventHandler.js"))('127.0.0.1:8000');
		var env = 			new (require("./Environment.js"))($("#scene"));
		var eventPool = 	new (require("./EventPool.js"))(env);	
		

	//	console.log( ticker instanceof );
		
		loop.addTick(globalTick);	
		loop.startTick();
		globalTick.addTick(env);
		globalTick.startTick();

		env.elements = [];
		env.elementIndexes = {};

		eventHandler.addListener(function(data){
			if(!env.elementIndexes[data.id]) {
				var element = new (require("./FunctionElement.js"))(env, data);
				globalTick.addTick(element);
				env.elementIndexes[data.id] = env.elements.push(element)-1;
			}
			var functionElement = env.elements[env.elementIndexes[data.id]];
			functionElement.eventCount++;
			var event = eventPool.getElement();
			event.attachElement(functionElement);
			globalTick.addTick(event);
		});

	}
///////////////////////////////////////////////////////////////////////////////	
	// module.exports = function(){
	// 	return new guitarHeroVisual();
	// }
///////////////////////////////////////////////////////////////////////////////
	$(document).ready(function(){
		guitarHeroVisual(); // Start
	});
})(jQuery, THREE, window, document)