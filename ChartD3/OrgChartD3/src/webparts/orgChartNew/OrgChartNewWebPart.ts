import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'OrgChartNewWebPartStrings';
import OrgChartNew from './components/OrgChartNew';
import { IOrgChartNewProps } from './components/IOrgChartNewProps';

export interface IOrgChartNewWebPartProps {
  description: string;
}

export default class OrgChartNewWebPart extends BaseClientSideWebPart<IOrgChartNewWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IOrgChartNewProps> = React.createElement(
      OrgChartNew,
      {
        description: this.properties.description
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
