chrome.tabs.query({currentWindow:true, active:true}, function(result){
	var tab=result[0];
	var bgPage=chrome.extension.getBackgroundPage();
	var activateLink=document.getElementById("activate");
	var gotoLink=document.getElementById("goto");

	var checkGoToLink = function(){
		var status = bgPage.jnstrument.tabStatus(tab);
		if(status &&status.status) gotoLink.style.display="block";
		else gotoLink.style.display="none";
	}
	checkGoToLink();

	var openVisualization = function(){
		var status = bgPage.jnstrument.tabStatus(tab);
		if(!status || !status.status) return;
		window.open("http://jnstrument.com/neuron/"+status.guid,"_blank");
	}

	activateLink.addEventListener("click", function(){
		bgPage.jnstrument.activate(tab);
		checkGoToLink();
		openVisualization();
	});

	gotoLink.addEventListener("click", function(){
		openVisualization();
	});

	window.addEventListener("blur", function(){
		window.close();
	})


});