import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'ReactIocWpWebPartStrings';
import ReactIocWp from './components/ReactIocWp';
import { IReactIocWpProps } from './components/IReactIocWpProps';
import { sp } from '@pnp/sp/presets/all';
import { mainContainer } from '../../ConfigIoc/Inversify.config';
import "reflect-metadata";

export interface IReactIocWpWebPartProps {
  description: string;
}

export default class ReactIocWpWebPart extends BaseClientSideWebPart<IReactIocWpWebPartProps> {

  protected async onInit(): Promise<void> {
    return super.onInit().then(_ => {
      sp.setup({
        spfxContext: this.context
      });

      mainContainer.registerContext(this.context.serviceScope);
    });
  }


  public render(): void {
    const element: React.ReactElement<IReactIocWpProps> = React.createElement(
      ReactIocWp,
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
