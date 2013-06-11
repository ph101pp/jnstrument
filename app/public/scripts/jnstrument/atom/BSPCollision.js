(function($, THREE, window, document, undefined) {	
	var BSPTree = function(){
		var elements = new (require("./ObjectStore"));
		var tree;

///////////////////////////////////////////////////////////////////////////////
		this.construct = function(_elements){
			this.addElements(_elements);
		}
///////////////////////////////////////////////////////////////////////////////
		this.testElements = function(group, recursive){
			var temp =[];
			var element;
			while(elements.length > 0) {
				element= elements.shift();
				this.testElement(element, group, recursive, true);
				temp.push(element);
			}
			elements = temp;
		}
///////////////////////////////////////////////////////////////////////////////
		this.addElement = function(element){
			elements.store(element);
			this.addToTree(element);
		}
///////////////////////////////////////////////////////////////////////////////
		this.addElements = function(elements){
			for(var i=0; i<elements.length; i++) this.addElement(elements[i]);
		}

///////////////////////////////////////////////////////////////////////////////
		this.removeElement = function(element){
			element = elements.remove(element);
		}
		this.BSPNode = function(){
			var nodes = [];

			this.node = function(){
				if(nodes.length


			}
			var children = new Array(4);
			var parent;

			node



		}
	}
///////////////////////////////////////////////////////////////////////////////
	module.exports = require("../Class.js").extend(BSPTree);
})(jQuery, THREE, window, document)