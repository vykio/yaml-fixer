const fs = require('fs');
const path = require('path');
const prettier = require('prettier');

const formatYamlFile = (filePath, prettierConfig) => {
  fs.readFile(filePath, 'utf8', async (err, data) => {
    if (err) {
      console.error(`Error reading file ${filePath}:`, err);
      return;
    }

    const formatted = await prettier.format(data, { ...prettierConfig, parser: 'yaml' });

    fs.writeFile(filePath, formatted, (err) => {
      if (err) {
        console.error(`Error writing file ${filePath}:`, err);
        return;
      }

      console.log(`File ${filePath} has been prettified.`);
    });
  });
};

const loadPrettierConfig = (configPath) => {
  try {
    const config = fs.readFileSync(configPath, 'utf8');
    console.log(`Config loaded ${config}`);
    return JSON.parse(config);
  } catch (err) {
    console.warn(`Could not load Prettier config at ${configPath}. Using default config.`);
    return {};
  }
};

const processPath = (filePath, prettierConfig) => {
  if (fs.statSync(filePath).isDirectory()) {
    fs.readdir(filePath, (err, files) => {
      if (err) {
        console.error(`Error reading directory ${filePath}:`, err);
        return;
      }

      files.forEach((file) => {
        processPath(path.join(filePath, file), prettierConfig);
      });
    });
  } else if (filePath.endsWith('.yaml') || filePath.endsWith('.yml')) {
    formatYamlFile(filePath, prettierConfig);
  }
};

const files = process.argv.slice(2);
const prettierConfigPath = '.prettierrc';
const prettierConfig = loadPrettierConfig(prettierConfigPath);

files.forEach((file) => processPath(file, prettierConfig));