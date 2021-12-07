import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { IPropertyPaneConfiguration, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'DatatableWebPartStrings';
import Datatable from './components/Datatable';
import { IDatatableProps } from './components/IDatatableProps';
import { sp } from '@pnp/sp/presets/all';
import { mainContainer } from '../../shared/config-di/inversify.config';

export interface IDatatableWebPartProps {
  description: string;
}

export default class DatatableWebPart extends BaseClientSideWebPart<IDatatableWebPartProps> {

  protected async onInit(): Promise<void> {
    return super.onInit().then(_ => {
      sp.setup({
        spfxContext: this.context
      });
      mainContainer.registerContext(this.context.serviceScope);
    });
  }

  public render(): void {
    const element: React.ReactElement<IDatatableProps> = React.createElement(
      Datatable,
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
