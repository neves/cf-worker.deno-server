// @ts-ignore
addEventListener("fetch", (event: FetchEvent) => {
  event.respondWith(handleRequest(event))
})
// @ts-ignore
function handleRequest(event: FetchEvent) {
  return new Response("url: " + event.request.url)
}
