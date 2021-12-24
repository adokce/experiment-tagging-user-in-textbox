// Goal:
// Make a textbox/textarea in which you can tag (@Name) people
// After submitting the text, have an option to highlight the tag and click on it

import { useMemo, useState } from "react";
import { createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";
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

  console.log({ value });
  return (
    <div
      style={{
        border: "1px solid green"
      }}
    >
      <Slate editor={editor} value={value} onChange={setValue}>
        {/*  */}
        <Editable />
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
