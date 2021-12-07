import { ServiceScope } from "@microsoft/sp-core-library";
import { IItemBigListe } from "../Models/IItemBigListe";
import { IServiceBase } from "../Warpper";

export interface IBigListService extends IServiceBase<ServiceScope> {
    getItems(): Promise<IItemBigListe[]>; 
}

