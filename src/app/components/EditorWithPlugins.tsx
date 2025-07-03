import React, { forwardRef } from "react";
import { Editor } from "@toast-ui/react-editor";
import colorSyntax from "@toast-ui/editor-plugin-color-syntax";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";

interface EditorWithPluginsProps {
  initialValue: string;
  previewStyle: "tab" | "vertical";
  height: string;
  initialEditType: "markdown" | "wysiwyg";
  useCommandShortcut: boolean;
  toolbarItems: any[];
  className?: string;
}

const EditorWithPlugins = forwardRef<Editor, EditorWithPluginsProps>(
  (props, ref) => {
    return (
      <Editor
        {...props}
        ref={ref}
        plugins={[[colorSyntax, { preset: ['#FFFFFF'] }]]}
      />
    );
  }
);

EditorWithPlugins.displayName = "EditorWithPlugins";

export default EditorWithPlugins;