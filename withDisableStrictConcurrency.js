const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

module.exports = function withDisableStrictConcurrency(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      let contents = fs.readFileSync(podfilePath, 'utf-8');

      // Add post_install hook to disable strict concurrency for ALL pods
      const postInstallRegex = /post_install do \|installer\|/;
      const strictConcurrencyPatch = `
post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['SWIFT_STRICT_CONCURRENCY'] = 'minimal'
    end
  end
`;
      if (!contents.includes("SWIFT_STRICT_CONCURRENCY")) {
          if (contents.match(postInstallRegex)) {
            contents = contents.replace(
              postInstallRegex,
              `post_install do |installer|\n  installer.pods_project.targets.each do |target|\n    target.build_configurations.each do |config|\n      config.build_settings['SWIFT_STRICT_CONCURRENCY'] = 'minimal'\n    end\n  end`
            );
          } else {
            contents += strictConcurrencyPatch + "end\n";
          }
          fs.writeFileSync(podfilePath, contents);
      }
      return config;
    },
  ]);
};
