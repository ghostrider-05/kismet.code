export function readArchetype (
    archetype: string
): Record<'Class' | 'Package', string> {
    const [Class, defaultClass] = archetype.split("'")
    const [Package] = defaultClass.split('.')

    return {
        Class,
        Package,
    }
}
