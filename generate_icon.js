const sharp = require('sharp');
sharp('./assets/logo_transparent.png')
  .flatten({ background: { r: 15, g: 23, b: 42, alpha: 1 } }) // #0F172A slate-900
  .toFile('./assets/icon-ios.png')
  .then(() => console.log('Successfully generated icon-ios.png with slate-900 background!'))
  .catch(err => console.error(err));
