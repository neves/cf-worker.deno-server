type Responder = (response: Response) => void

interface ExtendableEventInit extends EventInit {}

interface ExtendableEvent extends Event {
  waitUntil(f: any): void
}

interface FetchEvent extends ExtendableEvent {
  readonly clientId: string
  readonly preloadResponse: Promise<any>
  readonly replacesClientId: string
  readonly request: Request
  readonly resultingClientId: string
  respondWith(r: Response | Promise<Response>): void
}

interface FetchEventInit extends ExtendableEventInit {
  clientId?: string
  preloadResponse?: Promise<any>
  replacesClientId?: string
  request: Request
  resultingClientId?: string
}

interface FetchEvent extends ExtendableEvent {
  readonly clientId: string
  readonly preloadResponse: Promise<any>
  readonly replacesClientId: string
  readonly request: Request
  readonly resultingClientId: string
  respondWith(r: Response | Promise<Response>): void
}
