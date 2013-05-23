(function($, window, document, undefined) {	
	$(document).ready(function(){

		// var eventHandler = require("../jnstrument/clientEventHandler.js")('http://greenish.jit.su/');
		var eventHandler = require("../jnstrument/eventHandler.js")('127.0.0.1:8000');
		var guitarHeroVisual = require("../jnstrument/d3Test.js")(eventHandler);

	});
})(jQuery, window, document)
