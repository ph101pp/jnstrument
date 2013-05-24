(function($, THREE, window, document, undefined) {	
	var test = function(){

		var blub="hallo";

		alert("abstract");


	};
	test.prototype.draw = function(){
		alert("blub");
	}

	module.exports = require("../pcaClass.js").abstract(test);
})(jQuery, THREE, window, document)