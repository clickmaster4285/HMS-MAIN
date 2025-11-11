import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Heading from '@tiptap/extension-heading';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import ListItem from '@tiptap/extension-list-item';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import { FontSize } from '@tiptap/extension-font-size';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import axios from 'axios';
import { updateRadiologyReport, fetchRadiologyReportById } from '../../features/Radiology/RadiologySlice';

const RadiologySummaryEditor = ({ currentReport, selectedReport, selectedReportIndex, id }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const isRadiology = user.user_Access === 'Radiology';

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [activeFontSize, setActiveFontSize] = useState('16px');
  const [activeColor, setActiveColor] = useState('#000000');
  const [templateContent, setTemplateContent] = useState('');

  // Fetch template content
  const fetchTemplateContent = async (templateName) => {
    try {
      const response = await axios.get(`/api/templates/${templateName}`);
      return (
        response.data ||
        '<h2>Findings</h2><p>No findings available</p><h3>Summary</h3><p>No summary available</p>'
      );
    } catch (error) {
      console.error('Failed to fetch template:', error);
      return '<h2>Findings</h2><p>Template not found</p><h3>Summary</h3><p>Summary not available</p>';
    }
  };

  // Tiptap Editor Configuration
  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Underline,
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Color,
      Heading.configure({ levels: [1, 2, 3] }),
      Paragraph,
      Text,
      BulletList,
      OrderedList,
      ListItem,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      FontSize,
    ],
    content: editedContent,
    onUpdate: ({ editor }) => {
      setEditedContent(editor.getHTML());
      const fontSize = editor.getAttributes('textStyle').fontSize;
      if (fontSize) setActiveFontSize(fontSize);
      const color = editor.getAttributes('textStyle').color;
      if (color) setActiveColor(color);
    },
  });

  // Initialize content
  useEffect(() => {
    if (currentReport && currentReport.templateName) {
      const fetchContent = async () => {
        const templateName = Array.isArray(currentReport.templateName)
          ? currentReport.templateName[selectedReportIndex]
          : currentReport.templateName;
        if (templateName && templateName !== 'N/A') {
          const content = await fetchTemplateContent(templateName);
          setTemplateContent(content);
          const finalContent =
            currentReport.finalContent?.[selectedReportIndex] ||
            currentReport.finalContent ||
            content;
          setEditedContent(finalContent);
          if (editor && !editor.isDestroyed) {
            editor.commands.setContent(finalContent);
          }
        }
      };
      fetchContent();
    }
  }, [currentReport, selectedReportIndex, editor]);

  const handleEditClick = () => {
    setIsEditing(true);
    setTimeout(() => {
      if (editor) editor.commands.focus();
    }, 100);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    const content =
      selectedReport.finalContent ||
      templateContent ||
      '<h2>Findings</h2><p>No findings available</p><h3>Summary</h3><p>No summary available</p>';
    setEditedContent(content);
    if (editor) editor.commands.setContent(content);
    setActiveFontSize('16px');
    setActiveColor('#000000');
  };

  const handleSaveClick = async () => {
    if (!editedContent.trim()) return;

    setIsSaving(true);
    try {
      if (Array.isArray(currentReport.finalContent)) {
        const updatedFinalContent = [...currentReport.finalContent];
        updatedFinalContent[selectedReportIndex] = editedContent;
        await dispatch(
          updateRadiologyReport({
            id: currentReport._id,
            reportData: { finalContent: updatedFinalContent },
          })
        ).unwrap();
      } else {
        await dispatch(
          updateRadiologyReport({
            id: currentReport._id,
            reportData: { finalContent: editedContent },
          })
        ).unwrap();
      }
      dispatch(fetchRadiologyReportById(id));
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save report:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFontSizeChange = (size) => {
    const newSize = `${size}px`;
    setActiveFontSize(newSize);
    if (editor) {
      editor.chain().focus().setFontSize(newSize).run();
    }
  };

  const handleColorChange = (color) => {
    setActiveColor(color);
    if (editor) {
      editor.chain().focus().setColor(color).run();
    }
  };

  const toggleHighlight = (color = '#fffbeb') => {
    if (editor) {
      editor.chain().focus().toggleHighlight({ color }).run();
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-teal-700 flex items-center">
          <svg
            className="w-6 h-6 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Findings
        </h2>
        {!isEditing ? (
          isRadiology && (
            <button
              onClick={handleEditClick}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-all duration-200 shadow-md flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit Report
            </button>
          )
        ) : (
          <div className="space-x-3 flex">
            <button
              onClick={handleSaveClick}
              disabled={isSaving}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-all duration-200 disabled:opacity-50 shadow-md flex items-center"
            >
              {isSaving ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
            <button
              onClick={handleCancelClick}
              disabled={isSaving}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all duration-200 disabled:opacity-50 shadow-md flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Cancel
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="border rounded-2xl overflow-hidden shadow-lg transition-all duration-300">
          {/* Editor Toolbar */}
          <div className="flex flex-wrap gap-2 p-3 bg-gray-100 border-b border-gray-200">
            {/* Text Formatting */}
            <div className="flex items-center space-x-1 bg-gray-200 rounded-lg p-1">
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 rounded-md ${
                  editor?.isActive('bold')
                    ? 'bg-teal-100 text-teal-700'
                    : 'hover:bg-gray-300'
                }`}
                title="Bold"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z" />
                </svg>
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 rounded-md ${
                  editor?.isActive('italic')
                    ? 'bg-teal-100 text-teal-700'
                    : 'hover:bg-gray-300'
                }`}
                title="Italic"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4h-8z" />
                </svg>
              </button>
              <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-2 rounded-md ${
                  editor?.isActive('underline')
                    ? 'bg-teal-100 text-teal-700'
                    : 'hover:bg-gray-300'
                }`}
                title="Underline"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z" />
                </svg>
              </button>
            </div>

            {/* Headings */}
            <div className="flex items-center space-x-1 bg-gray-200 rounded-lg p-1">
              <button
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
                className={`p-2 rounded-md ${
                  editor?.isActive('heading', { level: 1 })
                    ? 'bg-teal-100 text-teal-700'
                    : 'hover:bg-gray-300'
                }`}
                title="Heading 1"
              >
                H1
              </button>
              <button
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className={`p-2 rounded-md ${
                  editor?.isActive('heading', { level: 2 })
                    ? 'bg-teal-100 text-teal-700'
                    : 'hover:bg-gray-300'
                }`}
                title="Heading 2"
              >
                H2
              </button>
              <button
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                className={`p-2 rounded-md ${
                  editor?.isActive('heading', { level: 3 })
                    ? 'bg-teal-100 text-teal-700'
                    : 'hover:bg-gray-300'
                }`}
                title="Heading 3"
              >
                H3
              </button>
              <button
                onClick={() => editor.chain().focus().setParagraph().run()}
                className={`p-2 rounded-md ${
                  editor?.isActive('paragraph')
                    ? 'bg-teal-100 text-teal-700'
                    : 'hover:bg-gray-300'
                }`}
                title="Paragraph"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 16h2V8H9v8zm3 0h2V8h-2v8zm3 0h2V8h-2v8zM6 4v3h12V4H6z" />
                </svg>
              </button>
            </div>

            {/* Font Size */}
            <div className="flex items-center space-x-1 bg-gray-200 rounded-lg p-1">
              <button
                onClick={() =>
                  handleFontSizeChange(parseInt(activeFontSize) - 2)
                }
                disabled={parseInt(activeFontSize) <= 8}
                className="p-2 rounded-md hover:bg-gray-300 disabled:opacity-50"
                title="Decrease Font Size"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 13H5v-2h14v2z" />
                </svg>
              </button>
              <span className="text-sm px-2">{activeFontSize}</span>
              <button
                onClick={() =>
                  handleFontSizeChange(parseInt(activeFontSize) + 2)
                }
                disabled={parseInt(activeFontSize) >= 36}
                className="p-2 rounded-md hover:bg-gray-300 disabled:opacity-50"
                title="Increase Font Size"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </svg>
              </button>
            </div>

            {/* Text Color */}
            <div className="flex items-center space-x-1 bg-gray-200 rounded-lg p-1">
              <input
                type="color"
                value={activeColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-8 h-8 cursor-pointer border-none bg-transparent"
                title="Text Color"
              />
              <button
                onClick={() => handleColorChange('#000000')}
                className="p-2 rounded-md hover:bg-gray-300"
                title="Reset Color"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>

            {/* Highlight */}
            <div className="flex items-center space-x-1 bg-gray-200 rounded-lg p-1">
              <button
                onClick={() => toggleHighlight('#fffbeb')}
                className={`p-2 rounded-md ${
                  editor?.isActive('highlight')
                    ? 'bg-teal-100 text-teal-700'
                    : 'hover:bg-gray-300'
                }`}
                title="Highlight"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
            </div>

            {/* Text Alignment */}
            <div className="flex items-center space-x-1 bg-gray-200 rounded-lg p-1">
              <button
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={`p-2 rounded-md ${
                  editor?.isActive('textAlign', { align: 'left' })
                    ? 'bg-teal-100 text-teal-700'
                    : 'hover:bg-gray-300'
                }`}
                title="Align Left"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M15 15H3v-2h12v2zm0-4H3V9h12v2zM3 5v2h18V5H3zm0 12h18v-2H3v2z" />
                </svg>
              </button>
              <button
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={`p-2 rounded-md ${
                  editor?.isActive('textAlign', { align: 'center' })
                    ? 'bg-teal-100 text-teal-700'
                    : 'hover:bg-gray-300'
                }`}
                title="Align Center"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M7 15v-2h10v2H7zm-4-4h18V9H3v2zm0-4h18V5H3v2zm4 8h10v2H7v-2z" />
                </svg>
              </button>
              <button
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={`p-2 rounded-md ${
                  editor?.isActive('textAlign', { align: 'right' })
                    ? 'bg-teal-100 text-teal-700'
                    : 'hover:bg-gray-300'
                }`}
                title="Align Right"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 15h12v-2H9v2zm0-4h12V9H9v2zM3 5v2h18V5H3zm6 12h12v-2H9v2z" />
                </svg>
              </button>
            </div>

            {/* Lists */}
            <div className="flex items-center space-x-1 bg-gray-200 rounded-lg p-1">
              <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded-md ${
                  editor?.isActive('bulletList')
                    ? 'bg-teal-100 text-teal-700'
                    : 'hover:bg-gray-300'
                }`}
                title="Bullet List"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z" />
                </svg>
              </button>
              <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded-md ${
                  editor?.isActive('orderedList')
                    ? 'bg-teal-100 text-teal-700'
                    : 'hover:bg-gray-300'
                }`}
                title="Numbered List"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Editor Content */}
          <EditorContent
            editor={editor}
            className="p-6 min-h-[400px] bg-white text-gray-800 prose max-w-none focus:outline-none"
          />
        </div>
      ) : (
        <div
          className="prose max-w-none text-gray-800 p-6 bg-gray-50 rounded-2xl shadow-inner"
          dangerouslySetInnerHTML={{
            __html:
              selectedReport?.finalContent ||
              '<h2>Findings</h2><p>No findings available</p><h3>Summary</h3><p>No summary available</p>',
          }}
        />
      )}
    </div>
  );
};

export default RadiologySummaryEditor;