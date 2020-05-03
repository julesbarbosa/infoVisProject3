function Vis4(geoJson, data, div){
    const margin = {top: 10, right: 100, bottom: 20, left: 40};
    const visWidth = width - margin.left - margin.right;
    const visHeight = 500 - margin.top - margin.bottom;

    const svg = div.append('svg')
        .attr('width', visWidth + margin.left + margin.right)
        .attr('height', visHeight + margin.top + margin.bottom)
    
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
        
    const x = d3.scaleTime()
        .domain([minYear, maxYear])
        .range([0, visWidth]);
    
    const y = d3.scaleLinear()
        .domain([0, maxLifeExpect]).nice()
        .range([visHeight, 0]);
    
    const xAxis = d3.axisBottom(x);
    
    const yAxis = d3.axisLeft(y);
    
    g.append('g')
        .attr('transform', `translate(0,${visHeight})`)
        .call(xAxis);
    
    g.append('g')
        .call(yAxis)
        .call(g => g.selectAll('.domain').remove())
      .append('text')
        .attr('text-anchor', 'start')
        .attr('dominant-baseline', 'middle')
        .attr('fill', 'black')
        .attr('x', 5)
        .text('Life Expectancy');
    
    const line = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.life_expect));
  
    const series = g.selectAll('.series')
      .data(lifeExpectancies)
      .join('g')
        .attr('class', 'series')
        .attr('stroke', d => colorf(d.country))
      .append('path')
        .datum(d => d.info)
        .attr('fill', 'none')
        .attr('d', line);
    
    g.selectAll('.country-label')
      .data(labelPoints)
      .join('text')
        .attr('class', 'country-label')
        .attr('x', d => x(d.year) + 2)
        .attr('y', d => y(d.life_expect))
        .attr('font-size', 10)
        .attr('font-family', 'sans-serif')
        .attr('dominant-baseline', 'middle')
        .text(d => d.country);
    
    return svg.node();
  }