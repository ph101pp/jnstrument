(function(window, document, undefined){
	function __pca__Instrument() {
			if (this == window) return new __pca__Instrument(); // has to be called as Constructor
/*//////////////////////////////////////////////////////////////////////////////
	Private Properties
/*//////////////////////////////////////////////////////////////////////////////
			var objIndex = 0;
			var maxDepth=4;
/*//////////////////////////////////////////////////////////////////////////////
	Public Properties
/*//////////////////////////////////////////////////////////////////////////////
/*//////////////////////////////////////////////////////////////////////////////
	Private Methods
/*//////////////////////////////////////////////////////////////////////////////
			var sendData = function (data) {
				//console.debug(data);
			}
///////////////////////////////////////////////////////////////////////////////
			var testObject = function(obj, name, parent) {
				try{
					var nameIsNot = ["Proxy", "Reflect", "__pca__", "toString", "__pca__Proxied", "prototype"];
					var objIsNot = [document,setTimeout, clearTimeout,getComputedStyle, null, console];
					var isNotInstancesOf = [console.constructor, window.location.constructor];
					var typeIs = ["object", "function"];


					
					// if(constructedFrom(parent, window.constructor)) { 
					// 	isNotInstancesOf.push(parent.location.constructor);
					// 	objIsNot.push(parent.chrome);
					// }

					// if not main "document"
					if((constructedFrom(parent, document.constructor) && parent != document ) || (constructedFrom(obj, document.constructor) && obj != document)) return false;
					if((constructedFrom(parent, window.constructor) && parent != window ) || (constructedFrom(obj, window.constructor) && obj != window)) return false;

					if(nameIsNot.indexOf(name) >= 0 ) return false;
					if(objIsNot.indexOf(obj) >= 0 ) return false;

					for(var i=0; i<isNotInstancesOf.length; i++) 
						if(obj instanceof isNotInstancesOf[i]) return false

				
					if(typeIs.indexOf(typeof(obj)) < 0) return false;

					if(parent) parent[name] = (function(){return obj;})(); // trigger dom exception etc
					else obj = (function(){return obj;})(); // trigger dom exception etc

					return true;
				}
				catch(e) {
					return false;
				}
			}
///////////////////////////////////////////////////////////////////////////////
			var constructedFrom = function(_obj, _constructor) {
				return _obj && _obj.constructor && (_obj instanceof _constructor || _obj.constructor.toString() == _constructor.toString()) ?
					true:false;
			}
///////////////////////////////////////////////////////////////////////////////
			var windowObjectProxy = function(obj) {
				if(!constructedFrom(obj,window.constructor)) return obj;
				Object.defineProperty(obj,"__pca__Proxied", {
					writable:true,
					value: function(){return true},
				});
				return obj;
			}
/*//////////////////////////////////////////////////////////////////////////////
	Public Methods
/*//////////////////////////////////////////////////////////////////////////////
			this.wrapper = function (obj, depth, parent, name) {
				if(!parent && !testObject(obj,name, parent)) return obj;

				if((depth = depth || maxDepth) > 1) 
          for(var p in obj) {
            var test = testObject(obj[p],p,obj);
            if(test) obj[p] = this.wrapper(obj[p], depth-1 , obj, p);
          }
          
				if(obj.__pca__Proxied && obj.__pca__Proxied()) return obj;
				return windowObjectProxy( Proxy(obj, { 
						apply: function(method, _this, arguments) {
							if(method == "__pca__Proxied") return true;
							if(method == "__pca__objInfo") return this.__pca__objInfo;
							if(method == "__pca__objIndex") return this.__pca__objIndex;

								//window.console.debug("Apply", this.__pca__objIndex);
							return Reflect.apply(method, _this, arguments);
						},
						construct: function(method, arguments) {
								//window.console.debug("Construct", this, method);
							//window.console.debug("Construct", this.__pca__objIndex);
							return __pca__.wrapper(Reflect.construct(method, arguments));
						},
						__pca__objIndex:objIndex++
					}));
			}
///////////////////////////////////////////////////////////////////////////////
	}
	__pca__=__pca__Instrument();
	__pca__.wrapper(window);
	console.debug("Window Instrumented");

})(window, document);