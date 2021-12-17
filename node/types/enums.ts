/**
 * Types of connections that can be made to a kismet node
 */
export const enum ConnectionType {
    INPUT = 'input',
    OUTPUT = 'output',
    VARIABLE = 'variable'
}

/**
 * Default input and output connection names when no other connections are present 
 */
export const enum DefaultConnectionName {
    IN = 'In',
    OUT = 'Out'
}

/**
 * Kismet String representations for booleans
 */
export const enum KismetBoolean {
    True = 'True',
    False = 'False'
}

/**
 * Common variables in the default properties of a kismet node
 * 
 * When the property is an array, only the name is present
 */
export const enum NodeProperty {
    CATEGORY = 'ObjCategory',
    LINKS_INPUT = 'InputLinks',
    LINKS_OUTPUT = 'OutputLinks',
    LINKS_VARIABLE = 'VariableLinks',
    NAME = 'ObjName'
}

/**
 * Categories for kismet nodes
 */
export enum NodeType {
    ACTIONS = 'actions',
    CONDITIONS = 'conditions',
    EVENTS = 'events',
    SEQUENCES = 'sequences',
    VARIABLES = 'variables'
}

/**
 * Options for layouts
 * 
 * - none: set no position
 * - default: apply only layoutOptions
 * - grid: place all nodes in a grid
 * - waterfall: place the next object in the sequence right and below the current object
 * - mountain: place the next object in the sequence right and above the current object
 * - schema: apply the options in the given schema
 * 
 * @default 'default'
 */
export const enum PositionStyleOption {
    DEFAULT = 'default',
    NONE = 'none',
    GRID = 'grid',
    MOUNTAIN = 'mountain',
    SCHEMA = 'schema',
    WATERFALL = 'waterfall'
}

/**
 * Position options for variables
 * 
 * - inherit: set default positions
 * - global: set all variables in global box
 * - attach: place variables close to the first connected item
 * - schema: apply the options in the given schema
 * 
 * @default 'inherit'
 */
export const enum VariablePositionStyleOption {
    INHERIT = 'inherit',
    ATTACH = 'attach',
    GLOBAL = 'global',
    SCHEMA = 'schema'
}
