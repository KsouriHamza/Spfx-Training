import * as React from 'react';
import { IProfilePropertyManagementProps } from './IProfilePropertyManagementProps';
import { escape } from '@microsoft/sp-lodash-subset';
import Preferences from './PreferencesPanel/Preferences';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { Stack, StackItem } from 'office-ui-fabric-react';
import { AppContext } from './common/AppContext';

export default class ProfilePropertyManagement extends React.Component<IProfilePropertyManagementProps, {}> {
  public render(): React.ReactElement<IProfilePropertyManagementProps> {
    return (
      <AppContext.Provider value={{ serviceScope: this.props.serviceScope }}>
        <HashRouter>
          <Stack>
            <StackItem>
              <Switch>
                <Route path="/mespreferences" exact={true} component={() => <Preferences description={""} /> }></Route>
              </Switch>
            </StackItem>
          </Stack>
        </HashRouter>
      </AppContext.Provider>
    );
  }
}
