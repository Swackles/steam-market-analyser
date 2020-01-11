class Settings {
  constructor(query) {
    console.log(query);
    // Allowed values
    const allowedOrderColumn = ['price', 'name', 'created_at'];
    const allowedOrder = ['DESC', 'ASC'];
    const allowedSize = ['s', 'l'];

    // Default values
    this.order = ['created_at', 'DESC'];
    this.size = 'l';

    // Bind values
    if (query.size && allowedSize.includes(query.size)) this.size = query.size;
    if (query.order && query.order.includes('-')) {
      let order = query.order.split('-');

      if (allowedOrderColumn.includes(order[0]) && allowedOrder.includes(order[1].toUpperCase())) this.order = [order[0], order[1].toUpperCase()];
    }
  }
}
module.exports = Settings;
