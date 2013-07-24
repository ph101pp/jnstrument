(function($, THREE, window, document, undefined) {	
	var index = function(){			
		var socket = 		new (require("./Socket.js"))('127.0.0.1:8000');
		var loop = 			new (require("./Loop.js"))();
		var visuals = 		new (require("./Curtain.js"))(socket, loop);

		loop.makeAsync();
		visuals.initialize($("#scene"));
	}	
///////////////////////////////////////////////////////////////////////////////
	AEROTWIST.init = function(){
		index(); // Start
	};
})(jQuery, THREE, window, document)