import path from 'path';
import express from 'express';
import historyApiFallback from 'express-history-api-fallback';
import morgan from 'morgan';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from './webpack.config.babel';

const {NODE_ENV, PORT = 3000} = process.env;
const contentBase = path.resolve(__dirname, './public');
const app = express();

if (NODE_ENV === 'development') {
  const compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler, {noInfo: true}));
  app.use(webpackHotMiddleware(compiler, {log: false}));
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

app.use(historyApiFallback('index.html', {root: contentBase}));
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`); // eslint-disable-line no-console
});
