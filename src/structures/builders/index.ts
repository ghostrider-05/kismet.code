export { default as builders } from './sequence.js'
export * from './json.js'

/**
 * Make a test wether a promise throws in a subcall
 * @param fn The function to test
 * @param Throw Whether the promise should throw
 */
export const catchTest = async (fn: () => Promise<void>, Throw = true) => {
    const statements = (equal: boolean) => () => expect(true).toBe(equal)

    await fn().then(statements(!Throw)).catch(statements(Throw))
}
