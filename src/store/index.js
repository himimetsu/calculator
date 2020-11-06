import { action, computed, makeAutoObservable } from 'mobx';

class MenuStore {
  value = '0';
  isKeyboard = true;
  operator = '';
  stack = '';
  firstValue = '';
  lastValue = '';
  sum = '';
  isBlock = false;
  isFloat = false;
  testStack = [];

  constructor() {
    makeAutoObservable(this);
  }

  @action setValue(enter) {
    this.value = enter;
  };

  @action setIsKeyboard() {
    this.isKeyboard = !this.isKeyboard;
  };

  fixedValue(a, b, callOperator) {
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
      case '*':
        {
          if (aCoord > -1) {
            value += a.slice(aCoord + 1).length;
          }

          if (bCoord > -1) {
            value += b.slice(bCoord + 1).length;
          }
        }
        break;
      case '/':
        value = 0;
        break;
    }

    let countZero = 0;

    const maxAmountZero = Math.max(a.slice(aCoord + 1).length, b.slice(bCoord + 1).length);

    a = a * Math.pow(10, maxAmountZero);
    b = b * Math.pow(10, maxAmountZero);

    if (callOperator === '/') {
      countZero = Math.pow(10, value);
    } else {
      countZero = Math.pow(10, maxAmountZero);
    }

    return [a, b, countZero];
  };

  startCalc(callOperator) {
    this.testStack.push(this.value, callOperator);
    this.stack = this.value + `${callOperator}`;
    this.firstValue = this.value;
    this.value = '0';
  };

  checkLastOperation(callOperator) {
    this.isFloat = false;
    if (this.operator && this.operator !== callOperator) {
      if (!this.sum) {
        switch (this.operator) {
          case '+':
            this.firstValue = Number(this.firstValue) + Number(this.lastValue);
            break;
          case '-':
            this.firstValue = Number(this.firstValue) - Number(this.lastValue);
            break;
          case '*':
            this.firstValue = Number(this.firstValue) * Number(this.lastValue);
            break;
          case '/':
            this.firstValue = Number(this.firstValue) / Number(this.lastValue);
            break;
        }
        this.stack = `${this.firstValue} ${this.operator} `;
        this.testStack = [this.firstValue, callOperator]; //
        this.value = '0';
        this.isBlock = true;
      }

      this.lastValue = '0';
    }
  };

  @action plus() {
    this.checkLastOperation('+');
    this.operator = '+';

    if (this.firstValue) {
      if (this.sum) {
        this.updateAfterCalculation('+');
      } else {
        if (!this.isBlock) {
          this.updateAfterDoubleSign('+');
        }
      }
    } else {
      this.startCalc('+');
    }
  };

  @action clear() {
    this.value = '0';
    this.isKeyboard = true;
    this.operator = '';
    this.stack = '';
    this.testStack = []; //
    this.firstValue = '';
    this.lastValue = '';
    this.sum = '';
    this.isBlock = false;
    this.isFloat = false;
  };

  updateAfterEqually(callOperator) {
    let result = '';
    const [a, b, countZero] = this.fixedValue(this.firstValue, this.lastValue, callOperator);
    const divider = countZero > 0 ? countZero : 1;

    switch (callOperator) {
      case '+':
        result = (a + b) / divider;
        this.testStack.length > 10
          ? this.testStack = [a / divider, '+', b / divider, '=']
          : this.testStack.push(b / divider, '+')
        break;
      case '-':
        result = (a - b) / divider;
        this.testStack.length > 10
          ? [a / divider, '-', b / divider, '=']
          : this.testStack.push(b / divider, '=')
        break;
      case '*':
        result = (a / divider) * (b / divider)
        this.testStack.length > 10
          ? [a / divider, '*', b / divider, '=']
          : this.testStack.push(b / divider, '=')
        break;
      case '/':
        result = (a / divider) / (b / divider)
        this.testStack.length > 10
          ? [a / divider, '/', b / divider, '=']
          : this.testStack.push(b / divider, '=')
        break;
    }

    this.sum = this.value = this.firstValue = result;
  };

  updateAfterCalculation(callOperator) {
    this.value = '0';
    this.sum = '';
    this.stack = `${this.firstValue} ${callOperator} `;
    this.testStack = [this.firstValue, callOperator];
    this.lastValue = '0';
  };

  updateAfterDoubleSign(callOperator) {
    this.lastValue = this.value;
    this.stack = this.stack + this.value + callOperator;
    this.testStack.push(this.value, callOperator);
    switch (callOperator) {
      case '+':
        this.value = Number(this.firstValue) + Number(this.lastValue);
        break;
      case '-':
        this.value = Number(this.firstValue) - Number(this.lastValue);
        break;
      case '*':
        this.value = Number(this.firstValue) * Number(this.lastValue);
        break;
      case '/':
        this.value = Number(this.firstValue) / Number(this.lastValue);
        break;
    }
    this.firstValue = this.value;
    this.lastValue = this.value;
    this.isBlock = true;
  };

  clearEntry() {
    if (this.sum) {
      this.clear();
    } else {
      this.value = '0';
      this.lastValue = '';
      this.isFloat = false;
    }
  };

  @action minus() {
    this.checkLastOperation('-');
    this.operator = '-';

    if (this.firstValue) {
      if (this.sum) {
        this.updateAfterCalculation('-');
      } else {
        if (!this.isBlock) {
          this.updateAfterDoubleSign('-');
        }
      }
    } else {
      this.startCalc('-');
    }
  };

  @action divide() {
    this.checkLastOperation('/');
    this.operator = '/';

    if (this.firstValue) {
      if (this.sum) {
        this.updateAfterCalculation('/');
      } else {
        if (!this.isBlock) {
          this.updateAfterDoubleSign('/');
        }
      }
    } else {
      this.startCalc('/');
    }
  };

  @action multiply() {
    this.checkLastOperation('*');
    this.operator = '*';

    if (this.firstValue) {
      if (this.sum) {
        this.updateAfterCalculation('*');
      } else {
        if (!this.isBlock) {
          this.updateAfterDoubleSign('*');
        }
      }
    } else {
      this.startCalc('*');
    }
  };

  @action digit(num) {
    if (!this.sum && this.operator) {
      String(this.lastValue[this.lastValue.length - 1]) === '.'
        ? this.lastValue += num
        : this.lastValue = Number(this.lastValue) + num
    }

    if (Number(this.value) === 0) {
      String(this.value[this.value.length - 1]) === '.'
        ? this.value += num
        : this.value = num
    } else {
      this.value += num;
    }
  };

  delete() {
    if (!this.sum) {
      const newString = String(this.value).substring(0, this.value.length - 1);
      if (String(this.value)[newString.length] === '.') this.isFloat = false;
      if (this.operator) this.lastValue = newString;
      newString ? this.value = newString : this.value = '0';
    }
  };

  convertToFloat() {
    if (!this.isFloat) {
      this.value = `${this.value}.`;
      this.isFloat = true;
      if (!this.sum && this.operator) {
        this.lastValue = `${this.lastValue}.`;
      }
    }
  };

  @action denial() {
    if (Number(this.value)) {
      if (String(this.value)[0] === '-') {
        this.value = Number(String(this.value).substring(1));
      } else {
        this.value = `-${this.value}`;
      }
    }

    if (this.lastValue) {
      if (!this.sum && this.operator) {
        if (String(this.lastValue)[0] === '-') {
          this.lastValue = this.lastValue.substring(1);
        } else {
          this.lastValue = `-${this.lastValue}`;
        }
      }
    }
  };

  @action equally() {
    if (this.operator) {
      this.isFloat = false;
      this.updateAfterEqually(this.operator);
    }
  };
};

export default new MenuStore();
