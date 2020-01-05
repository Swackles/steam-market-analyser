module.exports = async (skin, items, names) => {
  for (let item of items) {
    if (skin.name.match(new RegExp(`${item.name}$`, 'g')) || skin.name.match(new RegExp(`^${item.name}`, 'g'))) return item;
  }

  for (let name of names) {
    if (skin.name.match(new RegExp(`${name.name}$`, 'g')) || skin.name.match(new RegExp(`^${name.name}`, 'g'))) return items.find(x => x.id == name.itemId);
  }

  return null;
}
