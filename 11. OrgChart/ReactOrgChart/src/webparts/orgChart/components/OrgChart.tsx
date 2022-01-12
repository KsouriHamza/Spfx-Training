import * as React from 'react';
import { IOrgChartProps } from './IOrgChartProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { maintree, tree1, tree2, tree3, tree4 } from './consts';
import OrgChart from '@unicef/react-org-chart'

export interface IOrgChartStates {
  tree: any;
  downloadingChart: boolean;
  config: any;
  highlightPostNumbers: any[];
}

export default class OrgChartEx extends React.Component<IOrgChartProps, IOrgChartStates> {

  constructor(props) {
    super(props)

    this.state = {
      tree: maintree,
      downloadingChart: false,
      config: {},
      highlightPostNumbers: [1],
    }
  }

  getChild = id => {
    switch (id) {
      case 100:
        return tree1
      case 36:
        return tree2
      case 56:
        return tree3
      case 25:
        return tree4
      default:
        return console.log('no children')
    }
  }

  getParent = d => {
    if (d.id === 100) {
      return {
        id: 500,
        person: {
          id: 500,
          avatar: '',
          department: '',
          name: 'Pascal ruth',
          title: 'Member',
          totalReports: 1,
        },
        hasChild: false,
        hasParent: true,
        children: [d],
      }
    } else if (d.id === 500) {
      return {
        id: 1,
        person: {
          id: 1,
          avatar: '',
          department: '',
          name: 'Bryce joe',
          title: 'Director',
          totalReports: 1,
        },
        hasChild: false,
        hasParent: false,
        children: [d],
      }
    } else {
      return d
    }
  }

  handleDownload = () => {
    this.setState({ downloadingChart: false })
  }

  handleOnChangeConfig = config => {
    this.setState({ config: config })
  }

  handleLoadConfig = () => {
    const { config } = this.state
    return config
  }

  public render(): React.ReactElement<IOrgChartProps> {
    const { tree, downloadingChart } = this.state

    return (      
      <div>
        <OrgChart
          tree={tree}
          //downloadImageId={downloadImageId}
          //downloadPdfId={downloadPdfId}
          onConfigChange={config => {
            this.handleOnChangeConfig(config)
          }}
          loadConfig={d => {
            let configuration = this.handleLoadConfig()
            if (configuration) {
              return configuration
            }
          }}
          downlowdedOrgChart={d => {
            this.handleDownload()
          }}
          /* loadImage={d => {
             return Promise.resolve(avatarPersonnel)
           }}*/
          loadParent={d => {
            const parentData = this.getParent(d)
            return parentData
          }}
          loadChildren={d => {
            const childrenData = this.getChild(d.id)
            return childrenData
          }}
        />
      </div>
    );
  }
}
