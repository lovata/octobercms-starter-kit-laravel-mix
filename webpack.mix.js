const mix = require('laravel-mix');

require('laravel-mix-eslint');
require('laravel-mix-stylelint');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const postcssImport = require('postcss-import');
const postcssUrl = require('postcss-url');
const postcssNested = require('postcss-nested');
const postcssPresetEnv = require('postcss-preset-env');
const autoprefixer = require('autoprefixer');

const isLocal = process.env.LOCAL_DEV || false;

mix.options({
  clearConsole: true,
})
  .setPublicPath('themes/{{ THEME_NAME }}/assets/')
  .webpackConfig(webpack => ({
    plugins: [
      new StyleLintPlugin({
        files: ['./themes/{{ THEME_NAME }}/partials/**/*.css', './themes/{{ THEME_NAME }}/css/**/*.css'],
        configFile: '.stylelintrc',
      }),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        'window.$': 'jquery',
      }),
      new CopyWebpackPlugin([{
        from: 'themes/{{ THEME_NAME }}/partials/**/*',
        to: 'img/',
        ignore: ['*.js', '*.css', '*.htm'],
        flatten: true,
      }]),
    ],
  }))
  .stylelint()
  .postCss('./themes/{{ THEME_NAME }}/common.css', 'css',
    [
      postcssImport(),
      postcssUrl({
        url: 'rebase',
      }),
      postcssNested(),
      postcssPresetEnv({
        stage: 3,
        features: {
          'nesting-rules': true,
        },
      }),
      autoprefixer(),
    ])
  .js('./themes/{{ THEME_NAME }}/common.js', 'js')
  .eslint({
    fix: true,
    cache: false,
    failOnError: false,
    configFile: isLocal ? '.local.eslintrc' : '.eslintrc',
  })
  .extract()
  .version();
