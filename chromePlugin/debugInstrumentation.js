function InstrumentCode(_debuggee){
/////////////////////////////////////////////////////////////
	var priv = {};
	var	publ = this;
/////////////////////////////////////////////////////////////
	priv.debuggee = null;
	publ.runtimeData = [];

///////////////////////////////////////////////////////////// 
	priv.onAttach = function() {
		chrome.debugger.sendCommand(priv.debuggee, "Debugger.enable");
		chrome.debugger.onEvent.addListener(priv.onEvent.bind(this));
		chrome.debugger.onDetach.addListener(priv.eventDetached.bind(this));

		chrome.runtime.onMessage.addListener(priv.onEvent.bind(this));
		// chrome.runtime.onConnect.addListener(function(port) {
		// 	console.log("Connected",port);
		// });
		// chrome.debugger.sendCommand(priv.debuggee, "Runtime.evaluate",{expression:"pcaPort = chrome.runtime.connect({name: 'pcaVisualization'});"},function(response){console.log(response)});

//		chrome.debugger.sendCommand(priv.debuggee, "Console.enable");	
		// chrome.debugger.sendCommand(priv.debuggee, "Network.enable");	
		// chrome.debugger.sendCommand(priv.debuggee, "Page.enable");
		// chrome.debugger.sendCommand(priv.debuggee, "Timeline.start");

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
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
	priv.eventPaused = function (data){
	//	console.log("eventPaused ---------------------------");
	//	chrome.debugger.sendCommand(priv.debuggee, "Debugger.stepInto");
	relevantData=[];
	flag=true;
	for(var i=0; i<data.callFrames.length; i++)
		if(data.callFrames[i].functionName.search("^(InjectedScript\.).*") <0) {
			
			thisFrame=data.callFrames[i];

			if(thisFrame.functionName=="publ.getStatus") {
				flag=false;
				console.log(thisFrame);
				chrome.debugger.sendCommand(priv.debuggee, "Runtime.getProperties", {objectId:thisFrame.this.objectId,ownProperties:true}, function(got){console.log("Properties", got);}.bind(this));
				chrome.debugger.sendCommand(priv.debuggee, "Runtime.getProperties", {objectId:thisFrame.scopeChain[0].object.objectId,ownProperties:true}, function(got){console.log("Scope Local", got);}.bind(this));
				chrome.debugger.sendCommand(priv.debuggee, "Runtime.getProperties", {objectId:thisFrame.scopeChain[1].object.objectId,ownProperties:true}, function(got){console.log("Scope Closure", got);}.bind(this));
				chrome.debugger.sendCommand(priv.debuggee, "Runtime.getProperties", {objectId:thisFrame.scopeChain[2].object.objectId,ownProperties:true}, function(got){console.log("Scope Global", got);}.bind(this));
			}

			relevantData.push(data.callFrames[i]);
		}

	if(flag) chrome.debugger.sendCommand(priv.debuggee, "Debugger.resume");


	console.log(relevantData);
	//	setTimeout(function(){chrome.debugger.sendCommand(priv.debuggee, "Debugger.resume")}, 0);
	}
/////////////////////////////////////////////////////////////
	priv.eventDetached = function(){
		window.close();
	}	
	publ.eventClosed = function(){
		confirm("hallo");
		chrome.debugger.detach(priv.debuggee);
	}
/////////////////////////////////////////////////////////////
	priv.eventscriptParsed = function(data){
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