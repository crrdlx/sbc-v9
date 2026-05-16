var serviceWorkerRegistration = null;

var app = new App();

function getAppBaseUrl()
{
	var manifestLink = document.querySelector( 'link[rel="manifest"]' );
	if ( manifestLink && manifestLink.href )
	{
		return new URL( ".", manifestLink.href ).href;
	}
	return new URL( "./", window.location.href ).href;
}

function registerServiceWorker()
{
	if ( !( "serviceWorker" in navigator ) )
	{
		return;
	}

	var base = getAppBaseUrl();
	var swUrl = new URL( "sw.js", base ).href;

	navigator.serviceWorker.register( swUrl, { scope: base } ).then( function( reg )
	{
		console.log( "service worker has been registered successfully" );
		serviceWorkerRegistration = reg;
	} ).catch( function( error )
	{
		console.log( "failed to register service worker", error );
	} );
}

function init()
{
	registerServiceWorker();

	if ( navigator.onLine )
	{
		console.log( "online mode" );
	}
	else
	{
		console.log( "offline mode" );
	}

	window.addEventListener( "online", function()
	{
		console.log( "online event" );
		if ( typeof window.updatePrices === "function" )
		{
			window.updatePrices();
		}
		else if ( typeof window.forceFetchPrices === "function" )
		{
			window.forceFetchPrices();
		}
	} );

	window.addEventListener( "offline", function()
	{
		console.log( "offline event" );
	} );

	window.addEventListener( "beforeinstallprompt", function( event )
	{
		event.userChoice.then( function( choiceResult )
		{
			console.log( choiceResult.outcome );
		} );
	} );

	app.start();

	if ( typeof window.initSbcUi === "function" )
	{
		window.initSbcUi();
	}
}
