(function(window, document, undefined){
	function __pca__Instrument() {
			if (this == window) return new __pca__Instrument(); // has to be called as Constructor
/*//////////////////////////////////////////////////////////////////////////////
	Private Properties
/*//////////////////////////////////////////////////////////////////////////////
			var objIndex = 0;
			var maxDepth=3;
			var doInstrument = ["object", "function"];
			var dontInstrument = [document, window.location, "Proxy", "Reflect", "indexOf", console, "console", "__pca__", window.chrome, null, "prototype"];
			var windowProxied=false;
/*//////////////////////////////////////////////////////////////////////////////
	Public Properties
/*//////////////////////////////////////////////////////////////////////////////
/*//////////////////////////////////////////////////////////////////////////////
	Private Methods
/*//////////////////////////////////////////////////////////////////////////////
			var sendData = function (data) {
				console.debug(data);
			}

/*//////////////////////////////////////////////////////////////////////////////
	Public Methods
/*//////////////////////////////////////////////////////////////////////////////
			this.wrapper = function (obj, depth, parent, name) {
				if(dontInstrument.indexOf(obj) >= 0 || dontInstrument.indexOf(name) >= 0 || doInstrument.indexOf(typeof(obj)) < 0 || depth <= 1 || (obj == window && windowProxied)) return obj;
				
				if(obj == window) windowProxied=true;
				var doIt;

				for(var p in obj){
					try{
						doIt = dontInstrument.indexOf(p) < 0 && dontInstrument.indexOf(obj[p]) <0 && doInstrument.indexOf(typeof(obj[p])) >=0 ?
							true:false;
					} catch(e){ doIt=false; console.debug(e);}
					if(doIt) obj[p]=this.wrapper(obj[p], (depth >=0 ? depth-1 : maxDepth) , obj, p);
				}
//console.debug("__________________________________________________________","proxied",obj.__pca__Proxied, objIndex);
				
				if(obj.__pca__Proxied) return obj;
				else return Proxy(obj, {
					get: function(obj, name) {
						if(name == "__pca__objInfo") return this.__pca__objInfo;
						if(name == "__pca__objIndex") return this.__pca__objIndex;
						if(name == "__pca__Proxied") return true;

						//console.log("Proxie","get", this.__pca__objIndex);
						return Reflect.get(obj, name);
					},
					set: function(obj, name, value) {
						if(name === "__pca__objInfo") {
							this.__pca__objInfo=value;
							return;
						}
					//	console.log("Proxie","set", this.__pca__objIndex);
						return Reflect.set(obj, name, value);
					}, 
					apply: function(method, _this, arguments) {
						console.debug("Proxie","apply", this.__pca__objIndex);
						return Reflect.apply(method, _this, arguments);
					},
					construct: function(method, arguments) {
						console.debug("Proxie","construct", this.__pca__objIndex);
						return __pca__.wrapper(Reflect.construct(method, arguments));
					},
					__pca__objIndex:objIndex++
				});

			}
///////////////////////////////////////////////////////////////////////////////
	}
	__pca__=__pca__Instrument();
	__pca__.wrapper(window);
})(window, document);