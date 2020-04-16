
function dataVis2(data){
  const countries = {};
  store.data1.forEach(d => {
    countries[d.country] = {
      pieData: [
        { name: 'donated', value: d.donatedRate },
        { name: 'received', value: d.receivedRate }
      ]   
    };
  });
  return countries;
}


function vis2(geoJSON, div, data) {
  const margin = {top: 20, right: 20, bottom: 20, left: 20};

  const visWidth = 1300 - margin.left - margin.right;
  const visHeight = 1000 - margin.top - margin.bottom;

  const svg = div.append('svg')
      .attr('width', visWidth + margin.left + margin.right)
      .attr('height', visHeight + margin.top + margin.bottom);

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  const projection =  d3.geoEqualEarth()
      .fitSize([visWidth, visHeight], geoJSON);

  const path = d3.geoPath().projection(projection);

  function color(name){
    if (name == "received"){
      return "red"
    }else{
      return "blue"
    }
  }

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
    .outerRadius(15); // como colocar dependendo do tamanho do pais?

  // const countries = Object.keys(data)
  const countries = geoJSON.features.filter(d => data[d.properties.NAME_LONG]);
  console.log('countries', countries);

  g2.selectAll('.pieGroup') //g2
    .data(countries)//countries.find(c => c === d.properties.SOVEREIGNT)))
    .join(enter => enter 
      .append("g")
      .attr('class', 'pieGroup')
      .attr("transform", d => {
        console.log('transform', path.centroid(d));
        return `translate(${path.centroid(d)})`
      })
    )
 
  
  const pieGroups = g2.selectAll('.pieGroup')
    .data(countries)
    .selectAll('path')
    .data(d => pie(data[d.properties.NAME_LONG].pieData))
    .join(enter => enter
      .append("path")
      .attr('d', d => arc(d))
      .attr('fill', d =>  color(d.data.name))    
    )  

    g2.selectAll('.pieGroup') 
    .data(countries)
    .append("text")
      .text(d => d.properties.NAME_LONG)
    
 
  
  
}
