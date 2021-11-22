import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'FactoryMethodsPatternWebPartStrings';
import FactoryMethodsPattern from './components/FactoryMethodsPattern';
import { IFactoryMethodsPatternProps } from './components/IFactoryMethodsPatternProps';

export interface IFactoryMethodsPatternWebPartProps {
  description: string;
}

export default class FactoryMethodsPatternWebPart extends BaseClientSideWebPart<IFactoryMethodsPatternWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IFactoryMethodsPatternProps> = React.createElement(
      FactoryMethodsPattern,
      {
        description: this.properties.description,
        spcontext:this.context
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
