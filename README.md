# EmotionSense: Emotion Recognition Web App

## About This Project

EmotionSense is a real-time emotion recognition application that uses your camera to detect and analyze facial expressions. Built with modern web technologies, it processes everything directly in your browser, ensuring your data remains private and is never sent to external servers.

## 🚀 Features

- Real-time facial emotion detection
- Privacy-focused (all processing done in-browser)
- Detects six primary emotions: Joy, Sadness, Anger, Fear, Surprise, and Neutral
- Clean, modern UI with responsive design
- Visual feedback with facial landmarks
- Emotion history tracking

## 🛠️ Technologies Used

This project is built with:

- **React** - Frontend library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast development environment
- **face-api.js** - Face detection and emotion recognition
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Accessible and customizable component library

## 📋 How to Run the Project

### Prerequisites
- Node.js (v14 or later recommended)
- npm or yarn

### Installation

```sh
# Clone the repository
git clone https://github.com/kaaboura12/vibe-catcher.git

# Navigate to the project directory
cd vibe-catcher

# Install dependencies
npm install
# or
yarn install

# Start the development server
npm run dev
# or
yarn dev
```

The application will be available at http://localhost:8080 (or another port if 8080 is in use).

## 📷 Camera Access

EmotionSense requires camera access to function. When prompted:

1. Allow camera access in your browser
2. Position your face in view of the camera
3. The app will automatically begin detecting and analyzing your emotions

## 🧠 How It Works

EmotionSense uses face-api.js, a JavaScript implementation of facial recognition models. The detection process:

1. Locates faces in the camera feed
2. Identifies facial landmarks (68 key points)
3. Analyzes facial expressions to determine emotions
4. Provides real-time feedback on detected emotions

## 👨‍💻 Developer

Developed by [Amine Kaaboura](https://github.com/kaaboura12)

GitHub Repository: [https://github.com/kaaboura12/vibe-catcher](https://github.com/kaaboura12/vibe-catcher.git)

## 📄 License

This project is open source and available under the MIT License.
