import { useLayoutEffect, useRef, useEffect } from 'react';
import { OrgChart } from './../../../../d3-org-chart';
import * as React from 'react';
import { Icon } from 'office-ui-fabric-react';
import * as ReactDOMServer from 'react-dom/server';
import * as d3 from 'd3';
import UserSheet from '../UserSheet/UserSheet';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'


const _renderNodeNavBtn = (node, state) => {
    return (
        <div>
            <span>
                {node.children ? <Icon iconName='chevronup' /> : <Icon iconName='chevrondown' />}
            </span>
            {node.data._directSubordinates}
        </div>
    );
}
const _renderPersonCard = (node) => {
    return (
        <UserSheet node={node} styleIsSmall={false} isCalloutVisible={true} />
    );
};

export const OrgChartComponent = (props, ref) => {
    const d3Container = useRef(null);
    const sheet = new ServerStyleSheet()
    let chart = props.chart;

    useLayoutEffect(() => {
        if (props.data && d3Container.current) {
            if (!chart) {
                chart = new OrgChart();
            }
            chart
                .container(d3Container.current)
                .data(props.data)
                .nodeWidth(d => 350)
                .nodeHeight(d => 140)
                .childrenMargin((d) => 90)
                .compactMarginBetween((d) => 65)
                .compactMarginPair((d) => 100)
                .neightbourMargin((a, b) => 50)
                .siblingsMargin((d) => 100)
                .linkUpdate(function (d, i, arr) {
                    d3.select(this)
                        .attr('stroke', (d) => d.data._upToTheRootHighlighted ? '#14760D' : '#2CAAE5')
                        .attr('stroke-width', (d) => d.data._upToTheRootHighlighted ? 15 : 1);
                    if (d.data._upToTheRootHighlighted) { d3.select(this).raise(); }
                })
                .nodeContent(function (d, i, arr, state) {
                    if (d.data) {
                        try {
                            let compose = _renderPersonCard(d.data);
                            //let cmpo = ReactDOMServer.renderToString(_renderPersonCard(d.data));
                            let cmpo = ReactDOMServer.renderToString(_renderPersonCard(d.data));
                            return cmpo;
                        } catch (error) {
                            console.log('Heerrr');
                            console.log(error);
                        }
                    }                    
                })
                .onNodeClick((d, e) => {
                    let x = e.clientX
                    let y = e.clientY
                    let currentNde = document.elementFromPoint(x, y);
                    while (currentNde) {
                        if (currentNde.hasAttribute("data-action"))
                            break;
                        currentNde = currentNde.parentElement;
                    }
                    let actionName = currentNde.getAttribute("data-action");
                    props.onNodeClick(d, actionName);
                })
                .render();
        }
    }, [props.data, d3Container.current]);

    return (
        <div ref={ref}>
            <div ref={d3Container} />
        </div>
    );
};


