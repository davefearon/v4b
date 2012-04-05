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
	earthquaker();

	$('#earthquakereset').live('click', function(){
		console.log('reset');
		$('#earthquakereset').hide();
		$('div, section, h1, h2, h3, h4, h5, h6, a, p, span, article, footer, header, img')
			.filter(function(){return ( $(this).attr('class') != 'pixel' && $(this).attr('class') != 'earthquake' && $(this).attr('class') != 'hiddenmessage' );})
			.each(function(){
				$(this).css({
					'-webkit-transform' : 'rotate(0deg)',
					'-moz-transform' : 'rotate(0deg)',
					'-o-transform': 'rotate(0deg)',
					'transform': 'rotate(0deg)',
					'top' : '0',
					'left' : '0'
				});
			});

		earthquaker();
	});
});

function resizestuff() {
	$('#sidebar').css({
		height: $('body').height() - $('.mainfooter').height() - $('.mainsubfooter').height()
	});
}

resizestuff();

function earthquaker() {
	var kkeys = [], konami = "38,38,40,40,37,39,37,39,66,65";
	$(document).keydown(function(e) {
		kkeys.push( e.keyCode );
		if( kkeys.toString().indexOf( konami ) >= 0 ) {
			$(document).unbind('keydown',arguments.callee);
			$('#earthquake').css({
				'top' : ( $(window).height() / 2 ) - ( $('#earthquake').height() / 2 ),
				'left' : ( $(window).width() / 2 ) - ( $('#earthquake').width() / 2 )
			}).show();
			$('div, section, h1, h2, h3, h4, h5, h6, a, p, span, article, footer, header, img').filter(function(){return ( $(this).attr('class') != 'pixel' && $(this).attr('class') != 'earthquake' );}).jrumble({
				rangeX: 5,
				rangeY: 5,
				rangeRot: 2,
				rumbleEvent: 'constant',
				reset: 5000
			});
			$('#earthquakereset').show();
			/* RAINBOWS AND UNICORNS AND SUNSHINE
			$.getScript('http://www.cornify.com/js/cornify.js',function(){
				cornify_add();
				$(document).keydown(cornify_add);
			});
			*/
		}
	});
}

if( window.applicationCache ) {
	applicationCache.addEventListener('updateready', function(){
		if( confirm('An update is available. Reload now?') ) {
			window.location.reload();
		}
	});
}