(function($, undefined) {	
	var EventEmitter = function(){
/*/////////////////////////////////////////////////////////////////////////////
	Private Properties
/*/////////////////////////////////////////////////////////////////////////////
		var listener= {"all":[]};
		var stopped = true;
		var async = false;
/*/////////////////////////////////////////////////////////////////////////////
	Private Methods
/*/////////////////////////////////////////////////////////////////////////////
/*/////////////////////////////////////////////////////////////////////////////
	Public Methods
/*/////////////////////////////////////////////////////////////////////////////
		this.emitEvent = function(data, answerCallback, eventName) {
			if(stopped) return;
			var receiver = $.extend([],listener["all"], listener[eventName] || []);
			var now = Date.now();
			for(var i=0; i<receiver.length; i++) 
				if(receiver[i]) {
					if(async) setTimeout((function(fn, _data, _answerCallback, _now, _this){
							return function(){
								fn(_data, _answerCallback, _now, _this);
							}
						})(receiver[i], data, answerCallback, now, this),0);
					else receiver[i](data, answerCallback, now, this);
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
		this.addListener = function(eventName, callback){
			if(typeof(eventName) === "function" && callback === undefined) {
				callback=eventName;
				eventName="all";
			}
			if(!listener[eventName]) listener[eventName]=[];
			listener[eventName].push(callback);
		}
///////////////////////////////////////////////////////////////////////////////
		this.removeListener = function(eventName, callback) {
			if(typeof(eventName) === "function" && callback === undefined) {
				callback=eventName;
				eventName="all";
			}
			if(typeof(eventName) === "string" && callback === undefined)
				delete listener[eventName];
			else 
				delete listener[eventName][listener[eventName].indexOf(callback)];

		}
///////////////////////////////////////////////////////////////////////////////
		this.makeAsync = function(){
			async = true;
		}
///////////////////////////////////////////////////////////////////////////////
		this.makeSync = function(){
			async = false;
		}
	}
///////////////////////////////////////////////////////////////////////////////
	module.exports = require("../Class.js").abstract(EventEmitter);
})(jQuery)