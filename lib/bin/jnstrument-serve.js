#!/usr/bin/env node
const pkg = require('../../package.json');
const program = require('commander');
const pump = require('pump');
const split = require('split2');
const fs = require('fs');

///////////////////////////////////////////////////////////////////////////////

  
program
  .arguments('<visualization>')
  .option('-p, --port <port>', 'port to serve app through')
  .option('-s, --source <source>', 'source file to visualize')
  .action((visualization, options)=>{
    require('../server')(visualization, options);  
  });
  
  

program
  .parse(process.argv);
  
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

