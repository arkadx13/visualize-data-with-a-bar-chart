document.addEventListener("DOMContentLoaded", () => {
  const svgCanvass = {
    width: 600,
    height: 500,
    padding: 40,
  };

  const createCanvass = () => {
    return d3.select("body").append("svg").attr("width", svgCanvass.width);
  };
  const createTitle = () => {};
  const createBar = () => {};
  const createTooltip = () => {};

  fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const dataset = data?.data;
      console.log(dataset);
      createCanvass();
      createTitle();
      createBar();
      createTooltip();
    })
    .catch((err) => console.log(err));
});
