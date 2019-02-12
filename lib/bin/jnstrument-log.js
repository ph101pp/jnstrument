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
  .option('-n, --namespace <namespace>', 'listen to specific namespace')
  .parse(process.argv);
  
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

let dest; 
const parseEvent = /.*"jnstrumentEvent":"(((?:[^";]*?(?:\\")?)*);(?:[^"]*?(?:\\")?)*)".*/;

if(program.dest) {
  dest = fs.createWriteStream(program.dest);
  
  pump(process.stdin, split((line) => {
      
    if(line.indexOf('jnstrumentEvent') < 0) {
      process.stdout.write(line+'\n');
      return;
    };
    
    if(program.forward)
      process.stdout.write(line+'\n');
    
  
    const [_, event, namespace] = line.match(parseEvent);
    
    if(!program.namespace) 
      return event+'\n'
        
    if(namespace!==undefined) {
      const namespaces = namespace.split('.');
      const match = program.namespace.split('.').find((namespace)=>namespaces.indexOf(namespace) >= 0);
      
      if(match)
        return event+'\n';
    }
  
  }), dest);
}
