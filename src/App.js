import { ReactRenderer, useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Mention from "@tiptap/extension-mention";

import tippy from "tippy.js";
// import { MentionList } from './MentionList'

import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle
} from "react";
// import './MentionList.scss'

const App = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Mention.configure({
        HTMLAttributes: {
          class: "mention"
        },
        suggestion
      })
    ],
    content: "<p>Hello world</p>"
  });
  return <EditorContent editor={editor} />;
};

export default App;

const suggestion = {
  items: ({ query }) => {
    return [
      "Lea Thompson",
      "Cyndi Lauper",
      "Tom Cruise",
      "Madonna",
      "Jerry Hall",
      "Joan Collins",
      "Winona Ryder",
      "Christina Applegate",
      "Alyssa Milano",
      "Molly Ringwald",
      "Ally Sheedy",
      "Debbie Harry",
      "Olivia Newton-John",
      "Elton John",
      "Michael J. Fox",
      "Axl Rose",
      "Emilio Estevez",
      "Ralph Macchio",
      "Rob Lowe",
      "Jennifer Grey",
      "Mickey Rourke",
      "John Cusack",
      "Matthew Broderick",
      "Justine Bateman",
      "Lisa Bonet"
    ]
      .filter((item) => item.toLowerCase().startsWith(query.toLowerCase()))
      .slice(0, 5);
  },

  render: () => {
    let reactRenderer;
    let popup;

    return {
      onStart: (props) => {
        reactRenderer = new ReactRenderer(MentionList, {
          props,
          editor: props.editor
        });

        popup = tippy("body", {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: reactRenderer.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start"
        });
      },

      onUpdate(props) {
        reactRenderer.updateProps(props);

        popup[0].setProps({
          getReferenceClientRect: props.clientRect
        });
      },

      onKeyDown(props) {
        if (props.event.key === "Escape") {
          popup[0].hide();

          return true;
        }

        return reactRenderer.ref?.onKeyDown(props);
      },

      onExit() {
        popup[0].destroy();
        reactRenderer.destroy();
      }
    };
  }
};

export const MentionList = forwardRef((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index) => {
    const item = props.items[index];

    if (item) {
      props.command({ id: item });
    }
  };

  const upHandler = () => {
    setSelectedIndex(
      (selectedIndex + props.items.length - 1) % props.items.length
    );
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === "ArrowUp") {
        upHandler();
        return true;
      }

      if (event.key === "ArrowDown") {
        downHandler();
        return true;
      }

      if (event.key === "Enter") {
        enterHandler();
        return true;
      }

      return false;
    }
  }));

  return (
    <div className="items">
      {props.items.map((item, index) => (
        <button
          className={`item ${index === selectedIndex ? "is-selected" : ""}`}
          key={index}
          onClick={() => selectItem(index)}
        >
          {item}
        </button>
      ))}
    </div>
  );
});
