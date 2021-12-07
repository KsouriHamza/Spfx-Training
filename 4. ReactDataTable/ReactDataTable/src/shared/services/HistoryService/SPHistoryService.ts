import { ServiceScope } from "@microsoft/sp-core-library";
import { sp } from "@pnp/sp/presets/all";
import { injectable } from "inversify";
import { historyListName, itemHistory } from "../../models/HistoryConsts";
import { IHistoryItem } from "../../models/IHistoryItem";
import SPODataSources from "../SPODataSource";
import { IHistoryService } from "./IHistoryService";
import { PageContext } from "@microsoft/sp-page-context";


@injectable()
export default class SPHistoryService implements IHistoryService {

    public context: ServiceScope;


    /**
     *  Recuperation de l'hitorique
     * @returns Liste des items de la liste historique
     */
    async getHistoryItems(): Promise<IHistoryItem[]> {
        try {
            let opManager = SPODataSources.getInstance<IHistoryItem>(itemHistory, historyListName);
            var data = await opManager.GetBigListData();
            console.table(data);
            return data;
        } catch (error) {
            console.log(error);
            Promise.reject(error);
        }
    }

    /**
     * Recuperation de la liste des fields 
     */
    async getHistoryFields(): Promise<any[]> {
        try {
            let opManager = SPODataSources.getInstance<IHistoryItem>(itemHistory, historyListName);
            let fields = await opManager.GetListFields();
            let fieldsTra = fields
                .filter( field => itemHistory.getColumns().indexOf(field.InternalName) !== -1 )
                .map(field =>( { key: field.InternalName, text: field.Title, fieldType: field['odata.type'] }));
            console.table(fieldsTra);
            return fieldsTra;
        } catch (error) {

        }
    }

}