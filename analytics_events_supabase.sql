-- Table analytics_events pour dashboard MonadAI
-- Remplace dataLayer GTM côté client par stockage serveur

CREATE TABLE analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name text NOT NULL,
  page_url text,
  client_id text,
  event_data jsonb,
  user_agent text,
  ip_address text,
  cf_country text, -- Header Cloudflare automatique
  created_at timestamptz DEFAULT now()
);

-- Index pour performances dashboard
CREATE INDEX idx_analytics_events_name ON analytics_events(event_name);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX idx_analytics_events_name_date ON analytics_events(event_name, created_at);
CREATE INDEX idx_analytics_events_country ON analytics_events(cf_country);

-- Données de test pour vérifier (optionnel)
INSERT INTO analytics_events (event_name, page_url, event_data) VALUES 
('page_view', 'https://monadai.fr/', '{"page_title": "MonadAI Homepage"}'),
('devis_opened', 'https://monadai.fr/services', '{"page": "services", "price": 3000}'),
('faq_opened', 'https://monadai.fr/services', '{"questionId": "tarifs", "section": "services"}');
