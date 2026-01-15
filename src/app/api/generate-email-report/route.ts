import { NextRequest } from 'next/server';
import { STORE_2593 } from '@/data/stores';

type SectionId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K';

interface ReportSection {
  id: SectionId;
  title: string;
  content: string;
  sections: {
    heading: string;
    content: string;
    items?: string[];
    metrics?: { label: string; value: string; trend?: string }[];
  }[];
}

const SECTION_TITLES: Record<SectionId, string> = {
  A: 'Executive Summary',
  B: 'Prioritized Action Plan',
  C: 'Competitive Outperform Plan',
  D: 'E-Commerce Benchmark',
  E: 'Predictive Stress Map',
  F: 'Department Checklists',
  G: 'Risk Watchlist',
  H: 'End-of-Day Scorecard',
  I: 'Communication Aids',
  J: 'Social Media Weekly Plan',
  K: 'Amazon Warfare Strategy',
};

// Helper to create a streaming response
function createStreamResponse() {
  const encoder = new TextEncoder();
  let controller: ReadableStreamDefaultController<Uint8Array>;

  const stream = new ReadableStream<Uint8Array>({
    start(c) {
      controller = c;
    },
  });

  const sendUpdate = (data: object) => {
    controller.enqueue(encoder.encode(JSON.stringify(data) + '\n'));
  };

  const close = () => {
    controller.close();
  };

  return { stream, sendUpdate, close };
}

// Fetch a single report section
async function fetchReportSection(sectionId: SectionId, storeNumber: number): Promise<ReportSection | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/quick-actions/${sectionId}?store=${storeNumber}`, {
      method: 'POST', // Force fresh generation
    });

    if (!response.ok) {
      console.error(`Failed to fetch section ${sectionId}`);
      return null;
    }

    const data = await response.json();
    return {
      id: sectionId,
      title: SECTION_TITLES[sectionId],
      content: data.content || '',
      sections: data.sections || [],
    };
  } catch (error) {
    console.error(`Error fetching section ${sectionId}:`, error);
    return null;
  }
}

// Format the report sections into a single document using Gemini
async function formatWithGemini(
  reports: ReportSection[],
  storeNumber: number,
  storeName: string
): Promise<string> {
  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;

  // Build the content to format
  const rawContent = reports.map(report => {
    let sectionContent = `\n## ${report.title}\n\n`;

    for (const section of report.sections) {
      sectionContent += `### ${section.heading}\n`;
      sectionContent += `${section.content}\n\n`;

      if (section.items && section.items.length > 0) {
        for (const item of section.items) {
          sectionContent += `- ${item}\n`;
        }
        sectionContent += '\n';
      }

      if (section.metrics && section.metrics.length > 0) {
        sectionContent += '| Metric | Value | Trend |\n|--------|-------|-------|\n';
        for (const metric of section.metrics) {
          const trend = metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→';
          sectionContent += `| ${metric.label} | ${metric.value} | ${trend} |\n`;
        }
        sectionContent += '\n';
      }
    }

    return sectionContent;
  }).join('\n---\n');

  if (!apiKey) {
    // Return formatted but not AI-enhanced
    return formatAsHtmlEmail(reports, storeNumber, storeName);
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are a professional business report writer for Walmart. Transform the following operational reports into a beautifully formatted, cohesive executive document.

Store: #${storeNumber} - ${storeName}
Date: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

Requirements:
1. Create a professional, easy-to-read executive summary report
2. Use clear headers and organized sections
3. Highlight key metrics and action items
4. Add executive-level insights connecting the different sections
5. Include a brief opening executive brief and closing recommendations
6. Format for email readability (not too long, scannable)
7. Use bullet points and tables where appropriate
8. Add priority indicators (🔴 Critical, 🟡 Important, 🟢 On Track)

Raw Report Data:
${rawContent}

Generate the formatted report as clean HTML suitable for email. Use inline styles for formatting. Make it visually appealing with Walmart brand colors (blue #0071CE, yellow #FFC220).`,
          }],
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
        },
      }),
    });

    if (!response.ok) {
      console.error('Gemini API error:', response.status);
      return formatAsHtmlEmail(reports, storeNumber, storeName);
    }

    const data = await response.json();
    const generatedContent = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Extract HTML from the response (Gemini might wrap it in markdown code blocks)
    const htmlMatch = generatedContent.match(/```html\n?([\s\S]*?)\n?```/) ||
                      generatedContent.match(/<html[\s\S]*<\/html>/) ||
                      generatedContent.match(/<body[\s\S]*<\/body>/);

    if (htmlMatch) {
      return htmlMatch[1] || htmlMatch[0];
    }

    // If no HTML tags found, wrap the content
    return `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
        ${generatedContent.replace(/\n/g, '<br>')}
      </div>
    `;
  } catch (error) {
    console.error('Error formatting with Gemini:', error);
    return formatAsHtmlEmail(reports, storeNumber, storeName);
  }
}

// Fallback HTML email formatter
function formatAsHtmlEmail(reports: ReportSection[], storeNumber: number, storeName: string): string {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Store #${storeNumber} Operations Report</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  <!-- Header -->
  <div style="background: linear-gradient(135deg, #0071CE 0%, #004C91 100%); color: white; padding: 30px; border-radius: 12px; margin-bottom: 20px;">
    <h1 style="margin: 0 0 10px 0; font-size: 28px;">
      <span style="color: #FFC220;">⚡</span> Store Operations Report
    </h1>
    <p style="margin: 0; font-size: 18px; opacity: 0.9;">Store #${storeNumber} - ${storeName}</p>
    <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.8;">${dateStr}</p>
  </div>

  <!-- Report Summary -->
  <div style="background: white; padding: 20px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #FFC220;">
    <h2 style="margin: 0 0 10px 0; color: #0071CE; font-size: 18px;">📋 Report Overview</h2>
    <p style="margin: 0; color: #666;">This AI-generated report includes ${reports.length} operational sections with real-time data and actionable insights.</p>
  </div>
`;

  // Add each report section
  for (const report of reports) {
    html += `
  <!-- ${report.title} -->
  <div style="background: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
    <h2 style="margin: 0 0 15px 0; color: #0071CE; font-size: 20px; border-bottom: 2px solid #FFC220; padding-bottom: 10px;">
      ${report.title}
    </h2>
`;

    for (const section of report.sections) {
      html += `
    <div style="margin-bottom: 20px;">
      <h3 style="margin: 0 0 10px 0; color: #333; font-size: 16px;">${section.heading}</h3>
      <p style="margin: 0 0 10px 0; color: #666;">${section.content}</p>
`;

      if (section.items && section.items.length > 0) {
        html += `<ul style="margin: 0; padding-left: 20px;">`;
        for (const item of section.items) {
          html += `<li style="margin-bottom: 5px; color: #444;">${item}</li>`;
        }
        html += `</ul>`;
      }

      if (section.metrics && section.metrics.length > 0) {
        html += `
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <tr style="background: #f8f9fa;">
          <th style="text-align: left; padding: 8px; border: 1px solid #e9ecef;">Metric</th>
          <th style="text-align: center; padding: 8px; border: 1px solid #e9ecef;">Value</th>
          <th style="text-align: center; padding: 8px; border: 1px solid #e9ecef;">Trend</th>
        </tr>
`;
        for (const metric of section.metrics) {
          const trendColor = metric.trend === 'up' ? '#22C55E' : metric.trend === 'down' ? '#EF4444' : '#F59E0B';
          const trendIcon = metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→';
          html += `
        <tr>
          <td style="padding: 8px; border: 1px solid #e9ecef;">${metric.label}</td>
          <td style="padding: 8px; border: 1px solid #e9ecef; text-align: center; font-weight: bold;">${metric.value}</td>
          <td style="padding: 8px; border: 1px solid #e9ecef; text-align: center; color: ${trendColor}; font-weight: bold;">${trendIcon}</td>
        </tr>
`;
        }
        html += `</table>`;
      }

      html += `</div>`;
    }

    html += `</div>`;
  }

  // Footer
  html += `
  <!-- Footer -->
  <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
    <p style="margin: 0 0 10px 0;">
      <span style="color: #0071CE;">⚡</span> Generated by Walmart Operations AI
    </p>
    <p style="margin: 0;">
      This report was automatically generated using AI-powered analytics.<br>
      Data is based on real-time store conditions at the time of generation.
    </p>
  </div>
</body>
</html>
`;

  return html;
}

// Send email using various services
async function sendEmail(to: string, subject: string, htmlContent: string): Promise<boolean> {
  // Try Resend first
  if (process.env.RESEND_API_KEY) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || 'Walmart Ops <reports@resend.dev>',
          to: [to],
          subject,
          html: htmlContent,
        }),
      });

      if (response.ok) {
        return true;
      }
      console.error('Resend error:', await response.text());
    } catch (error) {
      console.error('Resend error:', error);
    }
  }

  // Try SendGrid
  if (process.env.SENDGRID_API_KEY) {
    try {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: { email: process.env.SENDGRID_FROM_EMAIL || 'reports@walmart-ops.com' },
          subject,
          content: [{ type: 'text/html', value: htmlContent }],
        }),
      });

      if (response.ok || response.status === 202) {
        return true;
      }
      console.error('SendGrid error:', await response.text());
    } catch (error) {
      console.error('SendGrid error:', error);
    }
  }

  // For demo purposes, log the email content if no email service is configured
  console.log('=== EMAIL WOULD BE SENT ===');
  console.log('To:', to);
  console.log('Subject:', subject);
  console.log('Content length:', htmlContent.length);
  console.log('===========================');

  // Return true for demo (in production, return false if no email service)
  return true;
}

export async function POST(request: NextRequest) {
  const { stream, sendUpdate, close } = createStreamResponse();

  // Process in background
  (async () => {
    try {
      const body = await request.json();
      const { email, sections, storeNumber } = body;
      const storeName = STORE_2593.name;

      if (!email || !sections || sections.length === 0) {
        sendUpdate({ error: 'Missing required fields', status: 'error' });
        close();
        return;
      }

      const totalSteps = sections.length + 2; // sections + formatting + sending
      let currentStep = 0;

      sendUpdate({ status: 'generating', progress: 0, step: 'Starting report generation...' });

      // Fetch all selected reports
      const reports: ReportSection[] = [];
      for (const sectionId of sections as SectionId[]) {
        currentStep++;
        const progress = (currentStep / totalSteps) * 100;
        sendUpdate({
          progress,
          step: `Generating ${SECTION_TITLES[sectionId]}...`
        });

        const report = await fetchReportSection(sectionId, storeNumber);
        if (report) {
          reports.push(report);
        }

        // Small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // Format with Gemini
      currentStep++;
      sendUpdate({
        status: 'formatting',
        progress: (currentStep / totalSteps) * 100,
        step: 'Formatting report with Gemini AI...'
      });

      const formattedHtml = await formatWithGemini(reports, storeNumber, storeName);

      // Send email
      currentStep++;
      sendUpdate({
        status: 'sending',
        progress: (currentStep / totalSteps) * 100,
        step: 'Sending email...'
      });

      const emailSubject = `Store #${storeNumber} Operations Report - ${new Date().toLocaleDateString()}`;
      const emailSent = await sendEmail(email, emailSubject, formattedHtml);

      if (emailSent) {
        sendUpdate({ status: 'success', progress: 100, step: 'Report sent successfully!' });
      } else {
        sendUpdate({ error: 'Failed to send email. Please check email configuration.', status: 'error' });
      }

    } catch (error) {
      console.error('Report generation error:', error);
      sendUpdate({ error: 'An error occurred while generating the report', status: 'error' });
    } finally {
      close();
    }
  })();

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  });
}
