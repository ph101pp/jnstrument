function pI () {
    this.index = 0;
    this.window = {};
    this.oF = function(){
        this.hallo = "bla";
        if(typeof(arguments[0]) != "undefined") this.world = arguments[0];
        
        this.setTwo = function() {
            this.hallo = "hello";
            this.world = "world";
        }
        this.print = function(){
            console.log(this.hallo, this.world);
        }

    }
    this.nF = function(oldFunc){
        this.window["func_"+index]
        return function() {
            // do Instrumentation
            this.oldFunc
            
        }.bind({oldFunc:func})
    }
    this.iF = function(that) {
        if(that == window) console.log("hello");
        else console.log("world");
    }
}
var instrumentor = new pI();




function main() {
    instrumentor.iF(this); 

    this.bla = function() {
        console.log("world");
    }
}
main();
new main();
console.log("!");

var obj = new instrumentor.oF("blub");

var func = obj.nF("world");

func();



// pI.window.console = {};
// pI.window.console.log = {}
// console.log = 

