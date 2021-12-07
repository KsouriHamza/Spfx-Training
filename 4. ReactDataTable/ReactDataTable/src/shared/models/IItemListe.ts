  /**
  * Default List Items .
  */
export interface IItemListe  {
    Id: string;
    Title: string;
    Modified?: Date;
    Created?: Date;
    getColumns?(): string[];
    getColumnsValeurs?(): any;
}

/**
 * Query setting 
 */
export interface IOrderQuery {
    NomColonne: string;
    Ascendant:boolean;
  }