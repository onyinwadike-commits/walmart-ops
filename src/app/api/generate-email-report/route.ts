import { NextRequest, NextResponse } from 'next/server';
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

// Get the base URL for internal API calls
function getBaseUrl(): string {
  // For Vercel deployments
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // For explicit base URL
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  // Fallback for local development
  return 'http://localhost:3000';
}

// Fetch a single report section
async function fetchReportSection(sectionId: SectionId, storeNumber: number): Promise<ReportSection | null> {
  try {
    const baseUrl = getBaseUrl();
    console.log(`Fetching section ${sectionId} from ${baseUrl}/api/quick-actions/${sectionId}`);

    const response = await fetch(`${baseUrl}/api/quick-actions/${sectionId}?store=${storeNumber}`, {
      method: 'POST', // Force fresh generation
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`Failed to fetch section ${sectionId}: ${response.status}`);
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
    console.log('No Gemini API key, using fallback formatter');
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

Generate the formatted report as clean HTML suitable for email. Use inline styles for formatting. Make it visually appealing with Walmart brand colors (blue #0071CE, yellow #FFC220). Start directly with the HTML, no markdown code blocks.`,
          }],
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
        },
      }),
    });

    if (!response.ok) {
      console.error('Gemini API error:', response.status, await response.text());
      return formatAsHtmlEmail(reports, storeNumber, storeName);
    }

    const data = await response.json();
    const generatedContent = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Extract HTML from the response (Gemini might wrap it in markdown code blocks)
    const htmlMatch = generatedContent.match(/```html\n?([\s\S]*?)\n?```/);
    if (htmlMatch) {
      return htmlMatch[1];
    }

    // Check if it starts with HTML
    if (generatedContent.trim().startsWith('<')) {
      return generatedContent;
    }

    // Wrap non-HTML content
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

// Send email using Resend
async function sendEmailWithResend(to: string, subject: string, htmlContent: string): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return { success: false, error: 'RESEND_API_KEY not configured' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || 'Walmart Ops <onboarding@resend.dev>',
        to: [to],
        subject,
        html: htmlContent,
      }),
    });

    const responseData = await response.json();

    if (response.ok) {
      console.log('Email sent successfully via Resend:', responseData);
      return { success: true };
    } else {
      console.error('Resend API error:', responseData);
      return { success: false, error: responseData.message || 'Failed to send email' };
    }
  } catch (error) {
    console.error('Resend error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Network error' };
  }
}

// Send email using SendGrid
async function sendEmailWithSendGrid(to: string, subject: string, htmlContent: string): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.SENDGRID_API_KEY;

  if (!apiKey) {
    return { success: false, error: 'SENDGRID_API_KEY not configured' };
  }

  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
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
      console.log('Email sent successfully via SendGrid');
      return { success: true };
    } else {
      const errorText = await response.text();
      console.error('SendGrid API error:', errorText);
      return { success: false, error: errorText };
    }
  } catch (error) {
    console.error('SendGrid error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Network error' };
  }
}

// Main email sending function - tries available services
async function sendEmail(to: string, subject: string, htmlContent: string): Promise<{ success: boolean; error?: string; service?: string }> {
  // Try Resend first
  if (process.env.RESEND_API_KEY) {
    const result = await sendEmailWithResend(to, subject, htmlContent);
    if (result.success) {
      return { ...result, service: 'Resend' };
    }
    console.log('Resend failed, trying next service...');
  }

  // Try SendGrid
  if (process.env.SENDGRID_API_KEY) {
    const result = await sendEmailWithSendGrid(to, subject, htmlContent);
    if (result.success) {
      return { ...result, service: 'SendGrid' };
    }
    console.log('SendGrid failed');
  }

  // No email service configured
  return {
    success: false,
    error: 'No email service configured. Please add RESEND_API_KEY or SENDGRID_API_KEY to environment variables.'
  };
}

interface ProgressUpdate {
  status: 'generating' | 'formatting' | 'sending' | 'success' | 'error';
  progress: number;
  step: string;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, sections, storeNumber } = body;
    const storeName = STORE_2593.name;

    if (!email || !sections || sections.length === 0) {
      return NextResponse.json({
        error: 'Missing required fields',
        status: 'error'
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        error: 'Invalid email address',
        status: 'error'
      }, { status: 400 });
    }

    const updates: ProgressUpdate[] = [];
    const totalSteps = sections.length + 2; // sections + formatting + sending
    let currentStep = 0;

    // Fetch all selected reports
    const reports: ReportSection[] = [];
    for (const sectionId of sections as SectionId[]) {
      currentStep++;
      updates.push({
        status: 'generating',
        progress: (currentStep / totalSteps) * 100,
        step: `Generating ${SECTION_TITLES[sectionId]}...`
      });

      const report = await fetchReportSection(sectionId, storeNumber);
      if (report) {
        reports.push(report);
      }
    }

    if (reports.length === 0) {
      return NextResponse.json({
        error: 'Failed to generate any reports',
        status: 'error'
      }, { status: 500 });
    }

    // Format with Gemini
    currentStep++;
    updates.push({
      status: 'formatting',
      progress: (currentStep / totalSteps) * 100,
      step: 'Formatting report with Gemini AI...'
    });

    const formattedHtml = await formatWithGemini(reports, storeNumber, storeName);

    // Send email
    currentStep++;
    updates.push({
      status: 'sending',
      progress: (currentStep / totalSteps) * 100,
      step: 'Sending email...'
    });

    const emailSubject = `Store #${storeNumber} Operations Report - ${new Date().toLocaleDateString()}`;
    const emailResult = await sendEmail(email, emailSubject, formattedHtml);

    if (emailResult.success) {
      return NextResponse.json({
        status: 'success',
        progress: 100,
        step: `Report sent successfully via ${emailResult.service}!`,
        message: `Report has been sent to ${email}`
      });
    } else {
      return NextResponse.json({
        status: 'error',
        error: emailResult.error || 'Failed to send email',
        progress: 100
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Report generation error:', error);
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'An error occurred while generating the report'
    }, { status: 500 });
  }
}
