module.exports = async (skin, names, items) => { 
  for (let item of items) {
    if (skin.match(new RegExp(`${item.name}$`, 'g')) != null) return item;
  }

  for (let name of names) {
    if (skin.match(new RegExp(`${name.name}$`, 'g')) != null) return items.find(x => return x.id == name.itemId);
  }

  return null;
}
