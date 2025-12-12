import React, { useState, useEffect } from 'react';
import { StickyNote, Plus, Trash2, Save } from 'lucide-react';
import { AdminNote } from '../types';

const NotesWidget: React.FC = () => {
  const [notes, setNotes] = useState<AdminNote[]>([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('turbo_admin_notes');
    if (saved) {
      setNotes(JSON.parse(saved));
    } else {
        setNotes([{ id: 'init', text: 'System Initialized. Check logs.', timestamp: Date.now(), type: 'info' }]);
    }
  }, []);

  const saveNotes = (updatedNotes: AdminNote[]) => {
    setNotes(updatedNotes);
    localStorage.setItem('turbo_admin_notes', JSON.stringify(updatedNotes));
  };

  const addNote = () => {
    if (!newNote.trim()) return;
    const note: AdminNote = {
      id: Date.now().toString(),
      text: newNote,
      timestamp: Date.now(),
      type: 'info'
    };
    saveNotes([note, ...notes]);
    setNewNote('');
  };

  const deleteNote = (id: string) => {
    saveNotes(notes.filter(n => n.id !== id));
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 backdrop-blur-sm h-full flex flex-col">
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
        <StickyNote className="w-5 h-5 text-yellow-400" />
        Admin Notes
      </h3>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Log entry..."
          onKeyDown={(e) => e.key === 'Enter' && addNote()}
          className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-500"
        />
        <button onClick={addNote} className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg transition-colors">
          <Plus size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
        {notes.map(note => (
          <div key={note.id} className="bg-yellow-900/10 border border-yellow-500/20 p-3 rounded-lg relative group">
            <p className="text-yellow-100/90 text-sm pr-6">{note.text}</p>
            <span className="text-[10px] text-yellow-500/50 block mt-2 font-mono">
              {new Date(note.timestamp).toLocaleString()}
            </span>
            <button 
              onClick={() => deleteNote(note.id)}
              className="absolute top-2 right-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {notes.length === 0 && <div className="text-center text-slate-600 text-xs py-4">No active logs</div>}
      </div>
    </div>
  );
};

export default NotesWidget;
