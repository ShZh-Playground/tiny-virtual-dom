import patch from '../src/patch';
import vnode from '../src/vnode';
import {VirtualNode} from '../src/vnode';

function createVTextNode(text: string) {
  return new VirtualNode(undefined, undefined, undefined, text);
}

describe('test diff algorithm in the same level nodes', () => {
  describe('test text node', () => {
    test('test 2 text elements', () => {
      const oldVDOM = createVTextNode('Hello');
      const newVDOM = createVTextNode('World');

      const spyRender = spyOn(newVDOM, 'render');

      patch(oldVDOM, newVDOM);

      expect(spyRender).not.toHaveBeenCalled();
      expect(oldVDOM.tagName).toBeUndefined();
      expect(oldVDOM.attribute).toEqual({});
      expect(oldVDOM.text).toEqual('World');
      expect((oldVDOM.element as Text).data).toEqual('World');
    });
    test('test replace text node with new non-text node', () => {
      const oldVDOM = createVTextNode('Hello');
      const newVDOM = vnode('span');

      patch(oldVDOM, newVDOM);
      expect(oldVDOM.tagName).toEqual('span');
      expect(oldVDOM.attribute).toEqual({});
      expect(oldVDOM.text).toEqual('');
      expect(oldVDOM.element?.nodeName).toEqual('SPAN');
    });
    test('test replace non-text node with text node', () => {
      const oldVDOM = vnode('span');
      const newVDOM = createVTextNode('Hello');

      patch(oldVDOM, newVDOM);
      expect(oldVDOM.tagName).toBeUndefined();
      expect(oldVDOM.attribute).toEqual({});
      expect(oldVDOM.text).toEqual('Hello');
      expect((oldVDOM.element as Text).data).toEqual('Hello');
    });
  });

  describe('test non-text node', () => {
    test('check different tagname of root elements', () => {
      const oldVDOM = vnode('h1', {id: 1});
      const newVDOM = vnode('h2', {class: 2});
      patch(oldVDOM, newVDOM);

      // Field test
      expect(oldVDOM.tagName).toEqual(newVDOM.tagName);
      expect(oldVDOM.attribute).toEqual(newVDOM.attribute);
      expect(oldVDOM.text).toEqual(newVDOM.text);

      // DOM test
      const el = oldVDOM.element as Element;
      expect(el.tagName).toEqual('H2');
      expect(el.getAttribute('class')).toEqual('2');
    });
    test('check performance of different tagname of root elements', () => {
      const oldVDOM = vnode('h1', {id: 1});
      const newVDOM = vnode('h2', {class: 2});

      const spyRender = spyOn(newVDOM, 'render');
      patch(oldVDOM, newVDOM);

      expect(spyRender).toHaveBeenCalledTimes(1);
    });
    test('check different field of root elements', () => {
      const oldVDOM = vnode('h1', {id: 1});
      const newVDOM = vnode('h1', {class: 2});

      const spyRender = spyOn(newVDOM, 'render');
      patch(oldVDOM, newVDOM);

      expect(spyRender).not.toHaveBeenCalled();
      expect(oldVDOM.attribute).toEqual({class: 2});
    });

    test('check field of non root elements', () => {
      const subOldVDOM = vnode('p', {id: 1});
      const subNewVDOM = vnode('h3', {class: 2});

      const oldVDOM = vnode('div', subOldVDOM);
      const newVDOM = vnode('div', subNewVDOM);

      patch(oldVDOM, newVDOM);

      expect(oldVDOM.element?.childNodes).toHaveLength(1);
      const el = oldVDOM.element?.childNodes[0] as Element;
      expect(el.tagName).toEqual('H3');
      expect(el.getAttribute('class')).toEqual('2');
    });
  });
});

describe("test diff algorithm in nodes' children", () => {
  test('test inserting new element at the front', () => {
    const oldVDOM = vnode('div', [vnode('h1'), vnode('h2')]);
    const newVDOM = vnode('div', [vnode('p'), vnode('h1'), vnode('h2')]);
    patch(oldVDOM, newVDOM);

    const chilren = oldVDOM.element?.childNodes!;
    expect(chilren[0].nodeName).toEqual('P');
    expect(chilren[1].nodeName).toEqual('H1');
    expect(chilren[2].nodeName).toEqual('H2');
  });

  test('test insert new element at the end', () => {
    const oldVDOM = vnode('div', [vnode('h1'), vnode('h2')]);
    const newVDOM = vnode('div', [vnode('h1'), vnode('h2'), vnode('p')]);
    patch(oldVDOM, newVDOM);

    const chilren = oldVDOM.element?.childNodes!;
    expect(chilren[0].nodeName).toEqual('H1');
    expect(chilren[1].nodeName).toEqual('H2');
    expect(chilren[2].nodeName).toEqual('P');
  });

  test('test move front element to rear', () => {
    const oldVDOM = vnode('div', [vnode('h1'), vnode('h2'), vnode('h3')]);
    const newVDOM = vnode('div', [vnode('h2'), vnode('h3'), vnode('h1')]);
    patch(oldVDOM, newVDOM);

    const chilren = oldVDOM.element?.childNodes!;
    expect(chilren[0].nodeName).toEqual('H2');
    expect(chilren[1].nodeName).toEqual('H3');
    expect(chilren[2].nodeName).toEqual('H1');
  });

  test('test move rear element to front', () => {
    const oldVDOM = vnode('div', [vnode('h1'), vnode('h2'), vnode('h3')]);
    const newVDOM = vnode('div', [vnode('h3'), vnode('h1'), vnode('h2')]);
    patch(oldVDOM, newVDOM);

    const chilren = oldVDOM.element?.childNodes!;
    expect(chilren[0].nodeName).toEqual('H3');
    expect(chilren[1].nodeName).toEqual('H1');
    expect(chilren[2].nodeName).toEqual('H2');
  });

  test('test common cases', () => {
    const oldVDOM = vnode('div', [
      vnode('h1'),
      vnode('h2'),
      vnode('h3'),
      vnode('h4')
    ]);
    const newVDOM = vnode('div', [
      vnode('p'),
      vnode('h2'),
      vnode('h1'),
      vnode('h4'),
      vnode('span')
    ]);
    patch(oldVDOM, newVDOM);

    const chilren = oldVDOM.element?.childNodes!;
    expect(chilren[0].nodeName).toEqual('P');
    expect(chilren[1].nodeName).toEqual('H2');
    expect(chilren[2].nodeName).toEqual('H1');
    expect(chilren[3].nodeName).toEqual('H4');
    expect(chilren[4].nodeName).toEqual('SPAN');
  });
});
