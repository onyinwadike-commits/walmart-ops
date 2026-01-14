'use client';

import { useState } from 'react';
import {
  MessageSquare,
  FileText,
  Brain,
  MousePointer,
  Lightbulb,
  Swords,
  Camera,
  Star,
  Send,
  ChevronDown,
  Store,
  CheckCircle,
} from 'lucide-react';
import { MARKET_396_STORES, Store as StoreType } from '@/data/stores';

// Feedback Categories with sentence starters (from BUILD_PLAN.md)
const FEEDBACK_CATEGORIES = [
  {
    id: 'report-quality',
    label: 'Report Quality',
    icon: FileText,
    color: '#3B82F6',
    sentenceStarters: [
      'The executive summary was...',
      'I found the action items to be...',
      'The competitive intel section could...',
      'The data accuracy was...'
    ]
  },
  {
    id: 'ai-accuracy',
    label: 'AI Accuracy',
    icon: Brain,
    color: '#8B5CF6',
    sentenceStarters: [
      'The AI recommendations were...',
      'The consensus between LLMs was...',
      'The predictions for my store were...',
      'I noticed the AI missed...'
    ]
  },
  {
    id: 'usability',
    label: 'Usability',
    icon: MousePointer,
    color: '#10B981',
    sentenceStarters: [
      'The interface makes it easy to...',
      'I had trouble finding...',
      'The navigation could be improved by...',
      'The loading times were...'
    ]
  },
  {
    id: 'feature-request',
    label: 'Feature Request',
    icon: Lightbulb,
    color: '#F59E0B',
    sentenceStarters: [
      'I wish the app could...',
      'It would be helpful if...',
      'My team needs...',
      'A great addition would be...'
    ]
  },
  {
    id: 'amazon-warfare',
    label: 'Amazon Warfare',
    icon: Swords,
    color: '#EF4444',
    sentenceStarters: [
      'The price tracking helped me...',
      'I responded to an Amazon threat by...',
      'The battleground view showed...',
      'I need better visibility into...'
    ]
  },
  {
    id: 'visual-merch',
    label: 'Visual Merchandising',
    icon: Camera,
    color: '#EC4899',
    sentenceStarters: [
      'The shelf analysis identified...',
      'The compliance score was...',
      'The AI recommendations for displays were...',
      'I used the camera feature to...'
    ]
  }
];

export default function FeedbackPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStarter, setSelectedStarter] = useState<string>('');
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [rating, setRating] = useState<number>(0);
  const [selectedStore, setSelectedStore] = useState<StoreType | null>(MARKET_396_STORES[0]);
  const [showStoreDropdown, setShowStoreDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const activeCategory = FEEDBACK_CATEGORIES.find(c => c.id === selectedCategory);

  const handleStarterClick = (starter: string) => {
    setSelectedStarter(starter);
    setFeedbackText(starter + ' ');
  };

  const handleSubmit = async () => {
    if (!selectedCategory || !feedbackText.trim() || rating === 0) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('Feedback submitted:', {
      category: selectedCategory,
      store: selectedStore?.number,
      feedback: feedbackText,
      rating,
    });

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset after 3 seconds
    setTimeout(() => {
      setSelectedCategory(null);
      setSelectedStarter('');
      setFeedbackText('');
      setRating(0);
      setIsSubmitted(false);
    }, 3000);
  };

  const canSubmit = selectedCategory && feedbackText.trim().length > 10 && rating > 0;

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-dark-bg p-6 flex items-center justify-center">
        <div className="glass-card p-12 rounded-2xl text-center max-w-md animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-dark-text mb-2">Thank You!</h2>
          <p className="text-dark-text-secondary">
            Your feedback has been submitted and will help us improve the Store Operations Orchestrator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg">
              <MessageSquare size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-dark-text">Share Your Feedback</h1>
              <p className="text-dark-text-secondary">
                Help us improve the Store Operations Orchestrator
              </p>
            </div>
          </div>

          {/* Store Selector */}
          <div className="relative">
            <button
              onClick={() => setShowStoreDropdown(!showStoreDropdown)}
              className="flex items-center gap-3 px-4 py-2.5 glass-card rounded-xl border border-dark-border hover:border-walmart-blue transition-colors"
            >
              <Store size={18} className="text-walmart-blue" />
              <span className="text-dark-text font-medium">
                {selectedStore?.name || 'Select Store'}
              </span>
              <ChevronDown size={16} className={`text-dark-text-secondary transition-transform ${showStoreDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showStoreDropdown && (
              <div className="absolute top-full mt-2 right-0 w-72 glass-card rounded-xl border border-dark-border p-2 z-50 max-h-80 overflow-y-auto">
                {MARKET_396_STORES.map(store => (
                  <button
                    key={store.id}
                    onClick={() => {
                      setSelectedStore(store);
                      setShowStoreDropdown(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      selectedStore?.id === store.id
                        ? 'bg-walmart-blue/20 text-walmart-blue'
                        : 'text-dark-text hover:bg-dark-surface'
                    }`}
                  >
                    <Store size={16} />
                    <div className="text-left">
                      <p className="text-sm font-medium">{store.name}</p>
                      <p className="text-xs text-dark-text-secondary">#{store.number}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Feedback Form */}
        <div className="glass-card p-8 rounded-2xl">
          {/* Category Selection */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-dark-text-secondary uppercase tracking-wider mb-4">
              Select Category
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {FEEDBACK_CATEGORIES.map((category) => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.id;

                return (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setSelectedStarter('');
                      setFeedbackText('');
                    }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-current'
                        : 'border-transparent glass-light hover:bg-dark-surface'
                    }`}
                    style={{
                      borderColor: isSelected ? category.color : 'transparent',
                      backgroundColor: isSelected ? `${category.color}15` : undefined,
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                      style={{ backgroundColor: `${category.color}25`, color: category.color }}
                    >
                      <Icon size={20} />
                    </div>
                    <span className="text-sm font-medium text-dark-text">{category.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sentence Starters */}
          {activeCategory && (
            <div className="mb-6 animate-fade-in">
              <h3 className="text-sm font-semibold text-dark-text-secondary uppercase tracking-wider mb-3">
                Start with...
              </h3>
              <div className="flex flex-wrap gap-2">
                {activeCategory.sentenceStarters.map((starter) => (
                  <button
                    key={starter}
                    onClick={() => handleStarterClick(starter)}
                    className={`px-4 py-2 rounded-full text-sm transition-all ${
                      selectedStarter === starter
                        ? 'text-dark-bg font-medium'
                        : 'glass-light text-dark-text-secondary hover:text-dark-text'
                    }`}
                    style={{
                      backgroundColor: selectedStarter === starter ? activeCategory.color : undefined,
                    }}
                  >
                    {starter}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Feedback Input */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-dark-text-secondary uppercase tracking-wider mb-3">
              Your Feedback
            </h3>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder={selectedCategory ? 'Continue your thought...' : 'Select a category first...'}
              disabled={!selectedCategory}
              className="w-full h-40 p-4 rounded-xl bg-dark-surface/50 border border-dark-border text-dark-text placeholder-dark-text-secondary resize-none focus:border-walmart-blue focus:outline-none transition-colors disabled:opacity-50"
            />
            <p className="text-xs text-dark-text-secondary mt-2 text-right">
              {feedbackText.length} characters
            </p>
          </div>

          {/* Rating */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-dark-text-secondary uppercase tracking-wider mb-3">
              Overall Experience
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      size={32}
                      className={star <= rating ? 'text-spark-yellow' : 'text-dark-text-secondary'}
                      fill={star <= rating ? 'currentColor' : 'none'}
                    />
                  </button>
                ))}
              </div>
              <span className="text-sm text-dark-text-secondary">
                {rating === 0 && 'Select a rating'}
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent'}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold text-lg transition-all ${
              canSubmit && !isSubmitting
                ? 'bg-gradient-to-r from-walmart-blue to-walmart-blue-dark text-white shadow-neon-blue hover:shadow-lg'
                : 'bg-dark-surface text-dark-text-secondary cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send size={20} />
                <span>Submit Feedback</span>
              </>
            )}
          </button>
        </div>

        {/* Recent Feedback Preview */}
        <div className="mt-8 glass-card p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-dark-text mb-4">
            Recent Feedback from Market 396
          </h3>
          <div className="space-y-4">
            {[
              {
                category: 'report-quality',
                store: 3455,
                text: 'The executive summary was very comprehensive and saved me 30 minutes of prep time this morning.',
                rating: 5,
                date: '2 hours ago',
              },
              {
                category: 'amazon-warfare',
                store: 4338,
                text: 'The price tracking helped me respond to a competitor price drop within 2 hours.',
                rating: 4,
                date: '1 day ago',
              },
              {
                category: 'feature-request',
                store: 2059,
                text: 'I wish the app could send push notifications for critical alerts.',
                rating: 3,
                date: '3 days ago',
              },
            ].map((fb, idx) => {
              const cat = FEEDBACK_CATEGORIES.find(c => c.id === fb.category);
              const Icon = cat?.icon || MessageSquare;

              return (
                <div key={idx} className="glass-light p-4 rounded-xl">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${cat?.color}25`, color: cat?.color }}
                      >
                        <Icon size={16} />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-dark-text">{cat?.label}</span>
                        <span className="text-xs text-dark-text-secondary ml-2">• Store #{fb.store}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star
                          key={star}
                          size={12}
                          className={star <= fb.rating ? 'text-spark-yellow' : 'text-dark-text-secondary'}
                          fill={star <= fb.rating ? 'currentColor' : 'none'}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-dark-text-secondary">{fb.text}</p>
                  <p className="text-xs text-dark-text-secondary mt-2">{fb.date}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
