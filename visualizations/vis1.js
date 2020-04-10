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
    }
  })
  return aidData
}



// function vis1(data, div) {
//   const margin = { top: 40, right: 20, bottom: 40, left: 100 };

//   const visWidth = 700 - margin.left - margin.right;
//   const visHeight = 400 - margin.top - margin.bottom;

//   const svg = div.append('svg')
//     .attr('width', visWidth + margin.left + margin.right)
//     .attr('height', visHeight + margin.top + margin.bottom);

//   const g = svg.append("g")
//     .attr("transform", `translate(${margin.left}, ${margin.top})`);

//   // add title

//   g.append("text")
//     .attr("x", visWidth / 2)
//     .attr("y", -margin.top + 5)
//     .attr("text-anchor", "middle")
//     .attr("dominant-baseline", "hanging")
//     .attr("font-family", "sans-serif")
//     .attr("font-size", "16px")
//     .text("Game Scores");

//   // create scales

//   const x = d3.scaleLinear()
//     .domain([0, d3.max(data.donors, d => sum(d.values.donors.commitment_amount_usd_constant)]).nice()
//     .range([0, visWidth]);

//   //const sortedNames = data.sort((a, b) => d3.descending(a.score, b.score))
//   //   .map(d => d.name);

//   const y = d3.scaleBand()
//     .domain(d.donors)
//     .range([0, visHeight])
//     .padding(0.2);

//   // create and add axes

//   const xAxis = d3.axisBottom(x);

//   g.append("g")
//     .attr("transform", `translate(0, ${visHeight})`)
//     .call(xAxis)
//     .call(g => g.selectAll(".domain").remove())
//     .append("text")
//     .attr("x", visWidth / 2)
//     .attr("y", 40)
//     .attr("fill", "black")
//     .attr("text-anchor", "middle")
//     .text("Score");

//   const yAxis = d3.axisLeft(y);

//   g.append("g")
//     .call(yAxis)
//     .call(g => g.selectAll(".domain").remove());

//   // draw bars

//   g.selectAll("rect")
//     .data(data)
//     .join("rect")
//     .attr("x", d => 0)
//     .attr("y", d => y(d.donors.key))
//     .attr("width", d => x(d.donors.value))
//     .attr("height", d => y.bandwidth())
//     .attr("fill", "steelblue");
// }
