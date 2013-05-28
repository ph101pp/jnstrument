(function($, THREE, window, document, undefined) {	
	var lvl1 = function(){

		this.construct = function(){
			console.log("lvl1");
			//this._super();

		}
		this.blub = function(){
			this._super();

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
	module.exports = require("../Class.js")(lvl1);
})(jQuery, THREE, window, document)