export interface OutreachEmail {
  subject: string
  body: string
  template: string
}

export type TemplateType = "erstkontakt" | "followup1" | "followup2" | "termin"

const TEMPLATE_LABELS: Record<TemplateType, string> = {
  erstkontakt: "Erstkontakt",
  followup1: "Follow-up 1",
  followup2: "Follow-up 2",
  termin: "Termin-Bestätigung",
}

function buildTemplatePrompt(template: TemplateType, leadName: string, industry: string, city?: string, analysis?: any, recommendations?: any): string {
  const analysisContext = analysis
    ? `\n\nAnalyse-Daten zum Unternehmen:\n${JSON.stringify(analysis, null, 2)}`
    : ""
  const recommendationsContext = recommendations
    ? `\n\nEmpfehlungen:\n${JSON.stringify(recommendations, null, 2)}`
    : ""

  const baseContext = `Unternehmen: ${leadName}\nBranche: ${industry}${city ? `\nStandort: ${city}` : ""}${analysisContext}${recommendationsContext}`

  switch (template) {
    case "erstkontakt":
      return `Schreibe eine erste Kontaktaufnahme-E-Mail an ${leadName} (${industry}${city ? `, ${city}` : ""}).

${baseContext}

Anforderungen:
- Zeige dass du dich mit dem Unternehmen beschäftigt hast
- Referenziere konkrete Schwächen oder Verbesserungspotenziale aus der Analyse
- Biete einen klaren Mehrwert an
- Kein aggressiver Sales-Pitch
- Kurz und prägnant (max 150 Wörter im Body)
- Absender ist EmotionFrame (Schweizer Marketing-Agentur)

Antworte im JSON-Format:
{"subject": "Betreffzeile", "body": "E-Mail-Text"}`

    case "followup1":
      return `Schreibe eine erste Follow-up-E-Mail an ${leadName} (${industry}${city ? `, ${city}` : ""}).

${baseContext}

Anforderungen:
- Beziehe dich auf eine vorherige E-Mail (Erstkontakt)
- Füge einen neuen, relevanten Insight hinzu
- Bleibe freundlich und nicht aufdringlich
- Kurz und prägnant (max 120 Wörter im Body)
- Absender ist EmotionFrame

Antworte im JSON-Format:
{"subject": "Betreffzeile", "body": "E-Mail-Text"}`

    case "followup2":
      return `Schreibe eine letzte Follow-up-E-Mail an ${leadName} (${industry}${city ? `, ${city}` : ""}).

${baseContext}

Anforderungen:
- Dies ist die letzte Nachricht in der Sequenz
- Biete ein kostenloses, unverbindliches Beratungsgespräch an
- Setze eine sanfte Deadline ("diese Woche" oder "nächste Woche")
- Respektiere wenn kein Interesse besteht
- Kurz und prägnant (max 100 Wörter im Body)
- Absender ist EmotionFrame

Antworte im JSON-Format:
{"subject": "Betreffzeile", "body": "E-Mail-Text"}`

    case "termin":
      return `Schreibe eine Terminbestätigungs-E-Mail an ${leadName} (${industry}${city ? `, ${city}` : ""}).

${baseContext}

Anforderungen:
- Bestätige einen vereinbarten Beratungstermin
- Füge eine kurze Agenda hinzu (3-4 Punkte)
- Nenne was vorbereitet werden sollte
- Professionell und vorfreudig
- Kurz und prägnant (max 120 Wörter im Body)
- Absender ist EmotionFrame

Antworte im JSON-Format:
{"subject": "Betreffzeile", "body": "E-Mail-Text"}`
  }
}

function buildDemoEmail(template: TemplateType, leadName: string, industry: string): OutreachEmail {
  switch (template) {
    case "erstkontakt":
      return {
        subject: `${leadName} - Ihre Online-Präsenz hat Potenzial`,
        body: `Guten Tag

Wir haben uns Ihre Online-Präsenz angeschaut und sehen einiges an Potenzial für ${leadName}.

Besonders im Bereich Social Media und Website-Optimierung gibt es schnell umsetzbare Massnahmen, die Ihnen mehr Sichtbarkeit und neue Kunden bringen können.

Als Schweizer Marketing-Agentur arbeiten wir mit vielen Unternehmen aus der ${industry}-Branche zusammen und kennen die spezifischen Herausforderungen.

Hätten Sie Interesse an einem kurzen, unverbindlichen Austausch? Ich zeige Ihnen gerne konkret, wo wir ansetzen würden.

Freundliche Grüsse
EmotionFrame

---
Demo-E-Mail: Diese E-Mail wurde ohne KI-API generiert. Mit konfiguriertem API-Schlüssel werden personalisierte E-Mails basierend auf der Lead-Analyse erstellt.`,
        template: TEMPLATE_LABELS[template],
      }

    case "followup1":
      return {
        subject: `Kurzes Follow-up: ${leadName}`,
        body: `Guten Tag

Ich habe Ihnen letzte Woche geschrieben bezüglich der Online-Präsenz von ${leadName}. Ich wollte kurz nachhaken, ob meine Nachricht angekommen ist.

Ein zusätzlicher Punkt, der mir aufgefallen ist: Viele Ihrer Mitbewerber in der ${industry}-Branche nutzen bereits gezieltes Online-Marketing, um neue Kunden zu gewinnen. Hier gibt es eine echte Chance, sich abzuheben.

Lassen Sie uns gerne kurz telefonieren - 15 Minuten reichen völlig.

Freundliche Grüsse
EmotionFrame

---
Demo-E-Mail: Kein API-Schlüssel konfiguriert.`,
        template: TEMPLATE_LABELS[template],
      }

    case "followup2":
      return {
        subject: `Letzter Versuch: Kostenloses Beratungsgespräch für ${leadName}`,
        body: `Guten Tag

Ich möchte Sie nicht weiter belästigen - dies ist meine letzte Nachricht.

Unser Angebot für ein kostenloses 30-Minuten-Beratungsgespräch steht noch bis Ende dieser Woche. Darin zeige ich Ihnen konkret, wie Sie Ihre Online-Sichtbarkeit verbessern können.

Falls kein Interesse besteht, ist das völlig in Ordnung. Ich wünsche Ihnen weiterhin viel Erfolg!

Freundliche Grüsse
EmotionFrame

---
Demo-E-Mail: Kein API-Schlüssel konfiguriert.`,
        template: TEMPLATE_LABELS[template],
      }

    case "termin":
      return {
        subject: `Terminbestätigung: Beratungsgespräch ${leadName}`,
        body: `Guten Tag

Vielen Dank für Ihr Interesse! Hiermit bestätige ich unseren Beratungstermin.

Agenda:
1. Kurze Vorstellung von EmotionFrame
2. Analyse Ihrer aktuellen Online-Präsenz
3. Konkrete Verbesserungsvorschläge
4. Ihre Fragen und nächste Schritte

Bitte halten Sie folgendes bereit:
- Zugangsdaten zu Ihren Social-Media-Konten (falls vorhanden)
- Aktuelle Marketing-Aktivitäten oder -Pläne

Ich freue mich auf unser Gespräch!

Freundliche Grüsse
EmotionFrame

---
Demo-E-Mail: Kein API-Schlüssel konfiguriert.`,
        template: TEMPLATE_LABELS[template],
      }
  }
}

export async function generateOutreachEmail(data: {
  leadName: string
  industry: string
  city?: string
  analysis?: any
  recommendations?: any
  template: TemplateType
  customInstructions?: string
}): Promise<OutreachEmail> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return buildDemoEmail(data.template, data.leadName, data.industry)
  }

  try {
    const userPrompt = buildTemplatePrompt(
      data.template,
      data.leadName,
      data.industry,
      data.city,
      data.analysis,
      data.recommendations
    ) + (data.customInstructions ? `\n\nZusätzliche Anweisungen: ${data.customInstructions}` : "")

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2048,
        system: "Du bist ein professioneller Sales-Copywriter für EmotionFrame, eine Schweizer Marketing-Agentur. Du schreibst E-Mails die höflich, per Sie, ehrlich und authentisch sind. Kein Spam-Style, keine leeren Versprechungen. Der Ton ist professionell aber persönlich, auf Augenhöhe. Schweizer Deutsch-Kontext (nicht Hochdeutsch-formal).",
        messages: [
          {
            role: "user",
            content: userPrompt,
          },
        ],
      }),
    })

    if (!res.ok) {
      return buildDemoEmail(data.template, data.leadName, data.industry)
    }

    const responseData = await res.json()
    const textContent = responseData.content?.find((c: any) => c.type === "text")
    if (!textContent?.text) {
      return buildDemoEmail(data.template, data.leadName, data.industry)
    }

    const jsonText = textContent.text.trim()
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return buildDemoEmail(data.template, data.leadName, data.industry)
    }

    const parsed = JSON.parse(jsonMatch[0])

    return {
      subject: parsed.subject || `Kontaktaufnahme: ${data.leadName}`,
      body: parsed.body || "",
      template: TEMPLATE_LABELS[data.template],
    }
  } catch {
    return buildDemoEmail(data.template, data.leadName, data.industry)
  }
}
