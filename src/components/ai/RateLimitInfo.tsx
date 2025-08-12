'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/common/badge';

interface RateLimitInfoProps {
  className?: string;
  showDetails?: boolean;
}

export function RateLimitInfo({ 
  className = '',
  showDetails = false
}: RateLimitInfoProps) {
  const [rateLimitInfo, setRateLimitInfo] = useState<{
    context: { remaining: number; reset: number };
    ai: { remaining: number; reset: number; dailyRemaining: number };
  } | null>(null);

  useEffect(() => {
    // This would be populated from actual API responses
    // For now, we'll show a placeholder
    setRateLimitInfo({
      context: { remaining: 25, reset: Date.now() + 30000 },
      ai: { remaining: 8, reset: Date.now() + 60000, dailyRemaining: 450 }
    });
  }, []);

  if (!rateLimitInfo) {
    return null;
  }

  const formatTimeRemaining = (resetTime: number): string => {
    const remaining = Math.max(0, Math.ceil((resetTime - Date.now()) / 1000));
    
    if (remaining < 60) {
      return `${remaining}s`;
    } else if (remaining < 3600) {
      return `${Math.floor(remaining / 60)}m`;
    } else {
      const hours = Math.floor(remaining / 3600);
      const minutes = Math.floor((remaining % 3600) / 60);
      return `${hours}h ${minutes}m`;
    }
  };

  const getContextStatus = (remaining: number) => {
    if (remaining <= 5) return 'destructive';
    if (remaining <= 10) return 'secondary';
    return 'outline';
  };

  const getAIStatus = (remaining: number) => {
    if (remaining <= 2) return 'destructive';
    if (remaining <= 5) return 'secondary';
    return 'outline';
  };

  return (
    <div className={`flex items-center gap-1 text-xs ${className}`}>
      {/* Compact Context Rate Limit */}
      <div className="flex items-center gap-1">
        <Badge 
          variant={getContextStatus(rateLimitInfo.context.remaining)}
          className="text-xs px-1.5 py-0.5"
        >
          C:{rateLimitInfo.context.remaining}
        </Badge>
        <span className="text-gray-500 text-[10px]">
          {formatTimeRemaining(rateLimitInfo.context.reset)}
        </span>
      </div>

      {/* Compact AI Rate Limit */}
      <div className="flex items-center gap-1">
        <Badge 
          variant={getAIStatus(rateLimitInfo.ai.remaining)}
          className="text-xs px-1.5 py-0.5"
        >
          AI:{rateLimitInfo.ai.remaining}
        </Badge>
        <span className="text-gray-500 text-[10px]">
          {formatTimeRemaining(rateLimitInfo.ai.reset)}
        </span>
      </div>

      {/* Daily AI Limit - only show if requested and space allows */}
      {showDetails && (
        <div className="flex items-center gap-1">
          <span className="text-gray-500 text-[10px]">D:</span>
          <Badge variant="outline" className="text-xs px-1.5 py-0.5">
            {rateLimitInfo.ai.dailyRemaining}
          </Badge>
        </div>
      )}

      {/* Warning indicators - only show critical warnings */}
      {rateLimitInfo.context.remaining <= 3 && (
        <span className="text-orange-500 text-[10px]">⚠️</span>
      )}
      {rateLimitInfo.ai.remaining <= 1 && (
        <span className="text-red-500 text-[10px]">🚨</span>
      )}
    </div>
  );
}
