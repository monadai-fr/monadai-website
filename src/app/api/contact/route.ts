import { NextRequest, NextResponse } from 'next/server'
import { contactSchema } from '@/lib/contact-schema'
import { supabase } from '@/lib/supabase'
import { Resend } from 'resend'
import { validateContactForm, sanitizeInput, logSecurityEvent } from '@/lib/security'

const resend = new Resend(process.env.RESEND_API_KEY)

// Validation Turnstile CAPTCHA
async function validateTurnstile(token: string): Promise<boolean> {
  if (!token) return false
  
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${process.env.TURNSTILE_SECRET_KEY}&response=${token}`
    })
    
    const result = await response.json()
    return result.success === true
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip') || 'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'
  
  try {
    const body = await request.json()
    
    // 1. Vérification Honeypot (anti-bot)
    if (body.website && body.website.trim() !== '') {
      await logSecurityEvent('form_blocked', {
        ip: clientIP,
        userAgent,
        reason: 'honeypot_filled',
        honeypotValue: body.website
      })
      
      return NextResponse.json(
        { success: false, message: 'Soumission invalide détectée.' },
        { status: 400 }
      )
    }
    
    // 2. Validation Turnstile CAPTCHA  
    if (!await validateTurnstile(body.captchaToken)) {
      await logSecurityEvent('form_blocked', {
        ip: clientIP, 
        userAgent,
        reason: 'captcha_failed'
      })
      
      return NextResponse.json(
        { success: false, message: 'Vérification sécurité échouée. Veuillez réessayer.' },
        { status: 400 }
      )
    }
    
    // 3. Sanitisation inputs
    const sanitizedData = {
      ...body,
      name: sanitizeInput(body.name),
      email: sanitizeInput(body.email),
      company: body.company ? sanitizeInput(body.company) : '',
      message: sanitizeInput(body.message)
    }
    
    // 4. Validation sécurité business (avec IP géographique Cloudflare)
    const securityCheck = validateContactForm(sanitizedData, clientIP, request)
    if (!securityCheck.isValid) {
      await logSecurityEvent('spam_detected', {
        ip: clientIP,
        userAgent, 
        reasons: securityCheck.blockedReasons,
        risk: securityCheck.risk,
        formData: sanitizedData
      })
      
      return NextResponse.json(
        { success: false, message: 'Contenu suspect détecté. Veuillez réviser votre message.' },
        { status: 400 }
      )
    }
    
    // 5. Validation avec Zod (données déjà sanitisées)
    const validatedData = contactSchema.parse(sanitizedData)
    
    // 1. Insérer dans Supabase
    const { data: contactData, error: supabaseError } = await supabase
      .from('contacts')
      .insert([{
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || null,
        company: validatedData.company || null,
        service: validatedData.service,
        budget: validatedData.budget,
        timeline: validatedData.timeline,
        message: validatedData.message,
        newsletter: validatedData.newsletter || false,
        consent: validatedData.consent,
        status: 'new'
      }])
      .select()
    
    if (supabaseError) {
      console.error('❌ Erreur Supabase:', supabaseError)
      throw new Error('Erreur de sauvegarde des données')
    }

    // 2. Envoyer emails (admin + client)
    try {
      // EMAIL ADMIN (existant)
      await resend.emails.send({
        from: 'MonadAI <noreply@monadai.fr>',
        to: [process.env.CONTACT_EMAIL || 'raph@monadai.fr'],
        subject: `🚀 Nouveau contact : ${validatedData.name} - ${validatedData.service}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1B4332;">Nouveau contact MonadAI</h2>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #000; margin-bottom: 15px;">Informations client :</h3>
              <p><strong>Nom :</strong> ${validatedData.name}</p>
              <p><strong>Email :</strong> ${validatedData.email}</p>
              ${validatedData.phone ? `<p><strong>Téléphone :</strong> ${validatedData.phone}</p>` : ''}
              ${validatedData.company ? `<p><strong>Entreprise :</strong> ${validatedData.company}</p>` : ''}
            </div>
            
            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1B4332; margin-bottom: 15px;">Détails projet :</h3>
              <p><strong>Service :</strong> ${validatedData.service}</p>
              <p><strong>Budget :</strong> ${validatedData.budget}</p>
              <p><strong>Délai :</strong> ${validatedData.timeline}</p>
            </div>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #000; margin-bottom: 15px;">Message :</h3>
              <p style="white-space: pre-wrap;">${validatedData.message}</p>
            </div>
            
            ${validatedData.newsletter ? '<p style="color: #1B4332;"><em>✓ Accepte la newsletter</em></p>' : ''}
            
            <hr style="margin: 30px 0; border: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">
              Reçu le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}<br/>
              Dashboard: <a href="https://app.supabase.com" style="color: #1B4332;">Voir dans Supabase</a>
            </p>
          </div>
        `,
      })

      // EMAIL CLIENT (nouveau) 🆕
      await resend.emails.send({
        from: 'MonadAI <noreply@monadai.fr>',
        to: [validatedData.email],
        subject: 'Votre demande MonadAI a été reçue ✅',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
            
            <!-- Header avec logo MonadAI -->
            <div style="background: linear-gradient(135deg, #1B4332 0%, #2D5A3D 100%); padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <div style="background: #ffffff; width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;">
                <span style="color: #1B4332; font-size: 24px; font-weight: bold;">M</span>
              </div>
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">MonadAI</h1>
              <p style="color: #E8F5E8; margin: 5px 0 0 0; font-size: 14px;">Solutions Web & IA sur mesure</p>
            </div>

            <!-- Corps du message -->
            <div style="padding: 30px 20px;">
              <h2 style="color: #1B4332; margin: 0 0 20px 0; font-size: 22px;">
                Bonjour ${validatedData.name.split(' ')[0]} 👋
              </h2>
              
              <p style="color: #374151; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                Merci pour votre demande concernant <strong>${
                  validatedData.service === 'web' ? 'le développement web' :
                  validatedData.service === 'ia' ? "l'automatisation IA" :
                  validatedData.service === 'transformation' ? 'la transformation digitale' :
                  validatedData.service === 'audit' ? "l'audit technique" : 'notre service'
                }</strong>. 
                Nous avons bien reçu votre message et nous nous engageons à vous répondre sous <strong>24h</strong>.
              </p>

              <div style="background: #F0FDF4; border-left: 4px solid #1B4332; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                <h3 style="color: #1B4332; margin: 0 0 15px 0; font-size: 18px;">📋 Récapitulatif de votre demande :</h3>
                <ul style="margin: 0; padding-left: 20px; color: #374151;">
                  <li style="margin-bottom: 8px;"><strong>Service :</strong> ${
                    validatedData.service === 'web' ? 'Développement Web' :
                    validatedData.service === 'ia' ? 'Automatisation IA' :
                    validatedData.service === 'transformation' ? 'Transformation Digitale' :
                    validatedData.service === 'audit' ? 'Audit Technique' : 'Autre service'
                  }</li>
                  <li style="margin-bottom: 8px;"><strong>Budget envisagé :</strong> ${
                    validatedData.budget === 'less-5k' ? 'Moins de 5K€' :
                    validatedData.budget === '5k-10k' ? '5K€ - 10K€' :
                    validatedData.budget === '10k-25k' ? '10K€ - 25K€' :
                    validatedData.budget === '25k-50k' ? '25K€ - 50K€' :
                    validatedData.budget === 'more-50k' ? 'Plus de 50K€' : 'À définir'
                  }</li>
                  <li><strong>Délai souhaité :</strong> ${
                    validatedData.timeline === 'asap' ? 'Le plus rapidement possible' :
                    validatedData.timeline === '1-month' ? 'Dans le mois' :
                    validatedData.timeline === '1-3-months' ? 'Dans 1 à 3 mois' :
                    validatedData.timeline === '3-6-months' ? 'Dans 3 à 6 mois' : 'Flexible'
                  }</li>
                </ul>
              </div>

              <p style="color: #374151; line-height: 1.6; margin: 20px 0; font-size: 16px;">
                En attendant notre réponse détaillée, n'hésitez pas à nous contacter directement si vous avez des questions urgentes.
              </p>
              
              <!-- Contact Info -->
              <div style="background: #F9FAFB; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h4 style="color: #1B4332; margin: 0 0 15px 0; font-size: 16px;">📞 Contact direct :</h4>
                <p style="margin: 0; color: #374151;">
                  <strong>Téléphone :</strong> <a href="tel:+33647244809" style="color: #1B4332; text-decoration: none;">06 47 24 48 09</a><br/>
                  <strong>Email :</strong> <a href="mailto:raph@monadai.fr" style="color: #1B4332; text-decoration: none;">raph@monadai.fr</a>
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div style="background: #F9FAFB; padding: 20px; border-top: 1px solid #E5E7EB; text-align: center; border-radius: 0 0 8px 8px;">
              <p style="margin: 0 0 10px 0; color: #6B7280; font-size: 14px;">
                <strong>Raphael LOTTE</strong><br/>
                Fondateur MonadAI
              </p>
              
              <div style="margin: 15px 0;">
                <a href="https://monadai.fr" style="color: #1B4332; text-decoration: none; font-size: 14px; margin: 0 15px;">🌐 Site web</a>
                <a href="https://www.linkedin.com/in/raphael-lotte-17a685331/" style="color: #1B4332; text-decoration: none; font-size: 14px; margin: 0 15px;" target="_blank">💼 LinkedIn</a>
              </div>
              
              <p style="margin: 15px 0 0 0; color: #9CA3AF; font-size: 12px;">
                MonadAI • Solutions Web & IA • Bordeaux, France<br/>
                Vous recevez cet email suite à votre demande de contact sur monadai.fr
              </p>
            </div>
          </div>
        `,
      })
    } catch (emailError) {
      console.error('⚠️ Erreur email (non bloquant):', emailError)
      // Email échoué mais contact sauvé - on continue
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Votre message a été envoyé avec succès ! Nous vous recontacterons sous 24h.',
      id: `contact_${Date.now()}` // Simulation d'un ID
    })
    
  } catch (error) {
    console.error('❌ Erreur soumission contact:', error)
    
    if (error instanceof Error && 'issues' in error) {
      // Erreur de validation Zod
      return NextResponse.json(
        { 
          success: false, 
          message: 'Données invalides',
          errors: error.issues 
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Une erreur est survenue. Veuillez réessayer.' 
      },
      { status: 500 }
    )
  }
}
