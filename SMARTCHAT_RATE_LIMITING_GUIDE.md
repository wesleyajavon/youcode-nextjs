# SmartChat Rate Limiting System Documentation

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture](#architecture)
3. [Configuration](#configuration)
4. [Implémentation](#implémentation)
5. [Utilisation](#utilisation)
6. [Tests](#tests)
7. [Monitoring](#monitoring)
8. [Dépannage](#dépannage)
9. [API Reference](#api-reference)

## 🎯 Vue d'ensemble

Le système de rate limiting SmartChat protège l'API YouCode AI contre les abus, la surcharge et assure un usage équitable entre tous les utilisateurs. Il utilise **Upstash Redis** avec la bibliothèque `@upstash/ratelimit` pour une gestion efficace des limites.

### **Objectifs principaux :**
- 🛡️ **Protection contre le spam** : Limite les requêtes par utilisateur
- ⚡ **Gestion de la charge** : Évite la surcharge du système
- 🎯 **Usage équitable** : Donne à tous un accès équitable
- 🚀 **Stabilité** : Protège contre les boucles infinies et abus

## 🏗️ Architecture

### **Composants du système :**

```
src/lib/rate-limit.ts          # Configuration des rate limiters
src/app/api/ai/context/route.ts    # API context avec rate limiting
src/app/api/ai/assistant/route.ts  # API assistant avec rate limiting
src/components/ai/RateLimitInfo.tsx # Composant d'affichage des limites
```

### **Flux de rate limiting :**

```
Requête → Identification utilisateur → Vérification limites → Traitement/Rejet
                ↓
        Headers, JWT, ou IP
                ↓
        Rate limiters Upstash
                ↓
        Réponse avec headers X-RateLimit
```

## ⚙️ Configuration

### **Rate Limiters configurés :**

```typescript
// Context API - Extraction de contexte
export const ratelimitSmartChatContext = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, "1m"), // 30 req/min
});

// AI Assistant - Génération de réponses
export const ratelimitSmartChatAI = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1m"), // 10 req/min
});

// Limite quotidienne - Contrôle d'usage
export const ratelimitSmartChatDaily = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(500, "1d"), // 500 req/jour
});

// Protection globale - Tous utilisateurs
export const ratelimitSmartChatGlobal = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1000, "1m"), // 1000 req/min
});
```

### **Limites par défaut :**

| Service | Limite | Fenêtre | Description |
|---------|--------|---------|-------------|
| **Context** | 30 | 1 minute | Extraction de contexte des URLs |
| **AI Assistant** | 10 | 1 minute | Génération de réponses AI |
| **AI Daily** | 500 | 1 jour | Limite quotidienne par utilisateur |
| **Global** | 1000 | 1 minute | Toutes requêtes confondues |

## 🔧 Implémentation

### **1. Identification des utilisateurs**

```typescript
export function getRateLimitIdentifier(request: Request): string {
  // 1. Header personnalisé X-User-ID
  const userId = request.headers.get('x-user-id');
  if (userId) return `user:${userId}`;
  
  // 2. Token JWT depuis Authorization
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    return `jwt:${token.substring(0, 8)}`;
  }
  
  // 3. Fallback sur l'adresse IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = realIp || forwardedFor?.split(',')[0] || 'unknown';
  
  return `ip:${ip}`;
}
```

### **2. Vérification des limites**

```typescript
// Vérification globale d'abord
const globalLimit = await ratelimitSmartChatGlobal.limit('global');
if (!globalLimit.success) {
  return NextResponse.json(
    { 
      success: false, 
      error: 'Global rate limit exceeded',
      details: 'Too many requests across all users. Please try again later.',
      retryAfter: globalLimit.reset - Date.now()
    },
    { status: 429 }
  );
}

// Puis vérification utilisateur spécifique
const userLimit = await ratelimitSmartChatAI.limit(identifier);
if (!userLimit.success) {
  return NextResponse.json(
    { 
      success: false, 
      error: 'Rate limit exceeded',
      details: 'Too many requests. Please wait before making more.',
      retryAfter: userLimit.reset - Date.now()
    },
    { status: 429 }
  );
}
```

### **3. Headers de réponse**

```typescript
// Headers standards de rate limiting
headers: {
  'X-RateLimit-Limit': '10',
  'X-RateLimit-Remaining': userLimit.remaining.toString(),
  'X-RateLimit-Reset': userLimit.reset.toString(),
  'Retry-After': Math.ceil((userLimit.reset - Date.now()) / 1000).toString()
}
```

## 📱 Utilisation

### **1. Dans les composants React**

```tsx
import { RateLimitInfo } from '@/components/ai/RateLimitInfo';

function SmartChat() {
  return (
    <div>
      {/* Affichage des limites actuelles */}
      <RateLimitInfo 
        className="text-gray-600" 
        showDetails={false} 
      />
    </div>
  );
}
```

### **2. Dans les API calls**

```typescript
// Ajouter l'identifiant utilisateur
const response = await fetch('/api/ai/assistant', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-User-ID': 'user-123' // Identifiant unique
  },
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'Hello AI!' }]
  })
});

// Vérifier les headers de rate limiting
const remaining = response.headers.get('X-RateLimit-Remaining');
const resetTime = response.headers.get('X-RateLimit-Reset');

if (remaining === '0') {
  console.log('Rate limit atteint, réessayer après:', new Date(parseInt(resetTime)));
}
```

### **3. Gestion des erreurs 429**

```typescript
if (response.status === 429) {
  const errorData = await response.json();
  
  // Afficher le message d'erreur
  console.error('Rate limit exceeded:', errorData.details);
  
  // Attendre le temps recommandé
  const retryAfter = errorData.retryAfter;
  setTimeout(() => {
    // Réessayer la requête
    retryRequest();
  }, retryAfter);
}
```

## 🧪 Tests

### **Script de test automatisé**

```bash
# Test complet du rate limiting
npm run test:smartchat-rate-limits

# Test du cache SmartChat
npm run test:smartchat-cache
```

### **Tests manuels**

```bash
# Test des limites context (30/min)
for i in {1..35}; do
  curl -X POST http://localhost:3000/api/ai/context \
    -H "Content-Type: application/json" \
    -H "X-User-ID: test-user-$i" \
    -d '{"url":"https://example.com/course/123"}'
  sleep 0.1
done

# Test des limites AI (10/min)
for i in {1..15}; do
  curl -X POST http://localhost:3000/api/ai/assistant \
    -H "Content-Type: application/json" \
    -H "X-User-ID: test-user-$i" \
    -d '{"messages":[{"role":"user","content":"Hello"}]}'
  sleep 0.1
done
```

### **Vérification des headers**

```bash
# Vérifier les headers de rate limiting
curl -v -X POST http://localhost:3000/api/ai/context \
  -H "Content-Type: application/json" \
  -H "X-User-ID: test-user" \
  -d '{"url":"https://example.com/course/123"}'

# Réponse attendue avec headers :
# X-RateLimit-Limit: 30
# X-RateLimit-Remaining: 29
# X-RateLimit-Reset: 1703123456789
```

## 📊 Monitoring

### **1. Composant RateLimitInfo**

Le composant `RateLimitInfo` affiche en temps réel :
- **Limites context** : Requêtes restantes et temps de réinitialisation
- **Limites AI** : Requêtes restantes et temps de réinitialisation
- **Avertissements** : Indicateurs visuels quand les limites sont proches

### **2. Headers de monitoring**

Chaque réponse API inclut :
- `X-RateLimit-Limit` : Limite actuelle
- `X-RateLimit-Remaining` : Requêtes restantes
- `X-RateLimit-Reset` : Timestamp de réinitialisation
- `Retry-After` : Délai d'attente recommandé (secondes)

### **3. Logs de débogage**

```typescript
// Logs automatiques dans les APIs
console.log('🔍 Extracting context from URL:', url);
console.log('✅ Context retrieved from cache');
console.log('⚠️ Rate limit hit after X requests');
```

## 🔍 Dépannage

### **Problèmes courants**

#### **1. Erreur 429 "Rate limit exceeded"**

**Cause** : L'utilisateur a dépassé ses limites
**Solution** : Attendre la réinitialisation ou réduire la fréquence des requêtes

```typescript
// Vérifier les headers pour connaître le délai
const retryAfter = response.headers.get('Retry-After');
console.log(`Réessayer dans ${retryAfter} secondes`);
```

#### **2. Identification utilisateur échoue**

**Cause** : Headers manquants ou mal formatés
**Solution** : Vérifier la présence de `X-User-ID` ou `Authorization`

```typescript
// Ajouter un header d'identification
headers: {
  'X-User-ID': 'user-unique-id'
}
```

#### **3. Limites trop strictes**

**Cause** : Configuration trop restrictive pour l'usage
**Solution** : Ajuster les limites dans `src/lib/rate-limit.ts`

```typescript
// Augmenter les limites si nécessaire
export const ratelimitSmartChatAI = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "1m"), // 20 au lieu de 10
});
```

### **Debugging avancé**

```typescript
// Activer le debug dans les APIs
console.log('Rate limit identifier:', identifier);
console.log('Global limit result:', globalLimit);
console.log('User limit result:', userLimit);
console.log('Headers de réponse:', response.headers);
```

## 📚 API Reference

### **Rate Limiters**

```typescript
// Import des rate limiters
import { 
  ratelimitSmartChatContext,
  ratelimitSmartChatAI,
  ratelimitSmartChatDaily,
  ratelimitSmartChatGlobal,
  getRateLimitIdentifier
} from '@/lib/rate-limit';

// Utilisation
const identifier = getRateLimitIdentifier(request);
const result = await ratelimitSmartChatAI.limit(identifier);

if (result.success) {
  // Requête autorisée
  console.log('Requêtes restantes:', result.remaining);
  console.log('Réinitialisation à:', new Date(result.reset));
} else {
  // Limite atteinte
  console.log('Limite atteinte, réessayer après:', new Date(result.reset));
}
```

### **Configuration**

```typescript
export const RATE_LIMIT_CONFIG = {
  SMARTCHAT: {
    CONTEXT: {
      REQUESTS_PER_MINUTE: 30,
      WINDOW: "1m"
    },
    AI: {
      REQUESTS_PER_MINUTE: 10,
      REQUESTS_PER_DAY: 500,
      WINDOW: "1m",
      DAILY_WINDOW: "1d"
    },
    GENERAL: {
      REQUESTS_PER_MINUTE: 20,
      WINDOW: "1m"
    },
    GLOBAL: {
      REQUESTS_PER_MINUTE: 1000,
      WINDOW: "1m"
    }
  }
};
```

### **Composant RateLimitInfo**

```tsx
interface RateLimitInfoProps {
  className?: string;        // Classes CSS personnalisées
  showDetails?: boolean;     // Afficher les détails quotidiens
}

// Utilisation
<RateLimitInfo 
  className="text-blue-600" 
  showDetails={true} 
/>
```

## 🚀 Bonnes pratiques

### **1. Identification des utilisateurs**
- ✅ Utiliser `X-User-ID` pour une identification claire
- ✅ Implémenter l'authentification JWT pour la sécurité
- ✅ Fallback sur IP uniquement en dernier recours

### **2. Gestion des erreurs**
- ✅ Toujours vérifier le statut 429
- ✅ Respecter le header `Retry-After`
- ✅ Informer l'utilisateur des limites

### **3. Monitoring**
- ✅ Afficher les limites restantes dans l'UI
- ✅ Logger les violations de rate limiting
- ✅ Surveiller l'utilisation globale

### **4. Performance**
- ✅ Vérifier les limites globales en premier
- ✅ Utiliser le cache Redis efficacement
- ✅ Optimiser les requêtes d'identification

## 📝 Notes importantes

- **Groq API gratuite** : Aucune limite de coût, uniquement des limites d'usage
- **Upstash Redis** : Nécessaire pour le fonctionnement du rate limiting
- **Sliding Window** : Algorithme utilisé pour une gestion précise des limites
- **Responsive** : Le système s'adapte automatiquement aux appareils mobiles

---

**Dernière mise à jour** : Décembre 2024  
**Version** : 1.0.0  
**Maintenu par** : Équipe YouCode
