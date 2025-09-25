'use client'

import { useState, useEffect } from 'react'
import { Note, Folder, NoteType } from '@/types/note'

const STORAGE_KEYS = {
  NOTES: 'pallisery_notes',
  FOLDERS: 'pallisery_folders',
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [folders, setFolders] = useState<Folder[]>([])

  // Load data from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    const savedNotes = localStorage.getItem(STORAGE_KEYS.NOTES)
    const savedFolders = localStorage.getItem(STORAGE_KEYS.FOLDERS)

    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes)
        setNotes(parsedNotes.map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt),
        })))
      } catch (error) {
        console.error('Error loading notes:', error)
      }
    }

    if (savedFolders) {
      try {
        const parsedFolders = JSON.parse(savedFolders)
        setFolders(parsedFolders.map((folder: any) => ({
          ...folder,
          createdAt: new Date(folder.createdAt),
        })))
      } catch (error) {
        console.error('Error loading folders:', error)
      }
    }
  }, [])

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes))
    }
  }, [notes])

  // Save folders to localStorage whenever folders change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders))
    }
  }, [folders])

  const createNote = (type: NoteType, folderId?: string): Note => {
    const newNote: Note = {
      id: generateId(),
      title: `${type === 'text' ? 'New Note' : 'New Canvas'}`,
      content: type === 'text' ? '' : JSON.stringify([]),
      type,
      folderId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setNotes(prev => [newNote, ...prev])
    return newNote
  }

  const updateNote = (updatedNote: Note) => {
    setNotes(prev =>
      prev.map(note =>
        note.id === updatedNote.id
          ? { ...updatedNote, updatedAt: new Date() }
          : note
      )
    )
  }

  const deleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId))
  }

  const createFolder = (name: string, color?: string): Folder => {
    const newFolder: Folder = {
      id: generateId(),
      name,
      color,
      createdAt: new Date(),
    }

    setFolders(prev => [newFolder, ...prev])
    return newFolder
  }

  return {
    notes,
    folders,
    createNote,
    updateNote,
    deleteNote,
    createFolder,
  }
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}