import El from '../src/vdom';

test("test El'sconstructor", () => {
  let el = new El('ul', {class: 'list'}, [
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
