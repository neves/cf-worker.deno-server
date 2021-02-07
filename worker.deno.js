import { listenAndServe } from "https://deno.land/std/http/server.ts"
import { readerFromStreamReader } from "https://deno.land/std/io/mod.ts"

// https://developer.mozilla.org/pt-BR/docs/Web/API/Request/Request
class FetchEventDeno extends CustomEvent {
  constructor(type, init) {
    super(type, init)
    this.request = init.request
    this.originalRequest = init.originalRequest
  }

  waitUntil(promise) {
    promise
      .then(data => console.log("waitUntil.then", data))
      .catch(data => console.log("waitUntil.catch", data))
  }

  async respondWith(response) {
    // response can be a Promise
    response = await response
    response = convertResponse(response)
    this.originalRequest.respond(response)
    this.stopImmediatePropagation()
  }
}

async function handler(originalRequest) {
  const request = await convertToRequest(originalRequest)
  dispatchEvent(new FetchEventDeno("fetch", { request, originalRequest }))
}

/**
 * Makes Request more debuggable
 */
function decorateRequest(request) {
  Object.defineProperties(request, {
    // toJSON: {
    //   value: function () {
    //     const { url, method, headers } = this
    //     return { class: "Request", url, method, headers }
    //   },
    //   enumerable: false,
    // },
    // headers: {
    //   value: request.headers,
    //   enumerable: true,
    // },
    url: {
      value: request.url,
      enumerable: true,
    },
    method: {
      value: request.method,
      enumerable: true,
    },
    body: {
      value: request.body,
      enumerable: true,
    },
  })
}

/**
 * Converts CloudFlare Worker Response https://developer.mozilla.org/pt-BR/docs/Web/API/Response
 * to Response from https://deno.land/std/http/server.ts
 * Just the body needs conversion.
 */
function convertResponse(response) {
  return {
    status: response.status,
    headers: response.headers,
    body: response.body && readerFromStreamReader(response.body.getReader()),
  }
}

/**
 * Converts a Request from https://deno.land/std/http/server.ts
 * to a CloudFlare Worker Request https://developer.mozilla.org/pt-BR/docs/Web/API/Request
 */
async function convertToRequest(originalRequest) {
  // url contains just the pathname part
  const url = "http://0.0.0.0" + originalRequest.url

  // makes body compatible with Request body by reading it all in advance
  const body = await Deno.readAll(originalRequest.body)

  const request = new Request(url, {
    method: originalRequest.method,
    headers: originalRequest.headers,
    body,
  })

  decorateRequest(request)

  return request
}

// dynamically loading relative file from command line
// watch will not restart if that file changes.
const file = Deno.args[0]
if (file) {
  console.log("loading " + file)
  import(file)
}

const port = +(Deno.env.get("PORT") || "8787")
listenAndServe({ port }, handler)
console.log("Listening on: http://0.0.0.0:" + port)
