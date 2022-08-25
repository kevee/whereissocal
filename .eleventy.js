require('dotenv').config()
const markdownIt = require('markdown-it')
const { DateTime } = require('luxon')
const htmlmin = require('html-minifier')
const sass = require('sass')

const md = new markdownIt({
  html: true,
})

module.exports = function (eleventyConfig) {
  const style = sass.compile('./src/sass/style.scss').css.toString()

  eleventyConfig.addWatchTarget('./src/sass/')
  eleventyConfig.addWatchTarget('./src/js/')
  eleventyConfig.addPassthroughCopy({
    './node_modules/d3/dist/d3.min.js': './js/d3.min.js',
    './node_modules/d3-geo/dist/d3-geo.min.js': './js/d3-geo.min.js',
    './src/js/map.js': './js/map.js',
  })

  eleventyConfig.addTransform('htmlmin', function (content, outputPath) {
    if (outputPath && outputPath.endsWith('.html')) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      })
      return minified
    }

    return content
  })

  eleventyConfig.addGlobalData('style', style)

  eleventyConfig.addFilter('markdown', (content) => {
    return md.render(content)
  })

  eleventyConfig.addFilter('json', (content) => {
    return JSON.stringify(content)
  })

  return {
    dir: {
      input: 'src',
      output: 'public',
    },
  }
}
