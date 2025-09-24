# 🗄️ Configuration Supabase Storage - MonadAI

## ⚠️ IMPORTANT : Configuration Manuelle Requise

Le système d'upload d'images nécessite une **configuration manuelle** dans Supabase Dashboard.

## 📋 Étapes Configuration

### 1. Créer le Bucket (Interface Supabase)
```
1. Aller dans Supabase Dashboard → Storage
2. Cliquer "New bucket"  
3. Nom: project-images
4. Public: ✅ Activé
5. Créer
```

### 2. Configurer Politiques (SQL Editor)
```sql
-- Lecture publique pour affichage images
CREATE POLICY "Public read access project images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'project-images');

-- Upload admin seulement  
CREATE POLICY "Admin upload project images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'project-images');

-- Modification/suppression admin
CREATE POLICY "Admin update project images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'project-images');

CREATE POLICY "Admin delete project images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'project-images');
```

### 3. Test Upload
```
Admin/Content → Projet → Modifier → Upload image
Résultat attendu: Upload réussi + URL générée
```

## 🔧 Alternative Temporaire

Si problème persiste, utiliser **images dans /public/** :
```
/public/images/projects/zentra-flux.webp
/public/images/projects/clara-node.webp  
/public/images/projects/vora-pulse.webp
```
