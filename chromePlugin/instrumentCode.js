function InstrumentCode(_debuggee){
/////////////////////////////////////////////////////////////
	var priv = {};
	var	publ = this;
/////////////////////////////////////////////////////////////
	priv.debuggee = null;
	publ.runtimeData = [];
/////////////////////////////////////////////////////////////
// constructor
	if(publ == window) return new InstrumentCode(_debuggee);
	else {
		priv.debuggee = _debuggee;
		chrome.debugger.attach(priv.debuggee, "1.0", priv.onAttach.bind(this));	
	}
///////////////////////////////////////////////////////////// 
	priv.onAttach = function() {
		chrome.debugger.sendCommand(priv.debuggee, "Debugger.enable");
		chrome.debugger.onEvent.addListener(priv.onEvent.bind(this));
		chrome.debugger.onDetach.addListener(priv.eventDetached.bind(this));
	}
/////////////////////////////////////////////////////////////
	priv.onEvent = function(tabId, method, data) {
		switch(method) {
			case "Debugger.paused": 
				priv.eventPaused(data); 
			break;
			case "Debugger.scriptParsed": 
				priv.eventscriptParsed(data); 
			break;
		}		
		//console.log(tabId,method,data);

	}
/////////////////////////////////////////////////////////////	priv.eventscriptParsed = function(data){
		if(data.url.search("^(http://|https://|file://|localhost:).*")<0) return; // only instrument scripts from the website.. not from scripts sent from chrome.
		var addFunction="if(!window) window=null;	if(!this) this=null;	chrome.runtime.sendMessage(this);";
		addFunction="debugger;";
		chrome.debugger.sendCommand(priv.debuggee, "Debugger.getScriptSource",{scriptId: data.scriptId }, function(result){
			var instrumentedScript=result.scriptSource.replace(
						/(function[\s\n\r\t]*([$A-Za-z_][A-Za-z_0-9$]*)?[\s\n\r\t]*\(([\s\n\r\t]*([$A-Za-z_][\w$]*)?[\s\n\r\t]*,?)*\)[\s\n\r\t]*{)/g,
						"$1 "+addFunction),
					niceScript = js_beautify(instrumentedScript);
			console.log(niceScript);
			//chrome.tabs.executeScript(priv.debuggee.tabId, {code:niceScript},function(response){console.log(response)});
			chrome.debugger.sendCommand(priv.debuggee,"Runtime.evaluate",{expression:niceScript},function(response){if(response.thrown)console.log(response)});

		});
	}
/////////////////////////////////////////////////////////////
}