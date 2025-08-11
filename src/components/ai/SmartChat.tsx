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
  HelpCircle
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
      content: 'Bonjour ! Je suis ton assistant IA YouCode. Comment puis-je t\'aider aujourd\'hui ? 🚀',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [courseContext, setCourseContext] = useState('');
  const [lessonContext, setLessonContext] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Extraire le contexte depuis l'URL au chargement et quand l'URL change
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
          
          console.log('🎯 Contexte extrait:', {
            course: data.context.courseContext,
            lesson: data.context.lessonContext,
            url: currentURL
          });
        }
      } catch (error) {
        console.error('❌ Erreur lors de l\'extraction du contexte:', error);
        // En cas d'erreur, on garde les contextes vides
        setCourseContext('');
        setLessonContext('');
      }
    };

    extractContextFromURL();
  }, [pathname]);

  // Détection du contexte basée sur le pathname
  const getContext = () => {
    if (!pathname) return 'home';
    if (pathname.startsWith('/admin')) return 'admin';
    if (pathname.startsWith('/user')) return 'user';
    if (pathname.startsWith('/public')) return 'public';
    if (pathname.startsWith('/account')) return 'account';
    return 'home';
  };

  const context = getContext();

  // Suggestions contextuelles adaptées
  const getSuggestions = (): Suggestion[] => {
    const baseSuggestions: Suggestion[] = [
      {
        id: 'explain-concept',
        text: 'Expliquer un concept',
        icon: <BookOpen className="w-4 h-4" />,
        prompt: 'Peux-tu m\'expliquer un concept de programmation de manière simple et avec des exemples ?'
      },
      {
        id: 'code-example',
        text: 'Exemple de code',
        icon: <Code className="w-4 h-4" />,
        prompt: 'Peux-tu me donner un exemple de code pratique avec des commentaires explicatifs ?'
      },
      {
        id: 'learning-tips',
        text: 'Conseils d\'apprentissage',
        icon: <Lightbulb className="w-4 h-4" />,
        prompt: 'Peux-tu me donner des conseils pour bien apprendre la programmation ?'
      }
    ];

    const contextualSuggestions: Suggestion[] = [];

    switch (context) {
      case 'admin':
        contextualSuggestions.push(
          {
            id: 'course-creation',
            text: 'Créer un cours',
            icon: <Target className="w-4 h-4" />,
            prompt: 'Comment puis-je créer un cours efficace sur YouCode ? Quelles sont les bonnes pratiques ?'
          },
          {
            id: 'ai-generation',
            text: 'Utiliser l\'IA',
            icon: <Sparkles className="w-4 h-4" />,
            prompt: 'Comment utiliser l\'IA de YouCode pour générer du contenu de cours de qualité ?'
          }
        );
        break;
      
      case 'user':
        contextualSuggestions.push(
          {
            id: 'course-selection',
            text: 'Choisir des cours',
            icon: <Target className="w-4 h-4" />,
            prompt: 'Comment choisir les bons cours pour mon apprentissage ? Quels critères utiliser ?'
          },
          {
            id: 'study-strategy',
            text: 'Stratégie d\'étude',
            icon: <Lightbulb className="w-4 h-4" />,
            prompt: 'Quelle stratégie d\'étude recommandes-tu pour apprendre la programmation efficacement ?'
          }
        );
        break;
      
      case 'public':
        contextualSuggestions.push(
          {
            id: 'browse-lessons',
            text: 'Parcourir les leçons',
            icon: <BookOpen className="w-4 h-4" />,
            prompt: 'Comment naviguer efficacement dans les leçons publiques de YouCode ?'
          },
          {
            id: 'sign-in',
            text: 'Se connecter à YouCode',
            icon: <Target className="w-4 h-4" />,
            prompt: 'Comment se connecter à YouCode et créer un compte pour accéder à plus de fonctionnalités ?'
          }
        );
        break;
      
      case 'account':
        contextualSuggestions.push(
          {
            id: 'profile-management',
            text: 'Gérer mon profil',
            icon: <HelpCircle className="w-4 h-4" />,
            prompt: 'Comment optimiser mon profil utilisateur sur YouCode ?'
          }
        );
        break;
      
      default: // home
        contextualSuggestions.push(
          {
            id: 'youcode-overview',
            text: 'Découvrir YouCode',
            icon: <Sparkles className="w-4 h-4" />,
            prompt: 'Peux-tu me donner un aperçu complet de la plateforme YouCode et ses fonctionnalités ?'
          },
          {
            id: 'getting-started',
            text: 'Commencer',
            icon: <Zap className="w-4 h-4" />,
            prompt: 'Comment commencer à utiliser YouCode ? Quelles sont les premières étapes ?'
          }
        );
    }

    return [...baseSuggestions, ...contextualSuggestions];
  };

  const suggestions = getSuggestions();

  // Auto-scroll vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus sur l'input quand le chat s'ouvre
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
          const reader = response.body?.getReader();
          if (reader) {
            let assistantMessage = '';
            const assistantMessageId = (Date.now() + 1).toString();
            
            // Ajouter le message initial
            setMessages(prev => [...prev, {
              id: assistantMessageId,
              role: 'assistant',
              content: '',
              timestamp: new Date()
            }]);
            
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              
              const chunk = new TextDecoder().decode(value);
              assistantMessage += chunk;
              
              // Mettre à jour le message en temps réel
              setMessages(prev => prev.map(msg => 
                msg.id === assistantMessageId 
                  ? { ...msg, content: assistantMessage }
                  : msg
              ));
            }
          }
        } else {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Erreur lors de l\'envoi du message:', error);
        toast.error('Erreur de connexion. Veuillez réessayer.');
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Désolé, une erreur est survenue. Veuillez réessayer.',
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
      content: 'Bonjour ! Je suis ton assistant IA YouCode. Comment puis-je t\'aider aujourd\'hui ? 🚀',
      timestamp: new Date()
    }]);
    toast.success('Conversation effacée');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getPositionClasses = () => {
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
          className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          title="Ouvrir l'assistant IA YouCode"
        >
          <MessageCircle className="w-7 h-7" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`fixed ${getPositionClasses()} z-50 ${className}`}>
      <Card className="w-80 shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Bot className="w-4 h-4" />
              Assistant IA YouCode
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearChat}
                className="text-white hover:bg-blue-700 h-7 w-7 p-0"
                title="Nouvelle conversation"
              >
                <RefreshCw className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-blue-700 h-7 w-7 p-0"
                title="Fermer"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
              {context === 'admin' ? 'Mode Admin' : 
               context === 'user' ? 'Mode Étudiant' : 
               context === 'public' ? 'Mode Public' : 
               context === 'account' ? 'Mon Compte' : 'Accueil'}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* Suggestions contextuelles */}
          <div className="p-3 bg-gray-50 border-b">
            <div className="text-xs font-medium text-gray-700 mb-2">
              💡 Suggestions contextuelles :
            </div>
            <div className="flex flex-wrap gap-1">
              {suggestions.slice(0, 4).map((suggestion) => (
                <Button
                  key={suggestion.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-xs h-auto py-1 px-2 flex items-center gap-1"
                  disabled={isLoading}
                >
                  {suggestion.icon}
                  {suggestion.text}
                </Button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="p-3 space-y-3 max-h-64 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3 h-3 text-blue-600" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-xs ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="whitespace-pre-wrap">
                    {message.content}
                  </div>
                  <div className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </div>
                </div>

                {message.role === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <User className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-2 justify-start">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <Bot className="w-3 h-3 text-blue-600" />
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

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="p-3 border-t bg-gray-50">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Posez votre question..."
                disabled={isLoading}
                className="flex-1 text-sm"
                maxLength={500}
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-blue-600 hover:bg-blue-700 px-3"
                size="sm"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            <div className="text-xs text-gray-500 mt-1 text-center">
              {input.length}/500 caractères
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
