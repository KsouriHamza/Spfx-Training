import { IFactory } from "./IFactory";
import { sp } from "@pnp/sp/presets/all";
import { ISampleList1Item } from "../models/ISampleListItem";

export class ListItemsFactory implements IFactory {
   
    async getAllItems(listName: string): Promise<any[]> {
        try {
            
            let items : ISampleList1Item[];
        items = await sp.web.lists.getByTitle(listName).items.getAll();
        return items
            
        } catch (error) {
            
        }               
    }
    updateItemById(listName: string, item: any) {
        throw new Error("Method not implemented.");
    }
    deleteItemById(listName: string, itemId: any) {
        throw new Error("Method not implemented.");
    }
    addItem(listName: string, newItem: any): Promise<any> {
        throw new Error("Method not implemented.");
    }


}