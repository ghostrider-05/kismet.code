import {
    BaseKismetConnection,
    BaseSequenceItem,
    ItemConnection,
    Sequence,
    SequenceAction,
    SequenceCondition,
    SequenceEvent,
    SequenceNode,
    SequenceVariable,
    VariableConnection,
} from '../../src/index.js'

import type { ClassConstructor } from '@kismet.ts/shared'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type builderOptions<T extends ClassConstructor<any, [any]>> = Partial<
    ConstructorParameters<T>[0]
>

const baseBuilderData = {
    Package: 'Package',
    Class: 'Archetype',
    Name: 'test',
    Index: 0,
}

const baseBuilderArchetype =
    baseBuilderData.Class +
    `'${baseBuilderData.Package}.${baseBuilderData.Name}'` //"Archetype'Package.test'"
const baseBuilderClassType = `Class'${baseBuilderData.Package}.${baseBuilderData.Class}'`

const itemBuilderOptions = (
    options?: builderOptions<typeof BaseSequenceItem>
) => {
    return {
        ObjectArchetype: options?.ObjectArchetype ?? baseBuilderArchetype,
        inputs: options?.inputs ?? {},
        ...options,
    }
}

const baseConnectionBuilder = (
    options: ConstructorParameters<typeof BaseKismetConnection>[0]
) => {
    return new BaseKismetConnection(options)
}

const itemConnectionBuilder = (
    ...options: ConstructorParameters<typeof ItemConnection>
) => {
    return new ItemConnection(...options)
}

const variableConnectionBuilder = (
    ...options: ConstructorParameters<typeof VariableConnection>
) => {
    return new VariableConnection(...options)
}

const actionBuilder = (options?: builderOptions<typeof SequenceAction>) => {
    return new SequenceAction(itemBuilderOptions(options))
}

const conditionBuilder = (
    options?: builderOptions<typeof SequenceCondition>
) => {
    return new SequenceCondition(itemBuilderOptions(options))
}

const eventBuilder = (options?: builderOptions<typeof SequenceEvent>) => {
    return new SequenceEvent(itemBuilderOptions(options))
}

const nodeBuilder = (options?: builderOptions<typeof SequenceNode>) => {
    return new SequenceNode(itemBuilderOptions(options))
}

const sequenceBuilder = (options?: builderOptions<typeof Sequence>) => {
    return new Sequence(options)
}

const variableBuilder = (options?: builderOptions<typeof SequenceVariable>) => {
    return new SequenceVariable(itemBuilderOptions(options))
}

export default {
    baseBuilderArchetype,
    baseBuilderData,
    baseBuilderClassType,
    util: {
        rawKeys: Sequence.rawKeys,
        hasRawValue: Sequence.hasRawValue,
    },
    baseConnectionBuilder,
    itemConnectionBuilder,
    variableConnectionBuilder,
    actionBuilder,
    conditionBuilder,
    eventBuilder,
    nodeBuilder,
    sequenceBuilder,
    variableBuilder,
}
