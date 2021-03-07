import { toVNode, vnode, patch } from '../dist/index.js';

const container = document.querySelector('#container');

const oldDOM = toVNode(container);
const newDOM = vnode(
  'div',
  {
    style: '                  \
      height: 100px;          \
      background-color: red;  \
    '
  }
);
setTimeout(() => {
  patch(oldDOM, newDOM);
}, 5000);

console.log('Hello');