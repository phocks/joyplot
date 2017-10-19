const { h, Component } = require("preact");

const Joyplot = require("./Joyplot");
const Pulse = require("./Pulse");

const styles = require("./App.scss");

class App extends Component {
  render() {
    const { type } = this.props;

    switch (type) {
      case "joyplot":
        return (
          <Joyplot dataUrl="http://www.abc.net.au/res/sites/news-projects/as-time-goes-by/master/data.csv" />
        );
        break; 
      case "stacked":
        return (
          <Pulse
            searches="http://www.abc.net.au/res/sites/news-projects/as-time-goes-by/master/pulse-data.csv"
            control="http://www.abc.net.au/res/sites/news-projects/as-time-goes-by/master/gun-control-data.csv"
          />
        );
    }
  }
}

module.exports = App;
