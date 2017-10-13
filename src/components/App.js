const { h, Component } = require("preact");

const Joyplot = require("./Joyplot");
const Pulse = require("./Pulse");

const styles = require("./App.scss");

class App extends Component {
  render() {
    return (
      <div className={styles.root}>
        {<Joyplot dataUrl="data.csv" />}
        <Pulse dataUrl="pulse-data.csv" />
      </div>
    );
  }
}

module.exports = App;
