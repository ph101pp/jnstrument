chrome.tabs.query({currentWindow:true, active:true}, function(result){
	var tab=result[0],
		bgPage=chrome.extension.getBackgroundPage(),
		activateLink=document.getElementById("activate"),
		deactivateLink=document.getElementById("deactivate"),
		google=document.getElementById("visualizeGoogle"),
		daum=document.getElementById("visualizeDaum"),
		naver=document.getElementById("visualizeNaver"),
		gotoLink=document.getElementById("open"),
		https,
		checkLink = function(){
			if(!window.Proxy) {
				document.body.setAttribute("class", "flags");
				return;
			}
			// else if(tab.url.match(/^https/)) {
			// 	document.body.setAttribute("class", "https");
			// 	return;
			// }
			var status = bgPage.jnstrument.tabStatus(tab);
			if(status && status.status) {
				document.body.setAttribute("class", "active");
			}
			else {
				document.body.setAttribute("class", "deactive");
			}
		},
		openVisualization = function(){
			var status = bgPage.jnstrument.tabStatus(tab);
			if(!status || !status.status) return;
			chrome.windows.create({'url': "http://jnstrument.com/"+status.guid+"/neuron"});
		},
		activate = function(){
			bgPage.jnstrument.activate(tab);
			checkLink();
			openVisualization();
		},
		visualize = function(url){
			chrome.tabs.create({url:url}, function(_tab){
				tab=_tab;
				activate();
			});
		};

	checkLink();

	activateLink.addEventListener("click", activate);
	deactivateLink.addEventListener("click", activate);
	google.addEventListener("click", function(){
		visualize("http://www.google.com");
	});
	daum.addEventListener("click", function(){
		visualize("http://www.daum.net");
	});
	naver.addEventListener("click", function(){
		visualize("http://www.naver.com");
	});
	gotoLink.addEventListener("click", function(){
		openVisualization();
	});

	window.addEventListener("blur", function(){
		window.close();
	})


});