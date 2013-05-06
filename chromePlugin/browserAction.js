chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.executeScript(
  		null, 
  		{
  			code:"document.write('\<script\> alert(\"red\"); \</script\>'"
  		}
  );
});
