(function($, undefined){
	var j= {

		behaviour : function(context) {
			context=$(context);

			$(".background", context).cover();


		}





	}

	$(function(){
		j.behaviour("body");
	});
})(jQuery);