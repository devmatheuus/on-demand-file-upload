import { fileURLToPath } from 'url';
import { resolve as _resolve, dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const entry = './src/public/ts/app.ts';
const output = {
    filename: 'bundle.js',
    path: _resolve(__dirname, 'src/public/js'),
};
const resolve = {
    extensions: ['.ts', '.tsx', '.js'],
};
const module = {
    rules: [
        {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
        },
    ],
};
const devServer = {
    static: {
        directory: _resolve(__dirname, 'src/public'),
    },
    compress: true,
    port: 8080,
    hot: true,
};

export default {
    mode: 'development',
    entry,
    output,
    resolve,
    module,
    devServer,
};