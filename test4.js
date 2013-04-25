

chrome.tabs.getSelected(null, function(tab) { 
	debuggee = {tabId:tab.id};

	try{
		chrome.debugger.attach(debuggee, "1.0", onAttach);	
	}
	catch(e){
		onAttach();
	}
			console.log("hello");

}); 

function instrumentWebsite (_debuggee){
	var priv = {},
			publ = this;
	
	(function constructor (_debuggee) {
		priv.debuggee = _debuggee;
		chrome.debugger.attach(priv.debuggee, "1.0", publ.onAttach);	
	})(_debuggee);


	priv.onAttach = function() {
		chrome.debugger.onEvent.addListener(priv.onEvent);
		chrome.debugger.sendCommand(priv.debuggee, "Debugger.enable");
		// chrome.debugger.sendCommand(debuggee, "Network.enable");	
		//chrome.debugger.sendCommand(debuggee, "Console.enable");	
		// chrome.debugger.sendCommand(debuggee, "Page.enable");
		// chrome.debugger.sendCommand({tabId:tabId}, "Timeline.start");

	}

}

/////////////////////////////////////////////////////////////
function onAttach() {
	chrome.debugger.onEvent.addListener(onEvent);
	chrome.debugger.sendCommand(debuggee, "Debugger.enable");
	// chrome.debugger.sendCommand(debuggee, "Network.enable");	
	//chrome.debugger.sendCommand(debuggee, "Console.enable");	
	// chrome.debugger.sendCommand(debuggee, "Page.enable");
	// chrome.debugger.sendCommand({tabId:tabId}, "Timeline.start");

}

/////////////////////////////////////////////////////////////
function onEvent(tabId, method, data) {
	console.log(method,data);
	
	switch(method) {
		case "Debugger.paused": 
			eventPaused(data); 
		break;
		case "Debugger.scriptParsed": 
			eventscriptParsed(data); 
		break;
	}		
}
/////////////////////////////////////////////////////////////
function eventPaused(data){
//	console.log("eventPaused ---------------------------");
	chrome.debugger.sendCommand(debuggee, "Debugger.resume");
}
/////////////////////////////////////////////////////////////

function eventscriptParsed(data){
	if(data.url == "") return; // only instrument scripts from the website.. not from scripts sent from chrome.
	

	chrome.debugger.sendCommand(debuggee, "Debugger.getScriptSource",{scriptId: data.scriptId }, function(result){
		var script=result.scriptSource.replace(
					/(function[\s\n\r\t]*([$A-Za-z_][A-Za-z_0-9$]*)?[\s\n\r\t]*\(([\s\n\r\t]*([$A-Za-z_][\w$]*)?[\s\n\r\t]*,?)*\)[\s\n\r\t]*{)/g,
					"$1 debugger;"),
				niceScript = js_beautify(script);

//			console.log(niceScript);	
			chrome.debugger.sendCommand(debuggee, "Runtime.evaluate",{expression:niceScript});

	});
}


