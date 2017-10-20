import { h, Component } from "preact";
import * as styles from "./Joyplot.scss";
import * as d3 from "d3";

class Joyplot extends Component {
  constructor(props) {
    super(props);

    this.createChart = this.createChart.bind(this); // Bind to access within method
  }
  componentWillMount() {}

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate() {
    this.loadData();
  }

  createChart(error, dataFlat) {
    // Initial values
    let margin = { top: 30, right: 20, bottom: 60, left: 20 },
      width = parseInt(d3.select("." + styles.joyplot).style("width"), 10),
      joyplotWidth = 700,
      joyplotHeight = 76,
      labelMargin = 200,
      labelOffset = 70,
      spacing = 52,
      totalPlots = dataFlat.columns.length - 1,
      height = (totalPlots - 1) * spacing + joyplotHeight,
      joyplotFill = "rgba(0, 125, 153, 0.6",
      lineWidth = 1;

    // We are using Mike Bostock's margin conventions https://bl.ocks.org/mbostock/3019563
    width = width - margin.left - margin.right;

    // Set up a date parser
    var parseDate = d3.timeParse("%d/%m/%Y");

    // set the range scales
    var xScale = d3.scaleTime().range([labelMargin, width]);
    var yScale = d3.scaleLinear().range([joyplotHeight, 0]);

    // define the chart area
    let area = d3
      .area()
      .x(d => {
        return xScale(d.Week);
      })
      .y0(yScale(0))
      .curve(d3.curveMonotoneX);

    let lineData = [[0, 0], [width, 0]];

    let lineGenerator = d3.line();

    let pathString = lineGenerator(lineData);

    // Parse the dates to use full date format
    dataFlat.forEach(d => {
      d.Week = parseDate(d["Week"]);
    });

    // Convert the number strings to integers
    dataFlat.columns.forEach(d => {
      dataFlat.forEach(e => {
        if (d === "Week") return;
        e[d] = +e[d];
      });
    });

    // Draw the chart
    var svg = d3
      .select("." + styles.joyplot)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    xScale.domain(
      d3.extent(dataFlat, function(d) {
        return d.Week;
      })
    );

    yScale.domain([
      0,
      d3.max(dataFlat, function(d) {
        return d["Sydney siege"];
      })
    ]);

    // Loop through data and plot the area chart
    dataFlat.columns.forEach((volume, i) => {
      if (volume === "Week") return;

      area.y1(d => {
        return yScale(d[volume]);
      });

      var downPage = spacing * (i - 1);

      console.log(spacing, i, downPage);

      let downPageText = spacing * (i - 1) + labelOffset;
      let downPageLine = spacing * (i - 1) + joyplotHeight + 1;

      svg
        .append("path")
        .attr("class", styles.singlePlot)
        .datum(dataFlat)
        .attr("fill", joyplotFill)
        .attr("transform", "translate(0, " + downPage + ")")
        .attr("d", area);

      // Draw a baseline
      svg
        .append("path")
        .attr("class", styles.singlePlot)
        .attr("d", pathString)
        .attr("stroke", joyplotFill)
        .attr("stroke-width", lineWidth + "px")
        .attr("fill", "none")
        .attr("shape-rendering", "crispEdges")
        .attr("transform", "translate(0, " + downPageLine + ")");

      svg
        .append("text")
        .text(volume)
        .style("font-size", "16px")
        .style("fill", "#444")
        .attr("transform", "translate(0, " + downPageText + ")");

      // Remove and redraw chart
      d3.select(window).on("resize", resize);

      function resize() {
        width = parseInt(d3.select("." + styles.joyplot).style("width"), 10);
        width = width - margin.left - margin.right;

        xScale = d3.scaleTime().range([labelMargin, width]);

        xScale.domain(
          d3.extent(dataFlat, function(d) {
            return d.Week;
          })
        );

        lineData = [[0, 0], [width, 0]];
        pathString = lineGenerator(lineData);

        d3.selectAll("." + styles.singlePlot).remove();

        dataFlat.columns.forEach((volume, i) => {
          if (volume === "Week") return;

          area.y1(d => {
            return yScale(d[volume]);
          });

          let downPage = spacing * (i - 1);
          let downPageLine = spacing * (i - 1) + joyplotHeight + 1;
          let downPageText = spacing * (i - 1) + 95;

          svg
            .append("path")
            .attr("class", styles.singlePlot)
            .datum(dataFlat)
            .attr("fill", "rgba(0, 125, 153, 0.6")
            .attr("transform", "translate(0, " + downPage + ")")
            .attr("d", area);

          svg
            .append("path")
            .attr("class", styles.singlePlot)
            .attr("d", pathString)
            .attr("stroke", joyplotFill)
            .attr("stroke-width", lineWidth + "px")
            .attr("fill", "none")
            .attr("transform", "translate(0, " + downPageLine + ")");
        });
      }
    });
  }

  loadData() {
    d3
      .queue(2) // Load 2 files concurrently (if there are more than 1)
      .defer(d3.csv, this.props.dataUrl)
      .await(this.createChart);
  }

  render(props, state) {
    return (
      <div className={styles.root}>
        <svg className={styles.joyplot} />
      </div>
    );
  }
}

module.exports = Joyplot;
