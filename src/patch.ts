import {assignWithoutElement, Attribute, VirtualNode} from './vnode';

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

function updateAttribute(
  node: Element,
  oldAttrs: Attribute,
  newAttrs: Attribute
): void {
  for (const attrKey in oldAttrs) {
    if (!newAttrs[attrKey]) {
      // Deleting attribute
      node.removeAttribute(attrKey);
    } else if (oldAttrs[attrKey] !== newAttrs[attrKey]) {
      // Change same key attribute
      node.setAttribute(attrKey, newAttrs[attrKey].toString());
    }
  }
  for (const attrKey in newAttrs) {
    if (!oldAttrs[attrKey]) {
      // Adding attribute
      node.setAttribute(attrKey, newAttrs[attrKey].toString());
    }
  }
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

  // Note: No need to consider tagname difference
  // (1). Root elements with different tagname have been considered before
  // (2). As chilren of some elements they must be the same tagname to enter this function

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
      parent.insertBefore(
        oldFrontNode.element!,
        oldRearNode.element?.nextSibling!
      );
      ++oldPtr.front;
      --newPtr.rear;
    } else if (isSimilarNode(oldRearNode, newFrontNode)) {
      patchNode(oldRearNode, newFrontNode);
      parent.insertBefore(oldRearNode.element!, oldFrontNode.element!);
      --oldPtr.rear;
      ++newPtr.front;
    } else {
      const index = map.get(newFrontNode.getKey());
      if (index && oldChildren[index]) {
        // Do have the corresponding node
        patchNode(oldChildren[index]!, newFrontNode);
        // Move the old node to the front
        parent.insertBefore(
          oldChildren[index]!.element!,
          oldFrontNode.element!
        );
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
      const targetElement = curNode.element!; // OldChilren must have element defined
      const targetParent = targetElement.parentNode;
      targetParent?.removeChild(targetElement);
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

export default patch;
