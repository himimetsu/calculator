import React, { useEffect, useRef } from 'react';
import { inject, observer } from 'mobx-react';
import './Input.scss';

const operators = ['+', '-', '*', '/', '='];

const Input = inject('menuStore')(observer(({ menuStore }) => {
  const refInput = useRef();

  useEffect(() => {
    window.addEventListener('keypress', (e) => {
      refInput.current.selectionStart = menuStore.value.length;
      refInput.current.selectionEnd = menuStore.value.length;
      menuStore.isKeyboard && menuStore.setValue(menuStore.value + e.key);
    })
  }, []);

  return (
    <div className='input'>
      <div className='input__stack'>
        {menuStore.testStack.map((item) => {
          return (
            <div className='stack__item'>
              {operators.includes(item)
                ? item === '/' ? '÷' : item
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
