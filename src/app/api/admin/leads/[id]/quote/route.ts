import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * API Devis CRM - Générer et envoyer devis personnalisé
 * POST: Créer devis PDF + envoyer par email + update status
 */

interface DevisData {
  prestations: string
  prix_ht: number
  tva: number
  prix_ttc: number
  conditions_paiement: string
  validite_jours: number
  notes_additionnelles?: string
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  try {
    const body = await request.json()
    const { prestations, prix_ht, conditions_paiement, validite_jours, notes_additionnelles } = body

    // Validation des données requises
    if (!prestations?.trim() || !prix_ht || prix_ht <= 0) {
      return NextResponse.json(
        { success: false, message: 'Prestations et prix HT requis' },
        { status: 400 }
      )
    }

    // Récupérer données lead
    const { data: contact, error: fetchError } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', params.id)
      .single()

    if (fetchError || !contact) {
      return NextResponse.json(
        { success: false, message: 'Lead non trouvé' },
        { status: 404 }
      )
    }

    // Calculs devis
    const tva = Math.round(prix_ht * 0.20) // TVA 20%
    const prix_ttc = prix_ht + tva
    const acompte_40 = Math.round(prix_ttc * 0.40) // Acompte 40%
    const solde_60 = prix_ttc - acompte_40 // Solde 60%

    // Générer numéro devis unique
    const devisNumber = `DEV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
    
    // Dates
    const dateCreation = new Date().toLocaleDateString('fr-FR')
    const dateValidite = new Date(Date.now() + (validite_jours || 30) * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')

    // Générer HTML devis stylé (template professionnel)
    const devisHTML = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Devis ${devisNumber} - MonadAI</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Arial', sans-serif; 
            line-height: 1.6; 
            color: #333;
            background: #ffffff;
        }
        .container { max-width: 800px; margin: 0 auto; padding: 40px 30px; }
        
        /* Header */
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 3px solid #1B4332; padding-bottom: 20px; }
        .logo-section { }
        .logo { font-size: 32px; font-weight: bold; color: #1B4332; margin-bottom: 5px; }
        .tagline { font-size: 14px; color: #666; font-style: italic; }
        .company-info { text-align: right; font-size: 13px; color: #666; }
        
        /* Devis info */
        .devis-info { background: #F0FDF4; padding: 20px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #1B4332; }
        .devis-number { font-size: 24px; font-weight: bold; color: #1B4332; margin-bottom: 10px; }
        .devis-dates { display: flex; justify-content: space-between; font-size: 14px; }
        
        /* Client info */
        .client-section { margin-bottom: 30px; }
        .section-title { font-size: 18px; font-weight: bold; color: #1B4332; margin-bottom: 15px; border-bottom: 2px solid #E5E7EB; padding-bottom: 5px; }
        .client-info { background: #F9FAFB; padding: 20px; border-radius: 8px; }
        
        /* Prestations */
        .prestations-section { margin-bottom: 30px; }
        .prestations-content { 
            background: #ffffff; 
            border: 1px solid #E5E7EB; 
            border-radius: 8px; 
            padding: 20px; 
            white-space: pre-wrap; 
            line-height: 1.8;
        }
        
        /* Tarification */
        .tarif-section { margin-bottom: 30px; }
        .tarif-table { width: 100%; border-collapse: collapse; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .tarif-table th, .tarif-table td { padding: 15px; text-align: left; border-bottom: 1px solid #E5E7EB; }
        .tarif-table th { background: #1B4332; color: white; font-weight: 600; }
        .tarif-table .total-row { background: #F0FDF4; font-weight: bold; }
        .tarif-table .total-row td { border-bottom: none; }
        .price { text-align: right; font-family: monospace; font-weight: bold; }
        
        /* Conditions */
        .conditions-section { margin-bottom: 30px; }
        .conditions-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .condition-box { background: #F9FAFB; padding: 20px; border-radius: 8px; border: 1px solid #E5E7EB; }
        .condition-title { font-weight: bold; color: #1B4332; margin-bottom: 10px; }
        
        /* Notes */
        .notes-section { margin-bottom: 30px; }
        .notes-content { 
            background: #FEF3C7; 
            border: 1px solid #FDE68A; 
            padding: 20px; 
            border-radius: 8px; 
            font-style: italic;
        }
        
        /* Footer */
        .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #E5E7EB; text-align: center; font-size: 12px; color: #666; }
        .footer-contact { margin-bottom: 15px; }
        .footer-legal { font-size: 10px; color: #999; }
        
        /* Responsive */
        @media (max-width: 600px) {
            .container { padding: 20px 15px; }
            .header { flex-direction: column; gap: 20px; }
            .company-info { text-align: left; }
            .devis-dates { flex-direction: column; gap: 5px; }
            .conditions-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="logo-section">
                <div class="logo">MonadAI</div>
                <div class="tagline">Solutions Web & IA sur mesure</div>
            </div>
            <div class="company-info">
                <div><strong>Raphael LOTTE</strong></div>
                <div>MonadAI - Micro-entreprise</div>
                <div>SIREN: 991054958</div>
                <div>raph@monadai.fr</div>
                <div>06 47 24 48 09</div>
                <div>Bordeaux, France</div>
            </div>
        </div>

        <!-- Devis Info -->
        <div class="devis-info">
            <div class="devis-number">Devis ${devisNumber}</div>
            <div class="devis-dates">
                <span><strong>Date:</strong> ${dateCreation}</span>
                <span><strong>Valide jusqu'au:</strong> ${dateValidite}</span>
            </div>
        </div>

        <!-- Client -->
        <div class="client-section">
            <h2 class="section-title">📋 Client</h2>
            <div class="client-info">
                <div style="margin-bottom: 10px;"><strong>${contact.name}</strong></div>
                <div style="margin-bottom: 5px;">📧 ${contact.email}</div>
                ${contact.phone ? `<div style="margin-bottom: 5px;">📞 ${contact.phone}</div>` : ''}
                ${contact.company ? `<div style="margin-bottom: 5px;">🏢 ${contact.company}</div>` : ''}
                <div style="margin-top: 10px; font-size: 12px; color: #666;">
                    Service demandé: <strong>${
                      contact.service === 'web' ? 'Développement Web' :
                      contact.service === 'ia' ? 'Automatisation IA' :
                      contact.service === 'transformation' ? 'Transformation Digitale' :
                      contact.service === 'audit' ? 'Audit Technique' : 'Service personnalisé'
                    }</strong>
                </div>
            </div>
        </div>

        <!-- Prestations -->
        <div class="prestations-section">
            <h2 class="section-title">🛠️ Prestations proposées</h2>
            <div class="prestations-content">${prestations.trim()}</div>
        </div>

        <!-- Tarification -->
        <div class="tarif-section">
            <h2 class="section-title">💰 Tarification</h2>
            <table class="tarif-table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th style="text-align: right; width: 150px;">Montant</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Total HT</td>
                        <td class="price">${prix_ht.toLocaleString('fr-FR')} €</td>
                    </tr>
                    <tr>
                        <td>TVA (20%)</td>
                        <td class="price">${tva.toLocaleString('fr-FR')} €</td>
                    </tr>
                    <tr class="total-row">
                        <td><strong>TOTAL TTC</strong></td>
                        <td class="price">${prix_ttc.toLocaleString('fr-FR')} €</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Conditions -->
        <div class="conditions-section">
            <h2 class="section-title">📝 Conditions</h2>
            <div class="conditions-grid">
                <div class="condition-box">
                    <div class="condition-title">💳 Modalités de paiement</div>
                    <div>• Acompte: <strong>${acompte_40.toLocaleString('fr-FR')} €</strong> (40% à la signature)</div>
                    <div>• Solde: <strong>${solde_60.toLocaleString('fr-FR')} €</strong> (60% à la livraison)</div>
                    <div style="margin-top: 10px; font-size: 13px;">${conditions_paiement || 'Paiement par virement bancaire ou chèque'}</div>
                </div>
                
                <div class="condition-box">
                    <div class="condition-title">⏰ Délais & Validité</div>
                    <div>• Devis valide: <strong>${validite_jours || 30} jours</strong></div>
                    <div>• Délai estimé: selon cahier des charges</div>
                    <div>• Support inclus: 1 mois post-livraison</div>
                </div>
            </div>
        </div>

        ${notes_additionnelles ? `
        <!-- Notes -->
        <div class="notes-section">
            <h2 class="section-title">📌 Notes additionnelles</h2>
            <div class="notes-content">${notes_additionnelles.trim()}</div>
        </div>
        ` : ''}

        <!-- Footer -->
        <div class="footer">
            <div class="footer-contact">
                <strong>MonadAI</strong> • Solutions Web & IA sur mesure<br/>
                📧 raph@monadai.fr • 📞 06 47 24 48 09 • 🌐 monadai.fr
            </div>
            <div class="footer-legal">
                MonadAI - SIREN: 991054958 - Micro-entreprise non assujettie à la TVA<br/>
                Siège social: Bordeaux, France
            </div>
        </div>
    </div>
</body>
</html>
    `

    // Pour l'instant, on envoie le HTML dans l'email
    // TODO: Intégrer génération PDF plus tard
    try {
      await resend.emails.send({
        from: 'MonadAI <raph@monadai.fr>',
        to: [contact.email],
        cc: ['raph@monadai.fr'], // Copie pour suivi
        subject: `Devis ${devisNumber} - MonadAI`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <!-- Header MonadAI -->
            <div style="background: linear-gradient(135deg, #1B4332 0%, #2D5A3D 100%); padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <div style="background: #ffffff; width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;">
                <span style="color: #1B4332; font-size: 24px; font-weight: bold;">M</span>
              </div>
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">MonadAI</h1>
              <p style="color: #E8F5E8; margin: 5px 0 0 0; font-size: 14px;">Votre devis personnalisé</p>
            </div>

            <!-- Corps -->
            <div style="padding: 30px 20px; background: #ffffff;">
              <h2 style="color: #1B4332; margin: 0 0 20px 0; font-size: 22px;">
                Bonjour ${contact.name.split(' ')[0]} 👋
              </h2>
              
              <p style="color: #374151; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                Merci pour votre intérêt pour nos services. Vous trouverez ci-dessous votre devis détaillé pour votre projet ${
                  contact.service === 'web' ? 'de développement web' :
                  contact.service === 'ia' ? "d'automatisation IA" :
                  contact.service === 'transformation' ? 'de transformation digitale' :
                  contact.service === 'audit' ? "d'audit technique" : ''
                }.
              </p>

              <!-- Résumé devis -->
              <div style="background: #F0FDF4; border-left: 4px solid #1B4332; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                <h3 style="color: #1B4332; margin: 0 0 15px 0; font-size: 18px;">📋 Récapitulatif devis</h3>
                <div style="color: #374151; font-size: 14px;">
                  <p style="margin: 0 0 8px 0;"><strong>Numéro:</strong> ${devisNumber}</p>
                  <p style="margin: 0 0 8px 0;"><strong>Montant TTC:</strong> ${prix_ttc.toLocaleString('fr-FR')} €</p>
                  <p style="margin: 0 0 8px 0;"><strong>Acompte (40%):</strong> ${acompte_40.toLocaleString('fr-FR')} €</p>
                  <p style="margin: 0;"><strong>Valide jusqu'au:</strong> ${dateValidite}</p>
                </div>
              </div>

              <p style="color: #374151; line-height: 1.6; margin: 20px 0; font-size: 16px;">
                Le devis complet est disponible en pièce jointe. N'hésitez pas à me contacter pour toute question ou modification.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="tel:+33647244809" style="background: #1B4332; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; display: inline-block; font-weight: bold;">
                  📞 Discutons de votre projet
                </a>
              </div>
            </div>

            <!-- Footer -->
            <div style="background: #F9FAFB; padding: 20px; border-top: 1px solid #E5E7EB; text-align: center; border-radius: 0 0 8px 8px;">
              <p style="margin: 0 0 10px 0; color: #6B7280; font-size: 14px;">
                <strong>Raphael LOTTE</strong><br/>
                Fondateur MonadAI
              </p>
              
              <p style="margin: 0; color: #374151; font-size: 14px;">
                📞 06 47 24 48 09 • ✉️ raph@monadai.fr
              </p>
              
              <p style="margin: 15px 0 0 0; color: #9CA3AF; font-size: 12px;">
                MonadAI • Solutions Web & IA • Bordeaux, France
              </p>
            </div>
          </div>
        `,
        attachments: [
          {
            filename: `Devis-${devisNumber}-MonadAI.html`,
            content: Buffer.from(devisHTML).toString('base64'),
            contentType: 'text/html'
          }
        ]
      })
    } catch (emailError) {
      console.error('❌ Erreur envoi devis:', emailError)
      return NextResponse.json(
        { success: false, message: 'Erreur lors de l\'envoi du devis' },
        { status: 500 }
      )
    }

    // Mettre à jour status lead + ajouter note
    const now = new Date().toISOString()
    const existingNotes = contact.notes || []
    
    const devisNote = {
      id: `note_${Date.now()}`,
      date: now,
      type: 'email',
      content: `Devis ${devisNumber} envoyé - ${prix_ttc.toLocaleString('fr-FR')} € TTC`,
      author: 'Raphael'
    }

    const { error: updateError } = await supabase
      .from('contacts')
      .update({
        status: 'quoted',
        last_contacted: now,
        notes: [...existingNotes, devisNote]
      })
      .eq('id', params.id)

    if (updateError) {
      console.error('❌ Erreur mise à jour lead:', updateError)
      // Devis envoyé mais status pas mis à jour - non bloquant
    }

    return NextResponse.json({
      success: true,
      message: `Devis ${devisNumber} envoyé avec succès à ${contact.name}`,
      devisData: {
        number: devisNumber,
        leadName: contact.name,
        email: contact.email,
        montant_ttc: prix_ttc,
        status: 'quoted'
      }
    })

  } catch (error) {
    console.error('❌ Erreur API devis:', error)
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
