import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'ProfilePropertyManagementWebPartStrings';
import ProfilePropertyManagement from './components/ProfilePropertyManagement';
import { IProfilePropertyManagementProps } from './components/IProfilePropertyManagementProps';

export interface IProfilePropertyManagementWebPartProps {
  description: string;
}

export default class ProfilePropertyManagementWebPart extends BaseClientSideWebPart<IProfilePropertyManagementWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IProfilePropertyManagementProps> = React.createElement(
      ProfilePropertyManagement,
      {
        description: this.properties.description,
        serviceScope: this.context.serviceScope
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
