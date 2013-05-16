new (function jnstrument(_tabId){
/////////////////////////////////////////////////////////////
	var tabs = {};
/////////////////////////////////////////////////////////////
	chrome.browserAction.onClicked.addListener(function(tab) {
		if(tabs[tab.id] && tabs[tab.id].status) deactivateTab(tab);
		else activateTab(tab)
	});
/////////////////////////////////////////////////////////////
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		if(tabs[sender.tab.id] && tabs[sender.tab.id].status) sendResponse({
			action : "enable",
			guid : tabs[sender.tab.id].guid
		});
	});
/////////////////////////////////////////////////////////////
	chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
		var icon = tabs[tabId] && tabs[tabId].status ? 
			"active.png":
			"inactive.png";
		chrome.browserAction.setIcon({
			path:icon,
			tabId:tabId
		});
	});
/////////////////////////////////////////////////////////////
	var activateTab = function(tab){
		if(tabs[tab.id]) tabs[tab.id].status = true;
		else tabs[tab.id] = {
			guid: createGuid(),
			status : true
		};
		chrome.tabs.sendMessage(tab.id, {
			action: "enable", 
			guid : tabs[tab.id].guid
		});
		chrome.browserAction.setIcon({
			path:"active.png",
			tabId:tab.id
		});
	}
/////////////////////////////////////////////////////////////
	var deactivateTab = function(tab){
		chrome.tabs.sendMessage(tab.id, {
			action: "disable"
		});
		tabs[tab.id].status = false;
		chrome.browserAction.setIcon({
			path:"inactive.png",
			tabId:tab.id
		});
	}
/////////////////////////////////////////////////////////////
	var createGuid = function (){
		return 'xxxxxxxx-xxxx-4xxx-yxxx-pxxxxcxxxxxa'.replace(/[xy]/g, function(c) {
	    	var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	    	return v.toString(16);
		});
	}
/////////////////////////////////////////////////////////////
})();

	// var trueInject = function(tabId, details, callback){
	// 	if(details.file) { 
	// 		details.code="document.body.appendChild(document.createElement('script')).src='"+details.file+"';";
	// 		delete details.file;
	// 	}
	// 	else {
	// 		details.code = "document.body.appendChild(document.createElement('script')).innerHTML='"+details.code+"';";
	// 	}
	// 	chrome.tabs.executeScript(tabId, details, callback);
	// } 

