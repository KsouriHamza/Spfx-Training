import { ServiceScope } from "@microsoft/sp-core-library";
import { IServiceBase } from "../../../spfx-di-wrapper";
import { IHistoryItem } from "../../models/IHistoryItem";
import 'reflect-metadata';

export interface IHistoryService extends IServiceBase<ServiceScope> {
    getHistoryItems(): Promise<IHistoryItem[]>; 
    getHistoryFields(): Promise<any[]>;
}
