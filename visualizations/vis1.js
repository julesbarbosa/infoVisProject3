function totalAidByCountry(data) {

  const donorsAndRecipients = {
    "donors": d3.rollup(data, v => d3.sum(v, d => d.commitment_amount_usd_constant), d => d.donor),
    "recipient": d3.rollup(data, v => d3.sum(v, d => d.commitment_amount_usd_constant), d => d.recipient)
  }

  const donors = Array.from(donorsAndRecipients.donors, ([k, v]) => ({ country: k, value: v }));
  const recipients = Array.from(donorsAndRecipients.recipient, ([k, v]) => ({ country: k, value: v }))

  const donorCountries = donors.map(d => d.country)
  const recipientsCountries = recipients.map(d => d.country)

  const countries = Array.from(new Set(donorCountries.concat(recipientsCountries)))

  const aidData = countries.map(c => {
    let donated = 0;
    let received = 0;
    if (donors.find(d => d.country == c)) {
      donated = (donors.find(d => d.country == c)).value;
    }
    if (recipients.find(d => d.country == c)) {
      received = (recipients.find(d => d.country == c)).value
    }
    return {
      country: c,
      donated: donated,
      received: received,
      difference: donated - received,
      total: donated + received,
      donatedRate: donated/(donated + received),
      receivedRate: received/(donated + received) 
    }

  })
  return aidData.sort((a, b) => d3.ascending(a.difference, b.difference))
//   d2 = aidData.sort((a, b) => d3.descending(a.difference, b.difference)).slice(0,10)
//   const aid = d1.concat(d2)
//   return aid.sort((a, b) => d3.ascending(a.difference, b.difference))
// }
}

function vis1(data, div)  {

  const margin = { top: 40, right: 20, bottom: 40, left: 100 };

  const visWidth = 1000 - margin.left - margin.right;
  const visHeight = 600 - margin.top - margin.bottom;

  const svg = div.append('svg')
    .attr('width', visWidth + margin.left + margin.right)
    .attr('height', visHeight + margin.top + margin.bottom);

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  
  // Config
  const cfg = {
    labelMargin: 5,
    xAxisMargin: 10,
    legendRightMargin: 10
  }
  
  const x = d3.scaleLinear()
    .range([0, visWidth]);
  
  const colour = d3.scaleSequential(d3.interpolatePRGn);
  
  const y = d3.scaleBand()
    .range([visHeight, 0])
    .padding(0.1);

  
  const legend = svg.append("g")
    .attr("class", "legend");
  
  legend.append("text")
    .attr("class", "x-axis")
    .attr("x", visWidth)
    .attr("y", visHeight)
    .attr("text-anchor", "end")
    .text("Diff in amount Donated and Recieved");
    
    y.domain(data.map(function(d) { return d.country; }));
    x.domain(d3.extent(data, function(d) { return d.difference; }));

    const middle = 0
    const max = d3.max(data, function(d) { return d.difference; })
    const min = d3.min(data, function(d) { return d.difference; })
    colour.domain([min, max]);
    
    const yAxis = svg.append("g")
      .attr("class", "y-axis")
      .attr("transform", "translate(" + x(0) + ",0)")
      .append("line")
        .attr("y1", 0)
        .attr("y2", visHeight);

    // var p = d3.precisionPrefix(1e5, 1.3e6),
    //     f = d3.formatPrefix("." + p, 1.3e6);
    const xformat = d3.format(".2s");
    const xAxis = svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + (visHeight + cfg.xAxisMargin) + ")")
      .call(d3.axisBottom(x)
        .tickSizeOuter(0)
        .tickFormat((n) => xformat(n).replace(/G/,"B") )
      );
      
    
    const bars = svg.append("g")
      .attr("class", "bars")
    
    bars.selectAll("rect")
      .data(data)
    .enter().append("rect")
      .attr("class", "annual-growth")
      .attr("x", function(d) {
         return x(Math.min(middle, d.difference));
      })
      .attr("y", function(d) { return y(d.country); })
      .attr("height", y.bandwidth())
      .attr("width", function(d) { 
        return Math.abs(x(d.difference) - x(middle))
      })
      .style("fill", function(d) {
        return colour(d.difference)
      });
    
    var labels = svg.append("g")
      .attr("class", "labels");
    
    labels.selectAll("text")
      .data(data)
    .enter().append("text")
      .attr("class", "bar-label")
      .attr("x", x(0))
      .attr("y", function(d) { return y(d.country)})
      .attr("dx", function(d) {
        return d.difference < 0 ? cfg.labelMargin : -cfg.labelMargin;
      })
      .attr("dy", y.bandwidth())
      .attr("text-anchor", function(d) {
        return d.difference < 0 ? "start" : "end";
      })
      .text(function(d) { return d.country })
  
}      


