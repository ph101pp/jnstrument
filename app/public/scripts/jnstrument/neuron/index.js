(function($, THREE, window, document, undefined) {	
	var index = function(){			
		var socket = 		new (require("./Socket.js"))(require("../config.js").socketAdress);
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