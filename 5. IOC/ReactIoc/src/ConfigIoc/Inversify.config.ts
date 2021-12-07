import { Environment, EnvironmentType, ServiceScope } from "@microsoft/sp-core-library";
import SPBigListService from "../Services/SPBigListService";
import { SPFxContainer } from "../Warpper";
import 'reflect-metadata';

export const TYPES = {
    BigListService: 'IBigListService'
};

export const mainContainer = new SPFxContainer<ServiceScope>([
    {
      serviceKey: TYPES.BigListService,
      serviceItems: [
        {
          targetName: EnvironmentType.SharePoint.toString(),
          service: SPBigListService
        },
        {
          targetName: EnvironmentType.Local.toString(),
          service: SPBigListService
        }
  
      ]
    }
  ], Environment.type.toString());