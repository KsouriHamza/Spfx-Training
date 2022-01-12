import * as React from 'react';
import { IOrgChartNewProps } from './IOrgChartNewProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as d3 from 'd3';
import { OrgChartComponent } from './Org/OrgChartComponent';
import { UserProfilePanel } from './Panel/UserProfilePanel';
import { OrgChart } from './../../../d3-org-chart';
import * as usersData from './../../../SampleData/convertcsv.json'
import { getTheme, IconButton, IIconProps, ISeparatorStyles, IStackStyles, IStackTokens, Separator, Stack, TextField } from 'office-ui-fabric-react';
import jspdf from 'jspdf';
import { DefaultButton, PrimaryButton } from '@microsoft/office-ui-fabric-react-bundle';

const stackStyles: IStackStyles = {
  root: {
    width: '100%',
    childrenGap: 2,
  },
};
const itemAlignmentsStackTokens: IStackTokens = {
  childrenGap: 2,
  padding: 2,
};
const sperStyles: ISeparatorStyles = {
  root: {
    height: '10px',
    selectors: {
      '::before': {
        height: '2px'
      }
    }
  },
  content: {
    height: '4px'
  }
};


const drawImageIcon: IIconProps = { iconName: 'FileImage' };
const drawPdfIcon: IIconProps = { iconName: 'PDF' };
const swapChartIcon: IIconProps = { iconName: 'PivotChart' };
const upToRootIcon: IIconProps = { iconName: 'PenWorkspace' };
const clearMarkIcon: IIconProps = { iconName: 'ClearFormattingEraser' };
const fullScreen: IIconProps = { iconName: 'FullScreen' };
const zoomInIcon: IIconProps = { iconName: 'ZoomIn' };
const zoomOutIcon: IIconProps = { iconName: 'ZoomOut' };
const theme = getTheme();
export default class OrgChartNew extends React.Component<IOrgChartNewProps, { data, currentNode, panelIsOpen }> {
  private data: any;
  private chart = null;
  private index;

  constructor(props: IOrgChartNewProps) {
    super(props);
    // Initialisation des etats
    this.index = 0;
    this.chart = new OrgChart();
    this.state = {
      data: this.data,
      currentNode: {},
      panelIsOpen: false,
    }
  }

  _onClosePanel = () => {
    this.setState({
      panelIsOpen: false
    })
  }

  public async componentDidMount() {

    d3.csv(
      'https://raw.githubusercontent.com/bumbeishvili/sample-data/main/org.csv'
    ).then((dataFlattened) => {
      this.setState({
        data: dataFlattened
      })
    });
    const ddd = usersData['default']
    /*
        this.setState({
          data: usersData['default']
        })*/
  }
  private onNodeClick = (node, actionName) => {
    if (actionName === "userProfile") {
      this.setState({
        panelIsOpen: true,
        currentNode: node
      })
    } else if (actionName === "markUser") {
      this.chart.clearHighlighting();
      this.chart.setHighlighted(node.id).render()
    }
  }
  private exporterImage = () => {
    this.chart.exportImg({ full: true });
  }
  private exporterPDF = () => {
    this.chart.exportImg({
      save: false,
      onLoad: (base64) => {
        var pdf = new jspdf();
        var img = new Image();
        img.src = base64;
        img.onload = function () {
          pdf.addImage(
            img,
            'JPEG',
            5,
            5,
            595 / 3,
            ((img.height / img.width) * 595) / 3
          );
          pdf.save('Organigramme.pdf');
        };
      },
    });
  }
  private swapOrg = () => {
    this.chart.layout(["right", "bottom", "left", "top"][this.index++ % 4]).render().fit();
  }
  private uoToRoot = () => {
    this.chart.setUpToTheRootHighlighted("O-6162").render().fit();
  }
  private ClearUpToRoot = () => {
    this.chart.clearHighlighting();
  }
  private fullScreen = () => {
    this.chart.fullscreen('body');
  }
  private zoomIn = () => {
    this.chart.zoomIn();
  }
  private zoomOut = () => {
    this.chart.zoomOut();
  }
/**
 * styles={{
  root: {color: theme.palette.white, background: theme.palette.themePrimary},
  rootHovered: {color: theme.palette.white,  background: theme.palette.themeDarkAlt}
}}
 */
  public render(): React.ReactElement<IOrgChartNewProps> {
    return (
      <div>
        <Stack>
          <Stack>
            <Stack horizontal wrap styles={stackStyles} tokens={itemAlignmentsStackTokens}  >
              <PrimaryButton size={60}  onClick={this.exporterImage} iconProps={drawImageIcon} title="Exporter en image" ariaLabel="Exporter en image" />
              <PrimaryButton onClick={this.exporterPDF} iconProps={drawPdfIcon} title="Exporter en PDF" ariaLabel="Exporter en PDF" />
              <PrimaryButton onClick={this.swapOrg} iconProps={swapChartIcon} title="Pivoter l'organigramme" ariaLabel="Exporter en PDF" />
              <PrimaryButton onClick={this.uoToRoot} iconProps={upToRootIcon} title="Marquer l'utilisateur courant jusqu'a la racine" ariaLabel="Marquer l'utilisateur courant jusqu'a la racine" />
              <PrimaryButton onClick={this.ClearUpToRoot} iconProps={clearMarkIcon} title="Effacer le marquage" ariaLabel="Effacer le marquage" />
              <PrimaryButton onClick={this.fullScreen} iconProps={fullScreen} title="Mode plein écran" ariaLabel="Afficher le profile" />
              <PrimaryButton onClick={this.zoomIn} iconProps={zoomInIcon} title="Mode plein écran" ariaLabel="Afficher le profile" />
              <PrimaryButton primary={true} onClick={this.zoomOut} iconProps={zoomOutIcon} title="Mode plein écran" ariaLabel="Afficher le profile" />
            </Stack>
          </Stack>
          <Stack>
            <Separator styles={sperStyles} />
          </Stack>
          <Stack>
            <OrgChartComponent
              onNodeClick={this.onNodeClick}
              chart={this.chart}
              data={this.state.data} />
          </Stack>
        </Stack>
        <UserProfilePanel isOpen={this.state.panelIsOpen} onClosePanel={this._onClosePanel} node={this.state.currentNode} />
      </div>
    );
  }
}
