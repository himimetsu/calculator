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
  startCalc(callOperator) {
    this.testStack.push(this.value, callOperator); //
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
    switch (callOperator) {
      case '+':
        result = Number(this.firstValue) + Number(this.lastValue);
        this.firstValue > 10
          ? [this.firstValue, '+', this.lastValue, '=']
          : this.testStack.push(this.lastValue, '=')
        break;
      case '-':
        result = Number(this.firstValue) - Number(this.lastValue);
        this.firstValue > 10
          ? [this.firstValue, '-', this.lastValue, '=']
          : this.testStack.push(this.lastValue, '=')
        break;
      case '*':
        result = Number(this.firstValue) * Number(this.lastValue);
        this.firstValue > 10
          ? [this.firstValue, '*', this.lastValue, '=']
          : this.testStack.push(this.lastValue, '=')
        break;
      case '/':
        result = Number(this.firstValue) / Number(this.lastValue);
        this.firstValue > 10
          ? [this.firstValue, '/', this.lastValue, '=']
          : this.testStack.push(this.lastValue, '=')
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
    const newString = String(this.value.substring(0, this.value.length - 1));
    if (String(this.value)[newString.length] === '.') this.isFloat = false;
    if (!this.sum && this.operator) this.lastValue = newString;
    newString ? this.value = newString : this.value = '0';
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
    Number(this.value) > 0
      ? this.value = `-${this.value}`
      : this.value = this.value.substring(1)
  };

  @action equally() {
    if (this.operator) {
      this.isFloat = false;
      this.updateAfterEqually(this.operator);
    }
  };
};

export default new MenuStore();
