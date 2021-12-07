import * as React from 'react';
//import styles from './ReactIocWp.module.scss';
import { IReactIocWpProps } from './IReactIocWpProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { InjectAutoInit, PropertyInject } from '../../../Warpper';
import { mainContainer, TYPES } from '../../../ConfigIoc/Inversify.config';
import { IBigListService } from '../../../Services/IBigListService';
import "reflect-metadata";


@InjectAutoInit
export default class ReactIocWp extends React.Component<IReactIocWpProps, { dataMe: string }> {

  @PropertyInject({
    typeKey: TYPES.BigListService,
    container: mainContainer.Container
  })
  private bigListService: IBigListService;

  constructor(props: IReactIocWpProps) {
    super(props);
    this.state = {
      dataMe : ""
    }
  }
  public render(): React.ReactElement<IReactIocWpProps> {
    return (
      <div>
        {this.state.dataMe}
      </div>
    );
  }

  public componentDidMount(): void {
    this.renderMe();
  }


  private async renderMe(): Promise<void> {

    //read data from the data source
    const dataSource = await this.bigListService.getItems();

    this.setState({
      dataMe:"Nombre des elements"+ dataSource.length
    })

  }
}
