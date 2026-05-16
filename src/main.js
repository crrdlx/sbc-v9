var serviceWorkerRegistration = null;
var deferredInstallPrompt = null;

var app = new App();

function isStandaloneApp()
{
	return window.matchMedia( "(display-mode: standalone)" ).matches
		|| window.navigator.standalone === true;
}

function isIosDevice()
{
	return /iphone|ipad|ipod/i.test( navigator.userAgent );
}

function getAppBaseUrl()
{
	var manifestLink = document.querySelector( "link[rel=\"manifest\"]" );
	if ( manifestLink && manifestLink.href )
	{
		return new URL( ".", manifestLink.href ).href;
	}
	return new URL( "./", window.location.href ).href;
}

function updateInstallButton()
{
	var btn = document.getElementById( "installBtn" );
	if ( !btn ) return;

	if ( isStandaloneApp() )
	{
		btn.hidden = true;
		return;
	}

	if ( deferredInstallPrompt )
	{
		btn.hidden = false;
		btn.textContent = "Install";
		btn.title = "Install Satoshi Bitcoin Converter";
		return;
	}

	if ( isIosDevice() )
	{
		btn.hidden = false;
		btn.textContent = "Add";
		btn.title = "Tap Share, then Add to Home Screen";
		return;
	}

	btn.hidden = true;
}

async function promptInstall()
{
	if ( deferredInstallPrompt )
	{
		deferredInstallPrompt.prompt();
		var result = await deferredInstallPrompt.userChoice;
		deferredInstallPrompt = null;
		updateInstallButton();
		console.log( "install prompt:", result.outcome );
		return;
	}

	if ( isIosDevice() )
	{
		window.alert( "On iPhone/iPad: tap the Share button in Safari, then choose \"Add to Home Screen\"." );
	}
}

function registerServiceWorker()
{
	if ( !( "serviceWorker" in navigator ) )
	{
		return;
	}

	var swUrl = new URL( "sw.js", getAppBaseUrl() ).href;
	var swReloaded = false;

	navigator.serviceWorker.addEventListener( "controllerchange", function()
	{
		if ( swReloaded || navigator.serviceWorker.controller === null )
		{
			return;
		}
		swReloaded = true;
		window.location.reload();
	} );

	navigator.serviceWorker.register( swUrl ).then( function( reg )
	{
		console.log( "service worker has been registered successfully" );
		serviceWorkerRegistration = reg;

		if ( reg.waiting )
		{
			reg.waiting.postMessage( { type: "SKIP_WAITING" } );
		}

		reg.addEventListener( "updatefound", function()
		{
			var worker = reg.installing;
			if ( !worker ) return;
			worker.addEventListener( "statechange", function()
			{
				if ( worker.state === "installed" && navigator.serviceWorker.controller )
				{
					worker.postMessage( { type: "SKIP_WAITING" } );
				}
			} );
		} );
	} ).catch( function( error )
	{
		console.log( "failed to register service worker", error );
	} );
}

function setupInstallPrompt()
{
	var btn = document.getElementById( "installBtn" );
	if ( btn )
	{
		btn.addEventListener( "click", promptInstall );
	}

	window.addEventListener( "beforeinstallprompt", function( event )
	{
		event.preventDefault();
		deferredInstallPrompt = event;
		updateInstallButton();
	} );

	window.addEventListener( "appinstalled", function()
	{
		deferredInstallPrompt = null;
		updateInstallButton();
		console.log( "PWA installed" );
	} );

	updateInstallButton();
}

function init()
{
	registerServiceWorker();
	setupInstallPrompt();

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

	app.start();

	if ( typeof window.initSbcUi === "function" )
	{
		window.initSbcUi();
	}
}
