interface Attribute {
  [propName: string]: string | number;
}

type ChildrenType = VirtualNode | VirtualNode[] | string;

export class VirtualNode {
  tagName: string;
  attribute: Attribute;
  children: ChildrenType;

  constructor(tagName: string, attribute?: Attribute, children?: ChildrenType) {
    this.tagName = tagName;
    this.attribute = attribute || {}; // Deal with `undefined`
    this.children = children || [];
  }

  render(): HTMLElement {
    // Tag creation
    const el = document.createElement(this.tagName);
    // Attribute setting
    for (const key in this.attribute) {
      const value = this.attribute[key];
      el.setAttribute(key, value.toString());
    }
    // Recursivly rendering sub-elements
    if (typeof this.children === 'string') {
      const text = document.createTextNode(this.children);
      el.appendChild(text);
    } else if (Array.isArray(this.children)) {
      for (const child of this.children) {
        el.appendChild(child.render());
      }
    } else {
      el.appendChild(this.children.render());
    }

    return el;
  }
}

function isChildrenType(obj: any): obj is ChildrenType {
  return typeof obj === 'string' || 'tagName' in obj || Array.isArray(obj);
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
