function buildURL(item) {
  let url = window.location.href;

  if (url.includes(item)) url = url.replace(item, '');
  else if (url.includes(item.split('=')[0])) url = url.replace(/size\=[.*?]/, item);
  else {
    if (url.includes('?')) url += `&${item}`;
    else url += `?${item}`;
  }

  url = url.replace(/\?$/, '');
  url = url.replace(/\?\&$/, '');
  url = url.replace(/\?\&$/, '?');
  window.location.href = url;
}
