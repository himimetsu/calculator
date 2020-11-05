import React from 'react';
import './index.scss';

const Key = ({ key, type, text, store }) => {
  return (
    <div
      className='key'
      key={key}
      data-type={type}
      onClick={() => store[type](text)}
    >
      {text}
    </div>
  );
};

export default Key;
