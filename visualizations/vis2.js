
function dataVis2(data) {
  const countries = {};
  data.forEach(d => {
    let name = d.country;
    if (name == 'Korea') {
      name = 'Republic of Korea';
    } else if (name == 'Slovak Republic') {
      name = 'Slovakia';
    }
    countries[name] = {
      pieData: [
        { name: 'donated', value: d.donatedRate },
        { name: 'received', value: d.receivedRate }
      ]
    };
  });
  return countries;
}

function vis2(geoJSON, div, data) {

  const margin = { top: 0, right: 20, bottom: 0, left: 20 };

  const visWidth = 1200 - margin.left - margin.right;
  const visHeight = 800 - margin.top - margin.bottom;

  const zoom = d3.zoom()
    .scaleExtent([1, 10])
    .on("zoom", zoomed);


  const svg = div.append('svg')
    .attr('width', visWidth + margin.left + margin.right)
    .attr('height', visHeight + margin.top + margin.bottom)
    .on("click", reset);

  const g = svg.append('g')
    .attr('transform', `translate(${visWidth}, ${visHeight})`);

  const projection = d3.geoEqualEarth()
    .fitSize([visWidth, visHeight], geoJSON);

  const path = d3.geoPath().projection(projection);

  const color = d3.scaleOrdinal(d3.schemeCategory10)

  g.selectAll('.border')
    .attr("cursor", "pointer")
    .data(geoJSON.features)
    .join('path')
    .on("click", clicked)
    .attr('class', 'border')
    .attr('d', path)
    .attr('fill', '#dcdcdc')
    .attr('stroke', 'white')
    .append("title")
    .text(d => d.properties.NAME_LONG);

  const mapOutline = d3.geoGraticule().outline();

  g.append('path')
    .datum(mapOutline)
    .attr('d', path)
    .attr('stroke', '#dcdcdc')
    .attr('fill', 'none');

  svg
    .call(zoom)
    .call(zoom.transform, d3.zoomIdentity);

  function reset() {
    svg.transition().duration(750).call(
      zoom.transform,
      d3.zoomIdentity,
      d3.zoomTransform(svg.node()).invert([visWidth / 2, visHeight / 2])
    );
  }

  function clicked(d) {
    const [[x0, y0], [x1, y1]] = path.bounds(d);
    d3.event.stopPropagation();
    svg.transition().duration(750).call(
      zoom.transform,
      d3.zoomIdentity
        .translate(visWidth / 2, visHeight / 2)
        .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / visWidth, (y1 - y0) / visHeight)))
        .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
      d3.mouse(svg.node())
    );
  }

  function zoomed() {
    const { transform } = d3.event;
    g.attr("transform", transform);
    g.attr("stroke-width", 1 / transform.k);
  }

  // CREAT PIE CHARTS

  const pie = d3.pie()
    .value(d => d.value);

  const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(7);

  const countries = geoJSON.features.filter(d => data[d.properties.NAME_LONG]);

  g.selectAll('.pieGroup')
    .data(countries)
    .join(enter => enter
      .append("g")
      .attr('class', 'pieGroup')
      .attr("transform", d => {
        return `translate(${path.centroid(d)})`
      })
    )

  const pieGroups = g.selectAll('.pieGroup')
    .data(countries)
    .selectAll('path')
    .data(d => pie(data[d.properties.NAME_LONG].pieData))
    .join(enter => enter
      .append("path")
      .attr('d', d => arc(d))
      .attr('fill', d => color(d.data.name))
    )

  g.selectAll('.pieGroup')
    .data(countries)
    .append("text")
    .text(d => d.properties.NAME_LONG)
    .attr("font-size", "3px")
    .attr("style", "font-family: Arial, Helvetica, sans-serif")
    .attr("transform", "translate(6,1)")
}

function legend2(div) {
  const size = 20;
  const lineHeight = size * 1.5;
  const width = 100;

  const color = d3.scaleOrdinal()
    .domain(["Donated", "Recieved"])
    .range(d3.schemeTableau10);

  const svg = div.append('svg')
    .attr('width', width)
    .attr('height', color.domain().length * lineHeight)

  const rows = svg
    .selectAll("g")
    .data(color.domain())
    .join("g")
    .attr("transform", (d, i) => `translate(0, ${i * lineHeight})`);

  rows.append("rect")
    .attr("height", size)
    .attr("width", size)
    .attr("fill", d => color(d));

  rows.append("text")
    .attr("font-family", "Helvetica")
    .attr("font-size", 15)
    .attr("dominant-baseline", "hanging")
    .attr("x", lineHeight)
    .text(d => d);
}



