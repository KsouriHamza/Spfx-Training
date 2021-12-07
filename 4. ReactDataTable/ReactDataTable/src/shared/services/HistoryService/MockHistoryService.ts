import { ServiceScope } from "@microsoft/sp-core-library";
import { IHistoryItem } from "../../models/IHistoryItem";
import { IHistoryService } from "./IHistoryService";


export default class MockHistoryService implements IHistoryService{
    getHistoryFields(): Promise<any[]> {
        throw new Error("Method not implemented.");
    }
    public context: ServiceScope;

    getHistoryItems(): Promise<IHistoryItem[]> {
        throw new Error("Method not implemented.");
    }
    
}