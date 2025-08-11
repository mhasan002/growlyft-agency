import { useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
}

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Write your content here...",
  height = "300px"
}: RichTextEditorProps) {
  const quillRef = useRef<ReactQuill>(null);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    }
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet', 'indent',
    'align',
    'blockquote', 'code-block',
    'link', 'image', 'video'
  ];

  // Custom styles for the editor
  const editorStyle = {
    height: height,
    marginBottom: '20px'
  };

  const quillStyle = {
    '& .ql-editor': {
      minHeight: height,
      fontSize: '14px',
      lineHeight: '1.6',
    },
    '& .ql-toolbar': {
      border: '1px solid #e2e8f0',
      borderTopLeftRadius: '6px',
      borderTopRightRadius: '6px',
    },
    '& .ql-container': {
      border: '1px solid #e2e8f0',
      borderTop: 'none',
      borderBottomLeftRadius: '6px',
      borderBottomRightRadius: '6px',
      fontSize: '14px',
    },
    '& .ql-editor.ql-blank::before': {
      color: '#94a3b8',
      fontStyle: 'normal',
    }
  };

  return (
    <div style={editorStyle}>
      <style>
        {`
          .ql-editor {
            min-height: ${height};
            font-size: 14px;
            line-height: 1.6;
          }
          .ql-toolbar {
            border: 1px solid #e2e8f0;
            border-top-left-radius: 6px;
            border-top-right-radius: 6px;
          }
          .ql-container {
            border: 1px solid #e2e8f0;
            border-top: none;
            border-bottom-left-radius: 6px;
            border-bottom-right-radius: 6px;
            font-size: 14px;
          }
          .ql-editor.ql-blank::before {
            color: #94a3b8;
            font-style: normal;
          }
          .ql-toolbar .ql-formats {
            margin-right: 8px;
          }
          .ql-toolbar .ql-picker-label {
            border: none;
          }
          .ql-toolbar .ql-picker-options {
            max-height: 200px;
            overflow-y: auto;
          }
        `}
      </style>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
}