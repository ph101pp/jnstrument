function InstrumentCode(_debuggee){
/////////////////////////////////////////////////////////////
	var priv = {},
			publ = this;
/////////////////////////////////////////////////////////////
	priv.debuggee = null;

///////////////////////////////////////////////////////////// 
	priv.onAttach = function() {
		console.log("Debugger attached");
		chrome.debugger.onEvent.addListener(priv.onEvent.bind(this));
		chrome.debugger.onDetach.addListener(priv.eventDetached.bind(this));
		chrome.debugger.sendCommand(priv.debuggee, "Debugger.enable");
		// chrome.debugger.sendCommand(priv.debuggee, "Network.enable");	
		// chrome.debugger.sendCommand(priv.debuggee, "Console.enable");	
		// chrome.debugger.sendCommand(priv.debuggee, "Page.enable");
		// chrome.debugger.sendCommand(priv.debuggee, "Timeline.start");

	}
/////////////////////////////////////////////////////////////
	priv.onEvent = function(tabId, method, data) {
		//console.log(method,data);
		switch(method) {
			case "Debugger.paused": 
				priv.eventPaused(data); 
			break;
			case "Debugger.scriptParsed": 
				priv.eventscriptParsed(data); 
			break;
		}		
	}
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
	priv.eventPaused = function (data){
	//	console.log("eventPaused ---------------------------");
	//	chrome.debugger.sendCommand(priv.debuggee, "Debugger.stepInto");
		chrome.debugger.sendCommand(priv.debuggee, "Debugger.resume");
	}
/////////////////////////////////////////////////////////////
	priv.eventDetached = function (){
		console.log("detached");
			var popup = window.open("","pcaVisualization_"+priv.debuggee.tabId,'height=500,width=700');
			popup.close();
	}
/////////////////////////////////////////////////////////////
	priv.eventscriptParsed = function(data){
		if(data.url == "") return; // only instrument scripts from the website.. not from scripts sent from chrome.

		chrome.debugger.sendCommand(priv.debuggee, "Debugger.getScriptSource",{scriptId: data.scriptId }, function(result){
			var instrumentedScript=result.scriptSource.replace(
						/(function[\s\n\r\t]*([$A-Za-z_][A-Za-z_0-9$]*)?[\s\n\r\t]*\(([\s\n\r\t]*([$A-Za-z_][\w$]*)?[\s\n\r\t]*,?)*\)[\s\n\r\t]*{)/g,
						"$1 debugger;"),
					niceScript = js_beautify(instrumentedScript);

	//			console.log(niceScript);	
				chrome.debugger.sendCommand(priv.debuggee, "Runtime.evaluate",{expression:niceScript});

		});
	}
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
// constructor
	if(publ == window) return new InstrumentCode(_debuggee);
	else {
		priv.debuggee = _debuggee;
		chrome.debugger.attach(priv.debuggee, "1.0", priv.onAttach.bind(this));	
	}
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
}