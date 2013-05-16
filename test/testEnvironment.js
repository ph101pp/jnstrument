(function(){
	var myClass = function(value){
		if(window.__pca__) __pca__.liner(this, arguments);

		if(this == window) console.log("Static Call");
		else console.log("construct");

		var test = function(){
			if(window.__pca__) __pca__.liner(this, arguments);
			console.log("test");
		}
		this.bla=function(){
			if(window.__pca__) __pca__.liner(this, arguments);
			console.log("bla");
		}
		this.testBla=function(){
			if(window.__pca__) __pca__.liner(this, arguments);

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

},5000);	


})();	