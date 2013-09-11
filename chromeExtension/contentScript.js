(function(window, document, undefined){

	var injected=false;

	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		updateScript(request.action, request.guid);
	});

	// Initialisation if already activated
	chrome.runtime.sendMessage({action:"init"}, function(response) {
		setTimeout(function(){
			updateScript(response.action, response.guid);
		},1000);p
	});

	var updateScript = function (action, guid){
		var script;
		if(action != "disable") {
			if(!injected) {
				document.body.appendChild(document.createElement('script')).src=chrome.extension.getURL("pca__ProxyInstrumentES5.js")+"?"+new Date().getTime();
				// document.body.appendChild(document.createElement('script')).src="http://localhost:8000/scripts/pca__ProxyInstrumentES5.js?"+new Date().getTime();
				// document.body.appendChild(document.createElement('script')).src="http://jnstrument.com/scripts/pca__ProxyInstrumentES5.js?"+new Date().getTime();
				injected = true;
			}
			script = "__pca__.enable('"+guid+"')";
		}
		else script = "__pca__.disable();";
		document.body.appendChild(document.createElement('script')).innerHTML="__pca__UpdateScript = function(){ "+script+"; delete __pca__UpdateScript;}; if(typeof(__pca__) === 'object') __pca__UpdateScript();";
	}

})(window, document);