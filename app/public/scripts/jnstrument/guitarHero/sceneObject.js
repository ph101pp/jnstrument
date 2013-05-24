(function($, THREE, window, document, undefined) {	
	var stageObject = function(){

		var blub="hallo";

		alert("abstract");


	};
	$.extend(stageObject.prototype, {
		draw : function(){
			alert("blub");
		}
	}

	module.exports = require("../pcaClass.js")(stageObject);
})(jQuery, THREE, window, document)