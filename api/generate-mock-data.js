/* This script generates mock data for local development.
   This way you don't have to point to an actual API,
   but you can enjoy realistic, but randomized data,
   and rapid page loads due to local, static data.
 */

var jsf = require('json-schema-faker');
const path = require('path');
var fs = require('fs');
const glob = require('glob');

const main = function () {
  //Extend Json schema faker to user faker js
  jsf.extend('faker', () => require('faker'));
  files = fs.readdirSync('./api/schema');
  const schemaList = getSchemas(files);

  console.log('Creating json file for each schema');
  schemaList.forEach((schema) => {
    var schemaJson = JSON.stringify(jsf.generate(schema[1]));
    fs.writeFileSync('./api/db/' + schema[0] + '.json', schemaJson, function (
      err
    ) {
      if (err) {
        return console.log(err);
      }
    });
  });
  writeDBJson();
};

const writeDBJson = function () {
  console.log('Generate db.json file');
  const dbFiles = glob.sync('./api/db/*.json', {
    nodir: true,
  });
  console.log('dbFiles', dbFiles);
  dbObj = {};
  dbFiles.forEach((file) => {
    const baseFileName = path.basename(file, '.json');
    const jsonObj = require(file.replace('./api', './'));
    dbObj[baseFileName] = jsonObj[baseFileName];
  });
  console.log(dbObj);
  fs.writeFile('./api/db.json', JSON.stringify(dbObj), function (err) {
    if (err) {
      return console.log(err);
    }
  });
};

const getSchemas = function (fileArray) {
  var schemaList = [];
  fileArray.forEach((file) => {
    if (path.extname(file) == '.json') {
      const schema = require('./schema/' + file);
      schemaList.push([getDBFileName(file), schema]);
    }
  });
  return schemaList;
};

const getDBFileName = function (filename) {
  return path.basename(filename, '.json').split('.')[0];
};

main();
