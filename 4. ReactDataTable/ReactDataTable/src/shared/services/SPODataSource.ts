import { sp } from "@pnp/sp/presets/all"; //from "@pnp/sp";
import { spODataEntityArray } from "@pnp/sp/odata";
import { Item, IItem, IItemAddResult } from "@pnp/sp/items";
import { ICamlQuery, IRenderListData } from "@pnp/sp/lists";
import { objectDefinedNotNull, ISPFXContext } from "@pnp/common-commonjs";
import { IItemListe, IOrderQuery } from "../models/IItemListe";
import "@pnp/sp/webs";

export default class SPODataSources<T extends IItemListe> {
    private _item: T;
    private _listId: string;

    /**
     * Constructor
     *  */
    private constructor(item: T, listId: string) {
        this._item = item;
        this._listId = listId;

    }

    public static getInstance<T extends IItemListe>(
        item: T,
        listId: string
    ) {
        return new SPODataSources<T>(item, listId);
    }

    public async GetListData(): Promise<T[]> {
        const columns = objectDefinedNotNull(this._item.getColumns)
            ? this._item.getColumns()
            : [];

        const arrayName = await sp.web.lists
            .getByTitle(this._listId)
            .items.select(...columns)
            .usingParser(spODataEntityArray<IItem, T>(Item))
            .orderBy("Id")
            .get();

        return arrayName;
    }

    public async GetListDataFilter(
        filter: string,
        orderBy: string
    ): Promise<T[]> {
        const columns = objectDefinedNotNull(this._item.getColumns)
            ? this._item.getColumns()
            : [];

        const arrayName = await sp.web.lists
            .getByTitle(this._listId)
            .items.select(...columns)
            .usingParser(spODataEntityArray<IItem, T>(Item))
            .filter(filter + "&$top=10000")
            .orderBy(orderBy)
            .get();

        return arrayName;
    }

    public async GetListDataFilterExpand(
        select: string[],
        expand?: string[],
        filter?: string,
        orderBy?: IOrderQuery[]
    ): Promise<T[]> {
        const query = await sp.web.lists
            .getByTitle(this._listId)
            .items.select(...select);

        if (expand) {
            query.expand(...expand);
        }

        if (filter) {
            query.filter(filter + "&$top=10000");
        }

        if (orderBy) {
            orderBy.map(o => {
                query.orderBy(o.NomColonne, o.Ascendant);
            });
        } else {
            query.orderBy("Id");
        }

        const resultat = query
            .usingParser(spODataEntityArray<IItem, T>(Item))
            .get();

        return resultat;
    }

    public async GetListDataFilterCalm(
        xmlCalm: string,
        expand?: string[]
    ): Promise<T[]> {
        const queryCalm: ICamlQuery = {
            ViewXml: xmlCalm
        };

        const result = await sp.web.lists
            .getByTitle(this._listId)
            .getItemsByCAMLQuery(queryCalm, ...expand);

        return result;
    }

    public async GetListDataViewXml(xmlCalm: string): Promise<IRenderListData> {
        const result = await sp.web.lists.getByTitle(this._listId).renderListData(
            xmlCalm
                .trim()
                .split("\n")
                .map(i => i.trim())
                .join("")
        );

        return result;
    }

    public async AddItem(item: T): Promise<T> {
        const columns = objectDefinedNotNull(this._item.getColumnsValeurs)
            ? this._item.getColumnsValeurs()
            : [];

        return await sp.web.lists
            .getByTitle(this._listId)
            .items.add(columns)
            .then((iar: IItemAddResult) => {
                item.Id = iar.data.Id;
                return item;
            });
    }

    public async UpdateItem(item: T): Promise<T> {
        const columns = objectDefinedNotNull(this._item.getColumnsValeurs)
            ? this._item.getColumnsValeurs()
            : [];

        await sp.web.lists
            .getByTitle(this._listId)
            .items.getById(+item.Id)
            .update(columns);

        return item;
    }

    public async SupprimerItem(item: T) {
        await sp.web.lists
            .getByTitle(this._listId)
            .items.getById(+item.Id)
            .delete();

        return item;
    }

    public async GetBigListData(): Promise<T[]> {
        try {

            const columns = objectDefinedNotNull(this._item.getColumns)
                ? this._item.getColumns()
                : [];

            let listItems = [];
            let items = await sp.web.lists.getByTitle(this._listId).items
                .select(...columns)
                .usingParser(spODataEntityArray<IItem, T>(Item))
                .orderBy("Id")
                .top(4999)
                .getPaged();

            listItems = items.results;
            while (items.hasNext) {
                items = await items.getNext();
                listItems = [...listItems, ...items.results];
            }
            return listItems;

        } catch (error) {
            console.log(error);            
            Promise.reject(error);
        }

    }

    public async GetListFields():Promise<any> {
        try {
            const allFields: any[] = await sp.web.lists
                .getByTitle(this._listId)
                .fields
                .filter("Hidden eq false and ReadOnlyField eq false and Title ne 'Content Type' and Title ne 'Attachments'")
                .get();
            return allFields;
        }
        catch (err) {
            Promise.reject(err);
        }
    }
}
