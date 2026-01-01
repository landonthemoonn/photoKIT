<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/19sdm6IWENIqeBdybDl5Y_Q-fq2gI8OK4

## Run Locally

**Prerequisites:**  Node.js (v18 or higher recommended)

### Quick Start

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <your-repo-url>
   cd photoKIT
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Get your Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Open the `.env.local` file in the project root
   - Replace the empty `GEMINI_API_KEY=` with your actual API key:
     ```
     GEMINI_API_KEY=your_actual_api_key_here
     ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   - Navigate to `http://localhost:3000`
   - The app should now be running locally!

### Available Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Troubleshooting

- **Port 3000 already in use?** The server will try another port automatically
- **API errors?** Make sure your `GEMINI_API_KEY` in `.env.local` is valid
- **Dependencies won't install?** Try removing `node_modules` and `package-lock.json`, then run `npm install` again
