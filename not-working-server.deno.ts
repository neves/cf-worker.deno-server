// @ts-ignore
import { serve } from "https://deno.land/std/http/server.ts"
const PORT = 8000

class FetchEventDeno extends CustomEvent<FetchEvent> implements FetchEvent {
  constructor(type: string, init: FetchEventInit, responder: Responder) {
    super(type, init)
    this.request = init.request
    this.clientId = init.clientId!
    this.responder = responder
  }

  responder: Responder
  request: Request
  clientId: string
  preloadResponse!: Promise<any>
  replacesClientId!: string
  resultingClientId!: string
  passThroughOnException!: () => void

  waitUntil(_: any): void {
    throw new Error("Method not implemented.")
  }

  async respondWith(responsePromise: Promise<Response>) {
    const response = await responsePromise
    console.log(response.headers)
    console.log(await response.text())
    this.responder(response)
  }
}

function buildResponse(req: any) {
  return async function responder(response: Response) {
    req.respond({
      body: await response.text(),
      status: response.status,
      headers: response.headers,
    })
  }
}

async function run() {
  const server = serve({ port: PORT })
  const url = `http://localhost:${PORT}/`
  console.log(url)
  // @ts-ignore
  for await (const req of server) {
    const request = new Request(url + req.url, {
      headers: req.headers,
    })

    const initEvent = { request }
    const fetchEvent = new FetchEventDeno(
      "fetch",
      initEvent,
      buildResponse(req),
    )

    dispatchEvent(fetchEvent)
  }
}

run()
