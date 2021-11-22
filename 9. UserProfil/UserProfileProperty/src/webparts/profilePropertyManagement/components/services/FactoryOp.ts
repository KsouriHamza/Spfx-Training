import { sp } from "@pnp/sp/presets/all";
import { property } from "lodash";
import { ISystemItem } from "../models/ISystemItem";
import { IFactory } from "./IFactory";

export class FactoryOp implements IFactory {
   
    public getAllSystemFromList = async (listName: string): Promise<any[]> => {
        
        let column  = ["ID","Title","Created","Modified","SysName","SysDescrip"]
        //console.log("ListeSp Name " + listName);
        //console.table((await sp.web.lists.getByTitle(listName).items.select("col1").get()))
        try {
            let listSysItems : ISystemItem[] = (await sp.web.lists.getByTitle(listName).items.select(...column).get()).map(               
                (item ) => {
                    let elemnt: ISystemItem = {
                        SysName: item.SysName,
                        SysDescrip: item.SysDescrip,
                        id: item.ID,
                        title: item.Title,
                        modified: item.Modified,
                        created: item.Created
                    }
                   return elemnt;
                }
            );
            
            //console.log("Liste des elements ");
            //console.table(listSysItems);            
            return listSysItems 
            
        } catch (error) {
            console.log(error);
            throw new error;         
        }
    }

    public getCurrentUserProfileValue = async (propertyName: string): Promise<string> => {
        try {
            let propertyValue = (await sp.profiles.myProperties.get()).UserProfileProperties
                .find(item => item.Key === "InfoCst-SysPref2").Value;

            console.log("Nom de la propriete " + propertyName + " Valeur " + propertyValue);
            return propertyValue;

        } catch (error) {
            console.log(error);            
        }
    }

    public setUserProfileProperty =  async (propertyName :string , propertyValue :string) => {
        try {
            // Recuperation current UserLogin
            let current = (await sp.web.currentUser.get()).LoginName;
            console.log(current);
            // Ajouter la valeur a la prop profile utilisateur            
            (await sp.profiles.setSingleValueProfileProperty(current, propertyName, propertyValue));
        } catch (error) {
            console.log(error);
        }
    }

}