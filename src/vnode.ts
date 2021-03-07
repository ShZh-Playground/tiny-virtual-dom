export type ChildrenType = VirtualNode | VirtualNode[] | string;

export type Attribute = {[propName: string]: string | number};

function isChildrenType(obj: any): obj is ChildrenType {
  return typeof obj === 'string' || 'tagName' in obj || Array.isArray(obj);
}

export class VirtualNode {
  tagName: string | undefined;
  attribute: Attribute;
  children: VirtualNode[]; // Should be array of its' class
  text: string;
  element: Node | undefined;
  key: string | undefined;

  constructor(
    tagName: string | undefined,
    attribute?: Attribute,
    children?: ChildrenType,
    text?: string
  ) {
    this.tagName = tagName;
    this.attribute = attribute || {};
    this.text = text || '';
    this.element = undefined;
    // Unify all kinds of children parameters
    if (children) {
      if (typeof children === 'string') {
        const textChild = new VirtualNode(
          undefined,
          undefined,
          undefined,
          children
        );
        this.children = Array.of(textChild);
      } else if (!Array.isArray(children)) {
        this.children = Array.of(children);
      } else {
        this.children = children;
      }
    } else {
      this.children = [];
    }
  }

  render(): Node {
    // Text Node
    if (!this.tagName) {
      this.element = document.createTextNode(this.text);
      return this.element;
    }
    // Create Node with tag
    const el = document.createElement(this.tagName);
    // Attribute setting
    for (const key in this.attribute) {
      const value = this.attribute[key];
      el.setAttribute(key, value.toString());
    }
    // Recursivly rendering sub-elements
    for (const child of this.children) {
      el.appendChild(child.render());
    }
    this.element = el;

    return el;
  }

  getKey(): string {
    // Lazy load when get `key` field
    if (!this.key) {
      this.key = this.text
        ? this.text
        : `${this.tagName}@${JSON.stringify(this.attribute)}`; // Mangled
    }
    return this.key;
  }
}

export function assignWithoutElement(
  oldNode: VirtualNode,
  newNode: VirtualNode
): void {
  oldNode.tagName = newNode.tagName;
  oldNode.attribute = newNode.attribute;
  oldNode.text = newNode.text;
  oldNode.children = newNode.children;
}

export function toVNode(el: Element): VirtualNode {
  const toAttributes = (nodeMap: NamedNodeMap) => {
    const attributes: Attribute = {};
    for (let i = 0; i < nodeMap.length; ++i) {
      attributes[nodeMap[i].name] = nodeMap[i].value;
    }
    return attributes;
  }

  const tagName = el.tagName;
  const attributes = toAttributes(el.attributes);
  const children: VirtualNode[] = [];
  for (let i = 0; i < el.children.length; ++i) {
    children.push(toVNode(el.children[i]));
  }
  const vnode = new VirtualNode(tagName, attributes, children);
  vnode.element = el;
  return vnode;
}

// Builder pattern
function vnode(
  tagName: string,
  param1?: Attribute | ChildrenType,
  param2?: ChildrenType
): VirtualNode {
  return param1 && isChildrenType(param1)
    ? new VirtualNode(tagName, undefined, param1)
    : new VirtualNode(tagName, param1 as Attribute, param2);
}

export default vnode;
