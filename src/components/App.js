const { h, Component } = require('preact');

const Joyplot = require('./Joyplot');
const styles = require('./App.scss');
const worm = require('./worm.svg');

class App extends Component {
  render({ projectName }) {
    return (
      <div className={styles.root}>
        <Joyplot></Joyplot>
      </div>
    );
  }
}

module.exports = App;
