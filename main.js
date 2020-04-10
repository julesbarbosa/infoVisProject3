// Load the datasets and call the functions to make the visualizations
const store = {}; 
Promise.all([
  d3.csv('data/aiddata-countries-only.csv', d3.autoType),
  d3.json('data/countries.json')
]).then(([data, geoJSON]) => {
  store.data = data;
  console.log(totalAidByCountry(data))
  //vis1(groups(data), d3.select('#vis1'));
  //vis2(geoJSON, d3.select('#vis2'));
});
