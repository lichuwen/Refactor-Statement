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

function UsdFormat(thisAmount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format(thisAmount / 100);
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
    for (let perf of data.invoice.performances) {
        const play = data.plays[perf.playID];
        result += ` ${play.name}: ${UsdFormat(getAmount(play, perf))} (${perf.audience} seats)\n`;
    }
    result += `Amount owed is ${UsdFormat(data.totalAmount)}\n`;
    result += `You earned ${data.volumeCredits} credits \n`;
    return result;
}

function getHtmlResult (data) {
    let result = `<h1>Statement for ${data.invoice.customer}</h1>\n`;
    result += `<table>\n` +
        `<tr><th>play</th><th>seats</th><th>cost</th></tr>`;
    for (let perf of data.invoice.performances) {
        const play = data.plays[perf.playID];
        result += ` <tr><td>${play.name}</td><td>${perf.audience}</td><td>${UsdFormat(getAmount(play, perf))}</td></tr>\n`;
    }
    result += `</table>\n`;
    result += `<p>Amount owed is <em>${UsdFormat(data.totalAmount)}</em></p>\n`;
    result += `<p>You earned <em>${data.volumeCredits}</em> credits</p>\n`;

    return result;
}

module.exports = {
    getTextResult,
    getHtmlResult,
    creatStatementData,
};