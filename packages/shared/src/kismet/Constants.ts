/**
 * Default name for the main sequence in a project
 */
export const DefaultMainSequenceName = 'Main_Sequence'

/**
 * Default UDK nodes that are deprecated and should not be used
 */
export const deprecatedNodes = new Set<string>()
    .add('SeqAct_AddRemoveFaceFXAnimSet')
    .add('SeqAct_DelaySwitch')
    .add('SeqAct_SetMatInstTexParam')
    .add('SeqAct_SetMatInstVectorParam')
    .add('SeqAct_RangeSwitch')

/**
 * Map of item versions when an item has a version that is > 1.
 * 
 * UDK will give an incorrect version when an item has a lower version.
 * If the item is not an event, it will also give an incorrect version when the version given is higher.
 * 
 * If the version is < 0, no version should be provided to the node.
 * 
 * Create a new issue if a class is missing: https://github.com/ghostrider-05/kismet.ts/issues/new
 */
export const ObjInstanceVersions = new Map<string, number>()
    .set('SeqAct_MainMenuSwitch_TA', -1)
    .set('SeqAct_AttachToActor', 2)
    .set('SeqAct_CameraFade', 2)
    .set('SeqAct_CameraShake', 2)
    .set('SeqAct_CarMatinee_TA', 2)
    .set('SeqAct_ConsoleCommand', 2)
    .set('SeqAct_ConvertToString', 2)
    .set('SeqAct_GetLocationAndRotation', 2)
    .set('SeqAct_GetVelocity', 2)
    .set('SeqAct_HeadTrackingControl', 2)
    .set('SeqAct_Interp', 2)
    .set('SeqAct_MITV_Activate', 2)
    .set('SeqAct_PlayCameraAnim', 2)
    .set('SeqAct_PlaySound', 2)
    .set('SeqAct_RandomSwitch', 2)
    .set('SeqAct_SetFloat', 2)
    .set('SeqAct_SetInt', 2)
    .set('SeqAct_SetObject', 2)
    .set('SeqAct_SetCameraTarget', 2)
    .set('SeqAct_Teleport', 2)
    .set('SeqAct_UpdatePhysBonesFromAnim', 2)
    .set('SeqCond_CompareBool', 2)
    .set('SeqEvent_RemoteEvent', 2)
    .set('SeqEvent_Touch', 2)
    .set('SeqAct_ActivateRemoteEvent', 3)
    .set('SeqAct_AIMoveToActor', 3)
    .set('SeqAct_DrawText', 3)
    .set('SeqAct_FeatureTest', 3)
    .set('SeqEvent_LevelLoaded', 3)
    .set('SeqAct_Log', 3)
    .set('SeqAct_SetLocation', 3)
    .set('SeqAct_StreamInTextures', 3)
    .set('SeqAct_ToggleHUD', 3)
    .set('SeqAct_CameraLookAt', 4)
    .set('SeqAct_SetSoundMode', 4)
    .set('SeqAct_ChangeCollision', 5)

export * from './enum.js'