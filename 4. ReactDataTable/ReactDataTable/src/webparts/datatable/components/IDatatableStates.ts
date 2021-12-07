import { IColumn } from "office-ui-fabric-react";

export interface IDatatableStates {
    listItems: any[];
    columns: IColumn[];
    page: number;
    rowsPerPage?: number;
    searchText: string;
    contentType: string;
    sortingFields: string;
    pageOfItems: any[];
    sortDirection: 'asc' | 'desc';
    filterNumber:number;
    filterSystem:string;
  }
  