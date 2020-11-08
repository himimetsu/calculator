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

  clearEntry() {
    if (this.sum) {
      this.clear();
    } else {
      this.value = '0';
      this.lastValue = '';
      this.isFloat = false;
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
