import "reflect-metadata";
import { IInjectServiceSetting } from "./IInjectServiceSetting";
import { CONSTANTS } from ".";

export function InjectService(parameter: IInjectServiceSetting) {
   
    return (target: Object, propertyKey: string, parameterIndex: number) => {
        let existingParameters = Reflect.getOwnMetadata(CONSTANTS.metadataKey, target) || [];
        existingParameters.push(parameter);
        Reflect.defineMetadata(CONSTANTS.metadataKey, existingParameters, target);
    };

}

export function PropertyInject(parameter: IInjectServiceSetting) {
   
    return (target: Object, propertyName: string) => {
        console.log("attribute");
        let existingParameters = Reflect.getOwnMetadata(CONSTANTS.metadataKey, target) || [];
        parameter.propertyName = propertyName;
        existingParameters.push(parameter);
        Reflect.defineMetadata(CONSTANTS.metadataKey, existingParameters, target);

    };
}

