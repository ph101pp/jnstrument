/* Instrument Userscript Snippet: function(){ ...

  if(__pca__) {
      var __pca__liner = __pca__.liner(this, arguments);
      if(__pca__liner) return __pca__liner;
  };
*/
(function(window, document, undefined){
  function __pca__Instrument() {
      if (this == window) return new __pca__Instrument(); // has to be called as Constructor
/*//////////////////////////////////////////////////////////////////////////////
  Private Properties
/*//////////////////////////////////////////////////////////////////////////////
      var objIndex = 0;
      var maxDepth = 2;
      var dontInstrument = [document, window.location, window.XMLHttpRequest,"XMLHttpRequest", window.localStorage,window.sessionStorage, window.console.debug, "__pca__", this.wrapper, this.liner, "__pca__objInfo", window.chrome, null, /*"status", "statusText",*/"prototype"];

      var structure = {};
/*//////////////////////////////////////////////////////////////////////////////
  Public Properties
/*//////////////////////////////////////////////////////////////////////////////
       this.doInstrument = ["object", "function"];
/*//////////////////////////////////////////////////////////////////////////////
  Private Methods
/*//////////////////////////////////////////////////////////////////////////////
      var sendData = function (data) {
        //console.debug(data);
      }
///////////////////////////////////////////////////////////////////////////////
      var getPropertyType = function(property){
          return property!=null && typeof(property.__pca__objInfo) == "object"?
              property.__pca__objInfo.oid:
                  property == null?
                    "null":
                    typeof(property); 
      };
///////////////////////////////////////////////////////////////////////////////
     var getObjId = function(method){
          return method.__pca__objInfo &&  method.__pca__objInfo.oid >=0 ?
              method.__pca__objInfo.oid:
              -1;
      }
///////////////////////////////////////////////////////////////////////////////
     var getProperties = function(method){
          var properties = {};
          for(var m in method) 
              if(m!="__pca__objInfo") 
                 properties[m] = getPropertyType(method[m]);
             
          return properties;
      }
///////////////////////////////////////////////////////////////////////////////   
      var instrumentation = function (_this, _arguments) {
      	  var info = _this.__pca__objInfo;
          if(info) sendData({
              oid : info.oid,
              parentName : info.name,
          //    properties : getProperties(info.obj),
              name : _this.constructor.name,
              method : _arguments.callee
          });
      }
///////////////////////////////////////////////////////////////////////////////
      var wrapFunction = function(method, depth, parent, name) {
      	var tempMethods = {};
				var wrapper = function() {
            var result, tempArguments;
      
            if(getObjId(this) < 0 && Object.getOwnPropertyNames(this).length <= 0) { // if [new] function got instanciated (probably)
                tempArguments = Array.prototype.slice.call(arguments);
                Array.prototype.unshift.call(tempArguments, null);
                result = new (Function.prototype.bind.apply(method, tempArguments)); 
                result = __pca__.doInstrument.indexOf(typeof(result)) >=0 ?
                	__pca__.wrapper(result):
                	result;
                instrumentation(result, arguments);
            } 
            else { // if normal function call
                if(getObjId(this) < 0) __pca__.wrapper(this); // if function call on existing object but not [new]
                instrumentation(this, arguments);
                
                try{
                  result = method.apply(this, arguments);
                } catch(e){console.debug(e)}
                  result = __pca__.doInstrument.indexOf(typeof(result)) >=0 ?
                    __pca__.wrapper(result):
                    result;
            }
            return result;
        };
				if(method.toString() == wrapper.toString()) return method;
			//	else return wrapper;

    		method = (wrapObject.bind(this))(method, depth, parent, name);
    		for(var m in method)
    			if(this.doInstrument.indexOf(typeof(method[m])) >=0) wrapper[m] = method[m]; 

    		return wrapper;


      }
///////////////////////////////////////////////////////////////////////////////
			var wrapObject = function (method,depth, parent, name){
				var doIt=false;

        if(method != null) name = method.constructor && method.constructor.name != "" ? method.constructor.name : name;
				if(dontInstrument.indexOf(method) >= 0 || dontInstrument.indexOf(name) >= 0 || depth <= 0 || (getObjId(method) >= 0 && depth != undefined)) return method;
          
  
        if(!method.__pca__objInfo) Object.defineProperty(method,"__pca__objInfo", { 
            writable:true,
            value:{
	        		oid:objIndex++, 
	            name: name, 
	            obj: method
  	        }
          }); 

	        for(var m in method){
	        	try{
            	doIt = dontInstrument.indexOf(m) < 0 && dontInstrument.indexOf(method[m]) <0 && this.doInstrument.indexOf(typeof(method[m])) >=0 ?
            		true:false;
            } catch(e){ doIt=false; console.debug(e);};
            if(doIt) method[m]=this.wrapper(method[m], (depth >=0 ? depth-1 : maxDepth) , method, m);
	        }
	        return method;

			}
/*//////////////////////////////////////////////////////////////////////////////
  Public Methods
/*//////////////////////////////////////////////////////////////////////////////
      this.wrapper = function (method, depth, parent, name) {
          switch(typeof(method)) {
              case "function" :
            		return (wrapFunction.bind(this))(method, depth, parent, name);               
              case "object":
             		return (wrapObject.bind(this))(method,depth, parent, name);
              break;
              default:
              	return method;   
              break;   
          }
      }
///////////////////////////////////////////////////////////////////////////////
      this.liner = function (_this, _arguments) {
          var newClass, tempArguments;
          if(_arguments.callee.caller != null && _arguments.callee.caller.toString() == this.wrapper(this.liner).toString()) return; //if wrapped
          
          if(Object.getOwnPropertyNames(_this).length <= 0 && getObjId(_this) < 0 && _arguments[_arguments.length-1] != "__pca__new") { // if [new] function got instanciated (probably)
              var tempArguments = Array.prototype.slice.call(_arguments);
              Array.prototype.push.call(tempArguments, "__pca__new");
              Array.prototype.unshift.call(tempArguments, null);
              var newClass = new (Function.prototype.bind.apply(_arguments.callee, tempArguments));

              this.wrapper(newClass);
              instrumentation(newClass, _arguments);
              return newClass;
          }
          else {
              if(getObjId(this) < 0) this.wrapper(method); // if function call on existing object but not [new]
              Array.prototype.splice.call(_arguments, _arguments.length-1, 1);
              return false;
          }
      }
///////////////////////////////////////////////////////////////////////////////
  }
	__pca__=__pca__Instrument();
	__pca__.wrapper(window);
})(window, document);