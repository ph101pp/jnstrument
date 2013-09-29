jnstrument = new (function (){
/////////////////////////////////////////////////////////////
	var tabs = {};
	var debugging = false;


////Exhibition stuff

	chrome.idle.setDetectionInterval(120);
	chrome.idle.onStateChanged.addListener(function(state){
		if(state != "idle") return;
		chrome.tabs.query({currentWindow:true, active:true}, function(result){
			var tab=result[0];
			chrome.tabs.update(tab.id, {
				url:"http://www.daum.net"
			});
			chrome.windows.update(tab.windowId, {
				state:"fullscreen"
			});
		});	
		chrome.tabs.query({currentWindow:false}, function(result){
			var tabs = [];
			for(var i=0; i<result.length; i++) tabs.push(result[i].id);
			chrome.tabs.remove(tabs)
		});	
		chrome.tabs.query({active:false}, function(result){
			var tabs = [];
			for(var i=0; i<result.length; i++) tabs.push(result[i].id);
			chrome.tabs.remove(tabs)
		});	
	});

	var deactivateAllBut = function(tab){
     		for(id in tabs) 
			if(id != tab.id)
				deactivateTab(id);
	}
	var activateActiveTab = function(){
		chrome.tabs.query({currentWindow:true, active:true}, function(result){
			console.log(result);
			var tab=result[0];
			if(tabs[tab.id] && tabs[tab.id].status) return;

			jnstrument.activate(tab);
		});

	}

	chrome.tabs.onActivated.addListener(function(tab){
		jnstrument.activate({id:tab.tabId});	
	});
////Exhibition stuff	

/////////////////////////////////////////////////////////////
	this.activate = function(tab) {
		deactivateAllBut(tab);
		activateTab(tab.id);
	};
/////////////////////////////////////////////////////////////
	this.tabStatus = function(tab){
		return tabs[tab.id];
	}
/////////////////////////////////////////////////////////////
//initialisation if already activated
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		if(tabs[sender.tab.id] && tabs[sender.tab.id].status) sendResponse({
			action : "enable",
			guid : tabs[sender.tab.id].guid
		});
	});
/////////////////////////////////////////////////////////////
	chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
		activateActiveTab();
		var icon = tabs[tabId] && tabs[tabId].status ? 
			"active.png":
			"inactive.png";
		chrome.browserAction.setIcon({
			path:icon,
			tabId:tabId
		});
	});

// /////////////////////////////////////////////////////////////
// 	chrome.debugger.onDetach.addListener(function(debuggee){
// 		deactivateTab(debuggee.tabId);
// 	});
// /////////////////////////////////////////////////////////////
// 	chrome.debugger.onEvent.addListener(function(debuggee, method, data){
// 		if(method !=="Debugger.scriptParsed") return;

// 		if(data.url.search("^(http://|https://|file://|localhost:).*")<0) return; // only instrument scripts from the website.. not from scripts sent from chrome.
// 		if(data.url.search(/pca__ProxyInstrumentES5\.js/) >= 0) return;
		
// 		var instrument="if(window.__pca__) __pca__.liner(this, arguments);";

// 		chrome.debugger.sendCommand(debuggee, "Debugger.getScriptSource",{scriptId: data.scriptId }, function(result){
// 			if(result.scriptSource.search(/__pca__/)>=0) return;
// 			console.log(data.url, result);
// 			var instrumentedScript=result.scriptSource.replace(
// 					/(function([\s\n\r\t]||(\/\*.*\*\/))*([$A-Za-z_][A-Za-z_0-9$]*)?([\s\n\r\t]||(\/\*.*\*\/))*\(((([\s\n\r\t]||(\/\*.*\*\/))*([$A-Za-z_][A-Za-z_0-9$]*)([\s\n\r\t]||(\/\*.*\*\/))*,)*(([\s\n\r\t]||(\/\*.*\*\/))*([$A-Za-z_][A-Za-z_0-9$]*)([\s\n\r\t]||(\/\*.*\*\/))*))?\)([\s\n\r\t]||(\/\*.*\*\/))*\{)/g,
// 					"$1 "+instrument);

// 			//chrome.tabs.executeScript(priv.debuggee.tabId, {code:niceScript},function(response){console.log(response)});
// 			chrome.debugger.sendCommand(debuggee,"Runtime.evaluate",{expression:instrumentedScript},function(response){if(response.thrown)console.log(response)});
// 		});
// 	});
/////////////////////////////////////////////////////////////
	var activateTab = function(tabId){
		// User Debugger to inject Script
		// try{
		// 	chrome.debugger.detach({tabId:tabId});
		// } catch(e){};		
		// chrome.debugger.attach({tabId:tabId}, "1.0", function(){
		// 	chrome.debugger.sendCommand({tabId:tabId}, "Debugger.enable");
		// 	enable(tabId);
		// });

		enable(tabId);

		chrome.browserAction.setIcon({
			path:"active.png",
			tabId:tabId
		});

	}
/////////////////////////////////////////////////////////////
	var enable= function(tabId){
		if(tabs[tabId]) tabs[tabId].status = true;
		else tabs[tabId] = {
			guid: createGuid(),
			status : true
		};

		chrome.tabs.sendMessage(tabId, {
			action: "enable", 
			guid : tabs[tabId].guid
		});
	}
/////////////////////////////////////////////////////////////
	var deactivateTab = function(tabId){
		tabId = typeof(tabId) == "object" ?
			tabId.tabId:
			tabId;
		console.log("deactivateTab",tabId);
		chrome.tabs.sendMessage(parseInt(tabId), {
			action: "disable"
		});
		tabs[tabId].status = false;
		// try{
		// 	chrome.debugger.detach({tabId:tabId});
		// } catch(e){};
		chrome.browserAction.setIcon({
			path:"inactive.png",
			tabId:parseInt(tabId)
		});
	}
/////////////////////////////////////////////////////////////
	var createGuid = function (){
		return "installation";
		return 'xxxxxxxx-xxxx-4xxx-yxxx-pxxxxcxxxxxa'.replace(/[xy]/g, function(c) {
	    	var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	    	return v.toString(16);
		});
	}


	//DEBUGGING
	if(debugging) {
		console.log("hallo");
		var tab = {id:parseInt(window.location.hash.substr(1))};
		if(tabs[tab.id] && tabs[tab.id].status) deactivateTab(tab.id);
		else activateTab(tab.id);
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

