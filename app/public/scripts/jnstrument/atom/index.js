(function($, THREE, window, document, undefined) {	
	var index = function(){			
		var socket = 		new (require("./Socket.js"))('127.0.0.1:8000');
		var loop = 			new (require("./Loop.js"))();
		var atom = 			new (require("./Atom.js"))(socket, loop);

		loop.makeAsync();
		atom.initialize($("#scene"));
	}	
///////////////////////////////////////////////////////////////////////////////
	AEROTWIST.init = function(){
		index(); // Start
	};
})(jQuery, THREE, window, document)