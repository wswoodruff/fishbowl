require('core-js/stable');
require('immer').enableES5();
const HotLoader = require('react-hot-loader');
const React = require('react');
const ReactDOM = require('react-dom');
const M = require('./middle-end');
const App = require('./App');
const Theme = require('./theme');

(() => {

    HotLoader.setConfig({
        errorReporter: () => null,
        ErrorOverlay: () => null
    });

    const middleEnd = M.create({
        logErrors: true,
        api: process.env.API_URL,
        basePath: process.env.BASE_PATH
    }).initialize();

    ReactDOM.render(
        <App
            middleEnd={middleEnd}
            history={middleEnd.mods.router.history}
            theme={Theme}
        />,
        document.getElementById('root')
    );
})();
