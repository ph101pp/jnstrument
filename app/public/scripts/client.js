(function(window, document, undefined) {
	
	var url = require("url");
	var urlObj = url.parse(window.location);

	var guid = urlObj.pathname.substr(1);
	console.log(guid);

	require("./clientEventHandler.js")(guid);


})(window, document)
