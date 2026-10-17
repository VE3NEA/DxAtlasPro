// Google Analytics only on the published site, so that docfx serve (localhost) and the headless
// browser of docfx pdf (127.0.0.1) are not counted as visitors
const gaTagId = 'G-EBFBX51E8H'
if (location.hostname === 've3nea.github.io') {
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaTagId}`
  document.head.appendChild(script)
  window.dataLayer = window.dataLayer || []
  window.gtag = function () { window.dataLayer.push(arguments) }
  window.gtag('js', new Date())
  window.gtag('config', gaTagId)
}

// the modern template links every article image over 200 px that is not in a link already to its
// full-size file; the same rule, except for the program icon, .page-icon
export default {
  showLightbox: img => !img.classList.contains('page-icon') && img.naturalWidth > 200 && img.naturalHeight > 200 && !img.closest('a')
}
