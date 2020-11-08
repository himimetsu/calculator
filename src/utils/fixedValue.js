export const fixedValue = (a, b, callOperator) => {
  if (typeof a === 'number' || typeof b === 'number') {
    a = String(Number(a));
    b = String(Number(b));
  }

  let value = 0;
  const aCoord = a.indexOf('.');
  const bCoord = b.indexOf('.');

  switch (callOperator) {
    case '+':
    case '-':
      value = Math.max(a.slice(aCoord + 1).length, b.slice(bCoord + 1).length);
      break;
    case '×':
      if (aCoord > -1) value += a.slice(aCoord + 1).length;
      if (bCoord > -1) value += b.slice(bCoord + 1).length;
      break;
    case '÷':
      value = 0;
      break;
  }

  let countZero = 0;

  const maxAmountZero = Math.max(a.slice(aCoord + 1).length, b.slice(bCoord + 1).length);

  a = a * Math.pow(10, maxAmountZero);
  b = b * Math.pow(10, maxAmountZero);

  countZero = Math.pow(10, maxAmountZero);

  if (callOperator === '÷') {
    if (aCoord > -1 || bCoord > -1) {
      countZero = Math.pow(10, value);
    } else {
      countZero = Math.pow(10, maxAmountZero);
    }
  }

  return [a, b, countZero];
};
