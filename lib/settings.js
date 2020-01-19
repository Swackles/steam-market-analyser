const config = require('config');

class Settings {
  constructor(query) {
    // Allowed values
    const allowedOrderColumn = ['price', 'name', 'created_at'];
    const allowedOrder = ['DESC', 'ASC'];
    const allowedSize = ['s', 'l'];

    // Default values
    this.order = ['created_at', 'DESC'];
    this.size = 'l';
    this.page = query.page;
    this.limit = query.limit;
    this.offset = query.page * query.limit;

    // Bind values
    if (query.size && allowedSize.includes(query.size)) this.size = query.size;
    if (query.order && query.order.includes('-')) {
      let order = query.order.split('-');

      if (allowedOrderColumn.includes(order[0]) && allowedOrder.includes(order[1].toUpperCase())) this.order = [order[0], order[1].toUpperCase()];
    }
  }

  pageCount(total) {
    return Math.floor(total / this.limit);
  }

  arrayPages(renderNumbers, total = null) {
    if (total) this.pageCount = this.getPageCount(total);

    let pages = [];
    for (let i = 1; i <= this.pageCount; i++) {
      if (Math.abs(this.page - i) <= renderNumbers) pages.push(i);
      if (pages.length == (renderNumbers * 2) + 1) break;
    }

    return pages;
  }
}

module.exports =  async (req, res, next) => {
  res.locals.settings = new Settings(req.query);

  next();
};
