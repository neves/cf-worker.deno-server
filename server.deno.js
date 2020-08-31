import { serve } from "https://deno.land/std/http/server.ts"
const PORT = 8787

class FetchEventDeno extends CustomEvent {
  constructor(type, init, responder) {
    super(type, init)
    this.request = init.request
    this.clientId = init.clientId
    this.responder = responder
  }

  waitUntil(promise) {
    promise
      .then(data => console.log("waitUntil.then", data))
      .catch(data => console.log("waitUntil.catch", data))
  }

  async respondWith(responsePromise) {
    const response = await responsePromise
    console.log(response.headers)
    console.log(await response.text())
    this.responder(response)
  }
}

function buildResponder(req) {
  return async function responder(response) {
    req.respond({
      body: await response.text(),
      status: response.status,
      headers: response.headers,
    })
  }
}

async function run() {
  const server = serve({ port: PORT })
  const url = `http://localhost:${PORT}`
  console.log(url)
  for await (const req of server) {
    // Uint8Array: new TextDecoder().decode(body)
    const body = await Deno.readAll(req.body)
    const request = new Request(url + req.url, {
      method: req.method,
      headers: req.headers,
      body,
    })

    const initEvent = { request }
    const responder = buildResponder(req)
    const fetchEvent = new FetchEventDeno("fetch", initEvent, responder)

    dispatchEvent(fetchEvent)
  }
}

run()
