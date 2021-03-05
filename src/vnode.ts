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

  constructor(
    tagName: string | undefined,
    attribute?: Attribute,
    children?: ChildrenType,
    text?: string
  ) {
    this.tagName = tagName;
    this.attribute = attribute || {};
    this.text = text || '';
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
      return document.createTextNode(this.text);
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

    return el;
  }
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
