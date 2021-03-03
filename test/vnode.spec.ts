import {VirtualNode} from '../src/vnode';
import vnode from '../src/vnode';

// JQuery-like selector
function $(selector: string): HTMLElement | null {
  return document.querySelector(selector);
}

describe("test El's constructor", () => {
  test("test El's constructor with full parameters", () => {
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

  test("test El's constructor with 2 parameters", () => {
    const el = vnode('div', [
      vnode('h1', 'Header'),
      vnode('p', {id: 1}),
      vnode('ul', vnode('li', 'Hello'))
    ]);

    expect(el.tagName).toEqual('div');
    expect(el.attribute).toEqual({});
    expect(el.children).toHaveLength(3);

    const children = el.children as VirtualNode[];
    expect(children[0].children).toEqual('Header');
    expect(children[0].attribute).toEqual({});
    expect(children[1].attribute).toEqual({id: 1});
    expect(children[1].children).toEqual([]);
    expect(children[2].attribute).toEqual({});

    const childOfChildren = children[2].children as VirtualNode;
    expect(childOfChildren.tagName).toEqual('li');
    expect(childOfChildren.attribute).toEqual({});
    expect(childOfChildren.children).toEqual('Hello');
  });

  test("test El's constructor with one parameter", () => {
    const el = vnode('p');

    expect(el.tagName).toEqual('p');
    expect(el.attribute).toEqual({});
    expect(el.children).toEqual([]);
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
