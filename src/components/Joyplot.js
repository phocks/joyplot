import { h, Component } from "preact";
import * as styles from "./Joyplot.scss";
import * as d3 from "d3";

class Joyplot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 960,
      height: 500
    };
    this.createChart = this.createChart.bind(this); // Bind to access within method
  }
  componentWillMount() {
    // Set up a date parser
    this.parseDate = d3.timeParse("%d/%m/%Y");

    // set the range scales
    this.xScale = d3.scaleTime().range([0, this.state.width]);
    this.yScale = d3.scaleLinear().range([this.state.height, 0]);

    // define the chart area
    this.area = d3
      .area()
      .x(d => {
        return x(d.date);
      })
      .y0(this.state.height)
      .y1(d => {
        return y(d.close);
      });
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate() {
    this.loadData();
  }

  createChart(error, dataFlat) {
    // console.log(data[0].Week);
    // console.log(this.parseDate(data[0].Week));
    // console.log(this.state.width);


    // Parse the dates to use full date format
    dataFlat.forEach(d => {
      d.Week = this.parseDate(d["Week"]);
    });

    // Convert the number strings to integers
    dataFlat.columns.forEach(d => {
      dataFlat.forEach(e => {
        if (d === "Week") return;
        e[d] = +e[d];
      });
    });

    // Use D3 to nest our data week by week
    var dataNested = d3
      .nest()
      .key(function(d) {
        return d.Week;
      })
      .entries(dataFlat);

    console.log(dataNested);


    const svg = d3
      .select("svg")
      .attr("width", this.state.width)
      .attr("height", this.state.height);
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
