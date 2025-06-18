import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  const [currentNote, setCurrentNote] = useState({ title: '', content: '', color: '#f9fafb' });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const saveNote = () => {
    if (!currentNote.title.trim()) return;

    if (isEditing) {
      setNotes(notes.map(note => note.id === currentNote.id ? currentNote : note));
      setIsEditing(false);
    } else {
      const newNote = {
        ...currentNote,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      setNotes([newNote, ...notes]);
    }
    setCurrentNote({ title: '', content: '', color: '#f9fafb' });
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const editNote = (note) => {
    setCurrentNote(note);
    setIsEditing(true);
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow-sm">Sticky Notes</h1>
        
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search notes..."
              className="w-full p-3 pl-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Note Editor */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-10 border border-gray-100">
          <input
            type="text"
            placeholder="Note Title"
            className="w-full p-2 mb-3 text-xl font-semibold border-b border-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
            value={currentNote.title}
            onChange={(e) => setCurrentNote({...currentNote, title: e.target.value})}
          />
          <textarea
            placeholder="Note Content"
            className="w-full p-2 min-h-[120px] focus:outline-none resize-y mt-2 text-gray-700"
            value={currentNote.content}
            onChange={(e) => setCurrentNote({...currentNote, content: e.target.value})}
          ></textarea>
          <div className="flex justify-between items-center mt-4">
            <div className="flex space-x-3">
              {['#f9fafb', '#fef3c7', '#dcfce7', '#dbeafe', '#f3e8ff', '#fee2e2'].map(color => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full shadow-sm transition-transform hover:scale-110 ${currentNote.color === color ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setCurrentNote({...currentNote, color})}
                  title="Select color"
                ></button>
              ))}
            </div>
            <button
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition shadow-md font-medium"
              onClick={saveNote}
            >
              {isEditing ? 'Update' : 'Add'} Note
            </button>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.length === 0 ? (
            <div className="col-span-full text-center py-16 text-gray-500 bg-white bg-opacity-50 rounded-xl shadow-sm border border-gray-100">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <p className="text-lg">{searchTerm ? 'No notes match your search' : 'No notes yet. Create your first note!'}</p>
            </div>
          ) : (
            filteredNotes.map(note => (
              <div 
                key={note.id} 
                className="rounded-lg shadow-lg p-5 break-words hover:shadow-xl transition-shadow border border-gray-100" 
                style={{ backgroundColor: note.color }}
              >
                <h3 className="text-xl font-semibold mb-3 border-b pb-2">{note.title}</h3>
                <p className="whitespace-pre-wrap mb-4 text-gray-700">{note.content}</p>
                <div className="flex justify-between items-center text-sm text-gray-600 pt-2 border-t">
                  <span className="italic">{new Date(note.createdAt).toLocaleDateString()}</span>
                  <div className="flex space-x-3">
                    <button 
                      className="px-2 py-1 hover:text-blue-600 transition flex items-center"
                      onClick={() => editNote(note)}
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                      Edit
                    </button>
                    <button 
                      className="px-2 py-1 hover:text-red-600 transition flex items-center"
                      onClick={() => deleteNote(note.id)}
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
