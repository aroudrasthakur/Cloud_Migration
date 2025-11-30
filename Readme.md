# MavPrep - Intelligent Exam Preparation & Collaboration Platform 🎓

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)
[![AWS](https://img.shields.io/badge/AWS-Cognito%20%7C%20Amplify%20%7C%20DynamoDB-orange?logo=amazonaws)](https://aws.amazon.com/)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)

**Your intelligent companion for academic success and exam preparation.**

MavPrep is a comprehensive educational platform designed to help students excel in their academic journey through collaborative study tools, real-time communication, and intelligent exam preparation. Initially targeting University of Texas at Arlington (UTA) students, with plans to expand to universities nationwide.

---

## 🎯 Project Vision

**Problem Statement:** Students often struggle with exam preparation due to lack of structured study materials, personalized learning paths, and tools to collaborate effectively with peers.

**Target Users:**

- University students preparing for midterms and finals
- Initially focusing on UTA students
- Expanding to students at universities nationwide

**Success Metrics:**

- Student engagement and retention rates
- Improvement in exam performance
- User satisfaction scores
- Community growth and participation

---

## ✨ Features

### 🔐 Authentication

- Email-based sign up/sign in with AWS Cognito
- Email verification with 6-digit codes
- Password reset functionality
- Secure JWT token management

### 💬 Text Channels

- Real-time messaging with Socket.IO
- Emoji picker for expressive communication
- Message history persistence with DynamoDB
- Public and private channels with password protection
- Channel-specific chat rooms for different courses

### 🎙️ Voice Channels

- Live audio streaming with WebRTC
- Mute/Unmute functionality
- Deafen/Undeafen for audio output control
- Visual participant avatars with speaking indicators
- Audio cues for join, leave, mute, and deafen actions
- Discord-like voice call interface

### 📚 Study Tools (Planned)

| Feature                | Description                                           |
| ---------------------- | ----------------------------------------------------- |
| **Practice Tests**     | Hundreds of practice tests with detailed explanations |
| **Custom Study Plans** | Personalized schedules tailored to individual goals   |
| **Progress Analytics** | Detailed performance insights and visualizations      |
| **Video Lessons**      | Expert instructors covering key topics                |
| **Smart Flashcards**   | AI-powered with spaced repetition algorithm           |

### 🎨 User Experience

- Modern, Discord-inspired dark theme
- Responsive design for all devices
- Neon accent styling with smooth animations
- Real-time connection status indicators

---

## 🛠 Tech Stack

### Frontend

| Technology           | Version | Purpose                         |
| -------------------- | ------- | ------------------------------- |
| **Next.js**          | 16.0    | React framework with App Router |
| **React**            | 19.2    | UI component library            |
| **TypeScript**       | 5.0     | Type-safe development           |
| **Tailwind CSS**     | 4.0     | Utility-first styling           |
| **Socket.IO Client** | 4.8     | Real-time communication         |

### Backend & Infrastructure

| Service              | Purpose                                 |
| -------------------- | --------------------------------------- |
| **AWS Cognito**      | User authentication & management        |
| **AWS Amplify**      | Hosting & CI/CD deployment              |
| **AWS DynamoDB**     | Chat history & channel data storage     |
| **Socket.IO Server** | WebSocket server for real-time features |
| **WebRTC**           | Peer-to-peer voice communication        |

### Design System

- **Theme:** Dark mode with neon blue accents
- **Color Palette:**
  - Primary: `#00d9ff` (Neon cyan/blue)
  - Secondary: `#0099cc` (Darker neon blue)
  - Accent: `#00ffff` (Bright cyan)
- **Typography:** Modern sans-serif with Inter font family

---

## 📁 Project Structure

```
Cloud_Migration/
├── mavprep-landing/           # Main Next.js application
│   ├── app/
│   │   ├── home/
│   │   │   └── page.tsx       # Dashboard with channels & voice
│   │   ├── login/
│   │   │   └── page.tsx       # Authentication pages
│   │   ├── layout.tsx         # Root layout with providers
│   │   ├── page.tsx           # Landing page
│   │   └── globals.css        # Global styles
│   ├── lib/
│   │   └── amplify-provider.tsx  # AWS Amplify configuration
│   ├── pages/
│   │   └── api/
│   │       └── webrtc-signaling.ts  # Socket.IO server
│   ├── public/                # Static assets
│   ├── package.json           # Dependencies
│   └── tsconfig.json          # TypeScript config
├── docs/                      # Documentation
│   ├── AWS_ARCHITECTURE.md    # AWS infrastructure guide
│   ├── API_DESIGN.md          # API documentation
│   └── DEPLOYMENT_GUIDE.md    # Deployment instructions
├── PROJECT_CHARTER.md         # Project charter
└── README.md                  # This file
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- AWS Account (for Cognito, DynamoDB)
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/zaineel/Cloud_Migration.git
   cd Cloud_Migration/mavprep-landing
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env.local` file in the `mavprep-landing` directory:

   ```env
   # AWS Cognito Configuration
   NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
   NEXT_PUBLIC_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
   NEXT_PUBLIC_AWS_REGION=us-east-1

   # Optional: DynamoDB (for production)
   NEXT_PUBLIC_DYNAMODB_TABLE_NAME=MavPrepData
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open the app**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

---

## ☁️ AWS Setup

### Cognito User Pool

1. Go to [AWS Cognito Console](https://console.aws.amazon.com/cognito)
2. Create a new User Pool:
   - Application type: Single-page application (SPA)
   - Sign-in: Email
   - Required attributes: `preferred_username`
   - Password policy: Minimum 8 characters
   - Self-registration: Enabled
   - Email verification: Enabled
3. Create an App Client:
   - Client type: Public client (SPA)
   - Don't generate a client secret
4. Copy the **User Pool ID** and **Client ID** to your `.env.local`

### DynamoDB Table Design

```
Table: MavPrepData
├── Partition Key: PK (String)
├── Sort Key: SK (String)
└── GSI: userId-timestamp-index

Data Patterns:
┌─────────────────────────────────────────────────────────┐
│ Channels                                                │
│ PK: "CHANNEL#c-1"  SK: "METADATA"                      │
│ Data: { name, type, privacy, createdBy, createdAt }    │
├─────────────────────────────────────────────────────────┤
│ Messages                                                │
│ PK: "CHANNEL#c-1"  SK: "MSG#2024-01-15T10:30:00Z#uuid" │
│ Data: { userId, userName, content, reactions }          │
├─────────────────────────────────────────────────────────┤
│ Voice Participants                                      │
│ PK: "VOICE#v-1"    SK: "USER#user-123"                 │
│ Data: { joinedAt, isMuted, isDeafened }                │
└─────────────────────────────────────────────────────────┘
```

### Amplify Deployment

1. Connect your GitHub repository to AWS Amplify Console
2. Configure build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - cd mavprep-landing
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: mavprep-landing/.next
       files:
         - "**/*"
     cache:
       paths:
         - mavprep-landing/node_modules/**/*
   ```
3. Add environment variables in Amplify Console
4. Deploy!

---

## 📋 Roadmap

### Phase 1: Foundation ✅ COMPLETE

- [x] Landing page design and development
- [x] User authentication UI (login/signup)
- [x] AWS Cognito integration
- [x] Password reset functionality
- [x] Email verification flow

### Phase 2: Communication ✅ COMPLETE

- [x] Text channels with real-time messaging
- [x] Voice channels with WebRTC
- [x] Mute/Deafen/Leave controls
- [x] Emoji picker for messages
- [x] Audio cues for voice actions
- [x] Socket.IO signaling server

### Phase 3: Data Persistence 🔄 IN PROGRESS

- [ ] DynamoDB integration for messages
- [ ] Channel data persistence
- [ ] User profile storage
- [ ] Message history loading
- [ ] Real-time sync across clients

### Phase 4: Study Tools

- [ ] Practice test engine
- [ ] Question bank and categorization
- [ ] Progress tracking system
- [ ] Basic analytics dashboard
- [ ] Custom study plan generator

### Phase 5: Enhanced Learning

- [ ] AI-powered flashcard system
- [ ] Video content integration
- [ ] Spaced repetition algorithm
- [ ] Performance recommendations
- [ ] Smart search and filtering

### Phase 6: Scale & Expansion

- [ ] Mobile application (React Native)
- [ ] Multi-university support
- [ ] Content marketplace for educators
- [ ] Advanced analytics and AI insights
- [ ] Integration with university LMS systems

---

## 📊 Current Status

- **Phase:** Phase 3 - Data Persistence
- **Current Focus:** DynamoDB integration & message persistence
- **Communication:** Discord #{{project-channel}}

### Recent Updates

- ✅ Text channels with emoji support
- ✅ Voice channels with WebRTC audio
- ✅ AWS Cognito authentication
- ✅ Password reset flow
- ✅ Discord-like UI with dark theme
- ✅ Audio cues for voice actions

---

## 👥 Team

### Maintainers

| Name                         | GitHub                                               | Role            |
| ---------------------------- | ---------------------------------------------------- | --------------- |
| **Aroudra**                  | [@aroudrasthakur](https://github.com/aroudrasthakur) | Project Creator |
| **Zaineel Mithani**          | [@zaineel](https://github.com/zaineel)               | Maintainer      |
| **Tanzid Noor Azad**         | [@TanzidAzad](https://github.com/TanzidAzad)         | Maintainer      |
| **Soumik Sen**               | [@soumiksen](https://github.com/soumiksen)           | Maintainer      |
| **Hani Markos**              | [@hm-22](https://github.com/hm-22)                   | Maintainer      |
| **Rachelle Centeno Azurdia** | [@rachelle9026](https://github.com/rachelle9026)     | Maintainer      |

### Project Leadership

- **Directors:** Tobi and Prajit Viswanadha
- **Contact:** DM on Discord

---

## 🤝 Contributing

We welcome contributions from developers, designers, educators, and students!

### Getting Involved

1. **Report Issues:** Found a bug? Open an issue with detailed information
2. **Submit Pull Requests:** Fix bugs, add features, or improve documentation
3. **Design Contributions:** Help improve UI/UX, create mockups, or design assets
4. **Content Creation:** Contribute study materials or practice questions
5. **Community Support:** Help other users in discussions

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature-name`
3. Make your changes and commit: `git commit -m "feat: add your feature"`
4. Push to your fork: `git push origin feat/your-feature-name`
5. Open a Pull Request with a clear description

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix      | Description              |
| ----------- | ------------------------ |
| `feat:`     | New features             |
| `fix:`      | Bug fixes                |
| `docs:`     | Documentation changes    |
| `style:`    | Code style changes       |
| `refactor:` | Code refactoring         |
| `test:`     | Adding or updating tests |
| `chore:`    | Maintenance tasks        |

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact & Support

- **Email:** support@mavprep.com
- **Discord:** ACM Projects Discord
- **GitHub Issues:** [Report issues](https://github.com/zaineel/Cloud_Migration/issues)
- **Discussions:** [Join conversations](https://github.com/zaineel/Cloud_Migration/discussions)

---

## 🙏 Acknowledgments

- **UTA ACM Chapter** for project support and collaboration
- **All contributors and maintainers** for their dedication
- **Open-source community** for the amazing tools and libraries:
  - Next.js & React teams
  - AWS for cloud infrastructure
  - Socket.IO for real-time communication
  - Tailwind CSS for styling
- **UTA students** for feedback and feature suggestions

---

<div align="center">

**MavPrep** — Your intelligent companion for academic success 📚

[Website](https://mavprep.com) • [Documentation](docs/) • [Discord](https://discord.gg/acm)

</div>
