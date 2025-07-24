# Real-Time Cryptocurrency Prices

This implementation provides real-time cryptocurrency price data using the Binance API. It supports both REST API polling and WebSocket connections for live updates.

## Features

- **Real-time price updates** from Binance API
- **Dual mode support**: REST API polling (5-second intervals) and WebSocket (instant updates)
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

### useRealTimePrices

Fetch real-time prices for multiple coins using REST API.

```tsx
import { useRealTimePrices } from "@/hooks/useRealTimePrices";

const { data, isLoading, error, refetch } = useRealTimePrices([
  "BTC",
  "ETH",
  "SOL",
]);
```

### useSingleCoinPrice

Fetch real-time price for a single coin.

```tsx
import { useSingleCoinPrice } from "@/hooks/useRealTimePrices";

const { data, isLoading, error } = useSingleCoinPrice("BTC");
```

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

Fetch real-time prices for specific symbols.

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
import { useRealTimePrices } from "@/hooks/useRealTimePrices";

function CustomComponent() {
  const { data: prices, isLoading, error } = useRealTimePrices(["BTC", "ETH"]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

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

- **Network errors**: Automatic retry with exponential backoff
- **API rate limits**: Built-in rate limiting and retry logic
- **WebSocket disconnections**: Automatic reconnection
- **Invalid data**: Graceful fallbacks and error states

## Performance Considerations

- **Caching**: React Query provides intelligent caching
- **Background updates**: Data updates even when tab is not active
- **Efficient re-renders**: Only updates when data actually changes
- **Connection pooling**: WebSocket connections are reused efficiently

## Security

- **No API keys required**: Uses public Binance API endpoints
- **Rate limiting**: Built-in protection against excessive requests
- **Data validation**: All incoming data is validated and sanitized

## Troubleshooting

### Common Issues

1. **No data loading**: Check network connection and Binance API status
2. **WebSocket not connecting**: Verify firewall settings and network connectivity
3. **Stale data**: Ensure React Query is properly configured
4. **High CPU usage**: Reduce update frequency or switch to REST API mode

### Debug Mode

Enable React Query DevTools for debugging:

```tsx
// Already included in main.tsx
<ReactQueryDevtools initialIsOpen={false} />
```

## Future Enhancements

- [ ] Price alerts and notifications
- [ ] Historical price charts
- [ ] Portfolio tracking
- [ ] Price comparison tools
- [ ] Custom watchlists
- [ ] Price change notifications
- [ ] Advanced filtering and sorting
- [ ] Export functionality
