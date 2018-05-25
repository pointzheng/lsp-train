import React from 'react';

/**
 * 与本目录下的index.js文件内容相同，仅仅是文件后缀的区别
 * 主要用于测试
 */
export default ({onClick, label}) => (
  <button onClick={onClick}>
    {label}
  </button>
);
