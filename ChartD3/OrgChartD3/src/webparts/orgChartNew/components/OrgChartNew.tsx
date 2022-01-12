import * as React from 'react';
import styles from './OrgChartNew.module.scss';
import { IOrgChartNewProps } from './IOrgChartNewProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as d3 from 'd3';
import { OrgChartComponent } from './charcomp';

export default class OrgChartNew extends React.Component<IOrgChartNewProps, { data }> {
  private data: any;
  private addNodeChildFunc = null;

  constructor(props: IOrgChartNewProps) {
    super(props);
    // Initialisation des etats
    this.state = {
      data: []
    }
  }
  //

  addNode() {
    const node = {
      nodeId: 'new Node',
      parentNodeId: 'O-6066'
    };

    this.addNodeChildFunc(node);
  }

  onNodeClick(nodeId) {
    console.log('d3', d3.event);
    alert('clicked ' + nodeId);
  }

  public async componentDidMount() {
    d3.csv(  'https://raw.githubusercontent.com/bumbeishvili/sample-data/main/org.csv')
    .then(data => { this.setState({  data: data  })
    });
  }
  public render(): React.ReactElement<IOrgChartNewProps> {
    return (
      <div>
        <button onClick={() => this.addNode()}>add node as root's child</button>
        <OrgChartComponent
          setClick={click => (this.addNodeChildFunc = click)}
          onNodeClick={this.onNodeClick}
          data={this.state.data} />
      </div>
    );
  }
}
