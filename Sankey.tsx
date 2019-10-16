import * as React from 'react';
import { format as d3Format, scaleOrdinal, schemeCategory10, select } from 'd3'
import { sankey as d3Sankey, sankeyLinkHorizontal } from 'd3-sankey'
import ReactFauxDOM from 'react-faux-dom';

type Props = {
	data?: any;
};

type State = {
	nodes: any,
	links: any;
};
export class Sankey extends React.Component<Props, State> {

	size: any = {
		width: 800,
		height: 500
	}

	state = {
		nodes: [
			{ "node": 0, "name": "node0" },
			{ "node": 1, "name": "node1" },
			{ "node": 2, "name": "node2" },
			{ "node": 3, "name": "node3" },
			{ "node": 4, "name": "node4" }
		],
		links: [
			{ "source": 0, "target": 2, "value": 2 },
			{ "source": 1, "target": 2, "value": 2 },
			{ "source": 1, "target": 3, "value": 2 },
			{ "source": 0, "target": 4, "value": 2 },
			{ "source": 2, "target": 3, "value": 2 },
			{ "source": 2, "target": 4, "value": 2 },
			{ "source": 3, "target": 4, "value": 4 }
		]
	};

	render() {

		const guid = () => {
			const _p8: any = (i: any) => {
				const p = (`${Math.random().toString(16)}000000000`).substr(2, 8)
				return i ? `-${p.substr(0, 4)}-${p.substr(4, 4)}` : p
			}
			return _p8() + _p8(true) + _p8(true) + _p8()
		}

		var svgNode = ReactFauxDOM.createElement('div');

		select(svgNode).select('svg').remove()
		const svg = select(svgNode)
			.append('svg')
			.attr('width', this.size.width)
			.attr('height', this.size.height)
			.style('width', this.size.width)
			.style('height', this.size.height)

		const { nodes, links } = d3Sankey()
			.nodeWidth(50)
			.nodePadding(40)
			.extent([[1, 1], [this.size.width - 1, this.size.height - 25]])({
				nodes: this.state.nodes.map((d: any) => Object.assign({}, d)),
				links: this.state.links.map((d: any) => Object.assign({}, d))
			})
		console.log("nodess", nodes)
		const scale = scaleOrdinal(schemeCategory10)
		const color = (name: any) => scale(name.replace(/ .*/, ''))
		const format = (d: any) => `$${d3Format(',.0f')(d)}`

		svg.append('g')
			.attr('stroke', '#000')
			.selectAll('rect')
			.data(nodes.filter((d: any) => !d.photo))
			.enter()
			.append('rect')
			.attr("height", (d: any) => (d.y1 - d.y0))
			.attr("width", (d: any) => (d.x1 - d.x0))
			.attr('x', (d: any) => d.x0)
			.attr('y', (d: any) => d.y0)
			.attr('fill', (d: any) => color(d.name))
			.style('cursor', 'pointer')

		const link = svg.append('g')
			.attr('fill', 'none')
			.attr('stroke-opacity', 0.5)
			.selectAll('g')
			.data(links)
			.enter()
			.append('g')
			.style('mix-blend-mode', 'multiply')

		const gradient = link.append('linearGradient')
			.attr('id', (d: any) => {
				d.uid = guid()
				return d.uid
			})
			.attr('gradientUnits', 'userSpaceOnUse')
			.attr('x1', (d: any) => d.source.x1)
			.attr('x2', (d: any) => d.target.x0)

		gradient.append('stop')
			.attr('offset', '0%')
			.attr('stop-color', (d: any) => color(d.source.name))

		gradient.append('stop')
			.attr('offset', '100%')
			.attr('stop-color', (d: any) => color(d.target.name))

		link.append('path')
			.attr('d', sankeyLinkHorizontal())
			.attr('stroke', (d: any) => `url(#${d.uid})`)
			.attr('stroke-width', (d: any) => Math.max(1, d.width))

		svg.append('g')
			.style('font', '10px sans-serif')
			.selectAll('text')
			.data(nodes)
			.enter()
			.append('text')
			.attr('x', (d: any) => (d.x0 < this.size.width / 2 ? d.x1 + 6 : d.x0 - 6))
			.attr('y', (d: any) => (d.y1 + d.y0) / 2)
			.attr('dy', '0.35em')
			.attr('text-anchor', (d: any) => (d.x0 < this.size.width / 2 ? 'start' : 'end'))
			.text((d: any) => `${d.name} (${format(d.value)})`)

		return svgNode.toReact()

	}
}
