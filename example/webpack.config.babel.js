/* eslint-env node */
import { resolve } from "path";
import webpack from "webpack";

function env(env, enabled = true, disabled) {
  if (disabled === undefined) {
    disabled = Array.isArray(enabled) ? [] : false;
  }

  return process.env.NODE_ENV === env ? enabled : disabled;
}

export default {
  devtool: env("development", "eval", "source-map"),
  entry: {
    example: [
      ...env("development", ["webpack-hot-middleware/client"]),
      "./example/src/main"
    ]
  },
  output: {
    path: resolve("./dist/example"),
    publicPath: "/",
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        include: [resolve("src"), /await-component/],
        query: {
          cacheDirectory: true
        }
      }
    ]
  },
  resolve: {
    modules: [resolve("./example/src"), resolve("./node_modules")],
    alias: {
      "await-component": resolve("./src")
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),
    ...env("development", [
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    ]),
    ...env("production", [
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true
      })
    ])
  ]
};
