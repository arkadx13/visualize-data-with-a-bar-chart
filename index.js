document.addEventListener("DOMContentLoaded", () => {
  const svgCanvass = {
    width: 900,
    height: 600,
    padding: 80,
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
      .attr("x", 250)
      .attr("y", 40)
      .text("USA Gross Domestic Product( in Billions of Dollars)");
  };

  const createTooltip = () => {
    return d3.select("body").append("div").attr("id", "tooltip");
  };

  const createBar = (svg, dates, gdp, xScale, yScale) => {
    return (
      svg
        .selectAll("rect")
        .data(gdp)
        .enter()
        .append("rect")
        .attr("width", (svgCanvass.width - svgCanvass.padding) / gdp.length)
        .attr(
          "height",
          (d) => svgCanvass.height - yScale(d) - svgCanvass.padding
        )
        .attr("x", (d, i) => xScale(new Date(dates[i])))
        .attr("y", (d) => yScale(d))
        .attr("fill", (d, i) => (i % 2 ? "#507661" : "#9ac9db"))
        .attr("class", "bar")
        .attr("data-date", (d, i) => `${dates[i]}`)
        .attr("data-gdp", (d, i) => `${d}`)
        //   .append("title")
        //   .text((d) => `Date: ${dates[gdp.indexOf(d)]}\n$${d} Billion `)
        //   .attr("id", "tooltip2")
        //   .attr("data-date", (d) => `${dates[gdp.indexOf(d)]}`)
        .on("mouseover", (e, d) => {
          let gdpInfo = d.toString().replace(/(\d)(?=(\d{3})+\.)/g, "$1,");

          d3.select("#tooltip")
            .style("opacity", 1)
            .style("left", e.pageX + 6 + "px")
            .style("top", e.pageY - 30 + "px")
            .attr("data-date", `${dates[gdp.indexOf(d)]}`)
            .html(
              `<p>Date: ${dates[gdp.indexOf(d)]}</p><p>$${gdpInfo} Billion</p>`
            );
        })
        .on("mouseout", () => {
          return d3
            .select("#tooltip")
            .style("opacity", 0)
            .style("left", 0)
            .style("top", 0);
        })
    );
  };

  const createAxes = (svg, xScale, yScale) => {
    svg
      .append("g")
      .attr(
        "transform",
        `translate(0,${svgCanvass.height - svgCanvass.padding})`
      )
      .attr("id", "x-axis")
      .attr("class", "tick")
      .call(d3.axisBottom(xScale));

    svg
      .append("g")
      .attr("transform", `translate(${svgCanvass.padding},0)`)
      .attr("id", "y-axis")
      .attr("class", "tick")
      .call(d3.axisLeft(yScale));
  };

  const createMoreInfo = (data) => {
    const updatedAt = new Date(data.updated_at);
    d3.select("svg")
      .append("text")
      .text(`Updated at: ${updatedAt.toLocaleString()}`)
      .attr("class", "source-info")
      .attr("x", svgCanvass.padding)
      .attr("y", svgCanvass.height - svgCanvass.padding / 3);

    d3.select("svg")
      .append("text")
      .attr("class", "gdp-label")
      .text(`GDP`)
      .style("fill", "#507661")
      .attr("x", svgCanvass.padding + 10)
      .attr("y", (svgCanvass.height - svgCanvass.padding / 3) / 2);

    d3.select("svg")
      .append("text")
      .text(`source:  ${data.source_name} (${data.source_code})`)
      .attr("class", "source-info")
      .attr("x", svgCanvass.width - svgCanvass.padding * 3.5)
      .attr("y", svgCanvass.height - svgCanvass.padding / 3);

    d3.select("svg")
      .append("text")
      .text(`${data.display_url})`)
      .attr("class", "source-info")
      .attr("x", svgCanvass.width - svgCanvass.padding * 3.5)
      .attr("y", svgCanvass.height - svgCanvass.padding / 5)
      .style("font-style", "italic");
  };

  fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
  )
    .then((response) => response.json())
    .then((data) => {
      const dataset = data?.data;

      //Domain max and min
      const dates = dataset.map((d) => d[0]);
      const gdp = dataset.map((d) => d[1]);

      const oldestDate = d3.min(dates);
      const latestDate = d3.max(dates);
      const maxGPD = d3.max(gdp);

      //Scaling
      const xScale = d3
        .scaleTime()
        .domain([new Date(oldestDate), new Date(latestDate)])
        .range([svgCanvass.padding, svgCanvass.width - svgCanvass.padding]);

      const yScale = d3
        .scaleLinear()
        .domain([0, maxGPD])
        .range([svgCanvass.height - svgCanvass.padding, svgCanvass.padding]);

      const svg = createCanvass();
      createTitle();
      createTooltip();
      createBar(svg, dates, gdp, xScale, yScale);
      createAxes(svg, xScale, yScale);
      createMoreInfo(data);
    })
    .catch((err) => console.log(err));
});
