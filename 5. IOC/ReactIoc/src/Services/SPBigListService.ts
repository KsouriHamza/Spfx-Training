import { ServiceScope } from "@microsoft/sp-core-library";
import { injectable } from "inversify";
import { IItemBigListe } from "../Models/IItemBigListe";
import { IBigListService } from "./IBigListService";
import SPODataSources from "./SPODataSource";

const itemBg :IItemBigListe = {
    field_1: "",
    field_2: "",
    field_3: "",
    field_4: 0,
    Id: "",
    Title: "",
    getColumns(): string[]{
        return [
            "Id",
            "Title",
            "field_1",
            "field_2",
            "field_3",
            "field_4"
        ]
    }
}

@injectable()
export default class SPBigListService implements IBigListService{
   
    public context: ServiceScope;
   
    constructor(){
        console.log(this.context);
        
    }
    async getItems(): Promise<IItemBigListe[]> {

        let bgListInst = await SPODataSources.getInstance<IItemBigListe>(itemBg,"BigListTest");
        var data = bgListInst.GetListData();
        console.table(data);
        return data;
       // throw new Error("Method not implemented.");
    }
    
    
}