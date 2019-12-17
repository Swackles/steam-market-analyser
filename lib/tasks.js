const colors = require('colors');
const db = require('./../db');

module.exports = async (func) => {
  const name = func.replace(/[(A-Z)]/g, '_$1').trim().toUpperCase();
  let start = process.hrtime();
  let startCount = Item.count();

  let log = await TaskLog.create({
    codeName: name,
    status: 'RUNNING'
  });

  console.log(`STARTING ${d.getHours()}:${d.getMinutes()} ${d.getDate()}.${d.getMonth()}.${d.getFullYear()}... ${name}`.yellow);

  // new transaction
  let transaction = await db.transaction();

  try {
    //call the function
    await require(`./tasks/${func}`)();

    let end = process.hrtime(startTime);
    let endCount = Item.count() - startCount;

    const time = `${end[0]}s`

    TaskLog.update({status: 'COMPLETED', description: `Completed in ${time}, with ${endCount} items added`}, {where: {id: log.dataValues.id}});

    console.log(`COMPLETED! ${name} in ${time}`.green);
  } catch() {
    if (e instanceof Error && e.code === "MODULE_NOT_FOUND") {
      console.log(`Module ${name} not found`.red);
    } else {
      await transaction.rollback();

      console.log(err);
      await TaskLog.update({status: 'FAILED', description: `${err}`}, {where: {id: log.dataValues.id}});

      console.log(`FAILED! ${name}`.red);
    }
  }
}
