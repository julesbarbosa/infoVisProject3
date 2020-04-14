function dataVis2(data){
  const d = store.data1.map(d => (
    {
      country: d.country,
      pieData: [
        { name: 'donated', value: d.donatedRate },
        { name: 'received', value: d.receivedRate }
      ]   
    }))
  return d  
}

function vis2(geoJSON, div, data) {
  const margin = {top: 20, right: 20, bottom: 20, left: 20};

  const visWidth = 1000 - margin.left - margin.right;
  const visHeight = 600 - margin.top - margin.bottom;

  const svg = div.append('svg')
      .attr('width', visWidth + margin.left + margin.right)
      .attr('height', visHeight + margin.top + margin.bottom);

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  const projection =  d3.geoEqualEarth()
      .fitSize([visWidth, visHeight], geoJSON);

  const path = d3.geoPath().projection(projection);

  g.selectAll('.border')
    .data(geoJSON.features)
    .join('path')
      .attr('class', 'border')
      .attr('d', path)
      .attr('fill', '#dcdcdc')
      .attr('stroke', 'white');
  
  const mapOutline = d3.geoGraticule().outline();
  
  g.append('path')
    .datum(mapOutline)
    .attr('d', path)
    .attr('stroke', '#dcdcdc')
    .attr('fill', 'none');

 // CREAT PIE CHARTS
      
  const g2 = svg.append('g')
      
  const pie = d3.pie()
        .value(d => d.value);
    
  const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(20); // como colocar dependendo do tamanho do pais?

  const pieGroups = g2.selectAll('.pieGroup')
    .data(data)
    .join('g')
      .attr('class', 'pieGroup')
      .attr('transform', d => `translate(${x(d.country)},${visHeight / 2})`);
  
  pieGroups.selectAll('path')
    .data(d => pie(d.pieData))
    .join('path')
      .attr('d', d => arc(d))
      .attr('fill', d => color(d.name))  
      
  
  pieGroups.selectAll('g')
    .data(data)
    .enter()
    .append("g")
    .attr("transform",function(d) { return "translate("+projection([d.country])+")" })
    .attr('class', 'pieGroup')
  
  
}
