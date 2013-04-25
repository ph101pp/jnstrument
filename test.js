
var debuggee = null;
var debuggerContinue = false;

chrome.tabs.getSelected(null, function(tab) { 
	if(debuggee && debuggee.tabId == tab.id) onAttach(tab.id);
	else {
		if(debuggee) chrome.debugger.detach(debuggee, attachDebugger.bind(null, tab.id));
		else attachDebugger(tab.id);
	}
}); 

chrome.debugger.onDetach.addListener(onDetach);
/////////////////////////////////////////////////////////////
function onDetach(){
	debuggee = null;	
}
/////////////////////////////////////////////////////////////
function attachDebugger(tabId) {
	chrome.debugger.attach({tabId:tabId}, "1.0", onAttach.bind(null, tabId));	
}
/////////////////////////////////////////////////////////////
function onAttach(tabId) {
	debuggee = {tabId:tabId};
	console.log("pausing");
	chrome.debugger.sendCommand(debuggee, "Debugger.enable");
	chrome.debugger.sendCommand(debuggee, "Network.enable");	
	chrome.debugger.sendCommand(debuggee, "Console.enable");	
//	chrome.debugger.sendCommand({tabId:tabId}, "Timeline.start");
	chrome.debugger.sendCommand(debuggee, "Page.enable", undefined, initialPause);


}

/////////////////////////////////////////////////////////////
function onEvent(tabId, method, data) {
	console.log(method,data);
	
	 if(method== "Debugger.paused") eventPaused(data);
	// if(method== "Debugger.scriptParsed") eventscriptParsed(data);
		
}
/////////////////////////////////////////////////////////////
function eventPaused(data){
	console.log("eventPaused ---------------------------");

	
		chrome.debugger.sendCommand(debuggee, "Debugger.resume");
}

function eventscriptParsed(data){
	if(data.url == "") return;
	chrome.debugger.sendCommand(debuggee, "Debugger.getScriptSource", {scriptId:data.scriptId}, function(result){
		console.log("Script in "+data.scriptId,result);
	});


	chrome.debugger.sendCommand(debuggee, "Debugger.getScriptSource",{scriptId: data.scriptId }, function(result){
		chrome.debugger.sendCommand(debuggee, "Debugger.searchInContent", {scriptId:data.scriptId,query:'function[\\s\\n\\r\\t]*([$A-Za-z_][\\w$]*)?[\\s\\n\\r\\t]*\\(([\\s\\n\\r\\t]*([$A-Za-z_][\\w$]*)?[\\s\\n\\r\\t]*,?)*\\)[\\s\\n\\r\\t]*{', isRegex:true }, function(result2){
	//	chrome.debugger.sendCommand(debuggee, "Debugger.searchInContent", {scriptId:data.scriptId,query:'function', isRegex:true }, function(result){
			console.log("Found BEFORE in "+data.scriptId,result2);
		

			var niceScript=js_beautify(result.scriptSource);
			console.log("NICE", niceScript);
			//console.log("NICE",niceScript);
			chrome.debugger.sendCommand(debuggee, "Debugger.setScriptSource",{scriptId: data.scriptId , scriptSource: niceScript}, function(test){
				console.log("TEST",test);
				chrome.debugger.sendCommand(debuggee, "Debugger.searchInContent", {scriptId:data.scriptId,query:'function[\\s\\n\\r\\t]*([$A-Za-z_][\\w$]*)?[\\s\\n\\r\\t]*\\(([\\s\\n\\r\\t]*([$A-Za-z_][\\w$]*)?[\\s\\n\\r\\t]*,?)*\\)[\\s\\n\\r\\t]*{', isRegex:true }, function(result3){
					console.log("Found AFTER in "+data.scriptId,result3);
				});
			});


		});		
		

	});

	
}
/////////////////////////////////////////////////////////////
function initialPause(response) {
	console.log("initialPause");
	chrome.debugger.onEvent.addListener(onEvent);
	chrome.debugger.sendCommand(debuggee, "Page.reload", {ignoreCache : true}, reloaded);
}
/////////////////////////////////////////////////////////////
function reloaded() {
	return;
	console.log("reloaded");
	chrome.debugger.sendCommand(debuggee, "Debugger.pause");

}

/////////////////////////////////////////////////////////////




function scriptParsed(tabId, data) {
	


}
/////////////////////////////////////////////////////////////
function setBreakpoints(result){
	console.log("SET BREAKPOINTS");

	console.log(result);
//	chrome.debugger.sendCommand(debuggee, "Debugger.stepInto");
	//		chrome.debugger.sendCommand(debuggee, "Debugger.resume");


}

