# Pulse

A demo app showcasing what you can build with Jupiter APIs. Browse trending tokens, view verified content, trade prediction markets, and swap tokens—all powered by Jupiter.

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
JUPITER_API_KEY=your_api_key_here
```

Get an API key at https://portal.jup.ag

Note: The API key is server-only (no `NEXT_PUBLIC_` prefix) to prevent exposure in the browser.

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
