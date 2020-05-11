function topDonorsAndRecipients(data) {
  const recipientsData = d3.nest()
    .key(d => d.recipient)
    .rollup(v => d3.sum(v, d => d.commitment_amount_usd_constant))
    .entries(data)
    // get only the top 10 entries
    .sort((a, b) => d3.descending(a.value, b.value))
    .slice(0, 10)
    .map(d => ({ key: d.key, value: -1 * d.value }))


  const donorsData = d3.nest()
    .key(d => d.donor)
    .rollup(v => d3.sum(v, d => d.commitment_amount_usd_constant))
    .entries(data)
    // get only the top 20 entries
    .sort((a, b) => d3.descending(a.value, b.value))
    .slice(0, 20)

  const uniquesDonors = donorsData.reduce((accumulator, d) => {

    const count = accumulator[d.key] ? accumulator[d.key].degree : 0;
    accumulator[d.key] = {
      id: d.key,
      degree: count + d.value
    }
    return accumulator;
  }, {})

  const uniquesRecipients = recipientsData.reduce((accumulator, d) => {

    const count = accumulator[d.key] ? accumulator[d.key].degree : 0;
    accumulator[d.key] = {
      id: d.key,
      degree: count + d.value
    }
    return accumulator;
  }, {})

  // //const uniques = donorsData.concat(recipientsData).reduce((accumulator, d) => {

  //   const count = accumulator[d.key] ? accumulator[d.key].degree : 0;
  //   accumulator[d.key] = {
  //     id: d.key,
  //     degree: count + d.value
  //   }
  //   return accumulator;
  // }, {})

  const nodesRecipients = Object.values(uniquesRecipients).map((d, indx) => (
    { ...d, index: indx }
  ))

  const nodesDonors = Object.values(uniquesDonors).map((d, indx) => (
    { ...d, index: indx }
  ))

  let transactions = data.map(d => {
    const source = nodesDonors.find(node => node.id === d.donor)
    const target = nodesRecipients.find(node => node.id === d.recipient);
    if (source && target) {
      return {
        source,
        target,
        value: d.commitment_amount_usd_constant,
        purpose: d.coalesced_purpose_name,
      };
    } else {
      return null;
    }
  })
    .filter(d => d != null)
    .filter(d => d.value > 0)

  const uniquesNodes = recipientsData.concat(donorsData).reduce((accumulator, d) => {

    const count = accumulator[d.key] ? accumulator[d.key].degree : 0;
    accumulator[d.key] = {
      id: d.key,
      degree: count + d.value
    }
    return accumulator;
  }, {})

  const nodes = Object.values(uniquesNodes).map((d, indx) => (
    { ...d, index: indx }
  ))

  return ({
    nodes: [...nodes.sort((a, b) => d3.descending(a.degree, b.degree))],
    nodesDonors: [...nodesDonors],
    nodesRecipients: [...nodesRecipients],
    links: [...transactions]
  })



}

function matrix(data) {
  const edgeHash = {};
  data.links.forEach(edge => {
    var id = edge.source.id + "-" + edge.target.id
    if (edgeHash[id]) {
      edgeHash[id] = edgeHash[id] + edge.value;
    } else {
      edgeHash[id] = edge.value;
    }
  })

  const matrix = []
  data.nodesDonors.forEach((source, a) => {
    data.nodesRecipients.forEach((target, b) => {
      var grid = {
        id: source.id + "-" + target.id,
        x: b,
        y: a,
        value: null,
        source: source.id,
        target: target.id
      };
      if (edgeHash[grid.id]) {
        grid.value = edgeHash[grid.id];
      }
      matrix.push(grid)
    })
  })
  return matrix
}



function vis1(data, div, matrix) {

  const margin = { top: 40, right: 50, bottom: 40, left: 100 };

  const width = 1300 - margin.left - margin.right;
  const height = 900 - margin.top + margin.bottom;

  const svg = div.append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)

  const maxDonation = d3.max(matrix, transact => transact.value)
  const minDonation = d3.min(matrix, transact => transact.value)



  const color = d3.scaleSequential()
    .domain([minDonation, maxDonation])
    .interpolator(d3.interpolateRdPu)

  //legend

  svg.append("g")
    .attr("transform", "translate(70,70)")
    .append("text")
    .attr("text-anchor", "end")
    .text("Donor")
    .style("font-size", "18px");

  svg.append("g")
    .attr("transform", "translate(150,30)")
    .append("text")
    .attr("text-anchor", "end")
    .text("Recipient")
    .style("font-size", "18px");
  ;


  d3.select("svg").append("g")
    .attr("transform", "translate(100,80)")
    .attr("id", "adjacencyG")
    .selectAll("rect")
    .data(matrix)
    .enter()
    .append("rect")
    .attr("fill", d => d.value != null ? color(d.value) : "white")
    .attr("class", "grid")
    .attr("width", 40)
    .attr("height", 40)
    .attr("x", d => d.x * 40)
    .attr("y", d => d.y * 40)


  d3.selectAll("svg")
    .append("g")
    .attr("transform", "translate(100,75)")
    .selectAll("text")
    .data(data.nodesRecipients)
    .enter()
    .append("text")
    .text(d => d.id)
    .style("font-size", "12px")


    .attr("x", (d, i) => 0)
    .attr("y", (d, i) => 0)
    .attr("transform", (d, i) => "rotate(-40," + (i * 40 + 17.5) + ",0) translate(" + (i * 40 + 17.5) + ")")
    .style("text-anchor", "start")


  d3.select("svg")
    .append("g").attr("transform", "translate(95,80)")
    .selectAll("text")
    .data(data.nodesDonors)
    .enter()
    .append("text")
    .attr("y", (d, i) => i * 40 + 17.5)
    .text(d => d.id)
    .style("text-anchor", "end")
    .style("font-size", "12px")

};

