(function($, THREE, window, document, undefined) {	
	var guitarHeroVisual = function(){
		var eventHandler = require("../eventHandler.js")('127.0.0.1:8000');
		var env = require("./environment.js")($("#scene"));
		
		var dataSet = [];
		var dataIndexes = {};

		eventHandler.addListener(function(data){
			if(!dataIndexes[data.id]) {
				data.events = [];
				data.eventCount = 0;
				dataIndexes[data.id] = dataSet.push(data)-1;
			}
			dataSet[dataIndexes[data.id]].events.push(Date.now());
			dataSet[dataIndexes[data.id]].eventCount++;
		});

		env.addRenderer("rotateCube", function(){
			//console.log(dataSet);
		});


		env.start();



	}
	module.exports = function(){
		$(document).ready(function(){
			return new guitarHeroVisual();
		});
	}
	module.exports(); // Start
})(jQuery, THREE, window, document)