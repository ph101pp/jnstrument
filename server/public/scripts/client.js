(function($, undefined){
	var j= {

		behaviour : function(context) {
			context=$(context);

			$(".background", context).cover();
			$(".slides", context).slides({
				vertical:true,
				stayOpen:true,
				limits: {
					min:32+30,
					0:{
						min:96+40
					}
				},
				events : {
					activate : "click"
				}
			});
			$(".fancy", context).fancybox({
				padding:3,
			    prevEffect      : 'none',
			    nextEffect      : 'none',
				helpers:  {
					overlay: null
				},
				closeBtn:true,
				closeClick:true
			});

		}





	}

	$(function(){
		j.behaviour("body");
	});
})(jQuery);