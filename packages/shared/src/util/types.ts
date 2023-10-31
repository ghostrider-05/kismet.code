export type ArrayUnion<T> = T | T[]

export type Awaitable<T = void> = Promise<T> | T

export type ClassConstructor<T = unknown, U extends unknown[] = []> = new (
    ...args: U
) => T

export type Enum<T extends string> = T | `${T}`

export type If<T extends boolean, U, P = undefined> = T extends true ? U : P

export type ExtendingProperties<T, V> = keyof T extends infer K ? K extends keyof T ? T[K] extends V ? K : never : never : never
