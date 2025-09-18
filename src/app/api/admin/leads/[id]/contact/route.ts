import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * API Contact CRM - Envoyer email personnalisé au lead
 * POST: Envoyer email + update status + ajouter note automatique
 */

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { subject, message } = body

    // Validation
    if (!subject?.trim() || !message?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Objet et message requis' },
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

    // Envoyer email au lead avec template MonadAI
    try {
      await resend.emails.send({
        from: 'MonadAI <raph@monadai.fr>',
        to: [contact.email],
        subject: subject.trim(),
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
            
            <!-- Header MonadAI -->
            <div style="background: linear-gradient(135deg, #1B4332 0%, #2D5A3D 100%); padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <div style="background: #ffffff; width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;">
                <span style="color: #1B4332; font-size: 24px; font-weight: bold;">M</span>
              </div>
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">MonadAI</h1>
              <p style="color: #E8F5E8; margin: 5px 0 0 0; font-size: 14px;">Solutions Web & IA sur mesure</p>
            </div>

            <!-- Corps du message personnalisé -->
            <div style="padding: 30px 20px;">
              <h2 style="color: #1B4332; margin: 0 0 20px 0; font-size: 22px;">
                Bonjour ${contact.name.split(' ')[0]} 👋
              </h2>
              
              <!-- Message personnalisé (avec sauts de ligne préservés) -->
              <div style="color: #374151; line-height: 1.6; font-size: 16px; white-space: pre-wrap; margin: 20px 0;">
${message.trim()}
              </div>

              <!-- Rappel du projet initial -->
              <div style="background: #F0FDF4; border-left: 4px solid #1B4332; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
                <h3 style="color: #1B4332; margin: 0 0 15px 0; font-size: 16px;">📋 Rappel de votre demande :</h3>
                <ul style="margin: 0; padding-left: 20px; color: #374151; font-size: 14px;">
                  <li style="margin-bottom: 5px;"><strong>Service :</strong> ${
                    contact.service === 'web' ? 'Développement Web' :
                    contact.service === 'ia' ? 'Automatisation IA' :
                    contact.service === 'transformation' ? 'Transformation Digitale' :
                    contact.service === 'audit' ? 'Audit Technique' : 'Autre service'
                  }</li>
                  <li style="margin-bottom: 5px;"><strong>Budget :</strong> ${
                    contact.budget === 'less-5k' ? 'Moins de 5K€' :
                    contact.budget === '5k-10k' ? '5K€ - 10K€' :
                    contact.budget === '10k-25k' ? '10K€ - 25K€' :
                    contact.budget === '25k-50k' ? '25K€ - 50K€' :
                    contact.budget === 'more-50k' ? 'Plus de 50K€' : 'À définir'
                  }</li>
                  <li><strong>Délai :</strong> ${
                    contact.timeline === 'asap' ? 'Le plus rapidement possible' :
                    contact.timeline === '1-month' ? 'Dans le mois' :
                    contact.timeline === '1-3-months' ? 'Dans 1 à 3 mois' :
                    contact.timeline === '3-6-months' ? 'Dans 3 à 6 mois' : 'Flexible'
                  }</li>
                </ul>
              </div>
            </div>

            <!-- Footer Contact -->
            <div style="background: #F9FAFB; padding: 20px; border-top: 1px solid #E5E7EB; text-align: center; border-radius: 0 0 8px 8px;">
              <p style="margin: 0 0 15px 0; color: #6B7280; font-size: 14px;">
                <strong>Raphael LOTTE</strong><br/>
                Fondateur MonadAI
              </p>
              
              <div style="margin: 15px 0;">
                <p style="margin: 0; color: #374151; font-size: 14px;">
                  📞 <a href="tel:+33647244809" style="color: #1B4332; text-decoration: none;">06 47 24 48 09</a>
                  • ✉️ <a href="mailto:raph@monadai.fr" style="color: #1B4332; text-decoration: none;">raph@monadai.fr</a>
                </p>
              </div>
              
              <div style="margin: 15px 0;">
                <a href="https://monadai.fr" style="color: #1B4332; text-decoration: none; font-size: 14px; margin: 0 15px;">🌐 Site web</a>
                <a href="https://www.linkedin.com/in/raphael-lotte-17a685331/" style="color: #1B4332; text-decoration: none; font-size: 14px; margin: 0 15px;" target="_blank">💼 LinkedIn</a>
              </div>
              
              <p style="margin: 15px 0 0 0; color: #9CA3AF; font-size: 12px;">
                MonadAI • Solutions Web & IA • Bordeaux, France
              </p>
            </div>
          </div>
        `,
      })
    } catch (emailError) {
      console.error('❌ Erreur envoi email:', emailError)
      return NextResponse.json(
        { success: false, message: 'Erreur lors de l\'envoi de l\'email' },
        { status: 500 }
      )
    }

    // Mettre à jour status lead + ajouter note automatique
    const now = new Date().toISOString()
    const existingNotes = contact.notes || []
    
    const autoNote = {
      id: `note_${Date.now()}`,
      date: now,
      type: 'email',
      content: `Email envoyé: "${subject.trim()}"`,
      author: 'Raphael'
    }

    const { error: updateError } = await supabase
      .from('contacts')
      .update({
        status: 'contacted',
        last_contacted: now,
        notes: [...existingNotes, autoNote]
      })
      .eq('id', params.id)

    if (updateError) {
      console.error('❌ Erreur mise à jour lead:', updateError)
      // Email envoyé mais status pas mis à jour - non bloquant
    }

    return NextResponse.json({
      success: true,
      message: `Email envoyé avec succès à ${contact.name}`,
      contactData: {
        name: contact.name,
        email: contact.email,
        status: 'contacted'
      }
    })

  } catch (error) {
    console.error('❌ Erreur API contact:', error)
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
