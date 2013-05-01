chrome.browserAction.onClicked.addListener(function(tab) {
	var popup=window.open("visualization.html?"+new Date().getTime()+"#"+tab.id,"pcaVisualization",'height=200,width=700');
});	

if(window.location.host == chrome.i18n.getMessage("@@extension_id")) {
	new proxyInject(parseInt(window.location.hash.substr(1)));
}

