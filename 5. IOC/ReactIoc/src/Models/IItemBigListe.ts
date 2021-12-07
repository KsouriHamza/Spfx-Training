import { IItemListe } from "./IItemListe";

export interface IItemBigListe extends IItemListe {
  field_1: string;
  field_2: string;
  field_3: string;
  field_4: number;

  getColumnsExpand?(): string[];
}