import { h, Component } from "preact";
import * as styles from "./Joyplot.scss";
import * as d3 from "d3";

class Joyplot extends Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 960,
      height: 60
    };
    this.createChart = this.createChart.bind(this); // Bind to access within method
  }
  componentWillMount() {
    
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate() {
    this.loadData();
  }

  createChart(error, dataFlat) {
    // Set up a date parser
    var parseDate = d3.timeParse("%d/%m/%Y");

    // set the range scales
    var xScale = d3.scaleTime().range([0, this.state.width]);
    var yScale = d3.scaleLinear().range([this.state.height, 0]);

    // define the chart area
    var area = d3
      .area()
      .x(d => {
        return xScale(d.Week);
      })
      .y1(d => {
        return yScale(d["Ankara bombing"]);
      })
      .curve(d3.curveBasis);

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
      .select("svg")
      .attr("width", this.state.width)
      .attr("height", this.state.height);

    var g = svg.append("g");

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

    area.y0(yScale(0));

    g
      .append("path")
      .datum(dataFlat)
      .attr("fill", "steelblue")
      .attr("d", area);
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
        <svg class={styles.joyplot} />
      </div>
    );
  }
}

module.exports = Joyplot;
