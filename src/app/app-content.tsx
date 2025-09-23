'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/sidebar'
import { NoteEditor } from '@/components/note-editor'
import { CanvasEditor } from '@/components/canvas-editor'
import { useNotes } from '@/hooks/use-notes'
import { Note, NoteType } from '@/types/note'

export default function AppContent() {
  const { notes, folders, createNote, updateNote, deleteNote, createFolder } = useNotes()
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    if (notes.length > 0 && !selectedNote) {
      setSelectedNote(notes[0])
    }
  }, [notes, selectedNote])

  const handleCreateNote = (type: NoteType, folderId?: string) => {
    const note = createNote(type, folderId)
    setSelectedNote(note)
  }

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note)
  }

  const handleUpdateNote = (note: Note) => {
    updateNote(note)
    setSelectedNote(note)
  }

  const handleDeleteNote = (noteId: string) => {
    deleteNote(noteId)
    if (selectedNote?.id === noteId) {
      setSelectedNote(notes.length > 1 ? notes.find(n => n.id !== noteId) || null : null)
    }
  }

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      <Sidebar
        notes={notes}
        folders={folders}
        selectedNote={selectedNote}
        onSelectNote={handleSelectNote}
        onCreateNote={handleCreateNote}
        onDeleteNote={handleDeleteNote}
        onCreateFolder={createFolder}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <main className="flex-1 flex overflow-hidden">
        {selectedNote ? (
          selectedNote.type === 'text' ? (
            <NoteEditor
              note={selectedNote}
              onUpdate={handleUpdateNote}
            />
          ) : (
            <CanvasEditor
              note={selectedNote}
              onUpdate={handleUpdateNote}
            />
          )
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                Welcome to Pallisery
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Create a note to get started
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}