interface Env {
    KISMET_KV: KVNamespace
}

export default <ExportedHandler<Env>>{
    async fetch (request, env) {
        const version = await env.KISMET_KV.get('latest_version')
        const { pathname } = new URL(request.url)

        if (pathname.startsWith('/patch-url')) {
            const website = 'https://www.rocketleague.com/news/'
            const pathNotesUrl = (version: string) => `${website}patch-notes-v${version.replace('.', '-')}/`

            return Response.redirect(version ? pathNotesUrl(version) : website)
        }

        const message = {
            "schemaVersion": 1,
            "label": "rocketleague version",
            "message": version ? ('v' + version) : 'unknown',
            "color": "orange"
        }

        return new Response(JSON.stringify(message), {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'max-age=604800',
            }
        })
    }
}