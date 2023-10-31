import { Sequence, SequenceItemType } from "@kismet.ts/core";
import { Command } from "./commands";

interface TaskResult {
    item: SequenceItemType
}

export class Actions {
    //PasteCount
    private history: TaskResult[] = [];
    private maxHistory = 10
    private currentHistoryIndex = 0

    public constructor (
        private readonly throwErrorOnInvalidAction?: boolean
    ) {}

    public get canUndo (): boolean {
        return this.currentHistoryIndex < this.maxHistory
    }

    public get canRedo (): boolean {
        return this.currentHistoryIndex > 0
    }

    public run <T extends unknown[]> (command: Command<T>, sequence: Sequence, ...args: T): this {
        command.run(sequence, ...args)

        this.history.push()
        this.currentHistoryIndex += 1

        return this
    }

    public undo (): void {
        if (!this.canUndo && this.throwErrorOnInvalidAction) {
            throw new Error('Unable to perform the undo action on current item set')
        }

        this.currentHistoryIndex += 1;
    }

    public redo (): void {
        if (!this.canRedo && this.throwErrorOnInvalidAction) {
            throw new Error('Unable to perform the redo action on current item set')
        }

        this.currentHistoryIndex -= 1;
    }
}