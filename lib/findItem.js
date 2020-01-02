module.exports = async (skin, items, names) => {
  for (let item of items) {
    if (skin.name.match(new RegExp(`${item.name}$`, 'g')) != null) return item;
  }

  for (let name of names) {
    if (skin.name.match(new RegExp(`${name.name}$`, 'g')) != null) return items.find(x => x.id == name.itemId);
  }

  return null;
}
