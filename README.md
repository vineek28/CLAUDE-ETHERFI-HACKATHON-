# 🚀 Liquid Staking Educational Platform

An interactive, gamified educational platform that teaches users about Ethereum liquid staking, DeFi concepts, and Ether.fi's ecosystem through hands-on demos and engaging learning experiences.

![Next.js](https://img.shields.io/badge/Next.js-14.0-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18.2-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Hardhat](https://img.shields.io/badge/Hardhat-Smart_Contracts-yellow?style=flat-square)
![Ethers.js](https://img.shields.io/badge/Ethers.js-6.9-purple?style=flat-square)

## 🌟 Features

### 📚 Interactive Learning
- **Before We Begin** - Concept sequencing slides that introduce key DeFi concepts on every page load
- **Step-by-step Tutorials** - Interactive overlays guiding users through each feature
- **Ether.fi Academy** - Deep dives into Decentralized Node Operators, EigenLayer Restaking, and Loyalty Points

### 🎮 Gamification
- **Duolingo-Style Quiz** - 10 educational questions with 4 question types:
  - Multiple Choice Questions
  - Image Matching
  - Fill in the Blanks
  - Match the Pairs
- **3D Animated Mascot** - Interactive character that reacts to your progress:
  - 🤔 Thinking state with thought bubbles
  - ✅ Happy celebration on correct answers
  - ❌ Disappointed on wrong answers
  - 🔥 Fire eyes on 3+ correct streaks
  - 😢 Crying when losing hearts
- **Dynamic Messaging** - Mascot speaks encouragement: "Keep going!", "So close!", "You're on fire!"
- **Hearts System** - 3 lives to complete the quiz
- **Streak Counter** - Track consecutive correct answers
- **Badge System** - Earn 9 meaningful achievement badges

### 💎 Core Functionality
- **ETH Staking** - Stake ETH and receive liquid eETH tokens
- **Real-time Portfolio** - View staked amounts, pending rewards, and total earnings
- **Reward Claiming** - Claim accumulated staking rewards
- **Live Blockchain Integration** - Connected to local Hardhat node with mock contracts

### 🤖 AI-Powered Chatbot
- **Finny** - AI assistant powered by Claude (Anthropic)
- Answers questions about liquid staking, DeFi, and Ether.fi
- Context-aware responses about the platform features

### 🎨 Design
- **Dark Theme** - Sleek purple/pink gradient design
- **Responsive UI** - Works on desktop and mobile
- **Smooth Animations** - CSS animations for mascot states, celebrations, and transitions
- **Tutorial Highlights** - Interactive elements highlighted during tutorials

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library

### Blockchain
- **Hardhat** - Ethereum development environment
- **Ethers.js v6** - Web3 library for blockchain interactions
- **OpenZeppelin Contracts** - Secure smart contract standards
- **Solidity** - Smart contract language

### AI Integration
- **Anthropic Claude API** - Powers the Finny chatbot

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Git

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/vineek28/CLAUDE_ETHERFI_HACK.git
cd CLAUDE_ETHERFI_HACK
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file:
```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

4. **Start local blockchain**
```bash
npm run hardhat:node
```
Keep this terminal running.

5. **Deploy smart contracts** (in a new terminal)
```bash
npm run hardhat:deploy
```

6. **Copy contract addresses**
```bash
Copy-Item contract-addresses.json public/contract-addresses.json
```

7. **Start the development server**
```bash
npm run dev
```

8. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 How to Use

1. **Connect Wallet** - Click "Connect Wallet" and select a Hardhat test account
2. **Watch Intro Slides** - Learn key concepts through the "Before We Begin" presentation
3. **Follow Tutorials** - Interactive guides walk you through each feature
4. **Stake ETH** - Try staking on the eETH tab
5. **View Portfolio** - Check your balance and rewards
6. **Explore Advanced** - Learn about node operators, restaking, and loyalty points
7. **Take the Quiz** - Test your knowledge with the gamified quiz (Advanced tab)
8. **Earn Badges** - Unlock achievements by completing actions
9. **Ask Finny** - Use the AI chatbot for questions

## 🏆 Badge System

Earn 9 achievement badges:
- 💎 **First Stake** - Stake ETH for the first time
- 🎁 **Wrapper Master** - Wrap eETH to weETH
- 💰 **DeFi Borrower** - Borrow against your stake
- ✨ **Tutorial Graduate** - Complete a tutorial walkthrough
- 🌍 **Decentralization Advocate** - Explore node operators demo
- 🔄 **Restaking Expert** - Learn about EigenLayer restaking
- ⭐ **Loyalty Enthusiast** - Explore the loyalty points system
- 💬 **Question Asker** - Ask Finny a question
- 🏆 **Quiz Master** - Score 50+ points in the quiz

## 📁 Project Structure

```
CLAUDE_ETHERFI_HACK/
├── app/                          # Next.js app directory
│   ├── page.tsx                  # Main dashboard
│   ├── api/chat/route.ts         # Chatbot API endpoint
│   └── demo/                     # Demo pages
├── components/                   # React components
│   ├── Header.tsx                # App header with wallet connection
│   ├── StakingInterface.tsx      # ETH staking UI
│   ├── PortfolioView.tsx         # Portfolio dashboard
│   ├── DuolingoStyleQuiz.tsx     # Gamified quiz with animated mascot
│   ├── EtherfiAcademy.tsx        # Educational content hub
│   ├── FinnyChatbot.tsx          # AI chatbot interface
│   ├── BeforeYouBeginModal.tsx   # Intro slides
│   ├── TutorialOverlay.tsx       # Interactive tutorials
│   ├── BadgeNotification.tsx     # Badge achievement popups
│   └── BadgesPanel.tsx           # Badge collection display
├── contexts/                     # React contexts
│   ├── Web3Context.tsx           # Blockchain connection state
│   └── LearningContext.tsx       # Badge and achievement system
├── contracts/                    # Solidity smart contracts
│   ├── MockEETH.sol              # Liquid staking token
│   ├── MockStakingPool.sol       # Staking pool contract
│   └── MockRewardsDistributor.sol # Rewards distribution
├── scripts/                      # Deployment scripts
│   └── deploy.js                 # Contract deployment
├── public/                       # Static assets
└── hardhat.config.ts             # Hardhat configuration
```

## 🎨 Quiz Features in Detail

### Animated Mascot States
- **Idle** - Gentle floating with blinking eyes
- **Thinking** - Moving pupils with thought bubbles
- **Correct** - Happy smile, bouncing, green glow
- **Wrong** - X eyes, shaking motion, red glow
- **Fire** - Flame eyes, particle effects on streaks
- **Crying** - Sad face with animated falling tears

### Question Types
1. **MCQ** - Choose from 4 options
2. **Image Match** - Select the correct emoji
3. **Fill in Blank** - Complete sentences with missing words
4. **Match Pairs** - Connect related concepts

### Educational Topics
- eETH and liquid staking basics
- weETH wrapping and rebasing
- DeFi yields and APR
- EigenLayer restaking
- Risk assessment
- Loyalty points and airdrops
- Gas fees and Layer 2

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Deploy to Vercel
```bash
vercel deploy
```

Remember to add environment variables in your deployment platform.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 👥 Contributors

- [@vineek28](https://github.com/vineek28) - Co-Developer
- [@vinayvikkranth] - Co-Developer

## 📄 License

This project is for educational purposes only. Not financial advice.

## ⚠️ Disclaimer

**EDUCATIONAL DEMO ONLY**
- No real funds used
- Not financial advice
- For learning purposes only
- Do not use in production without proper security audits

## 🙏 Acknowledgments

- Built with inspiration from Ether.fi's liquid staking protocol
- Duolingo-style gamification approach
- Claude AI by Anthropic for chatbot functionality
- Ethereum and DeFi community

## 📞 Support

For questions or issues, please open an issue on GitHub.

---

Made with 💜 for the Ethereum community
