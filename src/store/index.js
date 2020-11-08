import { makeAutoObservable } from 'mobx';
import { fixedValue } from '../utils/fixedValue';

class MenuStore {
  operator = '';
  firstValue = '0';
  lastValue = '0';
  sum = '';
  stack = [];
  isBlock = false;

  constructor() {
    makeAutoObservable(this);
  }

  setFirstValue(value) {
    this.firstValue = value;
  };

  setLasttValue(value) {
    this.lastValue = value;
  };

  setOperator(callOperator) {
    this.operator = callOperator;
  };

  setIsBlock(bool) {
    this.isBlock = bool;
  };

  setSum(value) {
    this.sum = value;
  };

  setStack(value) {
    this.stack = value;
  };

  clear() {
    this.operator = '';
    this.firstValue = '0';
    this.lastValue = '0';
    this.sum = '';
    this.stack = [];
    this.isBlock = false;
  };

  newUpdateAfterAction(first, last, callOperator) {
    const [a, b, countZero] = fixedValue(first, last, callOperator);
    const divider = countZero > 0 ? countZero : 1;
    let result;

    switch (callOperator) {
      case '+':
        result = (a + b) / divider;
        break;
      case '-':
        result = (a - b) / divider;
        break;
      case '×':
        result = (a / divider) * (b / divider);
        break;
      case '÷':
        result = (a / divider) / (b / divider);
        break;
    }

    this.setFirstValue(result);
    this.setLasttValue(result);
    this.setStack([first, callOperator, last, callOperator]);
  };

  clearEntry() {
    if (this.sum) {
      this.clear();
    } else {
      this.lastValue = '';
    }
  };

  action(callOperator) {
    const { firstValue, lastValue, operator, isBlock, sum } = this;

    if (operator && operator !== callOperator) this.setOperator(callOperator)

    if (sum) {
      this.setFirstValue(sum);
      this.setLasttValue('0');
      this.setStack([sum, callOperator]);
      this.setIsBlock(false);
      this.setSum('');
    } else {
      if (!operator) {
        this.setStack([firstValue, callOperator]);
        this.setOperator(callOperator);
      } else {
        if (!isBlock) {
          this.newUpdateAfterAction(firstValue, lastValue, callOperator);
          this.setIsBlock(true);
        }
      }
    }
  };

  digit(num) {
    const { firstValue, lastValue, operator, isBlock } = this;

    if (!Number(firstValue) || !operator) {
      if (num === ',') {
        !firstValue.includes('.') && this.setFirstValue(firstValue + '.');
      } else {
        if (firstValue === '0' && firstValue.length === 1) {
          this.setFirstValue(num);
        } else {
          this.setFirstValue(firstValue + num);
        }
      }
    } else {
      if (num === ',') {
        !lastValue.includes('.') && this.setLasttValue(lastValue + '.');
      } else {
        if (lastValue === '0' && lastValue.length === 1) {
          this.setLasttValue(num);
        } else {
          if (isBlock) {
            this.setLasttValue(num);
            this.setIsBlock(false);
          } else {
            this.setLasttValue(lastValue + num);
          }
        }
      }
    }
  };

  delete() {
    const { firstValue, lastValue, sum, operator } = this;

    if (!sum) {
      let newValue = '';
      if (!Number(firstValue) || !operator) {
        newValue = firstValue.substring(0, firstValue.length - 1);
        newValue ? this.setFirstValue(newValue) : this.setFirstValue('0');
      } else {
        newValue = lastValue.substring(0, lastValue.length - 1);
        newValue ? this.setLasttValue(newValue) : this.setLasttValue('0');
      }
    }
  };

  denial() {
    const { firstValue, lastValue, sum, operator } = this;

    if (!sum) {
      if (!Number(firstValue) || !operator) {
        if (firstValue[0] === '-') {
          this.setFirstValue(firstValue.substring(1));
        } else {
          this.setFirstValue(`-${firstValue}`);
        }
      } else {
        if (lastValue[0] === '-') {
          this.setLasttValue(lastValue.substring(1));
        } else {
          this.setLasttValue(`-${lastValue}`);
        }
      }
    }
  };

  calculation() {
    const { firstValue, lastValue, operator, stack } = this;

    if (operator) {
      let result = '';
      const [a, b, countZero] = fixedValue(firstValue, lastValue, operator);
      const divider = countZero > 0 ? countZero : 1;

      stack[stack.length - 1] === '=' && this.setStack(stack[stack.length - 1] = operator)

      stack.length < 10
        ? this.setStack(stack.concat([lastValue, '=']))
        : this.setStack([firstValue, operator, lastValue, '='])

      switch (operator) {
        case '+':
          result = (a + b) / divider;
          break;
        case '-':
          result = (a - b) / divider;
          break;
        case '×':
          result = (a / divider) * (b / divider);
          break;
        case '÷':
          result = (a / divider) / (b / divider);
          break;
      }

      this.setFirstValue(result);
      this.setSum(result);
    }
  };
};

export default new MenuStore();
