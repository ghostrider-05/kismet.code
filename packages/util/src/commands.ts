import { Sequence } from "@kismet.ts/core";

export interface Command<Args extends unknown[]> {
    name: string;
    description: string;
    run: (sequence: Sequence, ...args: Args) => void
}

export class Commands {
    public static get commands () {
        return [
            this.renameCommand,
        ]
    }

    public static renameCommand: Command<[name: string]> = {
        name: 'rename',
        description: 'Rename Sequence',
        run: (sequence, name) => {
            sequence.setName(name)
        }
    }
}