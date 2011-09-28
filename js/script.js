$(document).ready(function(){
	$('.qrcode').each(function(index){
		var link = $(this).parent().parent().attr('data-link');
		var color = 'rgb(' + Math.floor( Math.random() * 255 ) + ',' + + Math.floor( Math.random() * 255 ) + ',' + + Math.floor( Math.random() * 255 ) + ')';
		$(this).html(showQRCode(link,color));
	});

	$('#footerphoto').mouseenter(function(){
		$(this).attr('src',$(this).attr('data-altsrc'));
	}).mouseleave(function(){
		$(this).attr('src',$(this).attr('data-origsrc'));
	});
});
var kkeys = [], konami = "38,38,40,40,37,39,37,39,66,65";
$(document).keydown(function(e) {
  kkeys.push( e.keyCode );
  if ( kkeys.toString().indexOf( konami ) >= 0 ){
    $(document).unbind('keydown',arguments.callee);
    $.getScript('http://www.cornify.com/js/cornify.js',function(){
      cornify_add();
      $(document).keydown(cornify_add);
    });
  }
});