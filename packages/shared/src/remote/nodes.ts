export type RemoteKismetAssetType =
    | 'classes'
    | 'nodes'
    | 'blender'
    | 'itemdb'

export interface IResponse {
    ok: boolean;
    json: () => Promise<unknown>;
    text: () => Promise<string>;
}

export interface RemoteKismetAssetFetchOptions {
    /**
     * The version of the asset to fetch. 
     * If an incorrect asset version is provided, an error will be thrown
     */
    version: string
    /**
     * A base implementation of a cross platfrom compatible fetch function.
     * Use the current platform's fetch implementation for this value.
     * TODO: remove when all platforms have same fetch / type exists for this
     */
    fetch: (url: string) => Promise<IResponse>
    /**
     * The data type of the asset to retreive
     * @default 'json'
     */
    type?: 'text' | 'json'
}

/**
 * Small class wrapper around remote kismet assets.
 */
export class RemoteKismet {
    protected static createUrl (type: RemoteKismetAssetType, version: string) {
        const _url = "https://ghostrider-05.com/kismet/download"

        return _url + `?type=${type}` + (version != undefined ? `&version=${version}` : '')
    }

    public static async fetchAsset (type: RemoteKismetAssetType, options: RemoteKismetAssetFetchOptions) {
        const url = RemoteKismet.createUrl(type, options.version)
        const res = await options.fetch(url)

        if (!res.ok) throw new Error(JSON.stringify(res))

        const fn = options.type === 'text' ? res.text : res.json

        return await fn()
    }

    // TODO: want to implement this here??
    private static async fetchDummyAsset (name: string) {
        return name
    };
}