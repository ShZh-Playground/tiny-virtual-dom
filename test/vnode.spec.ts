import {VirtualNode} from '../src/vnode';
import vnode from '../src/vnode';

// JQuery-like selector
function $(selector: string): HTMLElement | null {
  return document.querySelector(selector);
}

describe("test El's constructor", () => {
  test("test El's normal constructor", () => {
    const el = vnode('ul', {class: 'list'}, [
      vnode('li', {id: 1}, 'apple'),
      vnode('li', {id: 2}, 'banana'),
      vnode('li', {id: 3}, 'tomato')
    ]);

    expect(el.tagName).toEqual('ul');
    expect(el.attribute).toEqual({class: 'list'});

    const children = el.children as VirtualNode[];
    expect(children).toHaveLength(3);
    expect(children[0].tagName).toEqual('li');
    expect(children[0].attribute).toEqual({id: 1});
    expect(children[0].children).toEqual('apple');
  });
});

describe("test El's method", () => {
  test("test El's render method", () => {
    const root = vnode('ul', {class: 'list'}, [
      vnode('li'),
      vnode('li', 'banana'),
      vnode('li', {id: 3}, vnode('p'))
    ]);

    document.body.appendChild(root.render());

    expect($('ul')?.getAttribute('class')).toEqual('list');
    expect($('ul')?.children.length).toEqual(3);

    expect($('li:nth-child(2)')?.innerHTML).toEqual('banana');
    expect($('li:nth-child(3)')?.getAttribute('id')).toEqual('3');
  });
});
