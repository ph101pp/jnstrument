///////////////////////////////////////////////////////////////////////////////
(function(window, document, undefined){
	var __pca__Instrument = function() {
		if (this == window) return new __pca__Instrument(); // has to be called as Constructor
/*//////////////////////////////////////////////////////////////////////////////
	Private Properties
/*//////////////////////////////////////////////////////////////////////////////
		var objIndex = 0;
		var maxDepth=3;
		var connection;
		var guid;
		var enabled=false;
/*//////////////////////////////////////////////////////////////////////////////
	Public Properties
/*//////////////////////////////////////////////////////////////////////////////
/*//////////////////////////////////////////////////////////////////////////////
	Private Methods
/*//////////////////////////////////////////////////////////////////////////////
		var sendData = function (event, proxy, method, args, _this) {
			//console.debug(event, proxy.__pca__objIndex, args, method);
			if(connection && enabled) connection.emit('__pca__Event', {
				event: event,
				args:args.toString(),
				id : proxy.__pca__objIndex
			}, function(data){
				console.log(data);
			});
		}
///////////////////////////////////////////////////////////////////////////////
		var testObject = function(obj, name, parent) {
			try{
				var nameIsNot = ["Proxy",  "__pca__", "toString", "__pca__Proxied", "prototype"];
				var objIsNot = [document, window.WebSocket.prototype.send, setTimeout, clearTimeout, getComputedStyle, null, console];
				var isNotInstancesOf = [console.constructor, window.location.constructor];
				var typeIs = ["object", "function"];

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
				value: true,
			});
			return obj;
		}
///////////////////////////////////////////////////////////////////////////////
		  var Reflect = function(target){
		    this.target = target;
		  }

		  Reflect.prototype = {
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
				get : function get(receiver, key){
					if(key == "__pca__Proxied") return true;
					if(key == "__pca__objInfo") return this.__pca__objInfo;
					if(key == "__pca__objIndex") return this.__pca__objIndex;

					return this.target[key];
				},
		    set: function set(receiver, key, value){
		    	if(key == "__pca__objInfo") this[key] = value;
		      else this.target[key] = value;
		      return true;
		    },
		    has: function has(key){
		      return key in this.target;
		    },
		    hasOwn: function(key){
		      return Object.prototype.hasOwnProperty.call(this.target, key);
		    },
		    delete: function(key){
		      delete this.target[key];
		      return true;
		    },
				apply : function(_this, args){
					sendData("Apply", this, this.target, args, _this);
					return Function.prototype.apply.call(this.target, _this, args);
				},
				construct : function(args){
					sendData("Construct", this, this.target, args);
					Array.prototype.unshift.call(args, null);
					return wrapper(new (Function.prototype.bind.apply(this.target, args))); 	
				},
	  	};
///////////////////////////////////////////////////////////////////////////////
		var _Proxy = function(target, overrides){
			var handler = new Reflect(target);
			for (var k in Object(overrides)) handler[k] = overrides[k];
				
			return typeof target === 'function'?
				Proxy.createFunction(handler,
					function(){ return handler.apply(this, arguments) },
					function(){ return handler.construct(arguments) }): 
				Proxy.create(handler, Object.getPrototypeOf(Object(target)));
		}
///////////////////////////////////////////////////////////////////////////////
		var setCookie = function (name, value, days) {
			if (days) {
				var date = new Date();
				date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
				var expires = "; expires=" + date.toGMTString();
			}
			else var expires = "";
			document.cookie = name + "=" + value + expires + "; path=/";
		}
///////////////////////////////////////////////////////////////////////////////
		var getCookie = function (c_name) {
			if (document.cookie.length > 0) {
				c_start = document.cookie.indexOf(c_name + "=");
				if (c_start != -1) {
					c_start = c_start + c_name.length + 1;
					c_end = document.cookie.indexOf(";", c_start);
					if (c_end == -1) {
						c_end = document.cookie.length;
					}
					return unescape(document.cookie.substring(c_start, c_end));
				}
			}
			return "";
		}
///////////////////////////////////////////////////////////////////////////////
		var wrapper = function (obj, depth, parent, name) {
			if(!parent && !testObject(obj,name, parent)) return obj;

			if((depth = depth || maxDepth) > 1) 
				for(var p in obj)
					if(testObject(obj[p],p,obj)) {
						obj[p] = wrapper(obj[p], depth-1 , obj, p);
			 		}
			if(typeof(obj) !== "function" || obj.__pca__Proxied) return obj;

			return windowObjectProxy( _Proxy(obj,{
				__pca__objIndex:objIndex++
			}));
		}
///////////////////////////////////////////////////////////////////////////////
		var setupConnection = function(){
			//connection = require("socket.io-client").connect('http://greenish.eu01.aws.af.cm/');
			connection = require("socket.io-client").connect('http://localhost:8000/');
			
			connection.emit("__pca__Connect_Sender",{guid:guid, source: window.location.href}, function(data){
				alert("Link to Visualization:\n "+data.url+data.guid);
			});
		}
///////////////////////////////////////////////////////////////////////////////
		var init = function(_guid){
			guid = _guid;
			wrapper(window);
			setupConnection();
			console.debug("Window Instrumented");		
		}	
/*//////////////////////////////////////////////////////////////////////////////
	Public Methods
/*//////////////////////////////////////////////////////////////////////////////
		this.disable = function (){
			enabled=false;
		}
///////////////////////////////////////////////////////////////////////////////
		this.enable = function(_guid){
			enabled=true;
			if(!connection) init(_guid);
		}
///////////////////////////////////////////////////////////////////////////////
	}
///////////////////////////////////////////////////////////////////////////////
	window.WEB_SOCKET_SWF_LOCATION = "http://greenish.eu01.aws.af.cm/socket.io/WebSocketMain.swf";
	__pca__= new __pca__Instrument();
	if(typeof(__pca__UpdateScript) === "function") __pca__UpdateScript();
})(window, document);