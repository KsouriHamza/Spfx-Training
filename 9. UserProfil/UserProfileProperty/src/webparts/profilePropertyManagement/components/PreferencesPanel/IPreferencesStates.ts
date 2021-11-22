export interface ICheckBoxItemUI {
  id: string ;
  systemName : string ;
  sysIsChecked:boolean;
}
export interface IPreferencesStates {
    isOpen: boolean;
    // Search
    keySearch:boolean;
    listFiltredSystem ?:ICheckBoxItemUI[];
    // Data
    listSystem:ICheckBoxItemUI[];
    // Notification
    notifMessage:string;
    showmessageBar:boolean;
  }
  