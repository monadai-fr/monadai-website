-- ========================================
-- SCHEMA SUPABASE CMS MONADAI
-- Version: 2.0 - Système Images + Copy/Paste dans SQL Editor Supabase
-- ========================================

-- 1. TABLE PROJETS SAAS (Zentra Flux, Clara Node, Vora Pulse)
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug VARCHAR(50) UNIQUE NOT NULL, -- zentra-flux, clara-node, vora-pulse
  title VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(30) DEFAULT 'En développement',
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  image_url TEXT, -- URL image du projet depuis Supabase Storage
  tech_stack TEXT[] DEFAULT ARRAY['Next.js', 'Supabase'],
  target_audience VARCHAR(100),
  focus_area VARCHAR(100), -- IA Analytics, Collaboration IA, etc.
  sort_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 2. TABLE FAQ DYNAMIQUE (Homepage + Services)  
CREATE TABLE faq_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section VARCHAR(20) NOT NULL CHECK (section IN ('homepage', 'services', 'general')),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  click_count INTEGER DEFAULT 0, -- Analytics simples
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 3. TABLE EMAIL TEMPLATES (Follow-up, Welcome, etc.)
CREATE TABLE email_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL, -- "Follow-up Lead", "Welcome Client"
  type VARCHAR(50) NOT NULL CHECK (type IN ('follow_up', 'welcome_client', 'quote_reminder', 'custom')),
  subject VARCHAR(200) NOT NULL,
  html_content TEXT NOT NULL,
  variables TEXT[] DEFAULT ARRAY['{{name}}', '{{company}}', '{{service}}'],
  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 4. TRIGGER UPDATED_AT AUTOMATIQUE
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Appliquer aux tables
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_faq_items_updated_at BEFORE UPDATE ON faq_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON email_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- SUPABASE STORAGE CONFIGURATION
-- ========================================

-- Bucket pour images projets
INSERT INTO storage.buckets (id, name, public) VALUES ('project-images', 'project-images', true);

-- Politiques d'accès
CREATE POLICY "Public read access project images" ON storage.objects FOR SELECT USING (bucket_id = 'project-images');
CREATE POLICY "Admin upload project images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'project-images');
CREATE POLICY "Admin update project images" ON storage.objects FOR UPDATE USING (bucket_id = 'project-images');
CREATE POLICY "Admin delete project images" ON storage.objects FOR DELETE USING (bucket_id = 'project-images');

-- ========================================
-- DONNÉES INITIALES (Vos projets actuels)
-- ========================================

-- PROJETS SAAS EXISTANTS (sans images initialement)
INSERT INTO projects (slug, title, category, description, status, progress, tech_stack, target_audience, focus_area, sort_order) VALUES
('zentra-flux', 'Zentra Flux', 'SaaS Opérationnel', 'Centralise les données opérationnelles avec alertes IA intelligentes', 'En développement', 75, ARRAY['Next.js', 'Supabase', 'IA Analytics'], 'Entreprises', 'IA Analytics', 1),
('clara-node', 'Clara Node', 'SaaS Collaboratif', 'Dashboard interactif avec IA pour optimiser le travail d''équipe', 'En développement', 60, ARRAY['Next.js', 'Supabase', 'Algorithmes IA'], 'Startups', 'Collaboration IA', 2),
('vora-pulse', 'Vora Pulse', 'Automatisation IA', 'Workflows clients automatisés avec sécurité renforcée', 'En développement', 45, ARRAY['Next.js', 'Supabase', 'APIs IA'], 'Agences', 'Cybersécurité', 3);

-- FAQ HOMEPAGE
INSERT INTO faq_items (section, question, answer, sort_order) VALUES
('homepage', 'Pourquoi choisir MonadAI ?', 'Expertise technique accessible : étudiant cybersécurité spécialisé pentest/DevSecOps, tarifs compétitifs, réactivité 24h. Nous combinons innovation technologique et proximité humaine pour des solutions sur mesure.', 1),
('homepage', 'Quelle est votre différence ?', 'Sécurité intégrée dès la conception (expertise pentest), technologies modernes (Next.js, IA), approche personnalisée pour chaque projet. Nous ne sommes pas qu''une agence web, nous créons des solutions intelligentes.', 2),
('homepage', 'Puis-je faire confiance à une jeune entreprise ?', 'Notre jeunesse est notre force : technologies à la pointe, tarifs attractifs, disponibilité totale. Formation cybersécurité rigoureuse, projets SaaS innovants en développement. Fraîcheur + expertise technique.', 3),
('homepage', 'Vos projets SaaS témoignent-ils de votre expertise ?', 'Absolument ! Zentra Flux (données temps réel), Clara Node (collaboration IA), Vora Pulse (automatisation sécurisée) prouvent notre capacité à concevoir des solutions complexes et innovantes.', 4);

-- FAQ SERVICES
INSERT INTO faq_items (section, question, answer, sort_order) VALUES
('services', 'Comment se déroule un projet avec MonadAI ?', 'Nous commençons par un échange gratuit pour comprendre vos besoins. Ensuite : devis détaillé sous 24h, acompte 40%, développement avec points réguliers, livraison avec formation, puis 3 mois de support inclus.', 1),
('services', 'Quels sont vos tarifs et modalités de paiement ?', 'Nos tarifs démarrent à 1000€ pour un audit technique, 1500€ pour un site web et 2000€ pour de l''automatisation IA. Paiement : 40% à la signature, 60% à la livraison. Moyens acceptés : virement bancaire et lien de paiement Qonto.', 2),
('services', 'Quels sont les délais de réalisation ?', 'Délais standards : site vitrine 2-3 semaines, e-commerce 4-6 semaines, automatisation IA 3-5 semaines. Pour les projets urgents, supplément de 30% pour réduire les délais de 50%.', 3),
('services', 'Qui peut faire appel à vos services ?', 'Nous accompagnons tous types de projets : entreprises (startups, PME, ETI, grands groupes) et particuliers (freelances, créateurs, associations, projets personnels). Aucune restriction de taille ou secteur.', 4),
('services', 'Quelles technologies utilisez-vous ?', 'Stack moderne : Next.js, React, TypeScript pour le web. Supabase pour les bases de données. OpenAI GPT pour l''IA. Déploiement Vercel. Sécurité renforcée avec expertise pentest et DevSecOps.', 5),
('services', 'Comment garantissez-vous la sécurité ?', 'Expertise cybersécurité : chiffrement données, headers sécurisés, validation stricte, tests de pénétration. Formé en pentest et DevSecOps, je porte une attention particulière à la sécurité de chaque projet.', 6),
('services', 'Quel support après livraison ?', '3 mois de support technique inclus, corrections bugs sous 60 jours, formation à la prise en main. Maintenance évolutive disponible sur devis. Réponse garantie sous 24h.', 7),
('services', 'Vos projets SaaS (Zentra Flux, Clara Node, Vora Pulse) sont-ils disponibles ?', 'Ces projets SaaS sont actuellement en développement. Ils seront proposés en version bêta courant 2025. Intéressé(e) ? Contactez-nous pour être informé(e) en avant-première !', 8),
('services', 'Avez-vous des références ou projets à montrer ?', 'En tant que jeune entreprise fondée en 2025, nous construisons actuellement notre portfolio avec nos premiers clients. Nos 3 projets SaaS en développement témoignent de notre expertise technique.', 9),
('services', 'Pouvez-vous gérer des projets urgents ?', 'Oui ! Pour les projets urgents (délai réduit de 50%), nous appliquons un supplément de 30%. Cela nous permet de mobiliser plus de ressources et de prioriser votre projet.', 10);

-- EMAIL TEMPLATES
INSERT INTO email_templates (name, type, subject, html_content, variables) VALUES
('Follow-up Lead Chaud', 'follow_up', 'Votre projet {{service}} - Prochaines étapes', 
'<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #1B4332 0%, #2D5A3D 100%); padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <div style="background: #ffffff; width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;">
      <span style="color: #1B4332; font-size: 24px; font-weight: bold;">M</span>
    </div>
    <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">MonadAI</h1>
  </div>
  <div style="padding: 30px 20px;">
    <h2 style="color: #1B4332; margin: 0 0 20px 0;">Bonjour {{name}} 👋</h2>
    <p style="color: #374151; line-height: 1.6;">Suite à votre demande concernant {{service}}, je souhaitais faire le point avec vous sur l''avancement de votre projet.</p>
    <p style="color: #374151; line-height: 1.6;">Avez-vous eu l''occasion de consulter notre proposition ? Je reste disponible pour toute question ou ajustement.</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="tel:+33647244809" style="background: #1B4332; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; display: inline-block; font-weight: bold;">📞 Planifier un échange</a>
    </div>
  </div>
</div>', 
ARRAY['{{name}}', '{{service}}', '{{company}}']),

('Relance Devis', 'quote_reminder', 'Rappel : Devis {{devis_number}} - MonadAI', 
'<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #1B4332 0%, #2D5A3D 100%); padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: #ffffff; margin: 0; font-size: 24px;">MonadAI</h1>
  </div>
  <div style="padding: 30px 20px;">
    <h2 style="color: #1B4332;">Bonjour {{name}}</h2>
    <p>Je me permets de revenir vers vous concernant le devis {{devis_number}} que je vous ai envoyé.</p>
    <p>Avez-vous pu l''examiner ? Je reste à votre disposition pour toute question ou modification.</p>
    <div style="background: #F0FDF4; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p><strong>Rappel :</strong> Montant {{montant_ttc}} • Service {{service}}</p>
    </div>
  </div>
</div>', 
ARRAY['{{name}}', '{{devis_number}}', '{{montant_ttc}}', '{{service}}']);

-- ========================================
-- SUPABASE STORAGE CONFIGURATION
-- ========================================

-- Bucket pour images projets
INSERT INTO storage.buckets (id, name, public) VALUES ('project-images', 'project-images', true);

-- Politiques d'accès
CREATE POLICY "Public read access project images" ON storage.objects FOR SELECT USING (bucket_id = 'project-images');
CREATE POLICY "Admin upload project images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'project-images');
CREATE POLICY "Admin update project images" ON storage.objects FOR UPDATE USING (bucket_id = 'project-images');
CREATE POLICY "Admin delete project images" ON storage.objects FOR DELETE USING (bucket_id = 'project-images');

-- ========================================
-- INDEX POUR PERFORMANCE
-- ========================================

CREATE INDEX idx_projects_visible ON projects (is_visible, sort_order);
CREATE INDEX idx_faq_section ON faq_items (section, is_visible, sort_order);
CREATE INDEX idx_email_templates_type ON email_templates (type, is_active);
