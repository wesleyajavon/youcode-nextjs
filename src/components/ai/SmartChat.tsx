'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/common/button';
import { Input } from '@/components/ui/common/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/common/card';
import { Badge } from '@/components/ui/common/badge';
import { 
  Loader2, 
  Send, 
  Bot, 
  User, 
  MessageCircle, 
  X, 
  RefreshCw, 
  Minimize2,
  Sparkles,
  BookOpen,
  Code,
  Lightbulb,
  Target,
  Zap,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Database
} from 'lucide-react';
import { toast } from 'sonner';
import { usePathname } from 'next/navigation';

interface SmartChatProps {
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  cached?: boolean;
}

interface Suggestion {
  id: string;
  text: string;
  icon: React.ReactNode;
  prompt: string;
}

export function SmartChat({ 
  className = '',
  position = 'bottom-right'
}: SmartChatProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I\'m your YouCode AI assistant. How can I help you today? 🚀',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [courseContext, setCourseContext] = useState('');
  const [lessonContext, setLessonContext] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [cacheStats, setCacheStats] = useState({ hits: 0, misses: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Extract context from URL on load and when URL changes
  useEffect(() => {
    const extractContextFromURL = async () => {
      if (!pathname) return;

      const currentURL = `${window.location.origin}${pathname}`;
      
      try {
        const response = await fetch('/api/ai/context', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: currentURL }),
        });

        if (response.ok) {
          const data = await response.json();
          setCourseContext(data.context.courseContext || '');
          setLessonContext(data.context.lessonContext || '');
          
          // Update cache stats
          if (data.cached) {
            setCacheStats(prev => ({ ...prev, hits: prev.hits + 1 }));
          } else {
            setCacheStats(prev => ({ ...prev, misses: prev.misses + 1 }));
          }
          
          console.log('🎯 Context extracted:', {
            course: data.context.courseContext,
            lesson: data.context.lessonContext,
            url: currentURL,
            cached: data.cached
          });
        }
      } catch (error) {
        console.error('❌ Error extracting context:', error);
        // In case of error, keep empty contexts
        setCourseContext('');
        setLessonContext('');
      }
    };

    extractContextFromURL();
  }, [pathname]);

  // Context detection based on pathname
  const getContext = () => {
    if (!pathname) return 'home';
    if (pathname.startsWith('/admin')) return 'admin';
    if (pathname.startsWith('/user')) return 'user';
    if (pathname.startsWith('/public')) return 'public';
    if (pathname.startsWith('/account')) return 'account';
    return 'home';
  };

  const context = getContext();

  // Contextual suggestions adapted
  const getSuggestions = (): Suggestion[] => {
    const baseSuggestions: Suggestion[] = [
      {
        id: 'explain-concept',
        text: 'Explain a concept',
        icon: <BookOpen className="w-4 h-4" />,
        prompt: 'Can you explain a programming concept in a simple way with examples?'
      },
      {
        id: 'code-example',
        text: 'Code example',
        icon: <Code className="w-4 h-4" />,
        prompt: 'Can you give me a practical code example with explanatory comments?'
      },
      {
        id: 'learning-tips',
        text: 'Learning tips',
        icon: <Lightbulb className="w-4 h-4" />,
        prompt: 'Can you give me tips for learning programming effectively?'
      }
    ];

    const contextualSuggestions: Suggestion[] = [];

    switch (context) {
      case 'admin':
        contextualSuggestions.push(
          {
            id: 'course-creation',
            text: 'Create a course',
            icon: <Target className="w-4 h-4" />,
            prompt: 'How can I create an effective course on YouCode? What are the best practices?'
          },
          {
            id: 'ai-generation',
            text: 'Use AI',
            icon: <Sparkles className="w-4 h-4" />,
            prompt: 'How to use YouCode AI to generate quality course content?'
          }
        );
        break;
      
      case 'user':
        contextualSuggestions.push(
          {
            id: 'course-selection',
            text: 'Choose courses',
            icon: <Target className="w-4 h-4" />,
            prompt: 'How to choose the right courses for my learning? What criteria should I use?'
          },
          {
            id: 'study-strategy',
            text: 'Study strategy',
            icon: <Lightbulb className="w-4 h-4" />,
            prompt: 'What study strategy do you recommend for learning programming effectively?'
          }
        );
        break;
      
      case 'public':
        contextualSuggestions.push(
          {
            id: 'browse-lessons',
            text: 'Browse lessons',
            icon: <BookOpen className="w-4 h-4" />,
            prompt: 'How to navigate efficiently through YouCode public lessons?'
          },
          {
            id: 'sign-in',
            text: 'Sign in to YouCode',
            icon: <Target className="w-4 h-4" />,
            prompt: 'How to sign in to YouCode and create an account to access more features?'
          }
        );
        break;
      
      case 'account':
        contextualSuggestions.push(
          {
            id: 'profile-management',
            text: 'Manage my profile',
            icon: <HelpCircle className="w-4 h-4" />,
            prompt: 'How to optimize my user profile on YouCode?'
          }
        );
        break;
      
      default: // home
        contextualSuggestions.push(
          {
            id: 'youcode-overview',
            text: 'Discover YouCode',
            icon: <Sparkles className="w-4 h-4" />,
            prompt: 'Can you give me a complete overview of the YouCode platform and its features?'
          },
          {
            id: 'getting-started',
            text: 'Get started',
            icon: <Zap className="w-4 h-4" />,
            prompt: 'How to start using YouCode? What are the first steps?'
          }
        );
    }

    return [...baseSuggestions, ...contextualSuggestions];
  };

  const suggestions = getSuggestions();

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus on input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setInput(suggestion.prompt);
    inputRef.current?.focus();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: input.trim(),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      setIsLoading(true);
      setIsTyping(true);

      try {
        const response = await fetch('/api/ai/assistant', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [...messages, userMessage].map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            courseContext: courseContext,
            lessonContext: lessonContext,
            userLevel: 'beginner',
            topic: 'programming'
          })
        });

        if (response.ok) {
          const isCached = response.headers.get('X-Cached') === 'true';
          
          // Update cache stats
          if (isCached) {
            setCacheStats(prev => ({ ...prev, hits: prev.hits + 1 }));
          } else {
            setCacheStats(prev => ({ ...prev, misses: prev.misses + 1 }));
          }

          const reader = response.body?.getReader();
          if (reader) {
            let assistantMessage = '';
            const assistantMessageId = (Date.now() + 1).toString();
            
            // Add initial message
            setMessages(prev => [...prev, {
              id: assistantMessageId,
              role: 'assistant',
              content: '',
              timestamp: new Date(),
              cached: isCached
            }]);
            
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              
              const chunk = new TextDecoder().decode(value);
              assistantMessage += chunk;
              
              // Update message in real time
              setMessages(prev => prev.map(msg => 
                msg.id === assistantMessageId 
                  ? { ...msg, content: assistantMessage }
                  : msg
              ));
            }
          }
        } else {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error sending message:', error);
        toast.error('Connection error. Please try again.');
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Sorry, an error occurred. Please try again.',
          timestamp: new Date()
        }]);
      } finally {
        setIsLoading(false);
        setIsTyping(false);
      }
    }
  };

  const clearChat = () => {
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I\'m your YouCode AI assistant. How can I help you today? 🚀',
      timestamp: new Date()
    }]);
    toast.success('Conversation cleared');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getPositionClasses = () => {
    // On mobile, always position at bottom center for better UX
    if (isMobile) {
      return 'bottom-4 left-1/2 transform -translate-x-1/2';
    }
    
    switch (position) {
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      default:
        return 'bottom-4 right-4';
    }
  };

  if (!isOpen) {
    return (
      <div className={`fixed ${getPositionClasses()} z-50 ${className}`}>
        <Button
          onClick={() => setIsOpen(true)}
          className={`${isMobile ? 'h-16 w-16' : 'h-14 w-14'} rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200`}
          title="Open YouCode AI Assistant"
        >
          <MessageCircle className={`${isMobile ? 'w-8 h-8' : 'w-7 h-7'}`} />
        </Button>
      </div>
    );
  }

  return (
    <div className={`fixed ${getPositionClasses()} z-50 ${className}`}>
      <Card className={`${isMobile ? 'w-[calc(100vw-2rem)] max-w-sm' : 'w-80'} shadow-2xl border-0 backdrop-blur-sm`}>
        <CardHeader className="bg-gradient-to-r from-blue-900 to-purple-900 p-4 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className={`${isMobile ? 'text-base' : 'text-sm'} flex items-center gap-2 text-white`}>
              <Bot className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'}`} />
              YouCode AI Assistant
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size={isMobile ? "default" : "sm"}
                onClick={clearChat}
                title="New conversation"
                className={isMobile ? "h-8 px-2" : ""}
              >
                <RefreshCw className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'}`} />
              </Button>
              <Button
                variant="destructive"
                size={isMobile ? "default" : "sm"}
                onClick={() => setIsOpen(false)}
                title="Close"
                className={isMobile ? "h-8 px-2" : ""}
              >
                <X className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'}`} />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
              {context === 'admin' ? 'Admin Mode' : 
               context === 'user' ? 'Student Mode' : 
               context === 'public' ? 'Public Mode' : 
               context === 'account' ? 'My Account' : 'Home'}
            </Badge>
            {/* Cache stats indicator */}
            <div className="flex items-center gap-1 text-blue-200">
              <Database className="w-3 h-3" />
              <span className="text-xs">
                {cacheStats.hits + cacheStats.misses > 0 
                  ? `${Math.round((cacheStats.hits / (cacheStats.hits + cacheStats.misses)) * 100)}%`
                  : '0%'
                }
              </span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* Contextual suggestions */}
          <div className="border-b">
            <div className="p-3 pb-2">
              <div className="flex items-center justify-between">
                <div className={`${isMobile ? 'text-sm' : 'text-xs'} font-medium text-gray-700`}>
                  💡 Contextual suggestions:
                </div>
                <Button
                  variant="ghost"
                  size={isMobile ? "default" : "sm"}
                  onClick={() => setShowSuggestions(!showSuggestions)}
                  className={`${isMobile ? 'h-8 w-8' : 'h-6 w-6'} p-0 hover:bg-gray-100`}
                  title={showSuggestions ? 'Hide suggestions' : 'Show suggestions'}
                >
                  {showSuggestions ? (
                    <ChevronUp className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'}`} />
                  ) : (
                    <ChevronDown className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'}`} />
                  )}
                </Button>
              </div>
            </div>
            
            {showSuggestions && (
              <div className="px-3 pb-3">
                <div className="flex flex-wrap gap-2">
                  {suggestions.slice(0, isMobile ? 3 : 4).map((suggestion) => (
                    <Button
                      key={suggestion.id}
                      variant="outline"
                      size={isMobile ? "default" : "sm"}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={`${isMobile ? 'text-sm h-10 px-3' : 'text-xs h-auto py-1 px-2'} flex items-center gap-2`}
                      disabled={isLoading}
                    >
                      {suggestion.icon}
                      <span className={isMobile ? 'hidden sm:inline' : 'inline'}>
                        {suggestion.text}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Messages */}
          <div className={`p-3 space-y-3 ${isMobile ? 'max-h-80' : 'max-h-64'} overflow-y-auto`}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className={`${isMobile ? 'w-8 h-8' : 'w-6 h-6'} rounded-full bg-primary/5 flex items-center justify-center flex-shrink-0`}>
                    <Bot className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'} text-blue-600`} />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 ${isMobile ? 'text-sm' : 'text-xs'} ${
                    message.role === 'user'
                      ? 'bg-primary/50 text-white'
                      : 'bg-primary/5 text-card-foreground'
                  }`}
                >
                  <div className="whitespace-pre-wrap">
                    {message.content}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className={`${isMobile ? 'text-sm' : 'text-xs'} mt-1 ${
                      message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                    </div>
                    {message.cached && message.role === 'assistant' && (
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <Database className="w-3 h-3" />
                        <span>Cached</span>
                      </div>
                    )}
                  </div>
                </div>

                {message.role === 'user' && (
                  <div className={`${isMobile ? 'w-8 h-8' : 'w-6 h-6'} rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0`}>
                    <User className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'} text-white`} />
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-2 justify-start">
                <div className={`${isMobile ? 'w-8 h-8' : 'w-6 h-6'} rounded-full bg-blue-100 flex items-center justify-center`}>
                  <Bot className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'} text-blue-600`} />
                </div>
                <div className="bg-gray-100 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-3 border-t">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your question..."
                disabled={isLoading}
                className={`flex-1 ${isMobile ? 'text-base h-12' : 'text-sm'}`}
                maxLength={500}
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-blue-600 hover:bg-blue-700 px-3"
                size={isMobile ? "default" : "sm"}
              >
                {isLoading ? (
                  <Loader2 className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'} animate-spin`} />
                ) : (
                  <Send className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'}`} />
                )}
              </Button>
            </div>
            <div className={`${isMobile ? 'text-sm' : 'text-xs'} text-gray-500 mt-2 text-center`}>
              {input.length}/500 characters
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
