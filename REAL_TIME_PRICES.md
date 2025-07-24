# Real-Time Cryptocurrency Prices (WebSocket Only)

This implementation provides real-time cryptocurrency price data using the Binance WebSocket API for instant updates.

## Features

- **Real-time price updates** from Binance WebSocket API
- **Instant updates** via WebSocket connection (no polling)
- **Automatic reconnection** for WebSocket connections
- **Error handling** with retry mechanisms
- **Loading states** with skeleton components
- **Responsive design** with mobile support

## Components

### 1. CoinSelector

The main component for selecting trading pairs with real-time price data.

```tsx
import { CoinSelector } from "@/components/Dashboard/CoinSelector";

<CoinSelector
  selectedCoin="BTC"
  onSelect={(coin) => console.log("Selected:", coin)}
  coins={["BTC", "ETH", "SOL"]} // Optional: custom coin list
/>;
```

### 2. PriceTicker

Display individual coin price information.

```tsx
import { PriceTicker, MiniPriceTicker } from '@/components/Dashboard/PriceTicker';

// Full price ticker with details
<PriceTicker symbol="BTC" showDetails={true} />

// Mini version for compact display
<MiniPriceTicker symbol="ETH" />
```

## Hooks

### useBinanceWebSocket

Real-time price updates via WebSocket connection.

```tsx
import { useBinanceWebSocket } from "@/hooks/useBinanceWebSocket";

const { prices, isConnected, error, reconnect } = useBinanceWebSocket([
  "BTC",
  "ETH",
]);
```

## API Functions

### getRealTimePrices

Fetch real-time prices for specific symbols (fallback method).

```tsx
import { getRealTimePrices } from "@/lib/api";

const prices = await getRealTimePrices(["BTC", "ETH", "SOL"]);
```

### getBinanceTicker

Get specific ticker data for a symbol.

```tsx
import { getBinanceTicker } from "@/lib/api";

const ticker = await getBinanceTicker("BTCUSDT");
```

## Data Structure

```typescript
interface CoinPriceData {
  symbol: string; // e.g., "BTC"
  name: string; // e.g., "Bitcoin"
  price: string; // e.g., "67542.12"
  change: string; // e.g., "1234.56"
  changePercent: string; // e.g., "+1.87%"
  isPositive: boolean; // true if price increased
  volume: string; // e.g., "1,234,567"
  high24h: string; // e.g., "68000.00"
  low24h: string; // e.g., "67000.00"
}
```

## Supported Coins

The system supports all major cryptocurrencies available on Binance. Common symbols include:

- BTC (Bitcoin)
- ETH (Ethereum)
- SOL (Solana)
- ADA (Cardano)
- DOT (Polkadot)
- LINK (Chainlink)
- UNI (Uniswap)
- MATIC (Polygon)
- AVAX (Avalanche)
- ATOM (Cosmos)
- LTC (Litecoin)
- BCH (Bitcoin Cash)
- XRP (Ripple)
- DOGE (Dogecoin)
- SHIB (Shiba Inu)
- TRX (TRON)
- NEAR (NEAR Protocol)
- FTM (Fantom)
- ALGO (Algorand)
- VET (VeChain)

## Configuration

### React Query Setup

The implementation uses React Query for caching and background updates. Configuration is in `src/main.tsx`:

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});
```

### WebSocket Configuration

WebSocket connections automatically reconnect every 5 seconds if disconnected.

## Usage Examples

### Dashboard with Multiple Coins

```tsx
import { CoinSelector } from "@/components/Dashboard/CoinSelector";

function Dashboard() {
  const [selectedCoin, setSelectedCoin] = useState("BTC");

  return (
    <div>
      <CoinSelector
        selectedCoin={selectedCoin}
        onSelect={setSelectedCoin}
        coins={["BTC", "ETH", "SOL", "ADA", "DOT"]}
      />
    </div>
  );
}
```

### Price Ticker Dashboard

```tsx
import { PriceTicker } from "@/components/Dashboard/PriceTicker";

function PriceDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <PriceTicker symbol="BTC" showDetails={true} />
      <PriceTicker symbol="ETH" showDetails={true} />
      <PriceTicker symbol="SOL" showDetails={true} />
    </div>
  );
}
```

### Custom Hook Usage

```tsx
import { useBinanceWebSocket } from "@/hooks/useBinanceWebSocket";

function CustomComponent() {
  const { prices, isConnected, error } = useBinanceWebSocket(["BTC", "ETH"]);

  if (!isConnected) return <div>Connecting...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {prices?.map((coin) => (
        <div key={coin.symbol}>
          {coin.symbol}: ${coin.price} ({coin.changePercent})
        </div>
      ))}
    </div>
  );
}
```

## Error Handling

The implementation includes comprehensive error handling:

- **Network errors**: Automatic reconnection with exponential backoff
- **WebSocket disconnections**: Automatic reconnection every 5 seconds
- **Invalid data**: Graceful fallbacks and error states
- **Connection timeouts**: Built-in timeout handling

## Performance Considerations

- **Real-time updates**: Instant price updates via WebSocket
- **Efficient re-renders**: Only updates when data actually changes
- **Connection pooling**: WebSocket connections are reused efficiently
- **Background updates**: Data updates even when tab is not active

## Security

- **No API keys required**: Uses public Binance WebSocket endpoints
- **Data validation**: All incoming data is validated and sanitized
- **Secure WebSocket**: Uses WSS (WebSocket Secure) protocol

## Troubleshooting

### Common Issues

1. **No data loading**: Check network connection and Binance API status
2. **WebSocket not connecting**: Verify firewall settings and network connectivity
3. **Connection drops**: WebSocket automatically reconnects every 5 seconds
4. **High CPU usage**: WebSocket is more efficient than polling

### Debug Mode

Enable React Query DevTools for debugging:

```tsx
// Already included in main.tsx
<ReactQueryDevtools initialIsOpen={false} />
```

## WebSocket Advantages

- **Real-time updates**: Instant price changes without polling delays
- **Lower latency**: Direct connection to Binance servers
- **Reduced server load**: No need for frequent HTTP requests
- **Better performance**: More efficient than REST API polling
- **Automatic reconnection**: Handles network interruptions gracefully

## Future Enhancements

- [ ] Price alerts and notifications
- [ ] Historical price charts
- [ ] Portfolio tracking
- [ ] Price comparison tools
- [ ] Custom watchlists
- [ ] Price change notifications
- [ ] Advanced filtering and sorting
- [ ] Export functionality
