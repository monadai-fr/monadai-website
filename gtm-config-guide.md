# Configuration GTM pour MonadAI

## 🎯 VARIABLES À CRÉER DANS GTM

### 1. GA4 Configuration
- **Type:** Constante
- **Nom:** GA4 - Measurement ID  
- **Valeur:** `G-9697XDEM67`

### 2. MonadAI Events
- **Type:** Variable de couche de données
- **Nom:** MonadAI - Event Name
- **Variable:** `eventName`

### 3. MonadAI Event Data  
- **Type:** Variable de couche de données
- **Nom:** MonadAI - Event Data
- **Variable:** `eventData`

## 🎯 DÉCLENCHEURS À CRÉER

### 1. MonadAI Custom Events
- **Type:** Événement personnalisé
- **Nom:** MonadAI - Custom Events
- **Événement:** `devis_opened|devis_submitted|contact_submitted|faq_opened`
- **Regex:** ✅ Activé

### 2. All Pages
- **Type:** Pages vues
- **Nom:** All Pages - MonadAI
- **Condition:** Toutes les pages

## 🎯 BALISES À CRÉER

### 1. GA4 Configuration 
- **Type:** Configuration Google Analytics : GA4
- **Nom:** GA4 - Config MonadAI
- **ID de mesure:** `{{GA4 - Measurement ID}}`
- **Déclencheur:** All Pages - MonadAI

### 2. GA4 Events MonadAI
- **Type:** Événement Google Analytics : GA4  
- **Nom:** GA4 - MonadAI Events
- **ID de mesure:** `{{GA4 - Measurement ID}}`
- **Nom événement:** `{{MonadAI - Event Name}}`
- **Paramètres:**
  - `event_category`: `{{MonadAI - Event Data.category}}`
  - `value`: `{{MonadAI - Event Data.price}}`
  - `service`: `{{MonadAI - Event Data.service}}`
- **Déclencheur:** MonadAI - Custom Events

## 🎯 VARIABLES VERCEL À AJOUTER

```bash
GA4_PROPERTY_ID=12148797133
GOOGLE_ANALYTICS_CLIENT_EMAIL=votre-service-account@project.iam.gserviceaccount.com  
GOOGLE_ANALYTICS_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----...
```

## 🎯 ÉVÉNEMENTS MONADS QUI SERONT TRACKÉS

- `devis_opened` → Modal devis ouvert
- `devis_submitted` → Devis demandé (lead qualifié)
- `contact_submitted` → Formulaire envoyé  
- `faq_opened` → Question FAQ ouverte
- `project_clicked` → Projet SaaS cliqué

## 🎯 DONNÉES RÉCUPÉRÉES DASHBOARD

- **Visiteurs 24h** → Depuis GA4 API
- **Devis simulés** → Depuis GTM dataLayer  
- **Leads qualifiés** → Depuis table contacts
- **Security events** → Depuis security_logs
