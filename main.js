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
  store.data1 = topDonorsAndRecipients(data)
  store.data2 = matrix(store.data1)
  store.data3 = question2(store.data1)
  console.log("esse",store.data2)
  vis1(store.data1, d3.select('#vis1'), store.data2 )
  vis2(store.data1, d3.select('#vis2'), store.data2, store.data3)
  legend(store.data2, d3.select("#example1"))
  legend2(d3.select("#vis2legend"), store.data3)






});
