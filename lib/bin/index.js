#!/usr/bin/env node

const pkg = require('../../package.json');
const program = require('commander');

///////////////////////////////////////////////////////////////////////////////

program
  .command('log', 'log jstrument event stream to file')
  .command('serve', 'serve visualization from file')
  .parse(process.argv);
