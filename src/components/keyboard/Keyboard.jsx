import React from 'react';
import { inject, observer } from 'mobx-react';
import { data } from './data';
import Key from './Key';
import './Keyboard.scss';

const Keyboard = inject('menuStore')(observer(({ menuStore }) => {
  return (
    <div className='keyboard'>
      {data.map((row, index) => {
        return (
          <div className='row' key={index}>
            {row.map((btn) => (
              <Key {...btn} store={menuStore} />
            ))}
          </div>
        )
      })}
    </div>
  );
}));

Keyboard.displayName = "Keyboard";
export default Keyboard;
