import type { CacheStorage } from "./types.js";

declare const caches: CacheStorage;

export interface R2AssetHandlerOptions { 
    req: Request
    ctx: ExecutionContext
    cacheOptions: {
        use: boolean
        control: string
        versionedControl?: string
    }
    auth: string
    bucket: R2Bucket
    transform?: (object: R2Object, params: URLSearchParams) => Promise<ReadableStream | undefined>
}

export interface R2AssetHandlerItem {
    key: string
    versioned?: boolean
    view?: boolean
    messages?: {
        error?: string
        unauthorized?: string
        put?: string
    }
    headersToAppend?: [name: string, value: string][]
}

/**
 * Handles requests to a R2 bucket with options for:
 * - simple auth (for PUT requests)
 * - Cache API
 * - reading and writing objects
 * @param options Request lifecycle options
 * @param item The item to read / write
 */
export async function handleR2AssetReq (
    options: R2AssetHandlerOptions, 
    item: R2AssetHandlerItem,
) {
    const { cacheOptions, ctx, auth, bucket, req } = options
    const { key, headersToAppend, messages, versioned, view } = item

    if (req.method === 'PUT') {
        if (req.headers.get('Authorization') !== auth) {
            return new Response(messages.unauthorized, { status: 403 })
        }

        await bucket.put(key, req.body);
        return new Response(messages.put, { status: 200 })
    } else if (req.method === 'GET') {
        let response: Response | undefined = undefined
        const cache = caches.default;
        const url = new URL(req.url);
        const cacheKey = new Request(url.toString(), req);

        if (cacheOptions.use) {      
            response = await cache.match(cacheKey);
      
            if (response) {
                console.log(`Cache hit for: ${req.url}.`);
                return response;
            }
      
            console.log(
              `Response for request url: ${req.url} not present in cache. Fetching and caching request.`
            );
        }

        const object = await bucket.get(key);

        if (object == null) {
            return new Response(messages.error, { status: 404 })
        }

        const headers = new Headers();

        headers.append('Access-Control-Allow-Origin', '*')
        headers.append('Content-Disposition', view ? 'inline' : 'attachment')

        object.writeHttpMetadata(headers);
        headers.set('etag', object.httpEtag);

        if (headersToAppend) {
            for (const [name, value] of headersToAppend) {
                headers.append(name, value)
            }

            headers.set('Access-Control-Expose-Headers', headersToAppend.join(','))
        }

        const body = await options.transform?.(object, new URL(req.url).searchParams) ?? object.body

        if (!cacheOptions.use) {
            return new Response(body, { status: 200, headers })
        } else {
            const { control, versionedControl } = cacheOptions
            headers.append('Cache-Control', versioned ? (versionedControl ?? control) : control);
        
            response = new Response(body, {
                headers,
            });
  
            ctx.waitUntil(cache.put(cacheKey, response.clone()));
            return response;
        }
    } else return new Response(null, { status: 400 })
}