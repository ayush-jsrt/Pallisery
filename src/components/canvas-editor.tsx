'use client'

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Save, Download, RefreshCw } from 'lucide-react'
import { Note } from '@/types/note'
import toast from 'react-hot-toast'

// Dynamically import Excalidraw to avoid SSR issues
const Excalidraw = dynamic(
  async () => (await import('@excalidraw/excalidraw')).Excalidraw,
  { 
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-full">Loading canvas...</div>
  }
)

interface CanvasEditorProps {
  note: Note
  onUpdate: (note: Note) => void
}

export function CanvasEditor({ note, onUpdate }: CanvasEditorProps) {
  const [title, setTitle] = useState(note.title)
  const [elements, setElements] = useState<any[]>([])
  const [appState, setAppState] = useState<any>({})
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const excalidrawRef = useRef<any>(null)

  useEffect(() => {
    setTitle(note.title)
    try {
      if (note.content) {
        const parsedContent = JSON.parse(note.content)
        if (parsedContent.elements) {
          setElements(parsedContent.elements)
        }
        if (parsedContent.appState) {
          setAppState(parsedContent.appState)
        }
      }
    } catch (error) {
      console.error('Error parsing canvas content:', error)
      setElements([])
      setAppState({})
    }
    setHasUnsavedChanges(false)
  }, [note])

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
    setHasUnsavedChanges(true)
  }

  const handleChange = (
    elements: readonly any[],
    appState: any,
    files: any
  ) => {
    setElements([...elements])
    setAppState(appState)
    setHasUnsavedChanges(true)
  }

  const handleSave = () => {
    const canvasData = {
      elements,
      appState,
    }

    const updatedNote: Note = {
      ...note,
      title: title || 'Untitled Canvas',
      content: JSON.stringify(canvasData),
    }

    onUpdate(updatedNote)
    setHasUnsavedChanges(false)
    toast.success('Canvas saved!')
  }

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear the canvas?')) {
      setElements([])
      setHasUnsavedChanges(true)
      toast.success('Canvas cleared!')
    }
  }

  const exportAsImage = async () => {
    toast.error('Export functionality will be available in a future update')
  }

  const exportAsSVG = async () => {
    toast.error('Export functionality will be available in a future update')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault()
      handleSave()
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900" onKeyDown={handleKeyDown}>
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="text-2xl font-bold bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400 flex-1"
            placeholder="Untitled Canvas"
          />
          <div className="flex items-center gap-2">
            {hasUnsavedChanges && (
              <span className="text-sm text-amber-600 dark:text-amber-400">
                Unsaved changes
              </span>
            )}
            <button
              onClick={handleClear}
              className="flex items-center gap-2 px-3 py-2 border border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Clear
            </button>
            <button
              onClick={exportAsImage}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              PNG
            </button>
            <button
              onClick={exportAsSVG}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              SVG
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1">
        <Excalidraw
          initialData={{
            elements,
            appState: {
              theme: 'light',
              viewBackgroundColor: '#ffffff',
              currentItemBackgroundColor: 'transparent',
              currentItemFillStyle: 'hachure',
              currentItemStrokeWidth: 1,
              currentItemStrokeStyle: 'solid',
              currentItemRoughness: 1,
              currentItemOpacity: 100,
              currentItemFontFamily: 1,
              currentItemFontSize: 20,
              currentItemTextAlign: 'left',
              currentItemStartArrowhead: null,
              currentItemEndArrowhead: 'arrow',
              scrollX: 0,
              scrollY: 0,
              zoom: {
                value: 1,
              },
              ...appState,
            },
          }}
          onChange={handleChange}
          UIOptions={{
            canvasActions: {
              loadScene: false,
              export: false,
              toggleTheme: false,
            },
          }}
        />
      </div>
    </div>
  )
}