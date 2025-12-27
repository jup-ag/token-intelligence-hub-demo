# Token Intelligence Hub

A token research and trading platform built with Jupiter APIs. Browse trending tokens, search the ecosystem, view verified content, and swap tokens directly.

## Features

- Trending tokens with verified content
- Token search by name, symbol, or mint
- Detailed token pages with VRFD content
- Direct token swaps via Jupiter
- Portfolio tracking
- Content feed across all tokens

## Tech Stack

Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, and Jupiter APIs for tokens, prices, swaps, and content.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` with your Jupiter API key:
```
NEXT_PUBLIC_JUPITER_API_KEY=your_api_key_here
```

Get an API key at https://portal.jup.ag

3. Run the dev server:
```bash
npm run dev
```

## Project Structure

- `app/` - Next.js pages (home, search, token details, portfolio, content)
- `components/` - React components (wallet, token cards, swap widget, UI)
- `lib/jupiter/` - Jupiter API clients
- `hooks/` - Custom React hooks
- `types/` - TypeScript definitions

## APIs Used

- Ultra Swap API for token swaps
- Tokens API v2 for search and info
- Price API v3 for real-time prices
- Content API for verified content
- Portfolio API for wallet positions

## License

MIT
