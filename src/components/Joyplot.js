import { h, Component } from "preact";
import * as styles from "./Joyplot.scss";
import * as d3 from "d3";

class Joyplot extends Component {
  constructor(props) {
    super(props);
    this.createChart = this.createChart.bind(this);
  }

  componentDidMount() {
    this.createChart();
  }

  createChart() {
    d3.select("svg");
  }
  render({}) {
    return (
      <div className={styles.root}>
        <svg />
      </div>
    );
  }
}

module.exports = Joyplot;
