// Load the datasets and call the functions to make the visualizations
function fixName(name) {
  if (name == 'Korea') {
    return 'Republic of Korea';
  } else if (name == 'Slovak Republic') {
    return 'Slovakia';
  } else {
    return name;
  }
}

function fixData(data) {
  return data.map(d => {
    const country = fixName(d.country);
    return {...d, country}
  });
}

const store = {};
Promise.all([
  d3.csv('data/aiddata-countries-only.csv', d3.autoType),
  d3.json('data/countries.json')
]).then(([data, geoJSON]) => {
  
  store.data = data;
  store.data1 = totalAidByCountry(data)
  store.data2 = dataVis2(store.data1)
  store.data3 = AidNameByCountry(store.data)
  vis1(store.data1, d3.select('#vis1'))
  vis2(geoJSON, d3.select('#vis2'), store.data2)
  vis3(geoJSON, d3.select('#vis3'), store.data3)
  legend2(d3.select("#vis2legend"))
  legend3(d3.select("#vis3legend"))







});
