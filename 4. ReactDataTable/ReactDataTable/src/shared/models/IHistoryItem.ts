import { IItemListe } from "./IItemListe";

export interface IHistoryItem extends IItemListe {
    field_0: string;
    field_1: string;
    field_3: string;
    field_4: string;
    field_5: string;
    field_6: string;
    field_7: string;
    field_8: string;
    field_9: string;

    getColumnsExpand?(): string[];
}