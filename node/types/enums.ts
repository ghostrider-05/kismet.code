export enum ConnectionType {
    INPUT = 'input',
    OUTPUT = 'output',
    VARIABLE = 'variable'
}

export enum DefaultConnectionName {
    IN = 'In',
    OUT = 'Out'
}

export enum KismetBoolean {
    True = 'True',
    False = 'False'
}

export enum LogLevel {
    ALL = 0,
    DEBUG = 1,
    ERRORS = 2,
    NOTHING = 3
}

export enum NodeProperty {
    CATEGORY = 'ObjCategory',
    LINKS_INPUT = 'InputLinks',
    LINKS_OUTPUT = 'OutputLinks',
    LINKS_VARIABLE = 'VariableLinks',
    NAME = 'ObjName'
}

export enum NodeType {
    ACTIONS = 'actions',
    CONDITIONS = 'conditions',
    EVENTS = 'events',
    VARIABLES = 'variables'
}
