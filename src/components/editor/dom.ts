export interface DomStateElement {
  id: string;
  element: string;
  props: {
    style: {
      [k: string]: any;
    };
    attributes?: {
      [k: string]: any;
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

export const captureDomProps = (
  components: DomStateElement,
  v_document: HTMLDocument,
) => {
  const ids = extractAllIds([components]);

  for (let i = 0; i < ids.length; i++) {
    const ele = v_document.getElementById(ids[i]);
    if (ele) {
      const rect = ele.getBoundingClientRect();
      setDomProps(components, ids[i], rect);
    }
  }
};

export const convertToHTML = (components: DomStateElement[]) => {
  let html = "";
  for (let i = 0; i < components.length; i++) {
    html += `<${components[i].element} id="${components[i].id}" style="${Object.keys(
      components[i].props.style,
    )
      .map((key) => `${key}:${components[i].props.style[key]}`)
      .join(";")}"
      ${
        components[i].props.attributes
          ? Object.keys(components[i].props.attributes)
              .map((key) => `${key}="${components[i].props.attributes[key]}"`)
              .join(" ")
          : ""
      }

    >
      ${components[i].content || ""}
      ${convertToHTML(components[i].children)}
    </${components[i].element}>`;
  }

  return html;
};

export const addToVDom = (
  components: DomStateElement[],
  element: DomStateElement,
  parent_id: string,
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
