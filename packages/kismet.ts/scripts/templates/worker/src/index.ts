import { 
    ExportedHandler,
    KVNamespace,
    R2Bucket,
    Request,
    Response,
// } from '../../shared/types.js'
} from '@cloudflare/workers-types/2022-11-30'

interface Env {
    BUCKET: R2Bucket
    KV: KVNamespace
}

async function handleRequest (request: Request, env: Env) {
    return new Response()
}

export default<ExportedHandler<Env>> {
    async fetch (request, env) {
        const { pathname, searchParams } = new URL(request.url)

        if (pathname.startsWith('/')) {
            return await handleRequest(request, env)
        }

        return new Response(null, { status: 404 });
    },
};