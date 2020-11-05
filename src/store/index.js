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
};

export default new MenuStore();
