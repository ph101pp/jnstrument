
chrome.browserAction.onClicked.addListener(function(tab) {
	var popup=window.open("visualization.html?"+new Date().getTime()+"#"+tab.id,"pcaVisualization",'height=500,width=700');
});
