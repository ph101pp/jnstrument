(function($, THREE, window, document, undefined) {	
	var lvl3 = function(){

		this.construct = function(){
			//console.log("lvl3");
			this._super();

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
		this.lvl3 = function(){

		}
	}
	module.exports = require("../Class.js")(lvl3).extend(require("./lvl2"));
})(jQuery, THREE, window, document)