# SmartChat YouCode AI - Guide d'utilisation

## 🚀 Démarrage rapide

### **1. Installation des dépendances**

```bash
# Installer les dépendances
npm install

# Ou avec pnpm
pnpm install
```

### **2. Configuration de l'environnement**

Créer un fichier `.env.local` :

```env
# Redis (Upstash)
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token

# Groq API (optionnel - fallback disponible)
GROK_API_KEY=your_grok_api_key

# Base URL pour les tests
BASE_URL=http://localhost:3000
```

### **3. Démarrer le serveur de développement**

```bash
npm run dev
```

Le SmartChat sera disponible sur `http://localhost:3000`

## 🧪 Tests du système

### **Tests de rate limiting**

```bash
# Test complet du rate limiting
npm run test:smartchat-rate-limits

# Test du cache SmartChat
npm run test:smartchat-cache
```

### **Tests manuels avec curl**

```bash
# Test de l'API context
curl -X POST http://localhost:3000/api/ai/context \
  -H "Content-Type: application/json" \
  -H "X-User-ID: test-user-123" \
  -d '{"url":"https://youcode.com/courses/javascript-basics"}'

# Test de l'API assistant
curl -X POST http://localhost:3000/api/ai/assistant \
  -H "Content-Type: application/json" \
  -H "X-User-ID: test-user-123" \
  -d '{"messages":[{"role":"user","content":"What is JavaScript?"}]}'
```

## 📱 Utilisation du SmartChat

### **1. Interface utilisateur**

Le SmartChat apparaît comme un bouton flottant en bas à droite de l'écran. Cliquez dessus pour l'ouvrir.

### **2. Fonctionnalités disponibles**

- **💬 Chat avec l'IA** : Posez des questions sur la programmation
- **🎯 Suggestions contextuelles** : Basées sur votre cours/leçon actuel
- **📊 Indicateurs de limites** : Voir vos quotas restants
- **💾 Cache intelligent** : Réponses mises en cache pour de meilleures performances

### **3. Limites d'usage**

| Service | Limite | Fenêtre | Description |
|---------|--------|---------|-------------|
| **Context** | 30 | 1 minute | Extraction de contexte |
| **AI Assistant** | 10 | 1 minute | Génération de réponses |
| **Quotidien** | 500 | 1 jour | Total des requêtes AI |

## 🔧 Intégration dans votre code

### **1. Utilisation du composant SmartChat**

```tsx
import { SmartChat } from '@/components/ai/SmartChat';

function MyPage() {
  return (
    <div>
      <h1>Ma page</h1>
      {/* Le SmartChat sera affiché automatiquement */}
      <SmartChat position="bottom-right" />
    </div>
  );
}
```

### **2. Appels API directs**

```typescript
// Extraction de contexte
const contextResponse = await fetch('/api/ai/context', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-User-ID': 'user-123' // Important pour le rate limiting
  },
  body: JSON.stringify({
    url: 'https://youcode.com/courses/javascript-basics'
  })
});

// Assistant AI
const aiResponse = await fetch('/api/ai/assistant', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-User-ID': 'user-123'
  },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: 'Explain JavaScript closures' }
    ],
    courseContext: 'JavaScript Basics',
    lessonContext: 'Functions and Scope',
    userLevel: 'beginner'
  })
});
```

### **3. Gestion des erreurs de rate limiting**

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

## 🎨 Personnalisation

### **1. Position du SmartChat**

```tsx
// Positions disponibles
<SmartChat position="bottom-right" />  // Par défaut
<SmartChat position="bottom-left" />
<SmartChat position="top-right" />
<SmartChat position="top-left" />
```

### **2. Affichage des limites**

```tsx
import { RateLimitInfo } from '@/components/ai/RateLimitInfo';

// Affichage simple
<RateLimitInfo />

// Avec détails quotidiens
<RateLimitInfo showDetails={true} />

// Style personnalisé
<RateLimitInfo className="text-blue-600 bg-gray-100 p-2 rounded" />
```

### **3. Thème et couleurs**

Le SmartChat utilise Tailwind CSS et peut être personnalisé via les classes CSS :

```tsx
// Personnalisation des couleurs
<SmartChat className="custom-smartchat-theme" />
```

## 📊 Monitoring et débogage

### **1. Headers de réponse**

Chaque réponse API inclut des informations de rate limiting :

```http
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 8
X-RateLimit-Reset: 1703123456789
Retry-After: 45
```

### **2. Logs de débogage**

Activez les logs dans la console pour voir :
- 🔍 Extraction de contexte
- ✅ Cache hits/misses
- ⚠️ Rate limit violations
- 🚨 Erreurs système

### **3. Composant de monitoring**

Le composant `RateLimitInfo` affiche en temps réel :
- Limites restantes
- Temps de réinitialisation
- Avertissements visuels

## 🚨 Dépannage

### **Problèmes courants**

#### **1. "Rate limit exceeded"**

**Cause** : Vous avez dépassé vos limites
**Solution** : Attendez la réinitialisation ou réduisez la fréquence

#### **2. SmartChat ne s'affiche pas**

**Cause** : Composant non importé ou CSS manquant
**Solution** : Vérifiez l'import et les dépendances Tailwind

#### **3. Erreurs de cache Redis**

**Cause** : Configuration Redis incorrecte
**Solution** : Vérifiez vos variables d'environnement Upstash

### **Debugging avancé**

```typescript
// Activer le debug dans les APIs
console.log('Rate limit identifier:', identifier);
console.log('Cache status:', cachedResponse ? 'hit' : 'miss');
console.log('Response headers:', response.headers);
```

## 📚 Ressources additionnelles

- **Documentation complète** : `SMARTCHAT_RATE_LIMITING_GUIDE.md`
- **Tests automatisés** : `scripts/test-smartchat-rate-limits.js`
- **Configuration cache** : `src/lib/cache.ts`
- **Configuration rate limiting** : `src/lib/rate-limit.ts`

## 🤝 Support

Pour toute question ou problème :
1. Consultez la documentation complète
2. Vérifiez les logs de la console
3. Testez avec les scripts fournis
4. Vérifiez la configuration Redis

---

**Version** : 1.0.0  
**Dernière mise à jour** : Décembre 2024  
**Maintenu par** : Équipe YouCode
