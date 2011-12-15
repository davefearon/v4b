/*
var Fearon = {};

$(document).ready(function() {
   new Fearon.buttons();
});

Fearon.buttons = function( active, filter )
{
   var that = this;
   active = active||false;
   filter = filter||"img, input:image";

   $(filter).each(function(i, val)
   {
      if( $(val).attr('src').match(/_u|_a/) != null )
      {
         $('<img>').attr( 'src', that.over( $(val).attr('src') ) );

         $(val).mouseover(function(){
            $(val).attr( 'src', that.over($(this).attr('src')) );
         });

         $(val).mouseout(function(){
            $(val).attr( 'src', that.reset($(this).attr('src')) );
         });

         if( active )
         {
            $('<img>').attr( 'src', that.active( $(val).attr('src') ) );

            $(val).mousedown (
               function() { $(this).attr( 'src', that.active($(this).attr('src')) ); }
            );
         }
      }
   });
};

Fearon.buttons.prototype =
{
   over:   function( src ) { return src.replace(/(_u\.)/, '_o.'); },
   active: function( src ) { return src.replace(/(_o\.|_u\.)/, '_a.'); },
   reset:  function( src ) { return src.replace(/(_o\.)/, '_u.'); }
};
*/



/**
* Cached Theme
*
* An extension that fetches and sets the theme styles for a given event.
* It is a spin-off of the html5.cachedGet.js file and then modified heavily
* to accommodate the loading of the files needed. File info is stored in
* localStorage and only replaced if the theme.manifest file for the given
* theme has a different date or version.
*
*/
/*
;(function() {
	var refreshed = false;
	var theTheme;

	// the init function
	function fetchThemeInfo(theme) {
		theTheme = theme;
		cachedFetchTheme(theme,'themes/?theme=' + theme,
			function(data){
				setThemeInfo();
			}, function(fail) {
				alert('No theme info saved. Connect to the intertubes.');
		});
	};

	// set a general variable to show what's in theme manifest
	function setThemeInfo() {
		GMUS.THEMEINFO = eval('(' + localStorage["theme: " + GMUS.config.theme] + ')');

		if( GMUS.THEMEINFO ) {
			parseTheme();
		}
	};

	// swap out each file in the cache if it needs to
	// call the appropriate set functions based on file type
	function parseTheme() {
		if( GMUS.THEMEINFO.files.css ) {
			for( var i = 0; i < GMUS.THEMEINFO.files.css.length; i++ ) {
				if( refreshed || !grabLocalStorage(GMUS.THEMEINFO.files.css[i]) ) {
					var d = $('<div>').html('<br/><br/><br/><br/>Please wait for a moment while the theme is updated');
					getOverlay().show(d);
					GMUS.survey.timeoutOverlay.reset(1200);
					GMUS.survey.timeoutOverlay.reset(1800); // 1/2 hour?
					GMUS.survey.timeoutOverlay.suspend(); // and suspend just in case
					cacheGet(GMUS.THEMEINFO.files.css[i], "themes/" + GMUS.THEMEINFO.files.css[i], function(data){
						setCSS(data);
					}, function(f) {
						alert('Could not load required theme file');
					});
				} else {
					var data = grabLocalStorage(GMUS.THEMEINFO.files.css[i]);
					setCSS(data);
				}
			}
		}
	};

	// set/replace the CSS for the theme
	function setCSS(data) {
		var exists = document.getElementById('theme-' + theTheme);
		if( exists ) {
			document.getElementsByTagName('head')[0].removeChild(exists);
		}
		var fr = document.createElement('style');
		fr.type = "text/css";
		fr.setAttribute('id', 'theme-' + theTheme);
		if( !!(window.attachEvent && !window.opera ) ) {
			fr.styleSheet.cssTest = data;
		} else {
			var styleText = document.createTextNode(data);
			fr.appendChild(styleText);
		}
		document.getElementsByTagName('head')[0].appendChild(fr);
		getOverlay().hide();
	};

	// borrowed from html5.cachedGet.js
	var newXHR = function() {
		return window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
	};

	// borrowed from html5.cachedGet.js
	function fullUrl(url) {
		if(/^[a-z]+:/i.test(url)) return url;
		var p = url.split('?');
		var url = p[0];
		var qs = p.length > 1 ? p[1] : null;

		// if using postq action must be absolute
		var base = window.location.protocol + "//" + window.location.host;
		var br = document.getElementsByTagName('BASE');
		if(br) {
			br = br[0];
			if(br) br.getAttribute('href');
		}
		if(br) base = br;
		if(/^\//.test(url)) { // server-relative
			url = base + url;
		} else { // document-relative
			var p = window.location.pathname;
			var loc = url.split("/");
			var out = p.split("/"); out.pop();  // take off the filename

			for(var i=0;i<loc.length;i++) {
				if(loc[i] == '.') continue;
				else if(loc[i] == '..') out.pop();
				else out.push(loc[i]);
			}
			url = base + out.join('/');
		}
		if(qs) url = url + "?" + qs;
		return url;
	};

	// borrowed from html5.cachedGet.js
	function ajaxGet(url, callback, err) {
		var xhr = newXHR();
		xhr.open('GET',url);
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4) {
				if(xhr.status == 200) {
					callback(xhr);
				} else {
					err(xhr);
				}
			}
		};
		xhr.send();
	};

	// borrowed from html5.cachedGet.js but modifed slightly to use a name instead of the url
	function cacheGet(name, url, success, fail) {
		url = fullUrl(url);
		var k = "theme: " + theTheme + " - " + name;
		console.log(k);
		var fetchFail = function(xhr) {
			if(window.localStorage && localStorage[k]) {
				success(localStorage[k]);
			} else {
				fail(xhr,0);
			}
		};

		if(navigator.onLine) {
			ajaxGet(url, function(xhr) {
				try {
					localStorage.removeItem(k);
					localStorage.setItem(k,xhr.responseText);
				}
				catch (e) {
					if (window.console) console.log("Could not update local storage: "+e.message);
				}
				success(xhr.responseText);
			}, fetchFail);
		} else {
			fetchFail({});
		}
	}

	// similar to cacheGet above, handles fetching the theme.manifest and checks to see if it requires refreshing or not
	function cachedFetchTheme(name, url, success, fail) {
		url = fullUrl(url);
		name = "theme: " + name;
		console.log(name);
		var fetchFail = function(xhr) {
			if(window.localStorage && localStorage[name]) {
				refreshed = false;
				success(localStorage[name]);
			} else {
				fail(xhr,0);
			}
		};
		if(navigator.onLine) {
			ajaxGet(url, function(xhr) {
				try {
					var newData = eval('(' + xhr.responseText + ')');
					var currentData = eval('(' + localStorage[name] + ')');
					if( currentData ) {
						if( newData.date != currentData.date ) {
							refreshed = true;
							localStorage.removeItem(name);
							localStorage.setItem(name,xhr.responseText);
						} else if( newData.version != currentData.version ) {
							refreshed = true;
							localStorage.removeItem(name);
							localStorage.setItem(name,xhr.responseText);
						} else {
							//everything is the same and nothing needs to be refreshed
							refreshed = false;
						}
					} else {
						refreshed = true;
						localStorage.setItem(name,xhr.responseText);
					}
					if( refreshed ) { try { cleanHouse(theme); } catch(e){} }
					console.log("theme refreshed: " + refreshed);
					success(xhr.responseText);
				} catch (e) {
					if(window.console) console.log("Could not update local storage: "+e.message);
				}
			}, fetchFail);
		} else {
			fetchFail({});
		}
	};

	// returns the localStorage string
	function grabLocalStorage(name) {
		return localStorage["theme: " + theTheme + " - " + name];
	};
	
	// cleaning out the other themes beside the theme parameter
	function cleanHouse(theme) {
		for( var i = 0; i < localStorage.length; i++ ) {
			var key = localStorage.key(i);

			if( key.indexOf("theme:") != -1 ) {
				if( key.indexOf(theme) == -1 ) {
					try {
						localStorage.removeItem(key);
					} catch(e) {}
				}
			}
		}
	};
	
	window.fetchThemeInfo = fetchThemeInfo;
})();
*/