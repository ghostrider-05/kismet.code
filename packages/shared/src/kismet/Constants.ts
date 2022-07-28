/**
 * Default name for the main sequence in a project
 */
export const DefaultMainSequenceName = 'Main_Sequence'

/**
 * Map of item versions when an item has a version that is > 1.
 * 
 * UDK will give an incorrect version when an item has a lower version.
 * If the item is an event, it will also give an incorrect version when the version given is higher.
 */
export const ObjInstanceVersions = new Map<string, number>()
    .set('SeqAct_ConvertToString', 2)
    .set('SeqAct_DrawText', 3)
    .set('SeqAct_SetInt', 2)
    .set('SeqEvent_Touch', 2)
    .set('SeqEvent_LevelLoaded', 3)

export * from './enum.js'