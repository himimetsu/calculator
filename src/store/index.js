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
        this.value = '0';
        this.sum = '';
        this.lastValue = '';
        this.stack = `${this.firstValue} + `;
        this.testStack = [this.firstValue, '+']; //
      } else {
        if (!this.isBlock) {
          this.lastValue = this.value;
          this.stack = this.stack + this.value + '+';
          this.testStack.push(this.value, '+'); //
          this.value = Number(this.firstValue) + Number(this.lastValue);
          this.firstValue = this.value;
          this.lastValue = this.value;
          this.isBlock = true;
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
  };

  clearEntry() {
    if (this.sum) {
      this.clear();
    } else {
      this.value = '0';
      this.lastValue = '';
    }
  };

  @action minus() {
    this.checkLastOperation('-');
    this.operator = '-';

    if (this.firstValue) {
      if (this.sum) {
        this.value = '0';
        this.sum = '';
        this.stack = `${this.firstValue} - `;
        this.testStack = [this.firstValue, '-']; //
      } else {
        if (!this.isBlock) {
          this.lastValue = this.value;
          this.stack = this.stack + this.value + '-';
          this.testStack.push(this.value, '-'); //
          this.value = Number(this.firstValue) - Number(this.lastValue);
          this.firstValue = this.value;
          this.lastValue = this.value;
          this.isBlock = true;
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
        this.value = '0';
        this.sum = '';
        this.lastValue = '';
        this.stack = `${this.firstValue} / `;
        this.testStack = [this.firstValue, '/']; //
      } else {
        if (!this.isBlock) {
          this.lastValue = this.value;
          this.stack = this.stack + this.value + '/';
          this.testStack.push(this.value, '/'); //
          this.value = Number(this.firstValue) / Number(this.lastValue);
          this.firstValue = this.value;
          this.lastValue = this.value;
          this.isBlock = true;
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
        this.value = '0';
        this.sum = '';
        this.lastValue = '';
        this.stack = `${this.firstValue} * `;
        this.testStack = [this.firstValue, '*']; //
      } else {
        if (!this.isBlock) {
          this.lastValue = this.value;
          this.stack = this.stack + this.value + '*';
          this.testStack.push(this.value, '*'); //
          this.value = Number(this.firstValue) * Number(this.lastValue);
          this.firstValue = this.value;
          this.lastValue = this.value;
          this.isBlock = true;
        }
      }
    } else {
      this.startCalc('*');
    }
  };

  @action digit(num) {
    if (!this.sum && this.operator) {
      switch (this.operator) {
        case '+':
          this.lastValue = Number(this.lastValue) + num;
          break;
        case '-':
          this.lastValue += num;
          break;
        case '*':
          this.lastValue += num;
          break;
        case '/':
          this.lastValue += num;
          break;
      }
    }

    if (Number(this.value) === 0) {
      this.value = num;
    } else {
      this.value += num;
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
    Number(this.value) > 0
      ? this.value = `-${this.value}`
      : this.value = this.value.substring(1)
  };

  @action equally() {
    if (this.operator) {
      switch (this.operator) {
        case '+':
          if (this.firstValue > 10) {
            this.stack = `${this.firstValue} + ${this.lastValue} =`;
            this.testStack = [this.firstValue, '+', this.lastValue, '=']; //
          } else {
            this.stack += this.lastValue + '=';
            this.testStack.push(this.lastValue, '='); //
          }
          this.sum = Number(this.firstValue) + Number(this.lastValue);
          this.value = Number(this.firstValue) + Number(this.lastValue); //
          this.firstValue = Number(this.firstValue) + Number(this.lastValue);
          break;
        case '-':
          if (this.firstValue > 10) {
            this.stack = `${this.firstValue} - ${this.lastValue} =`;
            this.testStack = [this.firstValue, '-', this.lastValue, '=']; //
          } else {
            this.stack += this.lastValue + '=';
            this.testStack.push(this.lastValue, '='); //
          }
          this.sum = Number(this.firstValue) - Number(this.lastValue); //
          this.value = Number(this.firstValue) - Number(this.lastValue);
          this.firstValue = Number(this.firstValue) - Number(this.lastValue);
          break;
        case '*':
          if (this.firstValue > 10) {
            this.stack = `${this.firstValue} * ${this.lastValue} =`;
            this.testStack = [this.firstValue, '*', this.lastValue, '=']; //
          } else {
            this.stack += this.lastValue + '=';
            this.testStack.push(this.lastValue, '='); //
          }
          this.sum = Number(this.firstValue) * Number(this.lastValue);
          this.value = Number(this.firstValue) * Number(this.lastValue); //
          this.firstValue = Number(this.firstValue) * Number(this.lastValue);
          break;
        case '/':
          if (this.firstValue > 10) {
            this.stack = `${this.firstValue} / ${this.lastValue} =`;
            this.testStack = [this.firstValue, '/', this.lastValue, '=']; //
          } else {
            this.stack += this.lastValue + '=';
            this.testStack.push(this.lastValue, '='); //
          }
          this.sum = Number(this.firstValue) / Number(this.lastValue);
          this.value = Number(this.firstValue) / Number(this.lastValue); //
          this.firstValue = Number(this.firstValue) / Number(this.lastValue);
          break;
      }
    }
  };
};

export default new MenuStore();
