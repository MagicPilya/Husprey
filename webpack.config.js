const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

module.exports = {
    entry: path.join(__dirname, 'src', 'index.js'),
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'index.[contenthash:8].js',
        assetModuleFilename: path.join('images', '[name][contenthash:8][ext]'),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.pug$/,
                loader: 'pug-loader'
            },

            {
                test: /\.(scss|css)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
                generator: {
                    filename: path.join('images', '[name][contenthash:8][ext]')
                }
            },
            {
                test: /\.svg$/,
                type: 'asset/resource',
                generator: {
                	filename: path.join('icons', '[name][contenthash:8][ext]')
                }
            },
			{
				test: /\.(woff2?|eot|ttf|otf)$/i,
				type: 'asset/resource',
                generator: {
                    filename: path.join('fonts', '[name][ext]')
                }

			}
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'index.pug'),
            filename: 'index.html'
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'pages/aboutUs.pug'),
            filename: 'pages/aboutUs.html'
        }),
        new FileManagerPlugin({
            events: {
                onStart: {
                    delete: ['dist']
                },
				onEnd: {
					copy: [
						{
							source: path.join('src', 'static'),
							destination: 'dist'
						},
					],

				}
            }
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash:8].css'
        })
    ],
    devServer: {
        watchFiles: path.join(__dirname, 'src'),
        port: 9000
    },
	optimization: {
		minimizer: [
			new ImageMinimizerPlugin({
				minimizer: {
					implementation: ImageMinimizerPlugin.imageminMinify,
					options: {
						plugins: [
							['gifsicle', { interlaced: true }],
							['jpegtran', { progressive: true }],
							['optipng', { optimizationLevel: 5 }],
							['svgo', { name: 'preset-default' }]
						]
					}
				}
			})
		]
	},
};
