'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote, 
  Code,
  Save,
  Download
} from 'lucide-react'
import { Note } from '@/types/note'
import toast from 'react-hot-toast'

interface NoteEditorProps {
  note: Note
  onUpdate: (note: Note) => void
}

export function NoteEditor({ note, onUpdate }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setTitle(note.title)
    setContent(note.content)
    setHasUnsavedChanges(false)
  }, [note])

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
    setHasUnsavedChanges(true)
  }

  const handleContentChange = () => {
    if (contentRef.current) {
      const newContent = contentRef.current.innerHTML
      setContent(newContent)
      setHasUnsavedChanges(true)
    }
  }

  const handleSave = () => {
    const updatedNote: Note = {
      ...note,
      title: title || 'Untitled Note',
      content,
    }
    onUpdate(updatedNote)
    setHasUnsavedChanges(false)
    toast.success('Note saved!')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 's':
          e.preventDefault()
          handleSave()
          break
        case 'b':
          e.preventDefault()
          execCommand('bold')
          break
        case 'i':
          e.preventDefault()
          execCommand('italic')
          break
        case 'u':
          e.preventDefault()
          execCommand('underline')
          break
      }
    }
  }

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    contentRef.current?.focus()
    handleContentChange()
  }

  const exportAsText = () => {
    const element = document.createElement('a')
    const file = new Blob([contentRef.current?.textContent || ''], {
      type: 'text/plain'
    })
    element.href = URL.createObjectURL(file)
    element.download = `${title || 'note'}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    toast.success('Note exported!')
  }

  const exportAsHTML = () => {
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>${title}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { color: #333; }
    </style>
</head>
<body>
    <h1>${title}</h1>
    ${content}
</body>
</html>`

    const element = document.createElement('a')
    const file = new Blob([htmlContent], { type: 'text/html' })
    element.href = URL.createObjectURL(file)
    element.download = `${title || 'note'}.html`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    toast.success('Note exported as HTML!')
  }

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
      {/* Toolbar */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="text-2xl font-bold bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400 flex-1"
            placeholder="Untitled Note"
            onKeyDown={handleKeyDown}
          />
          <div className="flex items-center gap-2">
            {hasUnsavedChanges && (
              <span className="text-sm text-amber-600 dark:text-amber-400">
                Unsaved changes
              </span>
            )}
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>

        {/* Formatting Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => execCommand('bold')}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => execCommand('italic')}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => execCommand('underline')}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Underline (Ctrl+U)"
          >
            <Underline className="w-4 h-4" />
          </button>
          
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />
          
          <button
            onClick={() => execCommand('insertUnorderedList')}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => execCommand('insertOrderedList')}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            onClick={() => execCommand('formatBlock', 'blockquote')}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Quote"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            onClick={() => execCommand('formatBlock', 'pre')}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Code Block"
          >
            <Code className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />

          <select
            onChange={(e) => execCommand('formatBlock', e.target.value)}
            className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="p">Paragraph</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
          </select>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={exportAsText}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              TXT
            </button>
            <button
              onClick={exportAsHTML}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              HTML
            </button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div
          ref={contentRef}
          contentEditable
          suppressContentEditableWarning
          className="min-h-full outline-none text-gray-900 dark:text-white prose prose-gray dark:prose-invert max-w-none"
          style={{
            lineHeight: '1.6',
            fontSize: '16px',
          }}
          dangerouslySetInnerHTML={{ __html: content }}
          onInput={handleContentChange}
          onKeyDown={handleKeyDown}
          data-placeholder="Start writing your note..."
        />
      </div>
    </div>
  )
}