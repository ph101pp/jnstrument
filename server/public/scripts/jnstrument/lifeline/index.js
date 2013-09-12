(function($, THREE, window, document, undefined) {	
	var index = function(){			
		var socket = 		new (require("./Socket.js"))(require("../config.js").outputAdress);
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