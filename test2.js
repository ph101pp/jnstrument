
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
	chrome.debugger.sendCommand(debuggee, "Debugger.enable", undefined, function(){
		chrome.debugger.sendCommand(debuggee, "Debugger.canSetScriptSource", undefined, function(result){
				console.log(result);
				chrome.debugger.onEvent.addListener(onScriptParsed);
				chrome.debugger.sendCommand(debuggee, "Page.reload", {ignoreCache : true});
		});
	});
}


function onScriptParsed(tabId, method, data) {
	if(method != "Debugger.scriptParsed") return;


	chrome.debugger.sendCommand(debuggee, "Debugger.getScriptSource",{scriptId: data.scriptId }, function(result){
		
		niceScript=js_beautify(result.scriptSource);
		//console.log("NICE",niceScript);
		chrome.debugger.sendCommand(debuggee, "Debugger.setScriptSource",{scriptId: data.scriptId , scriptSource: niceScript}, function(test){
			console.log("SET",test);
			chrome.debugger.sendCommand(debuggee, "Debugger.getScriptSource",{scriptId: data.scriptId }, function(result2){
				console.log("GOT",result2.scriptSource);

			});

		});

	});


}



