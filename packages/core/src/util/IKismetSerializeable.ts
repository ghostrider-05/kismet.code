import { SequenceItemType } from "../structures";

export interface IKismetSerializeable<Item extends SequenceItemType[] = SequenceItemType[]> {
    serialize (): Item;
}