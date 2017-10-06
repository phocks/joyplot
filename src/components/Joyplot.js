import { h, Component } from "preact";
import * as styles from "./Joyplot.scss";
import * as d3 from "d3";

class Joyplot extends Component {
  constructor(props) {
    super(props);
    // this.createChart = this.createChart.bind(this); // not needed?
  }
  componentWillMount() {
    // this.loadData();
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate() {
    this.loadData();
  }

  createChart(error, file1) {
    console.log(file1);
    const svg = d3.select("svg");
  }

  loadData() {
    d3
      .queue(2)
      .defer(d3.csv, this.props.dataUrl)
      .await(this.createChart);
  }

  render(props, state) {
    return (
      <div className={styles.root}>
        <svg />
      </div>
    );
  }
}

module.exports = Joyplot;
