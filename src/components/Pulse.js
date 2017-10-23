import { h, Component } from "preact";
import * as styles from "./Pulse.scss";
import * as d3 from "d3";

class Pulse extends Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 700,
      height: 1000
    };
    this.createChart = this.createChart.bind(this); // Bind to access within method
  }
  componentWillMount() {}

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate() {
    this.loadData();
  }

  createChart(error, dataFlat, gunControlData) {
    // Inital variables
    let margin = { top: 60, right: 5, bottom: 70, left: 5 },
      width = parseInt(d3.select("." + styles.pulse).style("width"), 10),
      joyplotHeight = 130,
      labelMargin = 120,
      spacing = 100,
      totalPlots = dataFlat.columns.length - 1,
      height = (totalPlots - 1) * spacing + joyplotHeight,
      guideFill = "rgba(92, 108, 112, 0.5)",
      guideTextFill = "rgba(92, 108, 122, 1.0)",
      lineWidth = 1,
      shapeRendering = "crispEdges",
      interestLineWidth = 50,
      fontSize = 15,
      maxSearchIndex = 100;

    // We are using Mike Bostock's margin conventions https://bl.ocks.org/mbostock/3019563
    width = width - margin.left - margin.right;

    const shootingColor = "rgba(0, 125, 153, 0.5)";
    const gunControlColor = "rgba(255, 97, 0, 0.75)";

    // Set up a date parser
    var parseDate = d3.timeParse("%d/%m/%y");

    // set the range scales
    var xScale = d3.scaleTime().range([0, width]);
    var yScale = d3.scaleLinear().range([joyplotHeight, 0]);

    // define the chart area
    let area = d3
      .area()
      .x(d => {
        return xScale(d.Week);
      })
      .y1(d => {
        return yScale(maxSearchIndex);
      })
      .y0(yScale(0))
      .curve(d3.curveMonotoneX);

    let interestLineData = [[0, 0], [interestLineWidth, 0]];
    let lineGenerator = d3.line();
    let interestline = lineGenerator(interestLineData);

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

    gunControlData.forEach(d => {
      d.Week = parseDate(d["Week"]);
    });

    // Convert the number strings to integers
    gunControlData.columns.forEach(d => {
      dataFlat.forEach(e => {
        if (d === "Week") return;
        e[d] = +e[d];
      });
    });

    // Get the containing div for labels
    const div = d3.select("." + styles.root);

    // Draw the chart
    var svg = d3
      .select("." + styles.pulse)
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
      -0.4, // Maintain a base line
      d3.max(dataFlat, function(d) {
        return maxSearchIndex;
      })
    ]);

    // Draw some guides up top
    const searchInterest = svg
      .append("g")
      .attr(
        "transform",
        "translate(" + (width * 0.33 - interestLineWidth / 2 + 4) + ", 0)"
      );

    searchInterest
      .append("path")
      .attr("d", interestline)
      .attr("stroke", guideFill)
      .attr("stroke-width", lineWidth + "px")
      .attr("fill", "none")
      .attr("shape-rendering", shapeRendering);

    const searchInterestText = searchInterest
      .append("text")
      .attr("fill", guideTextFill)
      .attr("font-size", 11)
      .attr("text-anchor", "end");

    searchInterestText
      .append("tspan")
      .text("100% search")
      .attr("x", -5);

    searchInterestText
      .append("tspan")
      .text("interest")
      .attr("x", -5)
      .attr("y", 13);

    dataFlat.columns.forEach((volume, i) => {
      if (volume === "Week") return;

      area.y1(d => {
        return yScale(d[volume]);
      });

      let downPage = (i - 1) * spacing;
      let downPageText = spacing * (i - 1) + margin.top - 4;

      svg
        .append("path")
        .datum(dataFlat)
        .attr("fill", shootingColor)
        .attr("transform", "translate(0, " + downPage + ")")
        .attr("d", area);

      // svg
      //   .append("text")
      //   .text(volume)
      //   .style("font-size", "16px")
      //   .style("font-family", "Helvetica, Arial, sans-serif")
      //   .style("fill", "#333")
      //   .style("font-weight", "bold")
      //   .attr("transform", "translate(0, " + downPageText + ")");

      // Render the labels in a span to get text wrapping
      // We put it in a table-cell to achieve bottom aligning
      var labels = div
        .append("span")
        .classed(styles.labels, true)
        .style("width", labelMargin - 10 + "px")
        .style("top", downPageText + "px")
        .style("left", margin.left + "px")
        .style("position", "absolute");

      var labelsDiv = labels
        .append("div")
        .text(volume)
        .style("display", "table-cell")
        .style("vertical-align", "bottom")
        .style("font-size", fontSize + "px")
        .style("font-weight", "bold")
        .style("text-align", "left")
        .style("height", joyplotHeight + "px")
        .style("color", "#333");
    });

    gunControlData.columns.forEach((volume, i) => {
      if (volume === "Week") return;

      area.y1(d => {
        return yScale(d[volume]);
      });

      let downPage = (i - 1) * spacing;

      svg
        .append("path")
        .datum(gunControlData)
        .attr("fill", gunControlColor)
        .attr("transform", "translate(0, " + downPage + ")")
        .attr("d", area);
    });
  } // end createChart

  loadData() {
    d3
      .queue(2) // Load files concurrently (if more than 1)
      .defer(d3.csv, this.props.dataURL)
      .defer(d3.csv, this.props.dataURL2)
      .await(this.createChart);
  }

  render(props, state) {
    return (
      <div className={styles.root}>
        <svg className={styles.pulse} />
      </div>
    );
  }
}

module.exports = Pulse;
