(function($, THREE, window, document, undefined) {	
	var lvl1 = function(){

		this.construct = function(){
			//console.log("lvl1");
			//this._super();

		}
		this.blub = function(){
		

		}		
		this.bla = function(){
			this._super();

		}
		this.plp = function(){
			this._super();

		}
		var haha;
		this.lvl1 = function(){
		
		}
	}
	lvl1.prototype.test = function(){};
	lvl1.test=function(){
		console.log("lvl1 TEST");
	};
	module.exports = require("../Class.js").abstract(lvl1);
})(jQuery, THREE, window, document)