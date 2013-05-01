function proxyInject(_tabId){
/////////////////////////////////////////////////////////////
// constructor
	if(this == window) return new proxyInject(_tabId);
	
	var tabId = _tabId;


	var injectScripts = function (tabId) {
		var ts = new Date().getTime();
	 	chrome.tabs.executeScript(tabId, { 
		  	code: "document.body.appendChild(document.createElement('script')).src='" + chrome.extension.getURL("pca__ProxyInstrument.js") +"?"+ts+"';",
				allFrames: true
		}, null);
	};

	injectScripts(tabId);


/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
}