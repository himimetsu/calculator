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
            {row.map((btn, index) => (
              <Key {...btn} store={menuStore} key={index} />
            ))}
          </div>
        )
      })}
    </div>
  );
}));

Keyboard.displayName = "Keyboard";
export default Keyboard;
