const i18n = require('../../lib/i18n')
const semver = require('semver')
const historian = require('electron-api-historian')

module.exports = (req, res, next) => {
  const doc = i18n.docs[req.language][req.path.replace('/history', '')]
  if (!doc) return next()

  // find releases that include the current doc
  const filenameKey = doc.href.replace(/^\//, '') + '.md'
  doc.birthTag = historian[filenameKey]
  doc.releases = req.context.releases.filter(release => {
    return semver.gte(release.version, doc.birthTag.replace('v', ''))
  })

  const context = Object.assign(req.context, {
    page: {
      title: `${doc.title} Version History | Electron`,
      description: doc.description,
      url: req.url
    },
    doc: doc,
    viewingDocHistory: true,
    layout: 'docs'
  })

  return res.render('docs/history', context)
}
