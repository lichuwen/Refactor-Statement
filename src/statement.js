const {getTextResult,getHtmlResult,creatStatementData} = require('../src/createStatement');

function statement (invoice, plays) {
  return getTextResult (creatStatementData (invoice, plays));
}

function htmlStatement (invoice, plays) {
  return getHtmlResult (creatStatementData (invoice, plays));
}

module.exports = {
  statement,
  htmlStatement,
};
