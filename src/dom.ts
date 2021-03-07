import {Attribute} from './vnode';

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

export function replaceNode(parent: Node, oldNode: Node, newNode: Node): void {
  parent.insertBefore(oldNode, newNode);
  parent.removeChild(oldNode);
}

export function insertBefore(targetNode: Node, sourceNode: Node): void {
  const parent = targetNode.parentNode;
  parent?.insertBefore(targetNode, sourceNode);
}

export function deleteNode(targetNode: Node): void {
  const parent = targetNode.parentNode;
  parent?.removeChild(targetNode);
}
