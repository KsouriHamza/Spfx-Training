import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'OrgChartWebPartStrings';
import OrgChart, { ErrorHandlerProps } from './components/OrgChart';
import { IOrgChartProps } from './components/IOrgChartProps';
import { IDataService } from '../../interfaces/IDataService';
import MockDataService from '../../services/mockdataservice';

export interface IOrgChartWebPartProps {
  description: string;
}

export default class OrgChartWebPart extends BaseClientSideWebPart<IOrgChartWebPartProps> {
  private _dataService: IDataService;
  private _errorProps: ErrorHandlerProps = { errorMsg: "", error: false };

  protected onInit(): Promise<void> {

    this._dataService = new MockDataService();

    return Promise.resolve();
  }


  public render(): void {
    const element: React.ReactElement<IOrgChartProps> = React.createElement(
      OrgChart,
      {
        styleIsSmall: false,
        errorHandlerProperties: this._errorProps,
        error: false,
        dataService: this._dataService,
        useGraphApi: false,
        selectedList: "Adam",
        selectedUser: "Nice Man"
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
