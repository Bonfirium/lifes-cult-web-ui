const CleanWebpackPlugin = require('clean-webpack-plugin');
const config = require('config');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
	template: `${__dirname}/src/assets/index.html`,
	filename: 'index.html',
	inject: 'body',
});

const extractSass = new ExtractTextPlugin({
	filename: '[name].[hash].css',
	disable: process.env.NODE_ENV === 'local',
});

const timeCache = Date.now();

module.exports = {
	entry: { app: path.resolve('src/index.tsx') },
	output: {
		publicPath: '/',
		path: path.resolve('dist'),
		filename: `[name].${timeCache}.js`,
		pathinfo: process.env.NODE_ENV === 'local',
		sourceMapFilename: '[name].js.map',
		chunkFilename: `[name].bundle.js?v=${timeCache}`,
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				include: /src/,
				use: { loader: 'ts-loader' },
			}, {
				test: /\.scss$/,
				use: extractSass.extract({
					use: [{ loader: 'css-loader' }, { loader: 'sass-loader' }],
					fallback: 'style-loader',
				}),
			},
			{ test: /\.(png|woff|woff2|eot|ttf|otf|svg)$/, loader: 'url-loader?limit=100000' },
		],
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				default: false,
				commons: { test: /[\\/]node_modules[\\/]/, name: 'vendor', chunks: 'all' },
			},
		},
	},
	resolve: { modules: ['node_modules', path.resolve('src')], extensions: ['.js', '.jsx', '.json', '.ts', '.tsx']},
	plugins: [
		new CleanWebpackPlugin(['dist']),
		new webpack.DefinePlugin({ __VERSION__: JSON.stringify(config.url) }),
		HTMLWebpackPluginConfig,
		extractSass,
	],
};
