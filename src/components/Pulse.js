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
    var joyplotHeight = 130;
    var joyplotWidth = 960;
    var spacing = 100;

    // Set up a date parser
    var parseDate = d3.timeParse("%d/%m/%y");

    // set the range scales
    var xScale = d3.scaleTime().range([0, joyplotWidth]);
    var yScale = d3.scaleLinear().range([joyplotHeight, 0]);

    // console.log(dataFlat);

    var searchTerm = "Virginia tech shooting";

    // define the chart area
    let area = d3
      .area()
      .x(d => {
        return xScale(d.Week);
      })
      .y1(d => {
        return yScale(d[searchTerm]);
      })
      .y0(yScale(0))
      .curve(d3.curveMonotoneX);

    var line = d3
      .line()
      .x(d => {
        return xScale(d.Week);
      })
      .y(d => {
        return yScale(d[searchTerm]);
      })
      .curve(d3.curveMonotoneX);

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

    console.log(gunControlData);

    // Draw the chart
    var svg = d3
      .select("." + styles.pulse)
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
        return d["Virginia tech shooting"];
      })
    ]);

    

    dataFlat.columns.forEach((volume, i) => {
      if (volume === "Week") return;

      area.y1(d => {
        return yScale(d[volume]);
      });

      line.y(d => {
        return yScale(d[volume]);
      });

      let downPage = spacing * i;

      let downPageText = downPage + 100;


      g
        .append("path")
        .datum(dataFlat)
        .attr("fill", '#C70039')
        .attr('fill-opacity', 0.6)
        .attr("transform", "translate(0, " + downPage + ")")
        .attr("d", area);

      // g
      //   .append("path")
      //   .datum(dataFlat)
      //   .style("fill", "none")
      //   .style("stroke", "#900C3F")
      //   .style("stroke-width", 1.4)
      //   .attr("transform", "translate(0, " + downPage + ")")
      //   .attr("d", line);

      g.append('text')
        .text(volume)
        .style('font-size', "16px")
        .style('font-family', 'Helvetica, Arial, sans-serif')
        .style('fill', '#444')
        .attr("transform", "translate(0, " + downPageText + ")")

    });


    gunControlData.columns.forEach((volume, i) => {
      if (volume === "Week") return;

      area.y1(d => {
        return yScale(d[volume]);
      });

      line.y(d => {
        return yScale(d[volume]);
      });

      let downPage = spacing * i;

      // downPage = downPage + 200;

      g
        .append("path")
        .datum(gunControlData)
        .attr("fill", 'lightblue')
        .attr('fill-opacity', 0.6)
        .attr("transform", "translate(0, " + downPage + ")")
        .attr("d", area);

      g
        // .append("path")
        // .datum(gunControlData)
        // .style("fill", "none")
        // .style("stroke", "blue")
        // .style("stroke-width", 1.4)
        // .attr("transform", "translate(0, " + downPage + ")")
        // .attr("d", line);

      // g.append('text')
      //   .text(volume)
      //   .style('font-size', "16px")
      //   .style('font-family', 'Helvetica, Arial, sans-serif')
      //   .style('fill', '#444')
      //   .attr("transform", "translate(0, " + downPage + ")")

    });

    
  }

  loadData() { 
    d3
      .queue(2) // Load 2 files concurrently (if there are more than 1)
      .defer(d3.csv, this.props.searches)
      .defer(d3.csv, this.props.control)
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
