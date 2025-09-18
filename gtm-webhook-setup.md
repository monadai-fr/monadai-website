# Configuration GTM → Webhook MonadAI

## 🎯 OBJECTIF
Faire envoyer GTM les analytics vers `/api/analytics/webhook` au lieu de seulement vers GA4.

## 📊 ÉTAPES DANS GTM

### 1. CRÉER NOUVELLE BALISE WEBHOOK

**Dans GTM → Balises → Nouvelle :**

**Configuration Balise :**
- **Type** : `Balise HTTP personnalisée`
- **Nom** : `MonadAI - Webhook Analytics`
- **URL** : `https://monadai.fr/api/analytics/webhook`
- **Méthode** : `POST`

**Headers :**
```
Content-Type: application/json
```

**Corps (JSON) :**
```json
{
  "event_name": "{{MonadAI - Event Name}}",
  "page_location": "{{Page URL}}",
  "client_id": "{{Client ID}}",
  "event_data": {{MonadAI - Event Data}},
  "user_agent": "{{User Agent}}",
  "timestamp": "{{Event Timestamp}}"
}
```

**Déclencheurs :**
- `All Pages - MonadAI` (pour page_view)
- `MonadAI - Custom Events` (pour devis, faq, contact)

### 2. CRÉER VARIABLES MANQUANTES

**Variables → Nouvelle :**

**Variable 1 : Page URL**
- **Type** : `Variable intégrée`
- **Nom** : `Page URL`
- **Type de variable** : `URL de la page`

**Variable 2 : Client ID**
- **Type** : `Variable intégrée` 
- **Nom** : `Client ID`
- **Type de variable** : `ID client`

**Variable 3 : User Agent**
- **Type** : `Variable de couche de données`
- **Nom** : `User Agent`
- **Nom de variable** : `userAgent`

**Variable 4 : Event Timestamp**
- **Type** : `JavaScript personnalisé`
- **Nom** : `Event Timestamp`
- **Code** :
```javascript
function() {
  return new Date().toISOString();
}
```

### 3. MODIFIER BALISES EXISTANTES

**Balise "GA4 - MonadAI Events" :**
- **Ajouter déclencheur** : `MonadAI - Webhook Analytics`
- **Maintenir** : Envoi vers GA4 ET webhook

## 🚀 RÉSULTAT

Après configuration :
```
USER ACTION → GTM → 1. GA4 (interface analytics.google.com)
                 → 2. WEBHOOK MonadAI → Supabase → Dashboard Admin
```

## ✅ TEST

**URL test webhook :** `GET https://monadai.fr/api/analytics/webhook`
**Retour attendu :** `{"status": "GTM Webhook MonadAI", "ready": true}`
