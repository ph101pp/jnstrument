#!/usr/bin/env node
const pkg = require('../../package.json');
const program = require('commander');
const pump = require('pump');
const split = require('split2');
const fs = require('fs');

///////////////////////////////////////////////////////////////////////////////

program
  .version(pkg.version)
  .option('-f, --forward', 'forward jnstrument events to stdout')
  .option('-d, --dest <filePath>', 'stream events to file')
  .parse(process.argv);
  
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

let dest; 
const parseEvent = /.*"jnstrumentEvent":"((?:[^"]*?(?:\\")?)*)".*/g;

if(program.dest) {
  dest = fs.createWriteStream(program.dest);
}

pump(process.stdin, split((line) => {
    
  if(line.indexOf('jnstrumentEvent') < 0) {
    process.stdout.write(line+'\n');
    return;
  };
  
  if(program.forward)
    process.stdout.write(line+'\n');
  
  return line.replace(parseEvent, (match, p1)=>p1)+'\n';

}), dest);
