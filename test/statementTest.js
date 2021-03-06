const test = require('ava');
const {statement,htmlStatement} = require('../src/statement');

const plays = {
  'hamlet': {
    'name': 'Hamlet',
    'type': 'tragedy',
  },
  'as-like': {
    'name': 'As You Like It',
    'type': 'comedy',
  },
  'othello': {
    'name': 'Othello',
    'type': 'tragedy',
  },
};


test('statement test1. Customer BigCo without performance.', t => {
  //given
  const invoice = {
    'customer': 'BigCo',
    'performances': [],
  };

  const result = statement(invoice, plays);
  const expect = 'Statement for BigCo\n' +
      'Amount owed is $0.00\nYou earned 0 credits \n';

  t.is(result, expect);
});

test('statement test2. Customer BigCo has one performance hamlet and the audiences is 30.', t => {
  //given
  const invoice = {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'hamlet',
        'audience': 30,
      }
    ],
  };

  const result = statement(invoice, plays);
  const expect = 'Statement for BigCo\n' +
      ' Hamlet: $400.00 (30 seats)\n' +
      'Amount owed is $400.00\n' +
      'You earned 0 credits \n'

  t.is(result, expect);
});


test('statement test3. Customer BigCo has one performance hamlet and the audiences is 31.', t => {
  //given
  const invoice = {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'hamlet',
        'audience': 31,
      }
    ],
  };

  const result = statement(invoice, plays);
  const expect = 'Statement for BigCo\n' +
      ' Hamlet: $410.00 (31 seats)\n' +
      'Amount owed is $410.00\n' +
      'You earned 1 credits \n'

  t.is(result, expect);

});

test('statement test4. Customer BigCo has one performance As You Like It and the audiences is 20.', t => {
  //given
  const invoice = {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'as-like',
        'audience': 20,
      }
    ],
  };

  const result = statement(invoice, plays);
  const expect = 'Statement for BigCo\n' +
      ' As You Like It: $360.00 (20 seats)\n' +
      'Amount owed is $360.00\n' +
      'You earned 4 credits \n'

  t.is(result, expect);
});

test('statement test5. Customer BigCo has one performance As You Like It and the audiences is 21.', t => {
  //given
  const invoice = {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'as-like',
        'audience': 21,
      }
    ],
  };

  const result = statement(invoice, plays);
  const expect = 'Statement for BigCo\n' +
      ' As You Like It: $468.00 (21 seats)\n' +
      'Amount owed is $468.00\n' +
      'You earned 4 credits \n'

  t.is(result, expect);
});

test('statement test6. Customer BigCo has three performance', t => {
  //given
  const invoice = {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'hamlet',
        'audience': 30,
      },
      {
        'playID': 'as-like',
        'audience': 20,
      },
      {
        'playID': 'othello',
        'audience': 31,
      }
    ],
  };

  const result = statement(invoice, plays);
  const expect = 'Statement for BigCo\n' +
      ' Hamlet: $400.00 (30 seats)\n' +
      ' As You Like It: $360.00 (20 seats)\n' +
      ' Othello: $410.00 (31 seats)\n' +
      'Amount owed is $1,170.00\n' +
      'You earned 5 credits \n'

  t.is(result, expect);
});

test('statement case 7. Customer BigCo has one unknown performance. ', t => {
  const plays = {
    'hamlet': {
      'name': 'Hamlet',
      'type': 'tragedy1',
    },
  };
  const invoice = {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'hamlet',
        'audience': 30,
      },
    ],
  };

  try {
    statement(invoice, plays);
    t.fail();
  }
  catch (e) {
    t.is(e.message, 'unknown type: tragedy1');
  }
});

test('statement case 7. Customer BigCo has one unknown performance. ', t => {
  const invoice = {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'hamlet',
        'audience': 30,
      },
      {
        'playID': 'as-like',
        'audience': 20,
      },
      {
        'playID': 'othello',
        'audience': 31,
      }
    ],
  };

  const result = htmlStatement(invoice, plays);
  const expect = '<h1>Statement for BigCo</h1>\n' +
      '<table>\n' +
      '<tr><th>play</th><th>seats</th><th>cost</th></tr>' +
      ' <tr><td>Hamlet</td><td>30</td><td>$400.00</td></tr>\n' +
      ' <tr><td>As You Like It</td><td>20</td><td>$360.00</td></tr>\n' +
      ' <tr><td>Othello</td><td>31</td><td>$410.00</td></tr>\n' +
      '</table>\n' +
      '<p>Amount owed is <em>$1,170.00</em></p>\n' +
      '<p>You earned <em>5</em> credits</p>\n';

  t.is(result, expect);

});


