import React from 'react';
import './index.scss';

const Key = ({ id, type, text, store }) => {
  return (
    <div
      className='key'
      key={id}
      data-type={type}
      onClick={() => store[type](text)}
    >
      {text}
    </div>
  );
};

export default Key;
