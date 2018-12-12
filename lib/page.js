module.exports.getPageProps = () => {
  // url (canonical?), title, referrer, path
  let url = document.querySelector('link[rel=\'canonical\']') ? document.querySelector('link[rel=\'canonical\']').href : document.location.href
  let title = document.title
  let referrer = document.referrer
  let path = location.pathname

  return {
    url: url,
    title: title,
    referrer: referrer,
    path: path,
  }
}