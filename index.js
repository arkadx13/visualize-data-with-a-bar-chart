document.addEventListener("DOMContentLoaded", () => {
  const svgCanvass = {
    width: 900,
    height: 500,
    padding: 40,
  };

  const createCanvass = () => {
    const svg = d3
      .select("body")
      .append("svg")
      .attr("width", svgCanvass.width)
      .attr("height", svgCanvass.height);
    return svg;
  };

  const createTitle = (svg) => {
    return d3
      .select("svg")
      .append("text")
      .attr("id", "title")
      .attr("x", 350)
      .attr("y", 40)
      .text("USA Gross Domestic Product");
  };
  const createBar = (svg, dataset) => {
    return svg
      .selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("width", svgCanvass.width + svgCanvass.padding / dataset.length)
      .attr("height", (d) => d[1])
      .attr("x", (d, i) => i * 3)
      .attr("y", (d) => svgCanvass.height - (d[1] - svgCanvass.padding));
  };

  const createAxes = (svg, xScale) => {
    return svg
      .append("g")
      .attr(
        "transform",
        `translate(0,${svgCanvass.height - svgCanvass.padding})`
      )
      .call(d3.axisBottom(xScale).tickFormat((d) => d3.timeFormat("%Y")(d)));
  };

  const createTooltip = () => {};

  fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
  )
    .then((response) => response.json())
    .then((data) => {
      //   console.log(data); --------------> response
      const dataset = data?.data;
      console.log(dataset); //----------------> dataset

      //max and min
      const dates = dataset.map((d) => d[0]);
      console.log("dates:", dates);
      const gdp = dataset.map((d) => d[1]);
      const oldestDate = d3.min(dates);
      console.log("oldestDate", oldestDate);
      console.log("typeof oldestDate", typeof oldestDate);

      const latestDate = d3.max(dates);
      console.log("latestDate:", latestDate);

      const maxGPD = d3.max(gdp);

      //Scaling
      const xScale = d3
        .scaleLinear()
        .domain([new Date(oldestDate), new Date(latestDate)])
        .range([svgCanvass.padding, svgCanvass.width - svgCanvass.padding]);

      const svg = createCanvass();
      createTitle();
      //   createBar(svg, dataset);
      createAxes(svg, xScale);
      createTooltip();
    })
    .catch((err) => console.log(err));
});
