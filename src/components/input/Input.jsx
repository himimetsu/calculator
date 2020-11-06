import React, { useEffect, useRef } from 'react';
import { inject, observer } from 'mobx-react';
import './Input.scss';

const operators = ['+', '-', '*', '/', '='];

const Input = inject('menuStore')(observer(({ menuStore }) => {
  const refInput = useRef();

  const handlerKeydown = (e) => {
    if (menuStore.isKeyboard) {
      switch (e.code) {
        case 'Backspace':
          menuStore.delete();
          break;
        case 'Minus':
          menuStore.minus();
          break;
        case 'Equal':
          e.key === '=' ? menuStore.equally() : menuStore.plus();
          break;
        case 'Slash':
          e.key === '/' && menuStore.divide();
          break;
        case 'Comma':
          e.key === ',' && menuStore.convertToFloat();
          break;
        case 'Digit8':
          e.shiftKey && menuStore.multiply();
          break;
        case 'Enter':
          menuStore.equally();
          break;
      }
    }
  };

  const handlerKeypress = (e) => {
    if (Number.isInteger(Number(e.key))) {
      menuStore.digit(e.key);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handlerKeydown);
    window.addEventListener('keypress', handlerKeypress);

    return () => {
      window.removeEventListener('keydown', handlerKeydown);
      window.removeEventListener('keypress', handlerKeypress);
    }
  }, []);

  return (
    <div className='input'>
      <div className='input__stack'>
        {menuStore.testStack.map((item, index) => {
          return (
            <div className='stack__item' key={item + index}>
              {operators.includes(item)
                ? item === '/'
                  ? '÷'
                  : item
                : Number(item)
              }
            </div>
          );
        })}
      </div>
      <div className='input__enter'>
        <input
          ref={refInput}
          type="text"
          value={
            menuStore.sum
              ? menuStore.sum
              : menuStore.value
          }
          onFocus={() => refInput.current.blur()}
        />
      </div>
    </div>
  );
}));

Input.displayName = "Input";
export default Input;
