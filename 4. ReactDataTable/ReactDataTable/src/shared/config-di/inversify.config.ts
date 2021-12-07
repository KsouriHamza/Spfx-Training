import { Environment, EnvironmentType, ServiceScope } from "@microsoft/sp-core-library";
import { SPFxContainer } from "../../spfx-di-wrapper";
import MockHistoryService from "../services/HistoryService/MockHistoryService";
import SPHistoryService from "../services/HistoryService/SPHistoryService";
import 'reflect-metadata';

export const TYPES = {
  HistoryService: 'IHistoryService'
};

export const mainContainer = new SPFxContainer<ServiceScope>([
    {
      serviceKey: TYPES.HistoryService,
      serviceItems: [
        {
          targetName: EnvironmentType.SharePoint.toString(),
          service: SPHistoryService 
        },
        {
          targetName: EnvironmentType.Local.toString(),
          service: MockHistoryService 
        }
      ]
    }
  ], Environment.type.toString());