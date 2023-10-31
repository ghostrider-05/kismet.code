import { R2AssetHandlerItem, handleR2AssetReq } from '../../shared/r2.js'

interface Env {
    KISMET_ASSETS: R2Bucket
    KISMET_KV: KVNamespace
    TAGS: string
    AUTH: string
    CACHE_DISABLED_MODE: string
}

export default<ExportedHandler<Env>> {
    async fetch (request, env, ctx) {
        const LATEST_KV_KEY = 'latest_version'
        const { pathname, searchParams } = new URL(request.url)

        const handleR2Req = (item: R2AssetHandlerItem) => handleR2AssetReq({
            bucket: env.KISMET_ASSETS,
            auth: env.AUTH,
            ctx,
            cacheOptions: { 
                use: searchParams.get('mode') !== env.CACHE_DISABLED_MODE, 
                versionedControl: 'max-age=31536000, immutable',
                control: 'max-age=604800',
            },
            req: request,
        }, item)

        if (pathname.startsWith('/assets')) {
            let version = searchParams.get('version')
            const tag = searchParams.get('tag'),
                useLatestVersion = version === 'latest'
            
            if (!version || !tag || !env.TAGS.split(',').includes(tag)) {
                return new Response(null, { status: 400 })
            }

            const latest = await env.KISMET_KV.get(LATEST_KV_KEY, { type: 'text', cacheTtl: 604800 })
            if (!latest) return new Response(null, { status: 500 })

            if (useLatestVersion) {
                version = latest
            }

            const key = `versions/${version}/${tag}`

            return await handleR2Req({ key, 
                messages: { error: 'Asset not found for version ' + version },
                versioned: !useLatestVersion,
                view: ['true', '1'].includes(searchParams.get('view')),
                headersToAppend: [
                    ['x-kismet-latest-version', latest],
                ],
            })
        } else if (pathname.startsWith('/images')) {
            const name = searchParams.get('name')

            if (!name) return new Response(null, { status: 400 })

            return await handleR2Req({ 
                key: `images/${name}`, 
                messages: { error: 'Image not found for this class...' },
            })
        }

        return new Response(null, { status: 404 });
    },
};