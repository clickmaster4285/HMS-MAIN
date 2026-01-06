import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';

const CreateRadiologyReport = () => {
  const [form, setForm] = useState({
    patientMRNO: '',
    patientName: '',
    age: '',
    sex: '',
    date: new Date().toISOString().slice(0, 10),
  });

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [editId, setEditId] = useState(null);
  const [editorKey, setEditorKey] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right'],
        defaultAlignment: 'left',
      }),
    ],
    content: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setError('');

    try {
      const finalContent = editor?.getHTML() || '';

      if (editId) {
        await axios.put(
          `http://localhost:6000/radiology/update-report/${editId}`,
          {
            ...form,
            finalContent,
          }
        );
        setSuccessMessage('✅ Report updated successfully!');
      } else {
        await axios.post('http://localhost:6000/radiology/create-report', {
          ...form,
          finalContent,
          createdBy: 'doctorId123',
        });
        setSuccessMessage('✅ Report created successfully!');
      }

      setForm({
        patientMRNO: '',
        patientName: '',
        age: '',
        sex: '',
        date: new Date().toISOString().slice(0, 10),
      });
      setEditId(null);
      editor?.commands.setContent('');
      setEditorKey((prev) => prev + 1);
      fetchReports();
    } catch (err) {
      console.error(err);
      setError('❌ Failed to save report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    try {
      const res = await axios.get('http://localhost:6000/radiology/get-report');
      setReports(res.data.data || []);
    } catch (err) {
      console.error('Error fetching reports:', err.message);
      setError('Failed to load reports. Please refresh the page.');
    }
  };

  const handleEdit = (report) => {
    setForm({
      patientMRNO: report.patientMRNO,
      patientName: report.patientName,
      age: report.age,
      sex: report.sex,
      date: new Date(report.date).toISOString().slice(0, 10),
    });
    setEditId(report._id);
    editor?.commands.setContent(report.finalContent);
    setEditorKey((prev) => prev + 1);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await axios.delete(
          `http://localhost:6000/radiology/delete-report/${id}`
        );
        setSuccessMessage('Report deleted successfully');
        fetchReports();
      } catch (err) {
        setError('Failed to delete report', err);
      }
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4">
        {editId ? 'Edit Radiology Report' : 'Create Radiology Report'}
      </h2>

      {successMessage && (
        <div className="p-3 mb-4 text-green-700 bg-green-100 rounded">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="p-3 mb-4 text-red-700 bg-red-100 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">MRNO</label>
            <input
              name="patientMRNO"
              value={form.patientMRNO}
              onChange={handleChange}
              placeholder="Patient MRNO"
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              name="patientName"
              value={form.patientName}
              onChange={handleChange}
              placeholder="Patient Name"
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Age</label>
            <input
              name="age"
              value={form.age}
              onChange={handleChange}
              placeholder="Age"
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sex</label>
            <select
              name="sex"
              value={form.sex}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Report Content:
          </label>
          <RichTextEditor editor={editor} key={editorKey}>
            <RichTextEditor.Toolbar sticky stickyOffset={60}>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Italic />
                <RichTextEditor.Underline />
                <RichTextEditor.Strikethrough />
                <RichTextEditor.Highlight />
                <RichTextEditor.Code />
                <RichTextEditor.ClearFormatting />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.H1 />
                <RichTextEditor.H2 />
                <RichTextEditor.H3 />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.BulletList />
                <RichTextEditor.OrderedList />
                <RichTextEditor.Blockquote />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.AlignLeft />
                <RichTextEditor.AlignCenter />
                <RichTextEditor.AlignRight />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.ColorPicker
                  colors={[
                    '#25262b',
                    '#868e96',
                    '#fa5252',
                    '#228be6',
                    '#40c057',
                    '#fab005',
                  ]}
                />
                <RichTextEditor.UnsetColor />
              </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>

            <RichTextEditor.Content />
          </RichTextEditor>
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary-600 text-white py-2 rounded hover:bg-primary-700 disabled:bg-primary-400"
          >
            {loading ? (
              <span className="flex items-center justify-center">
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
                {editId ? 'Updating...' : 'Saving...'}
              </span>
            ) : editId ? (
              'Update Report'
            ) : (
              'Generate & Save Report'
            )}
          </button>

          {editId && (
            <button
              type="button"
              onClick={() => {
                setEditId(null);
                editor?.commands.setContent('');
                setForm({
                  patientMRNO: '',
                  patientName: '',
                  age: '',
                  sex: '',
                  date: new Date().toISOString().slice(0, 10),
                });
                setEditorKey((prev) => prev + 1);
              }}
              className="flex-1 bg-gray-400 text-white py-2 rounded hover:bg-gray-500"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-3">Saved Reports</h3>
        {reports.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No reports found. Create your first report above.
          </div>
        ) : (
          <div className="space-y-3 max-h-125 overflow-y-auto pr-2">
            {reports.map((report) => (
              <div
                key={report._id}
                className="border rounded p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{report.patientName}</p>
                    <p className="text-sm text-gray-600">
                      MRNO: {report.patientMRNO}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">
                      {new Date(report.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      {report.age} yrs, {report.sex}
                    </p>
                  </div>
                </div>

                <details className="mt-3 group">
                  <summary className="flex items-center cursor-pointer text-primary-600 hover:text-primary-800">
                    <span>View Report</span>
                    <svg
                      className="ml-1 w-4 h-4 group-open:rotate-180 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div
                    className="mt-2 p-3 bg-white border rounded prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: report.finalContent }}
                  />
                </details>

                <div className="mt-3 flex justify-end space-x-2">
                  <button
                    onClick={() => handleEdit(report)}
                    className="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded hover:bg-primary-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(report._id)}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateRadiologyReport;
