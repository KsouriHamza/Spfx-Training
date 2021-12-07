import { IServiceBase } from "./index";
import { interfaces } from "inversify";

export interface IRegisterServiceItemSetting<T> {
    service: interfaces.Newable<IServiceBase<T>>;
    targetName: string;
}
export interface IRegisterServiceSetting<T> {
    serviceKey: string;
    serviceItems: IRegisterServiceItemSetting<T>[];
}
export class ServiceFactory {
    public static getServiceFactoryName(serviceKey: string) {
        return `${serviceKey}Factory`;
    }
}


