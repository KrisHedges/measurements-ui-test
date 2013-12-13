# Get measurements
#
# * Render measure.jade view through default layout
# * Pass the env var to the views
# * Pass the title var to the views
#

module.exports = (req, res) ->
  res.render 'measure', {
    env: env,
    title: "A New Recipe"
  }
