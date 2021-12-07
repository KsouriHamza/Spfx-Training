import { IHistoryItem } from "./IHistoryItem"

export const itemHistory :IHistoryItem = {
    field_1: "",
    field_0: "",
    field_3: "",
    field_4: "",
    field_5: "",
    field_6: "",
    field_7: "",
    field_8: "",
    field_9: "",
    Id: "",
    Title: "",
    getColumns(): string[] {
        return [
            "field_4",
            "field_0",
            "field_1",
            "field_6",
            "field_7",
            "Id"/*,
            "Title",
           
            "field_1",
            "field_3",
            
            "field_5",
            
            
            "field_8"*/
        ];
    }
};

//#region  Configuration de la liste

export const historyListName = "History";
export const sortBy  = ["field_0","field_1","field_3","field_7"];
export const searchBy =["field_0"];
export const filterDateBy="field_7" 
export const enableSorting = true;
export const enablePagination = true;
export const enableSearching = true;
export const evenRowColor= "#FFFFFF";
export const oddRowColor= "#FFFFFF";
export const fieldWithIcon="field_4";


//#endregion
