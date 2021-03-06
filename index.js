'use strict';

const environment = require('./src/environment');
const Parser = require('./src/parse/Parser');
const Compiler = require('./src/compile/Compiler');
const Renderer = require('./src/render/Renderer');
const Helpers = require('./src/render/Helpers');
const Utils = require('./src/render/Utils');

const Cache = require('./src/Cache');
const config = require('./src/Config');

//
module.exports.compile = (src) => {
  const buffer = new Parser().parse(src);
  return new Compiler().compile(buffer);
};

//
module.exports.render = (compiled, data) => {
  return new Renderer().render(compiled, data);
};

//
module.exports.configure = (app) => {
  config.init(app.settings);
};

// expressjs engine
module.exports.engine = (filePath, options, callback) => {
  const compiled = Cache.getCompiled(filePath);
  const rendered = module.exports.render(compiled, options);
  callback(null, rendered);
};

//
module.exports.helpers = Helpers;
module.exports.filters = Utils.f;
module.exports.config = config;

if (environment.isBrowser) {
  window.IgoDust = {
    render: (compiled, data) => {
      return new Renderer().render(compiled, data);
    },
    compile: (src) => {
      const buffer = new Parser().parse(src);
      return new Compiler().compile(buffer);
    },
  };
}