# Base Wallet Connect

A modern Web3 dApp built with Next.js, Reown AppKit (formerly WalletConnect), and Base network integration. This application provides seamless wallet connection, account management, and message signing with signature verification.

## Features

- **Wallet Connection**: Connect with multiple wallet providers using Reown AppKit
- **Base Network Integration**: Full support for Base mainnet and Base Sepolia testnet
- **Network Gating**: Automatic detection and switching to Base network
- **Account Display**: View connected wallet address and ETH balance
- **Message Signing**: Sign messages with your wallet
- **Signature Verification**: Verify signed messages cryptographically
- **Responsive UI**: Beautiful, mobile-friendly interface with Tailwind CSS
- **SSR Support**: Server-side rendering with cookie-based state management

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Web3 Integration**:
  - Reown AppKit (@reown/appkit)
  - Wagmi (@reown/appkit-adapter-wagmi)
  - Viem
- **State Management**: TanStack React Query

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager
- A Reown Cloud Project ID (get one from [Reown Cloud](https://cloud.reown.com))

## Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd walletconnect
```

2. Install dependencies:

```bash
npm install
# or
pnpm install
# or
yarn install
# or
bun install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Then edit `.env.local` and add your Reown Project ID:

```env
NEXT_PUBLIC_PROJECT_ID=your_project_id_here
```

To get a Project ID:
1. Go to [Reown Cloud](https://cloud.reown.com)
2. Sign up or log in
3. Create a new project
4. Copy your Project ID

## Development

Run the development server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

Build the application:

```bash
npm run build
```

Run the production server:

```bash
npm start
```

## Project Structure

```
walletconnect/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout with Web3Provider
│   │   ├── page.tsx        # Main application page
│   │   └── globals.css     # Global styles
│   ├── config/
│   │   └── wagmi.ts        # Wagmi and AppKit configuration
│   └── context/
│       └── Web3Provider.tsx # Web3 context provider
├── .env.example            # Environment variables template
├── .env.local              # Your local environment variables (gitignored)
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

## How It Works

### 1. Wallet Connection

The app uses Reown AppKit's `<appkit-button>` component for wallet connection. This provides:
- Support for 300+ wallets
- Email and social login options
- QR code scanning for mobile wallets

### 2. Base Network Gating

The app automatically detects the connected network and displays a warning if the user is not on Base or Base Sepolia. Users can switch networks with one click using the `useSwitchChain` hook.

### 3. Account Information

Once connected to Base network, the app displays:
- Full wallet address
- ETH balance (formatted to 4 decimal places)
- Current network name

### 4. Message Signing & Verification

Users can:
1. Enter any message in the text area
2. Sign the message with their wallet (prompts wallet signature)
3. View the generated signature
4. Verify the signature cryptographically using `verifyMessage` from viem

## Configuration

### Supported Networks

The app is configured for:
- **Base** (Chain ID: 8453)
- **Base Sepolia** (Chain ID: 84532)

To add more networks, edit [src/config/wagmi.ts](src/config/wagmi.ts):

```typescript
import { base, baseSepolia, mainnet } from '@reown/appkit/networks'

export const networks = [base, baseSepolia, mainnet]
```

### AppKit Customization

Modify the AppKit configuration in [src/context/Web3Provider.tsx](src/context/Web3Provider.tsx):

```typescript
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks,
  defaultNetwork: base,
  metadata: {
    name: 'Your App Name',
    description: 'Your App Description',
    url: 'https://yourapp.com',
    icons: ['https://youricon.url']
  },
  features: {
    analytics: true,
  }
})
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables:
   - `NEXT_PUBLIC_PROJECT_ID`
4. Deploy

### Deploy to Other Platforms

This is a standard Next.js application and can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Render
- AWS Amplify
- Docker

## Troubleshooting

### Common Issues

1. **"NEXT_PUBLIC_PROJECT_ID is not set" error**
   - Make sure you've created `.env.local` and added your Project ID
   - Restart the dev server after adding environment variables

2. **Wallet won't connect**
   - Check that your Project ID is valid
   - Ensure you're using a supported browser
   - Try clearing browser cache and cookies

3. **Wrong network warning persists**
   - Make sure MetaMask/your wallet has Base network added
   - Try manually adding Base network to your wallet

4. **Balance not showing**
   - Ensure you're connected to Base or Base Sepolia
   - Check that you have a valid address

## Resources

- [Reown AppKit Documentation](https://docs.reown.com/appkit)
- [Wagmi Documentation](https://wagmi.sh)
- [Base Network Documentation](https://docs.base.org)
- [Next.js Documentation](https://nextjs.org/docs)
- [Viem Documentation](https://viem.sh)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for learning or production applications.
