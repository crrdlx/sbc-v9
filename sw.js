self.importScripts( "config.js" );

var cacheName = "v" + serviceWorkerCacheVersion + ":static";

// Same-origin assets only (reliable offline shell). CDN URLs use network-first below.
var precacheRelative = [
	"index.html",
	"config.js",
	"manifest.json",
	"src/App.js",
	"src/main.js",
	"img/favicon.png",
	"img/refresh.png",
	"img/icon_120.png",
	"img/icon_180.png",
	"img/icon_192.png",
	"img/icon_512.png",
	"pages/about.html",
	"pages/dev_notes.html",
	"pages/satoshiday.html",
	"pages/grow.html",
	"pages/tips.html",
	"pages/fun.html",
	"pages/why.html",
	"pages/privacy.html",
	"pages/ichthys.html"
];

function precacheUrl( path )
{
	return new URL( path, self.location ).href;
}

self.addEventListener( "install", ( event ) =>
{
	event.waitUntil(
		caches.open( cacheName ).then( ( cache ) =>
		{
			return Promise.all(
				precacheRelative.map( ( path ) =>
					cache.add( precacheUrl( path ) ).catch( ( err ) =>
					{
						console.warn( "sw precache skip:", path, err );
					} )
				)
			);
		} ).then( () => self.skipWaiting() )
	);
} );

self.addEventListener( "activate", ( event ) =>
{
	event.waitUntil(
		caches.keys().then( ( keyList ) =>
			Promise.all( keyList.map( ( key ) =>
			{
				if ( key !== cacheName ) return caches.delete( key );
			} ) )
		).then( () => self.clients.claim() )
	);
} );

self.addEventListener( "fetch", ( event ) =>
{
	if ( event.request.method !== "GET" ) return;

	var url = new URL( event.request.url );

	// CryptoCompare: always network; never cache (stale prices / wrong offline UX)
	if ( url.hostname === "min-api.cryptocompare.com" )
	{
		event.respondWith(
			fetch( event.request ).catch( () =>
				new Response(
					JSON.stringify( { Response: "Error", Message: "Offline — connect to load prices." } ),
					{ status: 503, headers: { "Content-Type": "application/json" } }
				)
			)
		);
		return;
	}

	// Other third parties (jQuery, W3.CSS, StatCounter, etc.): try network, then cache
	if ( url.origin !== self.location.origin )
	{
		event.respondWith(
			fetch( event.request ).catch( () => caches.match( event.request ) )
		);
		return;
	}

	// Root URL → cached index.html (offline home)
	if ( url.pathname === "/" || url.pathname === "" )
	{
		event.respondWith(
			caches.match( precacheUrl( "index.html" ) ).then( ( cached ) =>
				cached || fetch( event.request )
			)
		);
		return;
	}

	// Same-origin: cache first, then network
	event.respondWith(
		caches.match( event.request ).then( ( cached ) =>
		{
			if ( cached ) return cached;
			return fetch( event.request ).then( ( response ) =>
			{
				var copy = response.clone();
				if ( response.ok )
				{
					caches.open( cacheName ).then( ( cache ) => cache.put( event.request, copy ) );
				}
				return response;
			} );
		} )
	);
} );
