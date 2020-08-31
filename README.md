# Cloudflare Worker deno server emulator

This is a experiment to replace `wrangler preview --watch` with [Deno](https://deno.land/).

This idea is based on that Deno has the same api as Service Workers:
- [addEventListener](https://doc.deno.land/builtin/stable#addEventListener)
- [fetch](https://doc.deno.land/builtin/stable#fetch)
- [Request](https://doc.deno.land/builtin/stable#Request)
- [Response](https://doc.deno.land/builtin/stable#Response)
- [URL](https://doc.deno.land/builtin/stable#URL)
- [URLSearchParams](https://doc.deno.land/builtin/stable#URLSearchParams)

That would be harder using Node, cause would need polyfill for all those objects.

## HOW TO

Create a entry file `entry.deno.ts` that imports deno-server followed by Cloudflare Worker entry file.

```ts
import "server.deno.js"
import "./entry.worker.ts"
```
And run using denon to watch for file changes:

`denon run --allow-net entry.deno.ts`

## TODO

- [ ] Configure PORT
- [ ] bin script to run against `entry.worker.ts`
- [ ] Make typescript version work

