import {Attribute, VirtualNode} from './vnode';

// Do not need to call render method
export function isSimilarNode(node1: VirtualNode, node2: VirtualNode): boolean {
  return node1.tagName === node2.tagName;
}

export function generateMap(nodeList: VirtualNode[]): Map<string, number> {
  const resultMap: Map<string, number> = new Map();
  for (let i = 0; i < nodeList.length; ++i) {
    resultMap.set(nodeList[i].getKey(), i);
  }
  return resultMap;
}

export function updateAttribute(
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
