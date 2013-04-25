// chrome.tabs.getSelected(null, function(tab) { 
// 	debuggee = {tabId:tab.id};
// 	new instrumentCode(debuggee);
// }); 
chrome.browserAction.onClicked.addListener(function(tab) {
	var debuggee = {tabId:tab.id};
	var instrumentation = new instrumentCode(debuggee);


});


function instrumentCode(_debuggee){
/////////////////////////////////////////////////////////////
	var priv = {},
			publ = this;
/////////////////////////////////////////////////////////////
	priv.debuggee = null;

/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
// constructor
	if(publ == window) return new instrumentCode(_debuggee);
	else {
		priv.debuggee = _debuggee;
		chrome.debugger.attach(priv.debuggee, "1.0", publ.onAttach);	
	}
/////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////// 
	priv.onAttach = function() {
		chrome.debugger.onEvent.addListener(priv.onEvent);
		chrome.debugger.sendCommand(priv.debuggee, "Debugger.enable");
		// chrome.debugger.sendCommand(debuggee, "Network.enable");	
		// chrome.debugger.sendCommand(debuggee, "Console.enable");	
		// chrome.debugger.sendCommand(debuggee, "Page.enable");
		// chrome.debugger.sendCommand({tabId:tabId}, "Timeline.start");

	}
/////////////////////////////////////////////////////////////
	priv.onEvent = function(tabId, method, data) {
		console.log(method,data);
		switch(method) {
			case "Debugger.paused": 
				publ.eventPaused(data); 
			break;
			case "Debugger.scriptParsed": 
				publ.eventscriptParsed(data); 
			break;
		}		
	}
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
	publ.eventPaused = function (data){
	//	console.log("eventPaused ---------------------------");
		chrome.debugger.sendCommand(debuggee, "Debugger.resume");
	}
/////////////////////////////////////////////////////////////
	publ.eventscriptParsed = function(data){
		if(data.url == "") return; // only instrument scripts from the website.. not from scripts sent from chrome.

		chrome.debugger.sendCommand(debuggee, "Debugger.getScriptSource",{scriptId: data.scriptId }, function(result){
			var instrumentedScript=result.scriptSource.replace(
						/(function[\s\n\r\t]*([$A-Za-z_][A-Za-z_0-9$]*)?[\s\n\r\t]*\(([\s\n\r\t]*([$A-Za-z_][\w$]*)?[\s\n\r\t]*,?)*\)[\s\n\r\t]*{)/g,
						"$1 debugger;"),
					niceScript = js_beautify(instrumentedScript);

	//			console.log(niceScript);	
				chrome.debugger.sendCommand(debuggee, "Runtime.evaluate",{expression:niceScript});

		});
	}
/////////////////////////////////////////////////////////////
}


