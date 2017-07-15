#!/usr/bin/env node

const pkg = require('../../package.json');
const program = require('commander');

///////////////////////////////////////////////////////////////////////////////

program
  .version(pkg.version)
  .option('-v, --verbose', 'Log / forward all jnstrument events to stdout')
  .command('log', 'log jstrument event stream to file')
  .parse(process.argv);
