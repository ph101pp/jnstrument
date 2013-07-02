(function($, THREE, window, document, undefined) {	
	var index = function(){			
		var socket = 		new (require("./Socket.js"))('127.0.0.1:8000');
		var loop = 			new (require("./Loop.js"))();
		var base = 			new (require("./Lifeline.js"))(socket, loop);

		loop.makeAsync();
		base.initialize($("#scene"));
	}	
///////////////////////////////////////////////////////////////////////////////
	$(function(){
		index(); // Start
	});
})(jQuery, THREE, window, document)