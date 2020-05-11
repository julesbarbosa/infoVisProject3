function legend(matrix, div){

    const maxDonation = d3.max(matrix, transact => transact.value)
    const minDonation = d3.min(matrix, transact => transact.value)

    const color1 = d3.scaleSequential()
                .domain([minDonation, maxDonation])
                .interpolator(d3.interpolateRdPu)

            
              div.append(() => continuousLegend(color1, 400, 35));

            
            function continuousLegend(color, width, height) {
              const svg = d3.create('svg')
                  .attr('width', width)
                  .attr('height', height);
              
              // margin set up
             
              const margin = {top: 0, bottom: 20, left: 20, right: 20};
              
              const w = width - margin.left - margin.right;  
              const h = height - margin.top - margin.bottom;
              
              const g = svg.append('g')
                  .attr('transform', `translate(${margin.left},${margin.top})`)
              
              // create a canvas element to draw the legend
              
              const canvas = document.createElement('canvas');
              
              canvas.width = w;
              canvas.height = h;
              
              const context = canvas.getContext("2d");

              for (let i = 0; i < w; ++i) {
                context.fillStyle = color.interpolator()(i / w);
                context.fillRect(i, 0, 100, h);
              }

              // add canvas to SVG as an image
              g.append('svg:image')
                  .attr('href', canvas.toDataURL())
              
              // set up the axis
              
              // create scale for tick marks
              const domain = color.domain();
              // sequential scales have domain length 2
              // diverging scales have domain length 3
              const range = domain.length === 2 ?
                    [0, w] :
                    [0, w/2, w];
              const scale = d3.scaleLinear()
                  .domain(domain)
                  .range(range);
              
              // create and add axis
              const axis = d3.axisBottom(scale)
                  .ticks(5);
              g.append('g')
                  .attr('transform', `translate(0, ${h})`)
                  .call(axis)
                  .call(g => g.select('.domain').remove());
  
              return svg.node();
            }
        }