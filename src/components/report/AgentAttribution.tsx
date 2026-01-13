'use client';

import {
  Search,
  Zap,
  Eye,
  Brain,
  MessageSquare,
  Code,
  Sparkles,
} from 'lucide-react';
import { AgentName, AgentRole } from '@/lib/llm/types';

interface AgentAttributionProps {
  agentName: AgentName;
  role?: AgentRole;
  size?: 'sm' | 'md' | 'lg';
  showRole?: boolean;
  className?: string;
}

// Agent configurations with icons and colors
const AGENT_CONFIG: Record<
  AgentName,
  {
    displayName: string;
    role: AgentRole;
    roleLabel: string;
    Icon: typeof Search;
    color: string;
    bgColor: string;
    borderColor: string;
    glowColor: string;
  }
> = {
  perplexity: {
    displayName: 'Perplexity',
    role: 'research',
    roleLabel: 'Research',
    Icon: Search,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/30',
    glowColor: 'rgba(168,85,247,0.3)',
  },
  grok: {
    displayName: 'Grok',
    role: 'realtime',
    roleLabel: 'Real-time',
    Icon: Zap,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
    borderColor: 'border-orange-500/30',
    glowColor: 'rgba(249,115,22,0.3)',
  },
  gemini: {
    displayName: 'Gemini',
    role: 'visual',
    roleLabel: 'Visual',
    Icon: Eye,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/20',
    borderColor: 'border-cyan-500/30',
    glowColor: 'rgba(6,182,212,0.3)',
  },
  claude: {
    displayName: 'Claude',
    role: 'strategy',
    roleLabel: 'Strategy',
    Icon: Brain,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
    borderColor: 'border-amber-500/30',
    glowColor: 'rgba(245,158,11,0.3)',
  },
  chatgpt: {
    displayName: 'ChatGPT',
    role: 'general',
    roleLabel: 'General',
    Icon: MessageSquare,
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/30',
    glowColor: 'rgba(34,197,94,0.3)',
  },
  deepseek: {
    displayName: 'DeepSeek',
    role: 'technical',
    roleLabel: 'Technical',
    Icon: Code,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/30',
    glowColor: 'rgba(59,130,246,0.3)',
  },
};

export default function AgentAttribution({
  agentName,
  size = 'md',
  showRole = true,
  className = '',
}: AgentAttributionProps) {
  const config = AGENT_CONFIG[agentName];
  if (!config) return null;

  const roleLabel = showRole ? config.roleLabel : '';

  // Size configurations
  const sizeConfig = {
    sm: {
      container: 'px-2 py-0.5 text-xs gap-1',
      icon: 12,
    },
    md: {
      container: 'px-2.5 py-1 text-sm gap-1.5',
      icon: 14,
    },
    lg: {
      container: 'px-3 py-1.5 text-base gap-2',
      icon: 18,
    },
  };

  const sizeStyles = sizeConfig[size];

  return (
    <div
      className={`
        inline-flex items-center rounded-full border backdrop-blur-sm
        ${config.bgColor} ${config.borderColor} ${config.color}
        ${sizeStyles.container}
        transition-all duration-300 hover:scale-105
        ${className}
      `}
      style={{
        boxShadow: `0 0 15px ${config.glowColor}`,
      }}
      title={`Insight from ${config.displayName} (${config.roleLabel} Agent)`}
    >
      <config.Icon size={sizeStyles.icon} className="flex-shrink-0" />
      <span className="font-medium">{config.displayName}</span>
      {showRole && size !== 'sm' && (
        <span className="text-dark-text-secondary text-xs hidden sm:inline">
          ({roleLabel})
        </span>
      )}
    </div>
  );
}

// Export a component to show multiple agents
interface AgentListProps {
  agents: AgentName[];
  size?: 'sm' | 'md' | 'lg';
  maxDisplay?: number;
  className?: string;
}

export function AgentList({
  agents,
  size = 'sm',
  maxDisplay = 3,
  className = '',
}: AgentListProps) {
  const displayedAgents = agents.slice(0, maxDisplay);
  const remainingCount = agents.length - maxDisplay;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <Sparkles size={14} className="text-dark-text-secondary" />
      <span className="text-xs text-dark-text-secondary">Powered by:</span>
      {displayedAgents.map((agent) => (
        <AgentAttribution
          key={agent}
          agentName={agent}
          size={size}
          showRole={false}
        />
      ))}
      {remainingCount > 0 && (
        <span className="text-xs text-dark-text-secondary">
          +{remainingCount} more
        </span>
      )}
    </div>
  );
}
