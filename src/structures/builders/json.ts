export const JSONnode = {
    name: 'WaitforLevelstobevisible',
    Class: 'SeqAct_WaitForLevelsVisible',
    Package: 'Engine',
    variables: [
        {
            flags: '',
            name: 'LevelNames',
            type: 'array<name>',
            replicated: 'False'
        },
        {
            flags: '',
            name: 'bShouldBlockOnLoad',
            type: 'bool',
            replicated: 'False'
        }
    ],
    category: '"Engine"',
    type: 'actions',
    archetype:
        '"SeqAct_WaitForLevelsVisible\'Engine.Default__SeqAct_WaitForLevelsVisible\'"',
    displayName: '"Wait for Levels to be visible"',
    defaultproperties: [
        {
            name: 'bShouldBlockOnLoad',
            value: 'true'
        }
    ],
    links: {
        input: [
            {
                name: '"Wait"'
            }
        ],
        output: [
            {
                name: '"Finished"'
            }
        ],
        variable: []
    }
}
