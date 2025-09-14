/**
 * Utilitaires DRY pour MonadAI
 * Helpers réutilisables pour éviter la duplication de code
 */

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function calculateDevisTotal(
  basePrice: number, 
  complexity: number, 
  addons: { seo?: boolean; animations?: boolean; formation?: boolean; maintenance?: boolean }
): number {
  let total = basePrice * complexity;
  
  if (addons.seo) total *= 1.15;
  if (addons.animations) total *= 1.10;
  if (addons.formation) total *= 1.20;
  if (addons.maintenance) total *= 1.25;
  
  return Math.round(total);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
