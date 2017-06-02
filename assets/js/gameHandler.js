$(document).ready(function(){
	var ww = $(window).width();
	var wh = $(window).height();

	$('.planet').width(ww);
	$('.bg-layer-0').height(wh + 100).css({left: -50+'px'});
	$('.bg-layer-1').height(wh + 100).css({left: -50+'px'});
});