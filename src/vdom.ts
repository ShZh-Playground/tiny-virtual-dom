type ChildrenType = El | El[] | string | null;

class El {
  tagName: string;
  attribute: any;
  children: ChildrenType;

  constructor(
    tagName: string,
    // the attribute field can include any type of attributes
    attribute: any = null,
    children: ChildrenType = null
  ) {
    this.tagName = tagName;
    this.attribute = attribute;
    this.children = children;
  }

  render(): HTMLElement {
    const el = document.createElement(this.tagName);

    if (this.attribute) {
      for (const key in this.attribute) {
        const value = this.attribute[key];
        el.setAttribute(key, value);
      }
    }

    if (this.children) {
      if (typeof this.children === 'string') {
        const text = document.createTextNode(this.children);
        el.appendChild(text);
      } else if (Array.isArray(this.children)) {
        for (const child of this.children as El[]) {
          el.appendChild(child.render());
        }
      } else {
        el.appendChild(((this.children as unknown) as El).render());
      }
    }

    return el;
  }
}

export default El;
