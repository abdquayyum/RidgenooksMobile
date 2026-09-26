const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

module.exports = function withDisableStrictConcurrency(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      let contents = fs.readFileSync(podfilePath, 'utf-8');

      const hookRegex = /post_install do \|installer\|/;
      
      const strictConcurrencyPatch = `
post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['SWIFT_STRICT_CONCURRENCY'] = 'minimal'
      config.build_settings['SWIFT_TREAT_WARNINGS_AS_ERRORS'] = 'NO'
      config.build_settings['GCC_TREAT_WARNINGS_AS_ERRORS'] = 'NO'
    end
  end
`;
      if (contents.match(hookRegex)) {
        contents = contents.replace(
          hookRegex,
          `post_install do |installer|\n  installer.pods_project.targets.each do |target|\n    target.build_configurations.each do |config|\n      config.build_settings['SWIFT_STRICT_CONCURRENCY'] = 'minimal'\n      config.build_settings['SWIFT_TREAT_WARNINGS_AS_ERRORS'] = 'NO'\n      config.build_settings['GCC_TREAT_WARNINGS_AS_ERRORS'] = 'NO'\n    end\n  end`
        );
      } else {
        contents += strictConcurrencyPatch + "end\n";
      }
      fs.writeFileSync(podfilePath, contents);
      return config;
    },
  ]);
};
