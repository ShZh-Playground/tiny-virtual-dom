import {deleteNode, insertBefore, replaceNode, updateAttribute} from './dom';
import {VirtualNode} from './vnode';

interface pointers {
  front: number;
  rear: number;
}

// Do not need to call render method
function isSimilarNode(node1: VirtualNode, node2: VirtualNode): boolean {
  return node1.tagName === node2.tagName;
}

function generateMap(nodeList: VirtualNode[]): Map<string, number> {
  const resultMap: Map<string, number> = new Map();
  for (let i = 0; i < nodeList.length; ++i) {
    resultMap.set(nodeList[i].getKey(), i);
  }
  return resultMap;
}

function patch(oldVDOM: VirtualNode, newVDOM: VirtualNode): void {
  patchNode(oldVDOM, newVDOM);
}

function patchNode(oldVDOM: VirtualNode, newVDOM: VirtualNode): void {
  if (!oldVDOM.element) {
    oldVDOM.render();
  }
  const parent = oldVDOM.element!.parentNode;

  // Special case: root element which does't have parent
  if (!parent && oldVDOM.tagName !== newVDOM.tagName) {
    oldVDOM.element = newVDOM.render();
    assignWithoutElement(oldVDOM, newVDOM);
    return;
  }

  // Special case: oldVDOM and newVDOM are both text nodes
  if (oldVDOM.text && newVDOM.text && newVDOM.text !== oldVDOM.text) {
    oldVDOM.text = newVDOM.text;
    (oldVDOM.element as Text).data = newVDOM.text;
    return;
  }

  // Different tagname: replace old DOM with new DOM
  if (oldVDOM.tagName !== newVDOM.tagName) {
    replaceNode(parent!, oldVDOM.element!, newVDOM.render());
    assignWithoutElement(oldVDOM, newVDOM);
    return;
  }
  // Different attribute
  updateAttribute(
    oldVDOM.element as Element,
    oldVDOM.attribute,
    newVDOM.attribute
  );
  oldVDOM.attribute = newVDOM.attribute;
  // Different chilren
  patchChildren(oldVDOM.element!, oldVDOM.children, newVDOM.children);
  oldVDOM.children = newVDOM.children;

  // Update virtual DOM
  oldVDOM = newVDOM;
}

function patchChildren(
  parent: Node,
  oldChildren: (VirtualNode | null)[],
  newChildren: VirtualNode[]
): void {
  const map = generateMap(oldChildren as VirtualNode[]);
  const oldPtr: pointers = {front: 0, rear: oldChildren.length - 1};
  const newPtr: pointers = {front: 0, rear: newChildren.length - 1};

  while (oldPtr.front <= oldPtr.rear && newPtr.front <= newPtr.rear) {
    const oldFrontNode = oldChildren[oldPtr.front];
    const oldRearNode = oldChildren[oldPtr.rear];
    const newFrontNode = newChildren[newPtr.front];
    const newRearNode = newChildren[newPtr.rear];

    // Would set null in the key comparsion part
    if (oldFrontNode === null) {
      ++oldPtr.front;
    } else if (oldRearNode === null) {
      --oldPtr.rear;
    } else if (isSimilarNode(oldFrontNode, newFrontNode)) {
      patchNode(oldFrontNode, newFrontNode);
      ++oldPtr.front;
      ++newPtr.front;
    } else if (isSimilarNode(oldRearNode, newRearNode)) {
      patchNode(oldRearNode, newRearNode);
      --oldPtr.rear;
      --newPtr.rear;
    } else if (isSimilarNode(oldFrontNode, newRearNode)) {
      patchNode(oldFrontNode, newRearNode);
      insertBefore(oldFrontNode.element!, oldRearNode.element?.nextSibling!);
      ++oldPtr.front;
      --newPtr.rear;
    } else if (isSimilarNode(oldRearNode, newFrontNode)) {
      patchNode(oldRearNode, newFrontNode);
      insertBefore(oldRearNode.element!, oldFrontNode.element!);
      --oldPtr.rear;
      ++newPtr.front;
    } else {
      const index = map.get(newFrontNode.getKey());
      if (index && oldChildren[index]) {
        // Do have the corresponding node
        patchNode(oldChildren[index]!, newFrontNode);
        // Move the old node to the front
        insertBefore(oldChildren[index]!.element!, oldFrontNode.element!);
        // Set undefined to avoid duplication
        oldChildren[index] = null;
      } else {
        // Do not have the corresponding node
        // New element, insert before the front node
        parent.insertBefore(newFrontNode.render(), oldFrontNode.element!);
      }
      ++newPtr.front;
    }
  }

  // Need to remove redundant elements
  while (oldPtr.front <= oldPtr.rear) {
    const curNode = oldChildren[oldPtr.front++];
    if (curNode) {
      deleteNode(curNode.element!);
    }
  }
  // Need to add new elements
  while (newPtr.front <= newPtr.rear) {
    const curNode = newChildren[newPtr.front++];
    const srcNode = oldChildren[oldPtr.rear + 1]
      ? oldChildren[oldPtr.rear + 1]?.element!
      : null;
    parent.insertBefore(curNode.render(), srcNode);
  }
}

function assignWithoutElement(
  oldNode: VirtualNode,
  newNode: VirtualNode
): void {
  oldNode.tagName = newNode.tagName;
  oldNode.attribute = newNode.attribute;
  oldNode.text = newNode.text;
  oldNode.children = newNode.children;
}

export default patch;
