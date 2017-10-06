import { h, Component } from "preact";
import * as styles from "./Joyplot.scss";
import * as d3 from "d3";

class Joyplot extends Component {
  constructor(props) {
    super(props);
    // this.createChart = this.createChart.bind(this);
  }

  componentDidMount() {
    this.createChart();
  }

  componentDidUpdate() {}

  createChart() {
    console.log(this.props);
    d3.select("svg");
  }
  render(props, state) {
    console.log(props.name);
    return (
      <div className={styles.root}>
        <svg />
      </div>
    );
  }
}

module.exports = Joyplot;
