# 🧪 Guide de Test du Cache Redis

Ce guide vous explique comment tester le système de cache Redis implémenté dans votre projet.

## 📋 Prérequis

1. **Variables d'environnement configurées** :
   ```env
   UPSTASH_REDIS_REST_URL=your_redis_url
   UPSTASH_REDIS_REST_TOKEN=your_redis_token
   ```

2. **Serveur de développement en cours d'exécution** :
   ```bash
   npm run dev
   ```

## 🚀 Méthodes de Test

### 1. Tests via Scripts NPM

#### Test Basique
```bash
npm run test:cache:basic
```
Teste les opérations GET/SET de base du cache.

#### Test de Performance
```bash
npm run test:cache:performance
```
Compare les performances avec et sans cache.

#### Statistiques du Cache
```bash
npm run test:cache:stats
```
Affiche les statistiques actuelles du cache (nombre de clés, etc.).

#### Nettoyer le Cache
```bash
npm run test:cache:clear
```
Supprime toutes les données du cache.

#### Tous les Tests
```bash
npm run test:cache:all
```
Exécute tous les tests de cache.

#### Tests Interactifs
```bash
npm run test:cache:interactive
```
Exécute une série de tests avec des pauses entre chaque test.

#### Tests des Routes API
```bash
npm run test:cache:api
```
Teste les routes API avec cache.

### 2. Tests via Script Direct

```bash
# Test basique
node scripts/test-cache.js basic

# Test de performance
node scripts/test-cache.js performance

# Afficher l'aide
node scripts/test-cache.js help
```

### 3. Tests via API REST

#### Test Basique
```bash
curl "http://localhost:3000/api/test/cache?action=basic"
```

#### Test de Performance
```bash
curl "http://localhost:3000/api/test/cache?action=performance"
```

#### Statistiques
```bash
curl "http://localhost:3000/api/test/cache?action=stats"
```

#### Nettoyer le Cache
```bash
curl "http://localhost:3000/api/test/cache?action=clear"
```

#### Tous les Tests
```bash
curl "http://localhost:3000/api/test/cache?action=all"
```

### 4. Tests Programmatiques

#### Tests Unitaires TypeScript
```typescript
import { runCacheUnitTests } from '@/lib/test/cache-unit-test';

// Exécuter tous les tests unitaires
const results = await runCacheUnitTests();
console.log(results);
```

#### Tests de Fonctions Spécifiques
```typescript
import { testFunctionWithCache } from '@/lib/test/cache-unit-test';

// Tester une fonction avec cache
const result = await testFunctionWithCache(
  'My Function',
  async () => ({ data: 'test' }),
  'test:key'
);
```

## 📊 Interprétation des Résultats

### Test de Performance
- **Sans cache** : Temps de la première requête
- **Avec cache (premier appel)** : Temps avec cache MISS
- **Avec cache (deuxième appel)** : Temps avec cache HIT
- **Amélioration** : Pourcentage d'amélioration grâce au cache

### Test Basique
- **Original** : Données originales
- **Retrieved** : Données récupérées du cache
- **Match** : Vérification de l'intégrité des données

### Statistiques
- **Total Keys** : Nombre total de clés en cache
- **Sample Keys** : Exemples de clés présentes

## 🔍 Tests Manuels

### 1. Test de Cache Hit/Miss

1. **Premier appel** (MISS) :
   ```bash
   curl "http://localhost:3000/api/user/courses/test-course-id/lessons"
   ```
   Notez le temps de réponse.

2. **Deuxième appel** (HIT) :
   ```bash
   curl "http://localhost:3000/api/user/courses/test-course-id/lessons"
   ```
   Le temps devrait être significativement plus rapide.

### 2. Test d'Expiration

1. **Créer des données avec expiration courte** :
   ```bash
   curl "http://localhost:3000/api/test/cache?action=basic"
   ```

2. **Attendre l'expiration** (selon la configuration)

3. **Vérifier que les données ont expiré** :
   ```bash
   curl "http://localhost:3000/api/test/cache?action=stats"
   ```

### 3. Test d'Invalidation

1. **Créer des données en cache**
2. **Modifier les données** (via l'interface admin)
3. **Vérifier que le cache est invalidé** (nouvelles données visibles)

## 🐛 Dépannage

### Erreur de Connexion Redis
```
Error: UPSTASH_REDIS_REST_URL is not defined
```
**Solution** : Vérifiez vos variables d'environnement.

### Erreur de Timeout
```
Error: Request timed out
```
**Solution** : Vérifiez votre connexion internet et les paramètres Redis.

### Cache Non Fonctionnel
```
Cache improvement: 0%
```
**Solution** : Vérifiez que le cache est bien activé et que les clés sont générées correctement.

## 📈 Métriques à Surveiller

### Performance
- **Temps de réponse moyen** : Devrait diminuer avec le cache
- **Hit rate** : Pourcentage de requêtes servies depuis le cache
- **Amélioration** : Gain de performance grâce au cache

### Fonctionnalité
- **Intégrité des données** : Les données récupérées doivent être identiques
- **Expiration** : Les données doivent expirer correctement
- **Invalidation** : Le cache doit être invalidé lors des modifications

### Ressources
- **Nombre de clés** : Surveillez l'utilisation du cache
- **Taille des données** : Évitez les clés trop volumineuses

## 🎯 Tests Recommandés

### Avant la Production
1. ✅ Tests unitaires complets
2. ✅ Tests de performance
3. ✅ Tests d'expiration
4. ✅ Tests d'invalidation
5. ✅ Tests de charge (simulation d'utilisateurs multiples)

### En Production
1. ✅ Monitoring des métriques
2. ✅ Surveillance des erreurs
3. ✅ Tests de récupération après panne
4. ✅ Tests de performance réguliers

## 🔧 Configuration Avancée

### Durées d'Expiration
```typescript
export const UPSTASH_CACHE_CONFIG = {
  LESSON_LIST: 300,      // 5 minutes
  LESSON_DETAIL: 1800,   // 30 minutes
  COURSE_DETAIL: 3600,   // 1 heure
  USER_PROGRESS: 600,    // 10 minutes
  SEARCH_RESULTS: 300,   // 5 minutes
};
```

### Clés de Cache
```typescript
// Format recommandé
const cacheKey = UpstashCacheManager.generateKey('prefix', {
  userId: '123',
  page: 1,
  limit: 10,
  search: 'query'
});
// Résultat: prefix:limit:10:page:1:search:query:userId:123
```

## 📝 Logs et Debugging

### Activer les Logs
```typescript
// Dans votre code
console.log(`Cache HIT for key: ${key}`);
console.log(`Cache MISS for key: ${key}`);
```

### Monitoring
```typescript
import { logUpstashCacheStats } from '@/lib/cache-upstash';

// Afficher les statistiques
await logUpstashCacheStats();
```

## 🎉 Validation du Succès

Votre cache fonctionne correctement si :

1. ✅ **Performance améliorée** : Les requêtes répétées sont plus rapides
2. ✅ **Données cohérentes** : Les données récupérées sont correctes
3. ✅ **Expiration fonctionnelle** : Les données expirent selon la configuration
4. ✅ **Invalidation efficace** : Le cache se met à jour lors des modifications
5. ✅ **Pas d'erreurs** : Aucune erreur Redis dans les logs

---

**💡 Conseil** : Testez régulièrement votre cache pour vous assurer qu'il fonctionne correctement et apporte les améliorations de performance attendues !
