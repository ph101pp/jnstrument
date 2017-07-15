const minimist = require('minimist');
const fs = require('fs');
const pump = require('pump');
const split = require('split2');

///////////////////////////////////////////////////////////////////////////////

run();

///////////////////////////////////////////////////////////////////////////////

function run(){
  const options = minimist(process.argv.slice(2));
  const outputDestination = options.o || options.output;
  
  if(!outputDestination) {
    console.error('jnstrument: No output file defined'); // eslint-disable-line
    process.exit(1);
  }
  
  const writeFileStream = fs.createWriteStream(outputDestination);
  
  pump(process.stdin, split((line) => {
    
    line += '\n';
    
    if(options.print || options.p)
      process.stdout.write(line);
    
    return line.indexOf('jnstrumentEvent') >= 0 ? line : undefined;
    
  }), writeFileStream);
  
};