export  interface IFactory {   
    
    getAllSystemFromList(listName:string): Promise<any[]>;
    getCurrentUserProfileValue(propertyName :string):Promise<string>;
    setUserProfileProperty( propertyName :string , propertyValue :string)
}