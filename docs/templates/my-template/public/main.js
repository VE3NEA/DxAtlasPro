// the modern template links every article image over 200 px that is not in a link already to its
// full-size file; the same rule, except for the program icon, .page-icon
export default {
  showLightbox: img => !img.classList.contains('page-icon') && img.naturalWidth > 200 && img.naturalHeight > 200 && !img.closest('a')
}
