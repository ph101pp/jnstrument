
var debuggee = null;
var instrumented =false;
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
	chrome.debugger.onEvent.addListener(onEvent);
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
		if(method== "Debugger.scriptParsed" && !instrumented) eventscriptParsed(data);
		
}
/////////////////////////////////////////////////////////////
function eventPaused(data){
	console.log("eventPaused ---------------------------");
		//chrome.debugger.sendCommand(debuggee, "Debugger.resume");
}

function eventscriptParsed(data){
	if(data.url == "") return;
	

	chrome.debugger.sendCommand(debuggee, "Debugger.getScriptSource",{scriptId: data.scriptId }, function(result){
		var niceScript=result.scriptSource.replace(
			/(function[\s\n\r\t]*([$A-Za-z_][A-Za-z_0-9$]*)?[\s\n\r\t]*\(([\s\n\r\t]*([$A-Za-z_][\w$]*)?[\s\n\r\t]*,?)*\)[\s\n\r\t]*{)/g
			,"$1 debugger;");
		
		niceScript=js_beautify(niceScript);

		chrome.debugger.sendCommand(debuggee, "Debugger.setScriptSource",{scriptId: data.scriptId , scriptSource: niceScript}, function(){
			instrumented=true;


			chrome.debugger.sendCommand(debuggee, "Debugger.searchInContent", {scriptId:data.scriptId,query:'debugger;'}, function(result3){
					console.log("Found AFTER in "+data.scriptId,result3);
						chrome.debugger.sendCommand(debuggee, "Page.reload");
				});

		
		});
			

	

	});

	
}
/////////////////////////////////////////////////////////////
function initialPause(response) {
	console.log("initialPause");
}


