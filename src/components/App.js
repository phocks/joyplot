const { h, Component } = require("preact");

const Joyplot = require("./Joyplot");
const Pulse = require("./Pulse");

const styles = require("./App.scss");

class App extends Component {
  render() {
    const { type } = this.props;

    switch (type) {
      case "joyplot":
        return <Joyplot dataUrl="http://www.abc.net.au/res/sites/news-projects/as-time-goes-by/master/data.csv" />;
        break;
      case "stacked":
        return (
          <Pulse dataUrl="http://www.abc.net.au/res/sites/news-projects/as-time-goes-by/master/pulse-data.csv" dataUrl2="http://www.abc.net.au/res/sites/news-projects/as-time-goes-by/master/gun-control-data.csv" />
        );
    }

    // return (
    //   <div className={styles.root}>
    //     <Joyplot dataUrl="data.csv" />
    //     <Pulse dataUrl="pulse-data.csv" dataUrl2="gun-control-data.csv"/>
    //   </div>
    // );
  }
}

module.exports = App;
