const mix = require('laravel-mix');
const stylelint = require('laravel-mix-stylelint');
const eslint = require('laravel-mix-eslint');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isLocal = process.env.LOCAL_DEV || false;

mix.options({
  clearConsole: true,
})
  .setPublicPath('themes/{{ THEME_NAME }}/assets/')
  .webpackConfig(webpack => {
    return {
      plugins: [
        new StyleLintPlugin({
          files: ['./partials/**/*.css', './css/**/*.css'],
          configFile: '.stylelintrc.yaml',
        }),
        new webpack.ProvidePlugin({
          $: 'jquery',
          jQuery: 'jquery',
          'window.jQuery': 'jquery',
          'window.$': 'jquery'
        }),
        new CopyWebpackPlugin([{
          from: 'themes/{{ THEME_NAME }}/partials/**/*',
          to: 'img/',
          ignore: ['*.js', '*.css', '*.htm'],
          flatten: true
        }]),
      ],
    }
  })
  .stylelint()
  .postCss('./themes/{{ THEME_NAME }}/common.css', 'css',
    [
      require('postcss-import')(),
      require('postcss-url')({
        url: "rebase",
      }),
      require('postcss-nested')(),
      require('postcss-preset-env')({
        stage: 3,
        features: {
          'nesting-rules': true,
        },
      }),
      require('autoprefixer')(),
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
