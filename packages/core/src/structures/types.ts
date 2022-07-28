import { ArrayUnion, Constants, Enum} from '@kismet.ts/shared'

export interface KismetVectorComponents {
    x: number
    y: number
    z: number
}

export type KismetPosition = Omit<KismetVectorComponents, 'z'>

export type UDKArchetype = `${string}'${string}.${string}'`

export type UDKSceneObject = string

export type UDKContentBrowserObject = 'None' | string

export type SchemaItemNames = ArrayUnion<
    Omit<SequenceItemTypeName, 'events' | 'conditions' | 'sequences'>
>

export type SequenceItemType =
    | BaseSequenceItem
    | SequenceAction
    | SequenceCondition
    | SequenceVariable
    | SequenceEvent

export type SequenceItemTypeName = Enum<Constants.NodeType>

export type KismetVariableValue = string | number | boolean | null | undefined

export type KismetVariableDefaultValue = `(${string})`