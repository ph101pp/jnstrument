(function(window, document, undefined){
    function __pca__Instrument() {
        if (this == window) return new __pca__Instrument(); // has to be called as Constructor
        this.index = 0;
        this.maxDepth = 3;
        this.dontInstrument = ["document", "location", "localStorage","sessionStorage", "debug", "__pca__", "__pca__objInfo"];

        this.send = function (data) {
            console.debug(data);
        }
        this.wrapper = function (method, depth) {
            console.debug(depth);
            switch(typeof(method)) {
                case "function" :
                    var newMethod = function() {
                        if (this.__pca__objInfo == undefined) __pca__.wrapper(this);
                        __pca__.instrumentation(this, arguments);
                        return __pca__.wrapper(method.apply(this, arguments));
                    };
                    return method.toString() == newMethod.toString() ?
                        method:
                        newMethod;
                break;            
                case  "object":
                    if(method == null || depth <= 0) return method;
                    
                    var properties=this.getProperties(method);

                    if(!method.__pca__objInfo || !method.__pca__objInfo.properties) method.__pca__objInfo={properties:[]};                      

                    if(properties.length == method.__pca__objInfo.properties.length) return method;
                    else method.__pca__objInfo = {
                        oid:this.index++, 
                        name: method.constructor.name, 
                        obj: method
                    };

                    for(var m in method){
                        if(this.dontInstrument.indexOf(m) < 0) {
                            method[m]=this.wrapper(method[m], depth-1 || this.maxDepth);
                        }
                    }
                default:
                    return method;   
                break;   
            }
        }
        this.getProperties = function(method){
            var properties = {};
            for(var m in method) 
                if(m!="__pca__objInfo") {
                    properties[m] =  method[m]!=null && typeof(method[m].__pca__objInfo) == "object"?  
                        method[m].__pca__objInfo.oid:
                            method[m] == null?
                              "null":
                              typeof(method[m]); 
                }
            return properties;
        }
        this.liner = function (_this, _arguments) {
            if (_arguments.callee.caller != null && _arguments.callee.caller.toString() == this.wrapper().toString()) return; //if wrapped
            this.instrumentation(_this, _arguments);
        }
        this.instrumentation = function (_this, _arguments) {
            var info = _this.__pca__objInfo;
            this.send({
                oid : info.oid,
                name : info.name,
                properties : this.getProperties(info.obj)
            });
        }
    }
    __pca__=__pca__Instrument();
    __pca__.wrapper(window);
})(window, document);
//tested in http://jsfiddle.net/SuJwg/16/

/*
window = __pca__.wrapper(window);
//__pca__.liner(this, arguments);

function myClass() {
    console.log("ClassCall");
    
    this.hello = "hallo";
    var hallo = "hello";
    
    this.method = function () {
        console.log("MethodCall");
        
        this.childHello = "hallo";
        
        this.childMethod = function(){
            console.log("ChildMethodCall");
        }
    }
}/*
//myClass();
var myClass = new myClass();


myClass = __pca__.wrapper(myClass);

//console.log("before",myClass.method);
myClass.method = __pca__.wrapper(myClass.method);
//console.log("after",myClass.method);

//myClass.method();

subClass= new myClass.method();
subClass.childMethod();

console.log(subClass);


console.log(window);

function test() {
   __pca__.liner(this, arguments);
   console.log("test();");
}
test();
test = __pca__.wrapper(test);
test();
*/
//alert = __pca__.wrapper(alert);
//console.log = __pca__.wrapper(console.log);
//console.trace= __pca__.wrapper(console.trace);



//alert("world");
//console.log("hello");
//console.trace();
