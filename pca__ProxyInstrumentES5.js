var Forwarder = function(){
  var _slice  = Array.prototype.slice,
      _bind   = Function.prototype.bind,
      _apply  = Function.prototype.apply,
      _hasOwn = Object.prototype.hasOwnProperty;

  function Forwarder(target){
    this.target = target;
  }

  Forwarder.prototype = {
    getOwnPropertyNames: function(){
      return Object.getOwnPropertyNames(this.target);
    },
    keys: function(){
      return Object.keys(this.target);
    },
    enumerate: function(){
      var i=0, keys=[];
      for (keys[i++] in this.target);
      return keys;
    },
    getPropertyDescriptor: function(key){
      var o = this.target;
      while (o) {
        var desc = Object.getOwnPropertyDescriptor(o, key);
        if (desc) {
          desc.configurable = true;
          return desc;
        }
        o = Object.getPrototypeOf(o);
      }
    },
    getOwnPropertyDescriptor: function x(key){
      var desc = Object.getOwnPropertyDescriptor(this.target, key);
      if (desc) {
        desc.configurable = true;
        return desc;
      }
      return desc;
    },
    defineProperty: function(key, desc){
      return Object.defineProperty(this.target, key, desc);
    },
    get: function get(receiver, key){
      return this.target[key];
    },
    set: function set(receiver, key, value){
      this.target[key] = value;
      return true;
    },
    has: function has(key){
      return key in this.target;
    },
    hasOwn: function(key){
      return _hasOwn.call(this.target, key);
    },
    delete: function(key){
      delete this.target[key];
      return true;
    },
    apply: function(receiver, args){
      return _apply.call(this.target, receiver, args);
    },
    construct: function(args){
      return new (_bind.apply(this.target, [null].concat(args)));
    }
  };

  // function forward(target, overrides){
  //   var handler = new Forwarder(target);
  //   for (var k in Object(overrides)) {
  //     handler[k] = overrides[k];
  //   }
  //   return typeof target === 'function'
  //     ? Proxy.createFunction(handler,
  //         function(){ return handler.apply(this, _slice.call(arguments)) },
  //         function(){ return handler.construct(_slice.call(arguments)) })
  //     : Proxy.create(handler, Object.getPrototypeOf(Object(target)));
  // }

  return Forwarder;
}();

(function(window, document, undefined){
	function __pca__Instrument() {
			if (this == window) return new __pca__Instrument(); // has to be called as Constructor
/*//////////////////////////////////////////////////////////////////////////////
	Private Properties
/*//////////////////////////////////////////////////////////////////////////////
			var objIndex = 0;
			var maxDepth=3;
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
					var objIsNot = [document, setTimeout, clearTimeout, getComputedStyle, null, console];
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

				 
				if(typeof(obj) != "function" || obj.__pca__Proxied) return obj;

				Object.defineProperty(obj,"__pca__Proxied", {
					value: true,
				});
				Object.defineProperty(obj,"__pca__objIndex", {
					value: objIndex++,
				});

				return Proxy.createFunction(new Forwarder(obj), function(){
						console.log("Call", arguments, obj.__pca__objIndex);
						return obj.apply(this, arguments);
					},
					function(){
						console.log("Construct", arguments, obj.__pca__objIndex);
						
						Array.prototype.unshift.call(arguments, null);
						return __pca__.wrapper(new (Function.prototype.bind.apply(obj, arguments))); 
						
					});


			}
///////////////////////////////////////////////////////////////////////////////
	}
	__pca__=__pca__Instrument();
	__pca__.wrapper(window);
	console.debug("Window Instrumented");

})(window, document);