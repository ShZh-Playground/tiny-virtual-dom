import El from '../src/vdom';

// JQuery-like selector
function $(selector: string): HTMLElement | null {
  return document.querySelector(selector);
}

describe("test El's constructor", () => {
  test("test El's normal constructor", () => {
    const el = new El('ul', {class: 'list'}, [
      new El('li', {id: 1}, 'apple'),
      new El('li', {id: 2}, 'banana'),
      new El('li', {id: 3}, 'tomato')
    ]);

    expect(el.tagName).toEqual('ul');
    expect(el.attribute).toEqual({class: 'list'});

    const children = el.children as El[];
    expect(children).toHaveLength(3);
    expect(children[0].tagName).toEqual('li');
    expect(children[0].attribute).toEqual({id: 1});
    expect(children[0].children).toEqual('apple');
  });
});

describe("test El's method", () => {
  test("test El's render method", () => {
    const root = new El('ul', {class: 'list'}, [
      new El('li'),
      new El('li', null, 'banana'),
      new El('li', {id: 3}, new El('p'))
    ]);

    document.body.appendChild(root.render());

    expect($('ul')?.getAttribute('class')).toEqual('list');
    expect($('ul')?.children.length).toEqual(3);

    expect($('li:nth-child(2)')?.innerHTML).toEqual('banana');
    expect($('li:nth-child(3)')?.getAttribute('id')).toEqual('3');
  });
});
