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
    
    // 4. Validation sécurité business (avec IP géographique)
    const securityCheck = validateContactForm(sanitizedData, clientIP)
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

    // 2. Envoyer email notification
    try {
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
