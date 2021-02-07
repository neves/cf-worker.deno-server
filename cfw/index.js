let counter = 0
let boot // can't initialize here

async function handleRequest({ request }) {
  counter++
  boot = boot || new Date()
  const uptime = (Date.now() - boot.getTime()) / 1000
  const response = {
    counter,
    boot,
    uptime
  }
  return jsonResponse(response)
}

addEventListener("fetch", event => {
  console.log("fetch")
  event.respondWith(handleEvent(event))
})

function handleEvent(event) {
  return cors(event.request) || favicon(event.request) || handleRequest(event)
}

function jsonResponse(data) {
  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      "content-type": "application/json",
      ...CORS
    }
  })
}

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "*",
  "Access-Control-Allow-Headers": "*",
  "access-control-max-age": "86400"
}

function cors(request) {
  if (request.method.toUpperCase() === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Content-Length": "0",
        ...CORS
      }
    })
  }
}

function favicon(request) {
  console.log(request, JSON.stringify(request))
  if (new URL(request.url).pathname === "/favicon.ico") {
    return new Response(null, {
      status: 301, // ou 204 No Content
      headers: {
        "Content-Type": "image/x-icon",
        "Cache-Control": "public, max-age=15552000"
      }
    })
  }
}
