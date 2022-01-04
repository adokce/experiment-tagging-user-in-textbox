// @refresh reset

// Goal:
// Make a textbox/textarea in which you can tag (@Name) people
// After submitting the text, have an option to highlight the tag and click on it

import React, { useCallback, useMemo, useState } from "react";
import { createEditor, Editor, Range } from "slate";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
import MentionExample from "./MentionExample";

const SlateComponent = () => {
  const [value, setValue] = useState([
    {
      type: "paragraph",
      children: [{ text: "1 line in paragraph" }]
    },
    {
      type: "paragraph",
      children: [{ text: "2 line in paragraph" }]
    },
    {
      type: "paragraph",
      children: [{ text: "3 line in paragraph" }]
    },
    {
      type: "paragraph",
      children: [{ text: "GO" }]
    }
  ]);
  const editor = useMemo(() => withReact(createEditor()), []);

  const [target, setTarget] = useState();
  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState("");

  const renderElement = (props) => {
    const { attributes, children, element } = props;

    return <div {...attributes}>{children}</div>;
  };

  const onKeyDown = useCallback((e) => {}, []);

  const onChange = (value) => {
    setValue(value);

    const { selection } = editor;

    // Don't understand this. Here's from docs
    // Whether the range is collapsed.
    // A range is considered "collapsed" when the
    // anchor point and focus point of the range are the same.
    const isRangeCollapsed = Range.isCollapsed(selection);

    if (isRangeCollapsed) {
      const [start] = Range.edges(selection);
      const wordBefore = Editor.before(editor, start, { unit: "word" });
      const before = wordBefore && Editor.before(editor, wordBefore);
      const beforeRange = before && Editor.range(editor, before, start);
      const beforeText = beforeRange && Editor.string(editor, beforeRange);
      const beforeMatch = beforeText && beforeText.match(/^@(\w+)$/);

      const after = Editor.after(editor, start);
      // console.log({ after });

      const afterRange = Editor.range(editor, start, after);
      // console.log({ afterRange });

      const afterText = Editor.string(editor, afterRange);
      // console.log({ afterText });

      const afterMatch = afterText.match(/^(\s|$)/);
      console.log({ beforeMatch, afterMatch });

      if (beforeMatch && afterMatch) {
        setTarget(beforeRange);
        setSearch(beforeMatch[1]);
        setIndex(0);
        return;
      }

      setTarget(null);
    }
    // All I understand is that beforeMatch contains info about a word that is f

    /*
      const { selection } = editor;

      if (selection && Range.isCollapsed(selection)) {
        const [start] = Range.edges(selection);
        const wordBefore = Editor.before(editor, start, { unit: "word" });
        const before = wordBefore && Editor.before(editor, wordBefore);
        const beforeRange = before && Editor.range(editor, before, start);
        const beforeText =
          beforeRange && Editor.string(editor, beforeRange);
        const beforeMatch = beforeText && beforeText.match(/^@(\w+)$/);
        const after = Editor.after(editor, start);
        const afterRange = Editor.range(editor, start, after);
        const afterText = Editor.string(editor, afterRange);
        const afterMatch = afterText.match(/^(\s|$)/);

        if (beforeMatch && afterMatch) {
          setTarget(beforeRange);
          setSearch(beforeMatch[1]);
          setIndex(0);
          return;
        }
      }

      setTarget(null);
      */
  };

  const isFocused = ReactEditor.isFocused(editor);
  const a = ReactEditor.stat;

  return (
    <div
      style={{
        border: "1px solid green",
        backgroundColor: isFocused ? "blue" : "red"
      }}
    >
      <span>{JSON.stringify({ isFocused, a })}</span>
      <Slate editor={editor} value={value} onChange={onChange}>
        {/*  */}
        <Editable
          autoFocus
          //
          renderElement={renderElement}
          onKeyDown={onKeyDown}
        />

        {target ? <div>opa</div> : null}
      </Slate>
    </div>
  );
};

export default function App() {
  return (
    <div>
      <div>
        <span>Try #1 </span>

        <SlateComponent />

        <br />

        <span>Slate's example</span>

        <MentionExample />
      </div>
    </div>
  );
}
