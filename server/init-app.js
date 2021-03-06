import path from 'path'
import express from 'express'
import webpack from 'webpack'
import webpackMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import config from '../webpack.config'

import initRoutes from './init-routes'

const isDeveloping = process.env.NODE_ENV !== 'production'
const app = express()

function useConfig (config) {
  const compiler = webpack(config)
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  })
  app.use(middleware)
  app.use(webpackHotMiddleware(compiler))
}

if (isDeveloping) {
  const middleware = useConfig(config)
  app.get('/', function response (req, res) {
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')))
    res.end()
  })
} else {
  app.use(express.static(path.join(__dirname, '/dist')))
  app.get('/', function response (req, res) {
    res.sendFile(path.join(__dirname, 'dist/index.html'))
  })
}

initRoutes(app)

export default app
