const fs = require('fs');
const path = require('path');

const file = path.resolve('./node_modules/babel-preset-react-native/plugins.js');
const text = fs.readFileSync(file, 'utf8');

// TODO this didnt fucking work - need to adapt to create react-native from react-app


if (!text.includes('babel-plugin-relay')) {
  if (text.includes('module.exports = {')) {
    text = text.replace(
      'module.exports = {',
      "module.exports = {\n   require.resolve('babel-plugin-relay'),",
    );
    fs.writeFileSync(file, text, 'utf8');
  } else {
    throw new Error(`Failed to inject babel-plugin-relay.`);
  }
}
