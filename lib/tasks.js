module.exports = async (func) => {
  require(`./tasks/${func}`)();
}
