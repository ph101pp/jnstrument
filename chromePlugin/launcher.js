function proxyInject(_tabId){
/////////////////////////////////////////////////////////////
// constructor
	if(this == window) return new proxyInject(_tabId);
	
	var tabId = _tabId;


	var injectScripts = function (tabId) {
	 	chrome.tabs.executeScript(tabId, { 
		  	code: "document.body.appendChild(document.createElement('script')).src='http://greenish.eu01.aws.af.cm/scripts/pca__ProxyInstrumentES5.js?"+new Date().getTime()+"';",
				allFrames: true
		}, null);
	};

	injectScripts(tabId);


/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
}

chrome.browserAction.onClicked.addListener(function(tab) {
	new proxyInject(tab.id);
});	

// chrome.browserAction.onClicked.addListener(function(tab) {
// 	var popup=window.open("visualization.html?"+new Date().getTime()+"#"+tab.id,"pcaVisualization",'height=200,width=700');
// });	

// if(window.location.host == chrome.i18n.getMessage("@@extension_id")) {
// 	new proxyInject(parseInt(window.location.hash.substr(1)));
// }

