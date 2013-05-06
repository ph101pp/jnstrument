		(function(){
			myClass = function(value){
				var priv = {};
				var publ = this;

				priv.status = "uninitialized";
				priv.value = undefined;
				publ.getStatus = function() { console.log(priv.status);}; publ.doSomething = function() { console.log("this is my value: "+priv.value);priv.status = "done";};
				
				
				if(this == window) console.log("Static MyClass '"+priv.value+"'");

				priv.status="initialized";
				priv.value=value;

			}

			myClass("test");
			var clss = new myClass("test");
			clss.getStatus();
			clss.doSomething();
			clss.getStatus();
			console.log("fertig");

			console.log(window);
		})();	