export type NoteType = 'text' | 'canvas'

export interface Note {
  id: string
  title: string
  content: string
  type: NoteType
  folderId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Folder {
  id: string
  name: string
  color?: string
  createdAt: Date
}