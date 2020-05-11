function question2(data) {
  const toppurposes = d3.nest()
    .key(d => d.purpose)
    .rollup(d => d3.sum(d, v => v.value))
    .entries(data.links)
    .sort((a, b) => d3.descending(a.value, b.value))
    .slice(0, 5)
    .map(d => d.key)


  const transactiontPurposes = data.links.filter(p => toppurposes.find(t => t == p.purpose)).map(d => ({
    source: d.source.id,
    target: d.target.id,
    value: d.value,
    purpose: d.purpose
  }))
    .filter(d => d != null)
    .filter(d => d.value > 0)

  const dataquestion3 = ({
    nodes: [...data.nodes],
    nodesDonors: [...data.nodesDonors],
    nodesRecipients: [...data.nodesRecipients],
    links: [...transactiontPurposes]

  })

  console.log(dataquestion3)

  const newData = (
    dataquestion3.links.map(d => (
      {
        source: d.source,
        target: d.target,
        id: d.source + "-" + d.target,
        total: d.value,
        purpose: d.purpose,
      }
    ))
  )

  const groupby = d3.nest()
    .key(d => d.id)
    .key(d => d.purpose)
    .rollup(d => ({
      source: d[0].source,
      target: d[0].target,
      total: d3.sum(d, v => v.total),
    }))
    .entries(newData)

  const datafinal = (
    groupby.map(d => ({
      id: d.key,
      source: d.values[0].value.source,
      target: d.values[0].value.target,
      total: d3.sum(d.values, s => s.value.total),
      purposes: d.values.map(p => ({
        purpose: p.key,
        value: p.value.total
      }))
    }))
  )
  return datafinal
}


function vis2(data, div, matrix, pieData) {
  const margin = { top: 50, right: 70, bottom: 60, left: 40 };

  const width = 970 - margin.left - margin.right;
  const height = 1740 - margin.top - margin.bottom;

  const svg = div.append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)



  const maxPieDonation = d3.max(pieData, transact => transact.total)
  const source = data.nodesDonors.map(d => d.id)
  const target = data.nodesRecipients.map(d => d.id)
  const purposes = [...new Set(pieData.map(d => d.purposes.map(c => c.purpose)).flat())]

  const yAxisWidth = 100;
  const xAxisWidth = 100;

  const x = d3.scaleBand()
    .domain(target)
    .range([0, width - xAxisWidth]);

  const y = d3.scaleBand()
    .domain(source)
    .range([0, height - yAxisWidth]);

  // creat pie charts
  const color1 = d3.scaleOrdinal()
    .domain(purposes)
    .range(d3.schemeTableau10)

  const radius = d3.scaleSqrt()
    .domain([0, maxPieDonation])
    .range([10, 35]);

  const outerRadius = Math.sqrt(x.step() / 2);
  const squareHeight = y.step();
  const squareWidth = x.step()

  const pie = d3.pie()
    .value(d => d.value);

  const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(d => radius(d.pieTotal));


  // end pie charts
  // matrix 

  const translate = `translate(${yAxisWidth},${xAxisWidth})`;
  svg.append("g")
    .attr("transform", translate)
    .attr("id", "adjacencyG")
    .selectAll("rect")
    .data(matrix)
    .enter()
    .append("rect")
    .attr("fill", d => d.value != null ? "white" : "white")
    .attr("class", "grid")
    .attr("width", squareWidth)
    .attr("height", squareHeight)
    .attr("x", d => x(d.target))
    .attr("y", d => y(d.source))

  //legend

  svg.append("g")
    .attr("transform", "translate(70,90)")
    .append("text")
    .attr("text-anchor", "end")
    .text("Donor")
    .style("font-size", "20px");

  svg.append("g")
    .attr("transform", "translate(185,50)")
    .append("text")
    .attr("text-anchor", "end")
    .text("Recipient")
    .style("font-size", "20px");
  ;
  // Axis
  svg.append("g")
    .attr("transform", translate)
    .selectAll("text")
    .data(data.nodesRecipients)
    .enter()
    .append("text")
    .text(d => d.id)
    .style("font-size", "14px")
    .attr("x", (d, i) => 0)
    .attr("y", (d, i) => -5)
    .attr("transform", (d, i) => "rotate(-0," + (x(d.id)) + ",0) translate(" + (x(d.id)) + ")")
    .style("text-anchor", "start")


  svg.append("g")
    .attr("transform", translate)
    .selectAll("text")
    .data(data.nodesDonors)
    .enter()
    .append("text")
    .attr("y", (d, i) => y(d.id) + y.step() / 2)
    .attr("x", (d, i) => -5)
    .text(d => d.id)
    .style("text-anchor", "end")
    .style("font-size", "12px");

  /// Pies

  const pieGroups = svg.append("g")
    .attr("transform", translate)
    .selectAll('.pieGroup')
    .data(pieData)
    .join('g')
    .attr('class', 'pieGroup')
    .attr('transform',
      d => `translate(${x(d.target) + x.step() / 2},${y(d.source) + y.step() / 2})`
    );

  pieGroups.selectAll('path')
    .data(d => {
      // return pie(d.purposes)
      const pieData = pie(d.purposes);
      const pieTotal = d3.sum(pieData, p => p.value);
      return pieData.map(p => ({ ...p, pieTotal }));
    })
    .join('path')
    .attr('d', d => arc(d))
    .attr('fill', d => color1(d.data.purpose))




};

function legend2(div, pieData) {

  const purposes = [...new Set(pieData.map(d => d.purposes.map(c => c.purpose)).flat())]

  const maxPieDonation = d3.max(pieData, transact => transact.total)

  const color1 = d3.scaleOrdinal()
    .domain(purposes)
    .range(d3.schemeTableau10)


  const svg = div.append('svg')
    .attr('width', 1000)

  const radius = d3.scaleSqrt()
    .domain([0, maxPieDonation])
    .range([10, 35]);

  svg.append("g")
    .attr("class", "legendSize")
    .attr("transform", "translate(400, 25)")
    .attr("fill", "grey");

  // legend pie size

  const legendSize = d3.legendSize()
    .scale(radius)
    .shape('circle')
    .shapePadding(20)
    .labelOffset(20)
    .orient('horizontal')
    .title("Total Donated")
    .labelFormat(d3.format(".2s"))

  svg.select(".legendSize")
    .call(legendSize);

  // Legend Pie color

  svg.append("g")
    .attr('class', "legendPie")
    .attr('transform', "translate(20,20)")

  const legendPie = d3.legendColor()
    .shape("path", d3.symbol().type(d3.symbolSquare).size(150)())
    .shapeWidth(40)
    .scale(color1)
    .orient("vertical")
    .title("Purposes")
    .cells(10)

  svg.select(".legendPie")
    .call(legendPie)


}
