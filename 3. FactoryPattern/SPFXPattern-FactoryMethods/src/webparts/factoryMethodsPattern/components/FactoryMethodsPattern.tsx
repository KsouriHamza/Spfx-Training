import * as React from 'react';
import styles from './FactoryMethodsPattern.module.scss';
import { IFactoryMethodsPatternProps } from './IFactoryMethodsPatternProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { sp } from "@pnp/sp/presets/all";
import { buildColumns, DetailsList, DetailsListLayoutMode, IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { IListItem } from './models/IListItem';
import { ListItemsFactory } from './service/ListItemsFactory';
import { IFactoryMethodsPatternStats } from './IFactoryMethodsPatternStats';
import { ISampleList1Item } from './models/ISampleListItem';

export default class FactoryMethodsPattern extends React.Component<IFactoryMethodsPatternProps, IFactoryMethodsPatternStats> {
  constructor(props:IFactoryMethodsPatternProps){
    super(props);
    sp.setup({
      spfxContext: this.props.spcontext
    });
    this.state = {
      columns:[],
      DetailsSampleList1: [] 
    };
  }
  
  public render(): React.ReactElement<IFactoryMethodsPatternProps> {    
    return (
      <div>
        <h3>Liste Sample</h3>
        <this.ListMarqueeSelection items={this.state.DetailsSampleList1 } columns={this.state.columns} />
      </div>
    );
  }

  public componentDidMount(): void {
    // read all file sizes from People library
    this.readItemsAndSetStatus("ISampleList1Item");
  }

  private readItemsAndSetStatus = async (listName:string) => {

    var myItems: any = null;
    // Appel Factory 
    const factory : ListItemsFactory  = new ListItemsFactory();

    await factory.getAllItems(listName).then((listItems : any[]) => {
      console.log(listItems);
      console.log("Step ---");  
      console.log (listItems as ISampleList1Item[])
      myItems = listItems as ISampleList1Item[];
    });
    
    console.log("Myitems");
    console.log(myItems);
    this.setState({
        DetailsSampleList1:myItems,
        columns: buildColumns(myItems)
    })

  }
  // reusable inline component
  private ListMarqueeSelection = (itemState: {columns: IColumn[], items: IListItem[] }) => (
    <div>
        <DetailsList
          items={ itemState.items }
          columns={ itemState.columns }
          setKey="set"
          layoutMode={ DetailsListLayoutMode.fixedColumns }
          selectionPreservedOnEmptyClick={ true }
          compact={ true }>
        </DetailsList>
    </div>
)
  
}
