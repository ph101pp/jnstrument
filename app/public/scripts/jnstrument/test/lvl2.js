(function($, THREE, window, document, undefined) {	
	var lvl2 = function(){

		this.construct = function(){
			//console.log("lvl2");
		//	this._super();

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
		this.lvl2 = function(){

		}
	}
		lvl2.prototype.test = function(){
			this._super();
		};

	module.exports = require("./lvl1.js").extend(lvl2);
})(jQuery, THREE, window, document)