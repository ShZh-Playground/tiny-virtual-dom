import patch from "../src/patch";
import vnode from "../src/vnode"

describe("test diff algorithm in the same level nodes", () => {
  test("test tagname and attribute difference at the same time", () => {
    const oldVDOM = vnode('h1', {id: 1});
    const newVDOM = vnode('h2', {class: 2});
    patch(oldVDOM, newVDOM);

    expect(oldVDOM).toEqual(newVDOM);
  });
});

describe("test diff algorithm in nodes' children", () => {
  test("test inserting new element at the front", () => {
    const oldVDOM = vnode('div', [
      vnode('h1'),
      vnode('h2'),
    ]);
    const newVDOM = vnode('div', [
      vnode('p'),
      vnode('h1'),
      vnode('h2'),
    ])
    patch(oldVDOM, newVDOM);

    expect(oldVDOM).toEqual(newVDOM);
  });

  test("test insert new element at the end", () => {
    const oldVDOM = vnode('div', [
      vnode('h1'),
      vnode('h2'),
    ]);
    const newVDOM = vnode('div', [
      vnode('h1'),
      vnode('h2'),
      vnode('p'),
    ]);
    patch(oldVDOM, newVDOM);

    expect(oldVDOM).toEqual(newVDOM);
  });

  test("test move front element to rear", () => {
    const oldVDOM = vnode('div', [
      vnode('h1'),
      vnode('h2'),
      vnode('h3'),
    ]);
    const newVDOM = vnode('div', [
      vnode('h2'),
      vnode('h3'),
      vnode('h1'),
    ]);
    patch(oldVDOM, newVDOM);

    expect(oldVDOM).toEqual(newVDOM);
  })

  test("test move rear element to front", () => {
    const oldVDOM = vnode('div', [
      vnode('h1'),
      vnode('h2'),
      vnode('h3'),
    ]);
    const newVDOM = vnode('div', [
      vnode('h3'),
      vnode('h1'),
      vnode('h2'),
    ]);
    patch(oldVDOM, newVDOM);

    expect(oldVDOM).toEqual(newVDOM);
  });

  test("test common cases", () => {
    const oldVDOM = vnode('div', [
      vnode('h1'),
      vnode('h2'),
      vnode('h3'),
      vnode('h4'),
    ]);
    const newVDOM = vnode('div', [
      vnode('p'),
      vnode('h2'),
      vnode('h1'),
      vnode('h4'),
      vnode('span'),
    ]);
    patch(oldVDOM, newVDOM);

    expect(oldVDOM).toEqual(newVDOM);
  });
});