import {
  FileText,
  Heading1Icon,
  Images,
  RectangleHorizontal,
} from "lucide-react";
import { DomStateElement } from "./dom";

interface Component {
  id: string;
  name: string;
  icon: any;
  element: Omit<DomStateElement, "id">;
}

export const components: Component[] = [
  {
    id: "core_1",
    name: "Box",
    icon: RectangleHorizontal,
    element: {
      children: [],
      element: "div",
      content: "this is the box",
      props: {
        style: {
          width: "100px",
          height: "100px",
          backgroundColor: "red",
        },
      },
    },
  },
  {
    id: "core_2",
    name: "Text",
    icon: FileText,
    element: {
      content: "this is the text",
      children: [],
      element: "u",
      props: {
        style: {
          color: "black",
        },
      },
    },
  },
  {
    id: "core_3",
    name: "Picture",
    icon: Images,
    element: {
      children: [],
      element: "img",
      props: {
        style: {
          width: "100px",
          height: "100px",
        },
        attributes: {
          src: "https://via.placeholder.com/150",
        },
      },
    },
  },
  {
    id: "core_4",
    name: "Heading",
    icon: Heading1Icon,
    element: {
      children: [],
      content: "some content",
      element: "h1",
      props: {
        style: {
          color: "black",
        },
      },
    },
  },
];
