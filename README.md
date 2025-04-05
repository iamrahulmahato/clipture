# Clipture

<div align="center">
  <img alt="Clipture" height="80" src="./favicon.svg">
  <h1>Clipture</h1>
  <p>A modern, minimalist clipboard sharing application that lets you share text snippets instantly.</p>

  [![Made with Firebase](https://img.shields.io/badge/Made%20with-Firebase-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com/)
  [![Built with Vite](https://img.shields.io/badge/Built%20with-Vite-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
  [![Styled with Tailwind](https://img.shields.io/badge/Styled%20with-Tailwind-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
  <br/>
</div>

## 🚀 Features

- 📝 Instant text sharing
- 🔗 Automatic URL detection and linking
- 📋 One-click copy functionality
- 🗑️ Easy deletion of snippets
- ⚡ Real-time updates
- 🎨 Clean, minimalist interface

## 🛠️ Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/iamrahulmahato/clipture.git
   cd clipture
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Fill in your Firebase configuration in `.env`
   - For Vercel deployment, add these environment variables in your Vercel project settings

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

### Firebase Configuration

1. Create a new Firebase project
2. Enable Firestore Database
3. Update the `.env` file with your Firebase configuration
4. For Vercel deployment, add the same environment variables in your Vercel project settings

## 🛠️ Built With

- [Firebase](https://firebase.google.com/) - Backend and database
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Vite](https://vitejs.dev/) - Build tool
- [jQuery](https://jquery.com/) - DOM manipulation

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Feel free to submit a Pull Request.

## 🙏 Acknowledgments

Created with ❤️ by [Rahul Mahato](http://rahulmahato.vercel.app)
