$(document).ready(function() {
	$('.screen').slick({
	  dots: true,
	  arrows: false,
	  slidesToShow: 1,
	  customPaging : function(slider, i) {
		var thumb = $(slider.$slides[i]).data();
		return '<a>'+(i+1)+'</a>';
	  }
	});
	$(".mCSB_container").mCustomScrollbar({theme:"light-3"});
});