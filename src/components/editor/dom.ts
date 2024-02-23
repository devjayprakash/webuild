export interface DomStateElement {
  id: string;
  element: string;
  props: {
    style: {
      [k: string]: string;
    };
    attributes?: {
      [k: string]: string;
    };
  };
  children: DomStateElement[];
  content?: string;
  dom?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export const extractAllIds = (components: DomStateElement[]) => {
  const ids: string[] = [];
  for (let i = 0; i < components.length; i++) {
    ids.push(components[i].id);
    ids.push(...extractAllIds(components[i].children));
  }
  return ids;
};

export const convertToHTML = (components: DomStateElement[]) => {
  let html = '';
  for (let i = 0; i < components.length; i++) {
    html += `<${components[i].element} id="${components[i].id}" style="${Object.keys(
      components[i].props.style
    )
      .map((key) => `${key}:${components[i].props.style[key]}`)
      .join(';')}"
      ${
        components[i].props.attributes
          ? Object.keys(components[i].props.attributes || {})
              .map((key) => `${key}="${components[i].props.attributes![key]}"`)
              .join(' ')
          : ''
      }

    >
      ${components[i].content || ''}
      ${convertToHTML(components[i].children)}
    </${components[i].element}>`;
  }

  return html;
};

export const vDomFind = (
  dom: DomStateElement[],
  id: string
): DomStateElement | undefined => {
  for (let i = 0; i < dom.length; i++) {
    if (dom[i].id === id) {
      return dom[i];
    }

    const found = vDomFind(dom[i].children, id);
    if (found) {
      return found;
    }
  }
};

export const setActiveElements = (
  doc: Document,
  func: (id: string, x: number, y: number, width: number, h: number) => void
) => {
  const all_elements = doc.querySelectorAll('*');

  for (let i = 0; i < all_elements.length; i++) {
    const ele = all_elements[i];
    const id = ele.id;
    if (id) {
      const ele = doc.getElementById(id);

      if (ele) {
        ele.onclick = () => {
          if (id !== 'root') {
            func(
              id,
              ele.getBoundingClientRect().x,
              ele.getBoundingClientRect().y,
              ele.getBoundingClientRect().width,
              ele.getBoundingClientRect().height
            );
          }
        };
      }
    }
  }
};

export const findAndModifyPropsInVDom = (
  id: string,
  key: string,
  value: string,
  components: DomStateElement[],
  obj_key: string
) => {
  for (let i = 0; i < components.length; i++) {
    if (components[i].id === id) {
      if (obj_key === 'style') {
        components[i].props.style[key] = value;
      } else if (obj_key === 'content') {
        components[i].content = value;
      } else {
        components[i].props.attributes![key] = value;
      }
      return;
    }
    findAndModifyPropsInVDom(id, key, value, components[i].children, obj_key);
  }
};

export const addToVDom = (
  components: DomStateElement[],
  element: DomStateElement,
  parent_id: string
) => {
  const idx_ele = components.findIndex((ele) => ele.id === parent_id);

  if (idx_ele === -1) {
    for (let i = 0; i < components.length; i++) {
      addToVDom(components[i].children, element, parent_id);
    }
  } else {
    components[idx_ele].children.push(element);
  }
};
