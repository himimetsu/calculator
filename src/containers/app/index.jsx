import { observer, Provider } from 'mobx-react';
import menuStore from '../../store';
import React from 'react';
import Input from '../../components/input/Input';
import Keyboard from '../../components/keyboard/Keyboard';
import './index.scss';

const stores = { menuStore };

const App = observer(() => {
  return (
    <Provider {...stores} >
      <div className='container'>
        <div className='container__enter'>
          <Input />
          <Keyboard />
        </div>
        <div className='container__info'>
          <div style={{ width: '100%' }}>
            Last update: 08.11.2020
          </div>
          <div style={{ width: '100%' }}>
            Version: 2
          </div>
        </div>  
      </div>
    </Provider>
  );
});

export default App;
