type ChildrenType = El | El[] | string | null;

class El {
  tagName: string;
  attribute: object;
  children: ChildrenType;

  constructor(tagName: string, attribute: object, children: ChildrenType) {
    this.tagName = tagName;
    this.attribute = attribute;
    this.children = children;
  }
}

export default El;
