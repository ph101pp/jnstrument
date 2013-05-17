(function(window, document, undefined){

	var injected=false;

	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		updateScript(request.action, request.guid);
	});

	chrome.runtime.sendMessage({action:"init"}, function(response) {
		updateScript(response.action, response.guid);
	});

	var updateScript = function (action, guid){
		console.log(action, "jnstrument");
		var script;
		if(action != "disable") {
			if(!injected) {
				// document.body.appendChild(document.createElement('script')).src="http://greenish.eu01.aws.af.cm/scripts/pca__ProxyInstrumentES5.js?"+new Date().getTime();
				// document.body.appendChild(document.createElement('script')).src="http://greenish.jit.su/scripts/pca__ProxyInstrumentES5.js?"+new Date().getTime();
				//document.body.appendChild(document.createElement('script')).src=chrome.extension.getURL("pca__ProxyInstrumentES5chrome.js")+"?"+new Date().getTime();
				document.body.appendChild(document.createElement('script')).src="http://localhost:8000/scripts/pca__ProxyInstrumentES5.js?"+new Date().getTime();
				injected = true;
			}
			script = "__pca__.enable('"+guid+"')";
		}
		else script = "__pca__.disable()";
		document.body.appendChild(document.createElement('script')).innerHTML="__pca__UpdateScript = function(){ "+script+"; delete __pca__UpdateScript;}; if(typeof(__pca__) === 'object') __pca__UpdateScript();";
	}

})(window, document);


	// var xhr = new XMLHttpRequest();
	// xhr.open("GET", "http://greenish.eu01.aws.af.cm/scripts/pca__ProxyInstrumentES5.js?"+new Date().getTime(), true);
	// xhr.onreadystatechange = function() {
	//   if (xhr.readyState == 4) {
	//   //	console.log(xhr.responseText);
	//   	var str = (xhr.responseText + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/,'\\0').replace(/\u2029/,'\\0').replace(/\u2028/,'\\0').replace(/\�/,'\\ufffd');

	//   	console.log(str);
	//     //document.body.appendChild(document.createElement('script')).innerHTML=str;
	//   }
	// }
	// xhr.send();