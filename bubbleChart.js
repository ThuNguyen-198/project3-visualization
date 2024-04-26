// Set up the chart dimensions
const width = 700;
const height = 700;
const padding = 20;

// Load the data
d3.csv("mutualfunds_2.csv").then((data) => {
  console.log("buble");

  data.forEach((d) => {
    d.NetAssets = parseFloat(d.NetAssets.replace(/,/g, ""));
  });

  const sortedData = data
    .sort((a, b) => b.NetAssets - a.NetAssets)
    .slice(0, 20);

  // Create the color scale
  const colorScale = d3
    .scaleOrdinal()
    .domain(sortedData.map((d) => d.Symbol))
    .range(d3.schemeCategory10);

  // Create the pack layout
  const pack = d3
    .pack()
    .size([width - padding, height - padding])
    .padding(5);

  // Create the hierarchy from the data
  const hierarchy = d3
    .hierarchy({ children: sortedData })
    .sum((d) => d.NetAssets);

  // Compute the pack layout
  const root = pack(hierarchy);

  // Create the SVG element
  const svg = d3.select("#chart").attr("width", width).attr("height", height);

  // Create the bubbles
  const bubbles = svg
    .selectAll(".bubble")
    .data(root.descendants().slice(1))
    .enter()
    .append("g")
    .filter((d) => !isNaN(d.x) && !isNaN(d.y)) // Filter out NaN values
    .attr("class", "bubble")
    .attr("transform", (d) => `translate(${d.x + padding}, ${d.y + padding})`);

  // Add the circles to the bubbles
  bubbles
    .append("circle")
    .attr("r", (d) => d.r)
    .attr("fill", (d) => colorScale(d.data.Symbol));

  bubbles
    .append("text")
    .attr("dy", "-0.4em")
    .style("text-anchor", "middle")
    .style("font-size", "10px")
    .append("tspan")
    .attr("class", "symbol")
    .text((d) => d.data.Symbol)
    .append("tspan")
    .attr("class", "netassets")
    .attr("x", 0)
    .attr("dy", "1.2em")
    .text((d) => d.data.NetAssets.toLocaleString());

  // Set the text color to black
  d3.selectAll("text").style("fill", "black");
});
