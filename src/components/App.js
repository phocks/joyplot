const { h, Component } = require("preact");

const Joyplot = require("./Joyplot");
const Pulse = require("./Pulse");

const styles = require("./App.scss");

const interactiveElement = document.querySelector(
  "[data-as-time-goes-by-root]"
);

const dataURLs = {
  joyplot: interactiveElement.dataset.joyplot,
  pulse: interactiveElement.dataset.pulse,
  control: interactiveElement.dataset.control
};



class App extends Component {
  render() {
    const { type } = this.props;

    switch (type) {
      case "joyplot":
        return (
          <Joyplot dataUrl={dataURLs.joyplot} />
        );
        break;
      case "stacked":
        return (
          <Pulse
            dataURL={dataURLs.pulse}
            dataURL2={dataURLs.control}
          />
        );
    }
  }
}

module.exports = App;
