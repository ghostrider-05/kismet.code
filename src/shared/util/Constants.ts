import type { layoutOptions, SequenceViewOptions } from '../../types/index.js'

const KISMET_LINE_INDENT = '   '
const MAIN_SEQUENCE = "Sequence'Main_Sequence'"

const DefaultLayoutOptions: Required<layoutOptions> = {
    startX: 500,
    startY: 500,
    spaceBetween: 200
}

const DefaultSequenceViewOptions: Required<SequenceViewOptions> = {
    x: 0,
    y: 0,
    zoom: 1
}

const KISMET_CLASSES_PREFIXES = [
    {
        prefix: 'SeqAct_',
        type: 'actions'
    },
    {
        prefix: 'SeqCond_',
        type: 'conditions'
    },
    {
        prefix: 'SeqEvent_',
        type: 'events'
    }
]

const KISMET_NODE_LINES = {
    begin: (name: string, Class: string): string =>
        `Begin Object Class=${Class} Name=${name}`,
    end: 'End Object'
}

const ObjInstanceVersions = new Map<string, number>()
    .set('SeqAct_ConvertToString', 2)
    .set('SeqAct_DrawText', 3)
    .set('SeqAct_SetInt', 2)

export * from '../../types/enums.js'
export {
    KISMET_CLASSES_PREFIXES,
    KISMET_LINE_INDENT,
    KISMET_NODE_LINES,
    MAIN_SEQUENCE,
    DefaultLayoutOptions,
    DefaultSequenceViewOptions,
    ObjInstanceVersions
}
