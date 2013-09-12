(function($, THREE, window, document, undefined) {	
	var index = function(){			
		console.log(require("../config.js").outputAdress);
		var socket = 		new (require("./Socket.js"))(require("../config.js").outputAdress);
		var loop = 			new (require("./Loop.js"))();
		var base = 			new (require("./Neuron.js"))(socket, loop);

		loop.makeAsync();
		base.initialize($("#scene"));
	}	
///////////////////////////////////////////////////////////////////////////////
	$(function(){
		index(); // Start
	});
})(jQuery, THREE, window, document)