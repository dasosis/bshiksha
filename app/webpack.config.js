import path from "path";
import CopyWebpackPlugin from "copy-webpack-plugin";

export default {
  mode: 'development',
  entry: "./src/index.js",
  output: {
    filename: "index.js",
    // path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new CopyWebpackPlugin([{ from: "./src/index.html", to: "index.html" }]),
  ],
  devServer: { contentBase: path.join(__dirname, "dist"), compress: true },
};
