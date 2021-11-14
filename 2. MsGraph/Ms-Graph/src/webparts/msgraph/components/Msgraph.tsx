import * as React from 'react';
import styles from './Msgraph.module.scss';
import { IMsgraphProps } from './IMsgraphProps';
import { escape } from '@microsoft/sp-lodash-subset';
import {MSGraphClient} from '@microsoft/sp-http'
import { DetailsList, PrimaryButton } from 'office-ui-fabric-react';

export interface Iuser {
  displayName: string;
  mail: string
}

export interface IuserState{
  usersState :Iuser[];
}

export default class Msgraph extends React.Component<IMsgraphProps, IuserState> {

  constructor(props:IMsgraphProps){
    super(props);
    this.state={usersState:[]}
  }
  
  public  usersList:Iuser[] = [];
  public GetUsers = ():void => {
    
    this.props.context.msGraphClientFactory.getClient().then(( msGhraph )=> {
      msGhraph
      .api("users")
      .version("v1.0")
      .select("displayName,mail")
      .get((err,res) => {
          if (err) {
            console.log("Error occured",err);            
          }
          res.value.map((result) => {
            this.usersList.push({
              displayName : result.displayName ,
              mail : result.mail});
          });
          this.setState({usersState:this.usersList})
        });
    });
  }

  public render(): React.ReactElement<IMsgraphProps> {
    return (
      <div>
        <PrimaryButton text="Search user" onClick={this.GetUsers}></PrimaryButton>
        <DetailsList items={this.state.usersState}></DetailsList>

      </div>
    );
  }
}
