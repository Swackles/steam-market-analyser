const colors = require('colors');
const db = require('./../db');

const TaskLog = require('./../../models/taskLog');

module.exports = async (func) => {
  const name = func.replace(/([A-Z])/g, '_$1').trim().toUpperCase();

  let start = process.hrtime();

  let log = await TaskLog.create({
    codeName: name,
    status: 'RUNNING'
  });

  let date = new Date();

  let minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
  console.log(`${date.getDate()}.${date.getMonth()} ${date.getHours()}:${minutes} STARTING... ${name}`.yellow);

  // new transaction
  let transaction = await db.transaction();

  try {
    //call the function
    await require(`./${func}`)(transaction);

    let end = process.hrtime(start);

    const time = `${end[0]}s`

    await TaskLog.update({status: 'COMPLETED', description: `Completed in ${time}`}, {where: {id: log.dataValues.id}});

    console.log(`COMPLETED! ${name} in ${time}`.green);
  } catch(err) {
    await transaction.rollback();

    if (err instanceof Error && err.code === "MODULE_NOT_FOUND") {
      console.log(`Task ${name} not found`.red);

      await TaskLog.update({status: 'FAILED', description: `Module not found`}, {where: {id: log.dataValues.id}});
    } else {

      console.log(err);
      await TaskLog.update({status: 'FAILED', description: `${err}`}, {where: {id: log.dataValues.id}});

      console.log(`FAILED! ${name}`.red);
    }
  }
}
