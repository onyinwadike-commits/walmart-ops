'use client';

import { useState, useEffect } from 'react';
import {
  X,
  Mail,
  FileText,
  ListChecks,
  TrendingUp,
  ShoppingCart,
  Activity,
  ClipboardCheck,
  AlertTriangle,
  MessageCircle,
  Share2,
  Award,
  Zap,
  Sparkles,
  Loader2,
  Check,
  Send,
  CheckCircle2,
} from 'lucide-react';

type SectionId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K';

interface ReportOption {
  id: SectionId;
  title: string;
  description: string;
  icon: typeof FileText;
  color: string;
}

const REPORT_OPTIONS: ReportOption[] = [
  { id: 'A', title: 'Executive Summary', description: 'High-level store overview with AI insights', icon: FileText, color: '#3B82F6' },
  { id: 'B', title: 'Prioritized Action Plan', description: 'Dynamic task prioritization', icon: ListChecks, color: '#22C55E' },
  { id: 'C', title: 'Competitive Outperform', description: 'Real-time competitive intelligence', icon: TrendingUp, color: '#A855F7' },
  { id: 'D', title: 'E-Commerce Benchmark', description: 'OGP/Delivery performance metrics', icon: ShoppingCart, color: '#06B6D4' },
  { id: 'E', title: 'Predictive Stress Map', description: 'AI-predicted pressure points', icon: Activity, color: '#F97316' },
  { id: 'F', title: 'Dept Checklists', description: 'Dynamic department checklists', icon: ClipboardCheck, color: '#14B8A6' },
  { id: 'G', title: 'Risk Watchlist', description: 'Proactive risk identification', icon: AlertTriangle, color: '#F59E0B' },
  { id: 'H', title: 'End-of-Day Scorecard', description: 'Performance tracking metrics', icon: Award, color: '#84CC16' },
  { id: 'I', title: 'Communication Aids', description: 'Pre-written messages & scripts', icon: MessageCircle, color: '#6366F1' },
  { id: 'J', title: 'Social Media Plan', description: 'Weekly content calendar', icon: Share2, color: '#EC4899' },
  { id: 'K', title: 'Amazon Warfare', description: 'Competitive counter-strategies', icon: Zap, color: '#EF4444' },
];

interface ReportEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeNumber: number;
  storeName: string;
}

type GenerationStatus = 'idle' | 'generating' | 'formatting' | 'sending' | 'success' | 'error';

export default function ReportEmailModal({
  isOpen,
  onClose,
  storeNumber,
  storeName,
}: ReportEmailModalProps) {
  const [email, setEmail] = useState('');
  const [selectedReports, setSelectedReports] = useState<Set<SectionId>>(new Set<SectionId>(['A', 'B', 'G']));
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
      setProgress(0);
      setCurrentStep('');
      setError(null);
    }
  }, [isOpen]);

  const toggleReport = (id: SectionId) => {
    const newSelected = new Set(selectedReports);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedReports(newSelected);
  };

  const selectAll = () => {
    setSelectedReports(new Set(REPORT_OPTIONS.map(r => r.id)));
  };

  const selectNone = () => {
    setSelectedReports(new Set());
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async () => {
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (selectedReports.size === 0) {
      setError('Please select at least one report');
      return;
    }

    setError(null);
    setStatus('generating');
    setProgress(0);

    try {
      const response = await fetch('/api/generate-email-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          sections: Array.from(selectedReports),
          storeNumber,
          storeName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      // Stream the progress updates
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value);
          const lines = text.split('\n').filter(l => l.trim());

          for (const line of lines) {
            try {
              const data = JSON.parse(line);
              if (data.progress) setProgress(data.progress);
              if (data.step) setCurrentStep(data.step);
              if (data.status) setStatus(data.status as GenerationStatus);
              if (data.error) {
                setError(data.error);
                setStatus('error');
              }
            } catch {
              // Not JSON, skip
            }
          }
        }
      }

      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setStatus('error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={status === 'idle' || status === 'error' ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-dark-card border border-dark-border shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-border bg-gradient-to-r from-spark-yellow/10 to-spark-orange/10">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-spark-yellow to-spark-orange">
              <Sparkles size={24} className="text-dark-bg" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-dark-text">Generate AI Report</h2>
              <p className="text-sm text-dark-text-secondary">Store #{storeNumber} - {storeName}</p>
            </div>
          </div>
          {(status === 'idle' || status === 'error' || status === 'success') && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-dark-surface transition-colors text-dark-text-secondary hover:text-white"
            >
              <X size={24} />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {status === 'success' ? (
            /* Success State */
            <div className="text-center py-12">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mx-auto mb-6">
                <CheckCircle2 size={48} className="text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-dark-text mb-2">Report Sent!</h3>
              <p className="text-dark-text-secondary mb-6">
                Your comprehensive AI report has been sent to<br />
                <span className="text-white font-medium">{email}</span>
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors"
              >
                Done
              </button>
            </div>
          ) : status !== 'idle' ? (
            /* Generating State */
            <div className="text-center py-12">
              <div className="relative w-32 h-32 mx-auto mb-6">
                {/* Outer glow */}
                <div className="absolute inset-0 bg-walmart-blue/20 rounded-full blur-xl animate-pulse" />
                {/* Progress ring */}
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-dark-surface"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={`${progress * 3.52} 352`}
                    strokeLinecap="round"
                    className="text-walmart-blue transition-all duration-300"
                  />
                </svg>
                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {status === 'generating' && <Loader2 size={32} className="text-walmart-blue animate-spin" />}
                  {status === 'formatting' && <Sparkles size={32} className="text-spark-yellow animate-pulse" />}
                  {status === 'sending' && <Send size={32} className="text-green-400 animate-bounce" />}
                </div>
              </div>
              <h3 className="text-xl font-bold text-dark-text mb-2">
                {status === 'generating' && 'Generating Reports...'}
                {status === 'formatting' && 'Formatting with Gemini...'}
                {status === 'sending' && 'Sending Email...'}
              </h3>
              <p className="text-dark-text-secondary mb-4">{currentStep}</p>
              <div className="text-2xl font-bold text-walmart-blue">{Math.round(progress)}%</div>
            </div>
          ) : (
            /* Form State */
            <>
              {/* Email Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-dark-text mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-text-secondary" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="manager@store.com"
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-dark-surface border border-dark-border text-dark-text placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-walmart-blue/50 focus:border-walmart-blue transition-all"
                  />
                </div>
                {error && error.includes('email') && (
                  <p className="text-red-400 text-sm mt-2">{error}</p>
                )}
              </div>

              {/* Report Selection */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-dark-text">
                    Select Reports ({selectedReports.size} selected)
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={selectAll}
                      className="text-xs text-walmart-blue hover:text-walmart-blue/80 transition-colors"
                    >
                      Select All
                    </button>
                    <span className="text-dark-text-secondary">|</span>
                    <button
                      onClick={selectNone}
                      className="text-xs text-dark-text-secondary hover:text-white transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {REPORT_OPTIONS.map((report) => {
                    const Icon = report.icon;
                    const isSelected = selectedReports.has(report.id);

                    return (
                      <button
                        key={report.id}
                        onClick={() => toggleReport(report.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                          isSelected
                            ? 'bg-dark-surface border-walmart-blue/50 ring-1 ring-walmart-blue/30'
                            : 'bg-dark-surface/50 border-dark-border hover:border-dark-border/80'
                        }`}
                      >
                        {/* Checkbox */}
                        <div
                          className={`flex items-center justify-center w-5 h-5 rounded-md border-2 transition-all ${
                            isSelected
                              ? 'bg-walmart-blue border-walmart-blue'
                              : 'border-dark-border'
                          }`}
                        >
                          {isSelected && <Check size={14} className="text-white" />}
                        </div>

                        {/* Icon */}
                        <div
                          className="flex items-center justify-center w-8 h-8 rounded-lg"
                          style={{ backgroundColor: `${report.color}20` }}
                        >
                          <Icon size={16} style={{ color: report.color }} />
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium text-dark-text block truncate">
                            {report.title}
                          </span>
                          <span className="text-xs text-dark-text-secondary block truncate">
                            {report.description}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {error && error.includes('report') && (
                  <p className="text-red-400 text-sm mt-2">{error}</p>
                )}
              </div>

              {/* Info Box */}
              <div className="p-4 rounded-xl bg-walmart-blue/10 border border-walmart-blue/20 mb-6">
                <div className="flex items-start gap-3">
                  <Sparkles size={20} className="text-walmart-blue flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-dark-text font-medium mb-1">AI-Powered Report Generation</p>
                    <p className="text-xs text-dark-text-secondary">
                      Each section will be generated using specialized AI models, then formatted by Gemini
                      into a beautiful, comprehensive report and sent directly to your email.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {status === 'idle' && (
          <div className="p-6 border-t border-dark-border bg-dark-surface/50">
            <div className="flex items-center justify-between">
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-xl text-dark-text-secondary hover:text-white hover:bg-dark-surface transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!email || selectedReports.size === 0}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-spark-yellow to-spark-orange text-dark-bg font-semibold hover:shadow-lg hover:shadow-spark-yellow/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
                Generate & Send Report
              </button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="p-6 border-t border-dark-border bg-red-500/10">
            <div className="flex items-center justify-between">
              <p className="text-red-400 text-sm">{error}</p>
              <button
                onClick={() => setStatus('idle')}
                className="px-6 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
