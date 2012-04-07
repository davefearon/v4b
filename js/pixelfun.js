var dummyexperiment = document.getElementById('dummyexperiment');
var experiment = document.getElementById('experiment');
var realboxwidth = experiment.offsetWidth - 50;
var boxwidth = Math.floor(realboxwidth/10) * 10;
var marginleft = realboxwidth - boxwidth;
experiment.style.width = boxwidth + "px";
experiment.style.marginLeft = 0 - (marginleft/2) + "px";
var boxheight = 300;
var pixelwidth = 10;
var pixelheight = 10;
var numpixels = ( boxwidth * boxheight ) / ( pixelwidth * pixelheight );
//var hiddenmessage = document.getElementById('hiddenmessage');
//hiddenmessage.style.width = boxwidth + 'px';

var colors = [];
function firstcolor() {
	var chars = "abcdef1234567890";
	var color = '';
	var i = 0;
	while( i < 6 ) {
		color += chars.substr( Math.floor( Math.random() * 15 ) + 1, 1 );
		i++;
	}
	return color;
}
function nextcolor(prev) {
	var chars = "abcdef1234567890";
	var color = '';
	var i = 0;
	var nextpos;
	while( i < 6 ) {
		var prevchar = prev.substr(i, 1);
		var prevpos = chars.indexOf(prevchar);
		if( prevpos == 15 ) {
			nextpos = 0;
		} else {
			nextpos = prevpos + 1;
		}
		color += chars.substr(nextpos, 1);
		i++;
	}
	return color;
}

/*
for( var j = 0; j < numpixels; j++ ) {
	var color = '';
	if( j == 0 ) {
		color = firstcolor();
	} else {
		color = nextcolor(colors[j - 1]);
	}
	colors[j] = color;

	var newdiv = document.createElement('div');
	newdiv.setAttribute('class','pixel');
	newdiv.setAttribute('style','background:#' + color);
	experiment.appendChild(newdiv);
}
*/
function fillthebox() {
	if( experiment.hasChildNodes() ) {
		while( experiment.childNodes.length >= 1 ) {
			experiment.removeChild(experiment.firstChild);
		}
	}
	for( var j = 0; j < numpixels; j++ ) {
		var color = '';
		color = firstcolor();
		colors[j] = color;

		var newdiv = document.createElement('div');
		newdiv.setAttribute('class','pixel');
		newdiv.setAttribute('style','background:#' + color);
		experiment.appendChild(newdiv);
	}
}
fillthebox();
var windowwidth = $(window).width();
window.onresize = function(event) {
	var ww = $(window).width();
	realboxwidth = dummyexperiment.offsetWidth - 10;
	boxwidth = Math.floor(realboxwidth/10) * 10;
	marginleft = realboxwidth - boxwidth;
	experiment.style.width = boxwidth + "px";
	experiment.style.marginLeft = 0 - (marginleft/2) + "px";
	numpixels = ( boxwidth * boxheight ) / ( pixelwidth * pixelheight );
	hiddenmessage.style.width = boxwidth + 'px';
	if( ww != windowwidth ) {
		windowwidth = ww;
		fillthebox();
	}
};

$(document).ready(function(){
	$('.pixel').live('mouseenter', function(){
		$(this).css({
			//'background' : '#' + firstcolor()
			'background' : 'transparent'
		});
		//$(this).remove();
	});

	/*
	$('.pixel').each(function(i){
		$(this).mouseenter(function(){
			$(this).css({
				//'background' : '#' + firstcolor()
				'background' : 'transparent'
			});
		});
	});
	//*/
});


