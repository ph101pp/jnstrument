#!/usr/bin/env node
const pkg = require('../../package.json');
const program = require('commander');
const pump = require('pump');
const split = require('split2');
const fs = require('fs');

///////////////////////////////////////////////////////////////////////////////

  
program
  .arguments('<source>')
  .option('-p, --port <port>', 'port to serve app through')
  .action((source, options)=>{
    require('../server')(source, options);  
  });
  
  

program
  .parse(process.argv);
  
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

