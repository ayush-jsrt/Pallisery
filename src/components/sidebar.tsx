'use client'

import { useState, useEffect } from 'react'
import { 
  PlusCircle, 
  FileText, 
  Brush, 
  Folder, 
  FolderOpen,
  Search,
  Menu,
  X,
  Sun,
  Moon,
  Trash2,
  MoreHorizontal
} from 'lucide-react'
import { Note, Folder as FolderType, NoteType } from '@/types/note'
import { useTheme } from './theme-provider'
import toast from 'react-hot-toast'

interface SidebarProps {
  notes: Note[]
  folders: FolderType[]
  selectedNote: Note | null
  onSelectNote: (note: Note) => void
  onCreateNote: (type: NoteType, folderId?: string) => void
  onDeleteNote: (noteId: string) => void
  onCreateFolder: (name: string, color?: string) => FolderType
  isOpen: boolean
  onToggle: () => void
}

export function Sidebar({
  notes,
  folders,
  selectedNote,
  onSelectNote,
  onCreateNote,
  onDeleteNote,
  onCreateFolder,
  isOpen,
  onToggle
}: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [showNewFolderInput, setShowNewFolderInput] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId)
    } else {
      newExpanded.add(folderId)
    }
    setExpandedFolders(newExpanded)
  }

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim())
      setNewFolderName('')
      setShowNewFolderInput(false)
      toast.success('Folder created!')
    }
  }

  const handleDeleteNote = (e: React.MouseEvent, noteId: string) => {
    e.stopPropagation()
    onDeleteNote(noteId)
    toast.success('Note deleted!')
  }

  const getNotesInFolder = (folderId: string | undefined) => {
    return filteredNotes.filter(note => note.folderId === folderId)
  }

  const renderNoteItem = (note: Note) => (
    <div
      key={note.id}
      className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
        selectedNote?.id === note.id
          ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
      onClick={() => onSelectNote(note)}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {note.type === 'text' ? (
          <FileText className="w-4 h-4 flex-shrink-0" />
        ) : (
          <Brush className="w-4 h-4 flex-shrink-0" />
        )}
        <div className="min-w-0 flex-1">
          <div className="font-medium text-sm truncate">{note.title}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {note.updatedAt.toLocaleDateString()}
          </div>
        </div>
      </div>
      <button
        onClick={(e) => handleDeleteNote(e, note.id)}
        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 transition-opacity"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  )

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>
    )
  }

  return (
    <div className="w-80 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Pallisery
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {mounted && theme === 'light' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={onToggle}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Create buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onCreateNote('text')}
            className="flex-1 flex items-center justify-center gap-2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span className="text-sm">Note</span>
          </button>
          <button
            onClick={() => onCreateNote('canvas')}
            className="flex-1 flex items-center justify-center gap-2 p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <Brush className="w-4 h-4" />
            <span className="text-sm">Canvas</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Create Folder */}
        <div className="mb-4">
          {showNewFolderInput ? (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Folder name..."
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <button
                onClick={handleCreateFolder}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                ✓
              </button>
              <button
                onClick={() => {
                  setShowNewFolderInput(false)
                  setNewFolderName('')
                }}
                className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowNewFolderInput(true)}
              className="flex items-center gap-2 w-full p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="text-sm">New Folder</span>
            </button>
          )}
        </div>

        {/* Uncategorized Notes */}
        <div className="space-y-2 mb-6">
          {getNotesInFolder(undefined).map(renderNoteItem)}
        </div>

        {/* Folders */}
        {folders.map(folder => (
          <div key={folder.id} className="mb-4">
            <button
              onClick={() => toggleFolder(folder.id)}
              className="flex items-center gap-2 w-full p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {expandedFolders.has(folder.id) ? (
                <FolderOpen className="w-4 h-4" />
              ) : (
                <Folder className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">{folder.name}</span>
              <span className="ml-auto text-xs text-gray-400">
                {getNotesInFolder(folder.id).length}
              </span>
            </button>
            {expandedFolders.has(folder.id) && (
              <div className="ml-6 mt-2 space-y-2">
                {getNotesInFolder(folder.id).map(renderNoteItem)}
                <div className="flex gap-1">
                  <button
                    onClick={() => onCreateNote('text', folder.id)}
                    className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded transition-colors"
                  >
                    <FileText className="w-3 h-3" />
                    Note
                  </button>
                  <button
                    onClick={() => onCreateNote('canvas', folder.id)}
                    className="flex items-center gap-1 px-2 py-1 text-xs text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900 rounded transition-colors"
                  >
                    <Brush className="w-3 h-3" />
                    Canvas
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}