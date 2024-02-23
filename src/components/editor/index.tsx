import { produce } from 'immer';
import { PenTool } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useDrag } from '../../hooks/useDrag';
import { components } from './config';
import {
  DomStateElement,
  addToVDom,
  convertToHTML,
  findAndModifyPropsInVDom,
  setActiveElements,
  vDomFind,
} from './dom';

const Properties: React.FC<{
  dom: DomStateElement[];
  active_element: string | null;
  setDom: (dom: DomStateElement[]) => void;
}> = ({ active_element, dom, setDom }) => {
  const props = useMemo<DomStateElement | null>(() => {
    if (!active_element) return null;
    const ele = vDomFind(dom, active_element);
    if (!ele) return null;
    return ele;
  }, [active_element, dom]);

  return (
    <div className="mt-3 space-y-3">
      <div className="px-2 w-full">
        Content <br />
        <input
          onChange={(ele) => {
            const val = ele.target.value;
            setDom(
              produce(dom, (c_dom) => {
                findAndModifyPropsInVDom(
                  active_element || '',
                  'content',
                  val,
                  c_dom,
                  'content'
                );
              })
            );
          }}
          className="w-full bg-gray-800 text-white placeholder-gray-400"
          type="text"
          placeholder="Content"
        />
      </div>

      {props &&
        [
          { p: props.props.style, t: 'style' },
          { p: props.props.attributes, t: 'attributes' },
        ].map((prop) => (
          <div className="h-[80vh] overflow-y-auto">
            {Object.keys(prop.p || {}).map((key) => (
              <div className="px-2 w-full">
                {key} <br />
                <input
                  onChange={(ele) => {
                    const val = ele.target.value;
                    setDom(
                      produce(dom, (c_dom) => {
                        findAndModifyPropsInVDom(
                          active_element || '',
                          key,
                          val,
                          c_dom,
                          prop.t
                        );
                      })
                    );
                  }}
                  className="w-full bg-gray-800 text-white placeholder-gray-400"
                  type="text"
                  placeholder={key}
                />
              </div>
            ))}
          </div>
        ))}
    </div>
  );
};

const Editor: React.FC = () => {
  const [activeProps, setActiveProps] = useState<null | {
    x: number;
    y: number;
    width: number;
    height: number;
    id: string;
  }>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const { setDragCompId } = useDrag();
  const [dom_state, setDomState] = useState<DomStateElement[]>([
    {
      element: 'body',
      id: 'root',
      children: [],
      props: {
        style: {},
      },
    },
  ]);

  const [html, setHtml] = useState<string>('');

  useEffect(() => {
    const test = setTimeout(() => {
      const frame = frameRef.current;
      if (!frame) return;
      const doc = frame.contentDocument;
      if (!doc) return;
      setActiveElements(doc, (id, x, y, w, h) => {
        setActiveProps({
          x,
          y,
          width: w,
          height: h,
          id,
        });
      });
    }, 1000);
    return () => {
      clearTimeout(test);
    };
  }, [dom_state, html]);

  useEffect(() => {
    setHtml('<html>' + convertToHTML(dom_state) + '</html>');
  }, [dom_state]);

  const downloadHtmlFile = () => {
    const element = document.createElement('a');
    const file = new Blob([html], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'website.html';
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  return (
    <div className="w-full h-screen flex flex-col bg-gray-900 text-white">
      <div className="w-full p-2 bg-gray-950 flex gap-4 justify-between">
        <div className="flex items-center gap-2">
          <PenTool size={30} color="white" />
          <div className="text-xl font-bold">Website builder</div>
        </div>
        <div>
          <button
            onClick={() => downloadHtmlFile()}
            className="px-3 py-2 bg-blue-700 rounded-md"
          >
            Export
          </button>
        </div>
      </div>
      <div className="flex-grow grid grid-cols-12">
        <div className="col-span-2 bg-gray-950 p-4">
          <div className="text-xl font-bold">Core elements</div>
          <div className="grid md:grid-cols-2 gap-3 mt-2 grid-cols-1">
            {components.map((comp) => (
              <div
                onClick={() => {
                  setDomState(
                    produce(dom_state, (copy) => {
                      const element = {
                        ...comp.element,
                        id: uuid(),
                      };
                      addToVDom(copy, element, 'root');
                    })
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
                <comp.icon size={20} />
                <div className="text-center text-xs">{comp.name}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-8 h-full bg-gray-800">
          <iframe
            ref={frameRef}
            className="bg-white w-full h-full"
            srcDoc={html}
          />
        </div>
        <div className="col-span-2 p-3">
          <div className="text-xl">Properties</div>
          <Properties
            setDom={setDomState}
            dom={dom_state}
            active_element={activeProps?.id || null}
          />
        </div>
      </div>
    </div>
  );
};

export default Editor;
