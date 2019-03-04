const express    = require('express')
const webpack    = require('webpack')
const middleware = require('webpack-dev-middleware')
const compiler   = webpack(require('../build/webpack.prod.js'))
const port       = 4400
const app        = express()

function normalizeAssets(assets) {
  return Array.isArray(assets) ? assets : [assets]
}

app.use(middleware(compiler, { serverSideRender: true }))

app.use((_, res) => {
  const assetsByChunkName = res.locals.webpackStats.toJson().assetsByChunkName
  res.send(
    `<html>
      <head>
        <title>Testing MsmCrypto on Browser</title>
      </head>
      <body>
        <div id="root"></div>
        ${normalizeAssets(assetsByChunkName.main)
            .filter(path => path.endsWith('.js'))
            .map(path => `<script src="${path}"></script>`)
            .join('\n')
        }
      </body>
    </html>`
  )
})

app.listen(port)
process.stdout.write(`Server started at http://localhost:${port}/`)