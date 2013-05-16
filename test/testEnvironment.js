(function(){
	var myClass = function(value){

		if(this == window) console.log("Static Call");
		else console.log("construct");

		var test = function(){
			console.log("test");
		}
		this.bla=function(){
			console.log("bla");
		}
		this.testBla=function(){

			test();
			this.bla();
		}

	}

	blub = new myClass();
	
setInterval(function(){
	if(!window.__pca__) return;
	
	myClass();
	

	blub.bla();
	blub.testBla();

},1000);	


})();	