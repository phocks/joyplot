const { h, render } = require('preact');

const PROJECT_NAME = 'joyplot';
const root = document.querySelector(`[data-joyplot-root]`);
const elemJoyplot = document.querySelector(`[name=joyplot]`);
const elemStacked = document.querySelector(`[name=stacked]`);

function init() {
  draw(elemJoyplot, "joyplot");
  draw(elemStacked, "stacked");
}

function draw(element, type) {
  const App = require('./components/App');

  console.log(type);
  
  render(<App type={type} />, element, element.firstChild);
}


init();

// Magic hot reload stuff
if (module.hot) {
  module.hot.accept('./components/App', () => {
    try {
      init();
    } catch (err) {
      const ErrorBox = require('./components/ErrorBox');

      render(<ErrorBox error={err} />, root, root.firstChild);
    }
  });
}

if (process.env.NODE_ENV === 'development') {
  require('preact/devtools');

  console.debug(`[${PROJECT_NAME}] public path: ${__webpack_public_path__}`);
}
