// BarChart.js
import * as d3 from 'd3';
import { useRef, useEffect } from 'react';

const BarChart = (props: any) => {
	const margin = {top: 30, right: 30, bottom: 50, left: 60}
	const width = props.width - margin.left - margin.right;
	const height = props.height - margin.top - margin.bottom;
	const data: [string, number][] = props.data;
    const ref: any = useRef();

	const svg = d3.select(ref.current);

	// Add X axis
	const x = d3.scaleBand()
		.range([0, width])
		.padding(0.2)

	// Add Y axis
	const y = d3.scaleLinear()
		.range([ height, 0 ]);

    useEffect(() => {
        const svg = d3.select(ref.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
    }, []);

    useEffect(() => {
        draw();
    }, [data]);

    const draw = () => {
		let mx = d3.max(data.map( x => x[1] ));
		mx = mx || 1;

		const groups = data.map(x => x[0]);

		svg.selectAll("*").remove();

		const yAxis = svg.append("g")
		.attr("transform", "translate("+margin.left+",0)")//magic number, change it at will	

		const xAxis = svg.append("g")
		.attr("transform", "translate("+margin.left+"," + height + ")")

		// X axis
		x.domain(groups)
		xAxis.transition().duration(1000)
		.call(d3.axisBottom(x))
		.selectAll("text")  
		.style("text-anchor", "end")
		.attr("dx", "-10px")
		.attr("dy", "0px")
		.attr("transform", "rotate(-65)");

		// Add Y axis
		y.domain([0, mx]);
		yAxis.transition().duration(1000).call(d3.axisLeft(y));

		var u = svg.selectAll("rect")
		.data(data)
		u
		.enter()
		.append("rect")
		// @ts-ignore
		.merge(u)
		.transition()
		.duration(1000)
			.attr("x", function(d) {
				const r = x(d[0]);
				if (r) {
					return(r+margin.left);
				}
				return(0+margin.left)
			})
			.attr("y", function(d) { return y(d[1]); })
			.attr("width", x.bandwidth())
			.attr("height", function(d) { return height - y(d[1]); })
			.attr("fill", "#FF04EE")
    }


    return (
        <div className="chart">
            <svg ref={ref}>
            </svg>
        </div>
        
    )

}

export default BarChart;