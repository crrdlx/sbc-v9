self.importScripts( "config.js" );

// cache name for cache versioning
var cacheName = "v"+serviceWorkerCacheVersion+":static";

// when the service is installed
self.addEventListener( "install" , ( event ) =>
{
	// cache all required files for offline use
	event.waitUntil( caches.open( cacheName ).then( ( cache ) =>
	{
		return cache.addAll( [
            "/",
			"config.js",
            "index.html",
			"manifest.json",
			"style.css",
			"src/App.js",
			"src/main.js",
			"img/favicon.png",
			"img/icon_120.png",
			"img/icon_180.png",
			"img/icon_192.png",
			"img/icon_512.png"
		] );
	}));
    console.log( "sw > installed" );
    // activate the new service worker version immediately
    self.skipWaiting();
});



// when a new version of the service worker is activated
addEventListener( "activate" , ( event ) => 
{
    // delete the old cache
	event.waitUntil( caches.keys().then( ( keyList ) => Promise.all( keyList.map( ( key ) => 
	{
		if ( key !== cacheName ) return caches.delete( key );
    }))));
    console.log( "sw > activated" );
});



// when the browser fetches a URL
self.addEventListener( "fetch" , ( event ) =>
{
    // cache first caching - only go to the network if no cache match was found, other caching strategies can be used too
    event.respondWith( caches.match( event.request ).then( ( response ) => 
    {
        return response || fetch( event.request );
    }));
});


// Below is code from web page https://whatwebcando.today/articles/handling-service-worker-updates/
// This seemed to work. It notices an update, then does a hard refresh. The only downside...it does it whether the person wants it or not and might be a slight nuisance. But, it works and likely is not a problem at all with this app.
// Service Worker-based solution
self.addEventListener('activate', async () => {
	// after we've taken over, iterate over all the current clients (windows)
	const tabs = await self.clients.matchAll({type: 'window'})
	tabs.forEach((tab) => {
	  // ...and refresh each one of them
	  tab.navigate(tab.url)
	})
  })