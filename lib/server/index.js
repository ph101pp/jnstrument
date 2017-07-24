const express = require('express');
const fs = require('fs');
///////////////////////////////////////////////////////////////////////////////

module.exports = serve_sunburst;

///////////////////////////////////////////////////////////////////////////////

function serve_sunburst(visualization, { source, port }){
  port = port || process.env.PORT || 5000;
  
  const app = express();
  const data = fs.readFileSync(__dirname+'/../../'+source, 'utf-8');
  
  app.use('/public', express.static('public'));
  app.get('favicon.ico', (req, res) => res.end(''));
  
  app.get('/', (req, res)=>{
    res.end(`
      <!doctype html>
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <title>jnstrument - ${visualization}</title>
          <meta name="robots" content="noindex,nofollow">
          <script>
            window.__DATA__ = ${JSON.stringify(data)};
          </script>
          <link rel="stylesheet" href="public/${visualization}.css">
        </head>
        <body>
        <div id="root"></div>
        <script src="public/${visualization}.js"></script>
        </body>
      </html>
    `);
  });
  
  app.listen(port);  
  console.info(`jnstrument server running on port: ${port}`); // eslint-disable-line
    
}


