import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScoreBreakdown } from "@/types/signal";

interface QualityScoreBadgeProps {
  score: 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C';
  scoreBreakdown?: ScoreBreakdown;
  className?: string;
}

const getScoreColor = (score: string): string => {
  switch (score) {
    case 'A+':
      return 'bg-green-600 hover:bg-green-700';
    case 'A':
      return 'bg-green-500 hover:bg-green-600';
    case 'A-':
      return 'bg-green-400 hover:bg-green-500';
    case 'B+':
      return 'bg-yellow-500 hover:bg-yellow-600';
    case 'B':
      return 'bg-yellow-400 hover:bg-yellow-500';
    case 'B-':
      return 'bg-orange-400 hover:bg-orange-500';
    case 'C':
      return 'bg-red-500 hover:bg-red-600';
    default:
      return 'bg-gray-500 hover:bg-gray-600';
  }
};

const getScoreDescription = (score: string): string => {
  switch (score) {
    case 'A+':
      return 'Excellent signal quality';
    case 'A':
      return 'Very good signal quality';
    case 'A-':
      return 'Good signal quality';
    case 'B+':
      return 'Above average signal quality';
    case 'B':
      return 'Average signal quality';
    case 'B-':
      return 'Below average signal quality';
    case 'C':
      return 'Poor signal quality';
    default:
      return 'Unknown quality';
  }
};

export function QualityScoreBadge({ score, scoreBreakdown, className }: QualityScoreBadgeProps) {
  const colorClass = getScoreColor(score);
  const description = getScoreDescription(score);

  const badge = (
    <Badge 
      variant="secondary" 
      className={`${colorClass} text-white font-semibold ${className}`}
    >
      {score}
    </Badge>
  );

  if (!scoreBreakdown) {
    return badge;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badge}
        </TooltipTrigger>
        <TooltipContent className="max-w-sm p-4">
          <div className="space-y-2">
            <div className="font-semibold text-sm">{description}</div>
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span>Trend Alignment:</span>
                <span>{scoreBreakdown.trend_alignment}/10</span>
              </div>
              <div className="flex justify-between">
                <span>Liquidity Edge:</span>
                <span>{scoreBreakdown.liquidity_edge}/10</span>
              </div>
              <div className="flex justify-between">
                <span>Positioning:</span>
                <span>{scoreBreakdown.positioning}/10</span>
              </div>
              <div className="flex justify-between">
                <span>Orderbook Support:</span>
                <span>{scoreBreakdown.orderbook_support}/10</span>
              </div>
              <div className="flex justify-between">
                <span>Event Risk:</span>
                <span>{scoreBreakdown.event_risk}/10</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Final Score:</span>
                <span>{scoreBreakdown.final_score}/50</span>
              </div>
              {Object.keys(scoreBreakdown.penalties).length > 0 && (
                <div className="text-red-400 text-xs">
                  <div>Penalties Applied:</div>
                  {Object.entries(scoreBreakdown.penalties).map(([key, value]) => (
                    <div key={key} className="ml-2">
                      {key.replace('_', ' ')}: {value}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="text-xs text-gray-400 mt-2">
              Quality score is informational only and not a guarantee of outcome.
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 