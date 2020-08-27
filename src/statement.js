function getAmount(play, perf) {
  let thisAmount = 0;
  switch (play.type) {
    case 'tragedy':
      thisAmount = 40000;
      if (perf.audience > 30) {
        thisAmount += 1000 * (perf.audience - 30);
      }
      break;
    case 'comedy':
      thisAmount = 30000;
      if (perf.audience > 20) {
        thisAmount += 10000 + 500 * (perf.audience - 20);
      }
      thisAmount += 300 * perf.audience;
      break;
    default:
      throw new Error(`unknown type: ${play.type}`);
  }
  return thisAmount;
}

function UsdFormat() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format;
}

function getVolumeCredits(invoice, plays) {
  let volumeCredits = 0;
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    volumeCredits += Math.max(perf.audience - 30, 0);
    if ('comedy' === play.type) volumeCredits += Math.floor(perf.audience / 5);
  }
  return volumeCredits;
}

function getTotalAmount(invoice, plays) {
  let totalAmount = 0;
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = getAmount(play, perf);
    totalAmount += thisAmount;
  }
  return totalAmount;
}

function creatStatementData (invoice, plays) {
  let totalAmount = getTotalAmount(invoice, plays);
  let volumeCredits = getVolumeCredits(invoice, plays);
  return { totalAmount,volumeCredits ,invoice, plays};
}

function getTextResult (data) {
  let result = `Statement for ${data.invoice.customer}\n`;
  const format = UsdFormat();
  for (let perf of data.invoice.performances) {
    const play = data.plays[perf.playID];
    let thisAmount = getAmount(play, perf);
    result += ` ${play.name}: ${format(thisAmount / 100)} (${perf.audience} seats)\n`;
  }
  result += `Amount owed is ${format(data.totalAmount / 100)}\n`;
  result += `You earned ${data.volumeCredits} credits \n`;
  return result;
}

function statement (invoice, plays) {
  return getTextResult (creatStatementData (invoice, plays));
}

module.exports = {
  statement,
};
