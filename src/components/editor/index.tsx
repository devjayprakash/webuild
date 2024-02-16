import { PenTool } from "lucide-react";
import { components } from "./config";
import { useDrag } from "../../hooks/useDrag";
import { useEffect, useRef, useState } from "react";
import { DomStateElement, addToVDom, convertToHTML } from "./dom";
import { v4 as uuid } from "uuid";
import { produce } from "immer";

const Properties: React.FC<{ properties: DomStateElement[] }> = () => {
  return <div>this is working</div>;
};

const Editor: React.FC = () => {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const { setDragCompId } = useDrag();
  const [dom_state, setDomState] = useState<DomStateElement[]>([
    {
      element: "body",
      id: "root",
      children: [],
      props: {
        style: {},
      },
    },
  ]);
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    setHtml("<html>" + convertToHTML(dom_state) + "</html>");
  }, [dom_state]);

  return (
    <div className="w-full h-screen flex flex-col bg-gray-900 text-white">
      <div className="w-full p-2 bg-gray-950 flex gap-4">
        <PenTool size={30} color="white" />
        <div className="text-xl font-bold">Website builder</div>
      </div>
      <div className="flex-grow grid grid-cols-12">
        <div className="col-span-3 bg-gray-950 p-4">
          <div className="text-xl font-bold">Core elements</div>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {components.map((comp) => (
              <div
                onClick={() => {
                  setDomState(
                    produce(dom_state, (copy) => {
                      const element = {
                        ...comp.element,
                        id: uuid(),
                      };
                      addToVDom(copy, element, "root");
                    }),
                  );
                }}
                key={comp.id}
                id={comp.id}
                onDragStart={() => setDragCompId(comp.id)}
                onDragEnd={() => {
                  setDragCompId(null);
                }}
                draggable
                className="bg-gray-900 text-white hover:text-blue-600 select-none cursor-pointer p-4 rounded-lg border hover:border-blue-600 flex flex-col items-center justify-center gap-3"
              >
                <comp.icon size={40} />
                <div className="text-center text-xl">{comp.name}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-6 h-full bg-gray-800">
          <iframe
            ref={frameRef}
            className="bg-white w-full h-full"
            srcDoc={html}
          />
        </div>
        <div className="col-span-3 p-3">
          <div className="text-xl">Properties</div>
          <Properties properties={dom_state} />
        </div>
      </div>
    </div>
  );
};

export default Editor;
