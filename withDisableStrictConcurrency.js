const { withXcodeProject } = require('@expo/config-plugins');

module.exports = function withDisableStrictConcurrency(config) {
  return withXcodeProject(config, async (config) => {
    const xcodeProject = config.modResults;
    const configurations = xcodeProject.pbxXCBuildConfigurationSection();
    
    for (const key in configurations) {
      const buildSettings = configurations[key].buildSettings;
      if (buildSettings) {
        buildSettings['SWIFT_STRICT_CONCURRENCY'] = '"minimal"';
      }
    }
    return config;
  });
};
