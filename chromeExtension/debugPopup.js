
chrome.browserAction.onClicked.addListener(function(tab) {
	var popup=window.open("debugPopup.html#"+tab.id,"pcaVisualization",'height=200,width=200');
});
