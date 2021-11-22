
export  interface IFactory {
    getAllItems(  listName: string): Promise<any[]>;
    updateItemById(listName: string, item:any);
    deleteItemById(listName: string, itemId:any):void;
    addItem(listName: string, newItem:any) :Promise<any>;
}