# Pallisery

A modern, feature-rich note-taking application built with Next.js, TypeScript, and Tailwind CSS. Combine rich text notes with powerful canvas drawing capabilities, organize your content in folders, and enjoy a clean, responsive interface with dark/light mode support.

![Pallisery Welcome Screen](https://github.com/user-attachments/assets/f2a702b0-beb0-4d09-ad22-472caaafc38e)

## ✨ Features

### 📝 Rich Text Editor
- **Full-featured text editor** with formatting toolbar
- **Bold, italic, underline** text styling
- **Lists**: Bulleted and numbered lists
- **Headings**: Multiple heading levels (H1-H3)
- **Quotes and code blocks** for structured content
- **Keyboard shortcuts** (Ctrl+B, Ctrl+I, Ctrl+U, Ctrl+S)
- **Export options**: Save as TXT or HTML files

![Rich Text Editor](https://github.com/user-attachments/assets/8d196ff2-c92f-4129-b6a9-790181ed0a38)

### 🎨 Canvas Drawing
- **Excalidraw integration** for sketching and drawing
- **Drawing tools**: Pen, shapes, arrows, text
- **Export capabilities**: PNG and SVG formats (planned)
- **Collaborative-style** interface with smooth interactions

### 📁 Organization
- **Folder system** for organizing notes
- **Search functionality** across all notes and content
- **Drag-and-drop** note management (visual organization)
- **Note types**: Text notes and Canvas notes

![Folder Organization](https://github.com/user-attachments/assets/598511a0-5686-412d-8224-f45b232159f1)

### 🎨 Modern Interface
- **Dark/Light mode** toggle with system preference detection
- **Responsive design** that works on all screen sizes
- **Clean, minimalist** aesthetic
- **Smooth animations** and hover effects
- **Collapsible sidebar** for focused writing

![Dark Mode](https://github.com/user-attachments/assets/bb0c3a09-d169-480e-9030-cebee400bdb3)

### 💾 Data Persistence
- **localStorage** for client-side persistence
- **Auto-save** functionality with unsaved changes indicator
- **Real-time updates** across the application
- **Export capabilities** for backup and sharing

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ayush-jsrt/Pallisery.git
   cd Pallisery
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## 📖 Usage Guide

### Creating Notes
1. **Text Note**: Click the "Note" button to create a rich text note
2. **Canvas Note**: Click the "Canvas" button to create a drawing canvas
3. **In Folders**: Expand a folder and use the mini create buttons

### Text Editor Features
- Use the **formatting toolbar** for styling options
- **Keyboard shortcuts**:
  - `Ctrl+S` / `Cmd+S`: Save note
  - `Ctrl+B` / `Cmd+B`: Bold text
  - `Ctrl+I` / `Cmd+I`: Italic text
  - `Ctrl+U` / `Cmd+U`: Underline text
- **Export**: Use TXT or HTML export buttons in the toolbar

### Organization
- **Create folders**: Click "New Folder" and enter a name
- **Search**: Use the search bar to find notes by title or content
- **Delete notes**: Hover over a note and click the trash icon

### Interface
- **Theme toggle**: Click the sun/moon icon to switch themes
- **Sidebar**: Click the X to collapse, menu icon to expand
- **Auto-save**: Notes are saved automatically as you type

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Canvas**: Excalidraw for drawing functionality
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **State Management**: React Hooks + Context
- **Storage**: Browser localStorage

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles and Tailwind imports
│   ├── layout.tsx           # Root layout component
│   ├── page.tsx             # Main page with dynamic imports
│   └── app-content.tsx      # Main application logic
├── components/
│   ├── sidebar.tsx          # Navigation sidebar component
│   ├── note-editor.tsx      # Rich text editor component
│   ├── canvas-editor.tsx    # Canvas drawing component
│   └── theme-provider.tsx   # Dark/light theme context
├── hooks/
│   └── use-notes.ts         # Custom hook for note management
└── types/
    └── note.ts              # TypeScript type definitions
```

## 🎯 Key Features Explained

### Rich Text Editing
The text editor uses `contentEditable` with `execCommand` for formatting, providing a familiar word-processor experience with real-time formatting preview.

### Canvas Integration
Excalidraw is dynamically imported to avoid SSR issues, providing a full-featured drawing experience with tools for sketching, shapes, and annotations.

### Data Persistence
Notes are automatically saved to localStorage with proper serialization/deserialization of dates and complex data structures.

### Theme System
A React Context provider manages theme state with localStorage persistence and system preference detection.

## 🔧 Configuration

The application works out of the box with no additional configuration needed. All data is stored locally in the browser.

### Environment Variables
No environment variables are required for basic functionality.

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload the 'out' directory to Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- **Excalidraw** for the excellent canvas drawing library
- **Lucide** for the beautiful icon set
- **Tailwind CSS** for the utility-first CSS framework
- **Next.js** team for the amazing React framework