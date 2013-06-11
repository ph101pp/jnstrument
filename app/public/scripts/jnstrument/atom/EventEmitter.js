(function($, undefined) {	
	var EventEmitter = function(){
/*/////////////////////////////////////////////////////////////////////////////
	Private Properties
/*/////////////////////////////////////////////////////////////////////////////
		var listener= {"all": new (require("./ObjectStore"))};
		var stopped = true;
		var async = false;
/*/////////////////////////////////////////////////////////////////////////////
	Private Methods
/*/////////////////////////////////////////////////////////////////////////////
		var getReceiver = function(allListener, eventNameListener){
			var receiver = [];
			if(typeof allListener.objects === "object") 
				for(var i=0; i<allListener.objects.length; i++) {
					receiver.push({
						object:allListener.objects[i],
						data: allListener.data[i]
					});
				}
			if(typeof eventNameListener.objects === "object") 
				for(var i=0; i<eventNameListener.objects.length; i++) {
					receiver.push({
						object:eventNameListener.objects[i],
						data: eventNameListener.data[i]
					});
				}		
			return receiver;
		}
/*/////////////////////////////////////////////////////////////////////////////
	Public Methods
/*/////////////////////////////////////////////////////////////////////////////
		this.emitEvent = function(data, answerCallback, eventName) {
			if(stopped) return;
			var receiver = getReceiver(listener["all"].getAll(), listener[eventName] ? listener[eventName].getAll() : []);
			var now = Date.now();
			console.log(receiver);
			for(var i=0; i<receiver.length; i++) 
				if(typeof receiver[i] === "object") {
					console.log(receiver[i].object);
					if(async === true) {
						if(receiver[i].data.executing !== true) 
							setTimeout((function(receiver, _data, _answerCallback, _now, _this){
								receiver.data.executing = true;
								receiver = listener[receiver.data.eventName].store(receiver.object, receiver.data);
								return function(){
									receiver.object.call(receiver.data.bind, _data, _answerCallback, _now, _this);
									receiver.data.executing = false;
									listener[receiver.data.eventName].store(receiver.object, receiver.data);
								}
							})(receiver[i],  data, answerCallback, now, this),1);
					}
					else receiver[i].object.call(receiver[i].data.bind, data, answerCallback, now, this);
				}
		}
///////////////////////////////////////////////////////////////////////////////
		this.activate = function() {
			stopped = false;
		}		
///////////////////////////////////////////////////////////////////////////////
		this.deactivate = function() {
			stopped = true;	
		}
///////////////////////////////////////////////////////////////////////////////
		this.isActive = function(){
			return !stopped;
		}
///////////////////////////////////////////////////////////////////////////////
		this.makeAsync = function() {
			async = true;	
		}
///////////////////////////////////////////////////////////////////////////////
		this.makeSync = function(){
			async = falsea;	
		}
///////////////////////////////////////////////////////////////////////////////
		this.addListener = function(callback, options){ // options { eventName, async, bind, data }
			options = options || {};
			options.eventName = options.eventName || "all";
			if(!listener[options.eventName]) listener[options.eventName]= new (require("./ObjectStore"));
			listener[options.eventName].store(callback, options);
		}
///////////////////////////////////////////////////////////////////////////////
		this.removeListener = function(callback, options) {
			options = options || {};
			var eventName = options.eventName || "all";
			if(typeof(callback) === "string")
				listener[eventName].removeAll();
			else 
				listener[eventName].remove(callback);
		}
	}
///////////////////////////////////////////////////////////////////////////////
	module.exports = require("../Class.js").abstract(EventEmitter);
})(jQuery)