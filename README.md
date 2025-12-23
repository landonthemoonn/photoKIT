<div align="center">
  <img src="./public/images/photokit-logo.svg" alt="PhotoKIT Logo" width="300" />
  <h1>PhotoKIT</h1>
  <p><strong>Professional Digital Asset Management System</strong></p>
  <p>A modern, sleek DAM solution for photographers and creative teams</p>
</div>

---

## Features

- **Smart Asset Organization** - Upload, tag, categorize, and search your photos with ease
- **Bulk Operations** - Edit metadata for multiple photos at once
- **Advanced Filtering** - Search by title, tags, photographer, category, and more
- **Dark Mode** - Beautiful light and dark themes
- **Modern UI** - Clean, responsive interface with smooth animations
- **Export Tools** - Export your catalog to CSV for external analysis
- **User Management** - Multi-user support with role-based access

## Tech Stack

- **React 19** - Latest React with modern hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast development and builds
- **Tailwind CSS** - Utility-first styling
- **React Easy Crop** - Advanced image cropping

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd photoKIT
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
photoKIT/
├── components/          # React components
│   ├── PhotoCard.tsx   # Individual photo card
│   ├── Sidebar.tsx     # Filter sidebar
│   ├── UploadModal.tsx # Photo upload interface
│   ├── DetailModal.tsx # Photo detail view
│   └── BulkEditModal.tsx
├── services/           # Business logic
│   └── mockService.ts  # Mock data service
├── public/             # Static assets
│   └── images/         # Logo and branding
├── App.tsx             # Main application
├── types.ts            # TypeScript definitions
└── index.html          # Entry point
```

## Usage

1. **Upload Photos** - Click the "Upload" button to add new photos
2. **Browse & Search** - Use the search bar and filters to find photos
3. **View Details** - Click any photo to see full details and metadata
4. **Bulk Edit** - Enter selection mode to edit multiple photos at once
5. **Export Data** - Export your entire catalog to CSV

## Customization

The app uses custom Tailwind colors defined in `index.html`:
- `pk-orange`: #FF8833 - Primary brand color
- `pk-black`: #050505 - Dark text and UI elements
- `pk-panel`: #F5F5F5 - Light panel backgrounds

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.
