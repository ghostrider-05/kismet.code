import { RawUnrealJsonFile } from "../classes/index.js";

enum TreeCharacters {
    End = '|--',
    Split = '|--',
    Line = '|'
}

function logNode (node: RawUnrealJsonFile) {
    console.log(node.name);

    for (let i = 0; i < node.variables.length; i++)
    {
        const prefix = i + 1 === node.variables.length ? TreeCharacters.End : TreeCharacters.Split;
        const v = node.variables[i];

        console.log(`${prefix} ${typeof v.category === 'string' ? `(${v.category})` : ''} ${v.name} {${v.type}} ${v.replicated === 'True' ? '[R]' : ''}`)
    }
}

export function logTree (nodes: RawUnrealJsonFile[], logSuper = true) {
    if (!logSuper)
        return logNode(nodes[0])

    for (let i = 0; i < nodes.length; i++) {
        logNode(nodes[i])
    }
}