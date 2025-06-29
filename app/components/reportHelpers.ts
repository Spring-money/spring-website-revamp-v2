/* ------------------------------------------------------------------
    · Report helpers (PDF + WhatsApp) — Spring Money
------------------------------------------------------------------ */
"use client";

import html2canvas from "html2canvas";
import { ReportOptionsData } from "./ReportDialog";
import type { PDFDocument, PDFPage, PDFFont, RGB, PDFImage } from 'pdf-lib';

/* ───────── Brand palette ───────── */
const COLORS = {
  primary:     "#108E66",    // Spring Money primary green
  primaryDark: "#0d7a5a",    // Dark green
  text:        "#272B2A",    // Dark text
  textLight:   "#808080",    // Medium gray text
  gray100:     "#272B2A",    // Dark gray
  gray300:     "#272B2A8A",  // Semi-transparent dark
  accent:      "#525ECC",    // Accent blue
  lightGray:   "#272B2A40",  // Light border color
  background:  "#FCFFFE",    // Off-white background
  white:       "#FFFFFF",    // Pure white
  primaryBF:   "#272B2ABF",  // Semi-transparent primary
};

/* ───────── Helpers ───────── */
const formatINR = (n: number) => `Rs. ${n.toLocaleString("en-IN")}`;   // Using "Rs." instead of ₹
const formatPCT = (n: number) => `${n.toFixed(2)}%`;
const safeName = (s: string) => s.replace(/\s+/g, "_");              // filename-safe

// Helper function to truncate text
const truncateText = (text: string | undefined, maxLength: number = 1000): string => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

/* ───────── Types ───────── */
export interface YearRow {
  year: number;
  openingBalance: number;
  interestEarned: number;
  closingBalance: number;
}
export interface SIPYearRow {
  year: number;
  totalInvested: number;
  futureValue: number;
  wealthGained: number;
}

// Extended ReportData interface to include Capital Gains Tax Calculator fields
export interface ReportData {
  title: string;
  totalInvested: number;
  futureValue: number;
  wealthGained: number;
  monthlyInvestment: number;
  duration: number;
  annualReturn: number;
  rows?: YearRow[];
  
  // Capital Gains Tax Calculator specific fields
  assetName?: string;
  assetType?: string;
  isPre2001Asset?: boolean;
  fairMarketValue2001?: number;
  purchaseCost?: number;
  purchaseFinancialYear?: string;
  improvementCosts?: Array<{cost: number, year: string}>;
  totalImprovementCost?: number;
  salePrice?: number;
  saleExpenses?: number;
  saleDate?: string;
  saleProceeds?: number;
  holdingPeriodMonths?: number;
  holdingPeriodYears?: string;
  capitalGainType?: string;
  indexedPurchaseCost?: number;
  indexedImprovementCost?: number;
  totalIndexedCost?: number;
  capitalGain?: number;
  taxSlab?: number | null;
  capitalGainTax?: number;
  effectiveTaxRate?: string;
  netProfitAfterTax?: number;
  taxExemptionInfo?: string;
  taxTips?: string[] | string;
  calculationDate?: string;
}

/* ════════════════════════════════
   1. Screenshot helper
   ════════════════════════════════ */
export const captureChartAsImage = async (id: string): Promise<string | null> => {
  try {
    const el = document.getElementById(id);
    if (!el) {
      console.warn(`Chart element with ID "${id}" not found`);
      return null;
    }
    
    // Make sure the element is visible for capture
    const originalDisplay = el.style.display;
    if (originalDisplay === 'none') {
      el.style.display = 'block';
    }
    
    // Capture the chart
    const canvas = await html2canvas(el, { 
      scale: 2, 
      backgroundColor: "#fff",
      logging: false,
      allowTaint: true,
      useCORS: true
    });
    
    // Reset display style if it was changed
    if (originalDisplay === 'none') {
      el.style.display = 'none';
    }
    
    // Ensure we get a PNG format
    const dataUrl = canvas.toDataURL("image/png");
    
    // Validate the data URL
    if (!dataUrl || !dataUrl.startsWith('data:image/png;base64,')) {
      console.error('Failed to generate valid PNG data URL');
      return null;
    }
    
    return dataUrl;
  } catch (error) {
    console.error(`Error capturing chart "${id}":`, error);
    return null;
  }
};

/* ════════════════════════════════
   2. Text report generation
   ════════════════════════════════ */

// Formatting utilities
const INR = (val: number) => new Intl.NumberFormat('en-IN', { 
  style: 'currency', currency: 'INR', maximumFractionDigits: 0 
}).format(val).replace('₹', 'Rs.');
const PCT = (val: number) => val.toFixed(2) + '%';
const fmtMobile = (n: string) => n.startsWith('+') ? n : `+91${n}`;

/* Text colors for PDF */
const PDF_COLORS = {
  primary: [16, 142, 102],      // Spring Money green #108E66
  primaryDark: [13, 122, 90],   // Darker green #0d7a5a
  gray100: [252, 255, 254],     // Spring Money background #FCFFFE
  gray200: [238, 238, 238],     // Light gray
  gray300: [218, 218, 218],     // Medium gray
  text: [39, 43, 42],           // Spring Money text #272B2A
  textLight: [128, 128, 128]    // Medium gray text #808080
};

// Function to sanitize text by removing or replacing problematic characters
const sanitizeText = (text: string): string => {
  if (!text) return '';
  return String(text).replace(/\n/g, ' ').replace(/\r/g, '').replace(/\t/g, ' ');
};

// Generate plain text report (used as fallback or for non-PDF output)
export const generateReport = (opts: ReportOptionsData, data: ReportData): string => {
  const { clientName } = opts;
  const date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  
  let report = `
INVESTMENT REPORT
----------------
Prepared for: ${clientName}
Date: ${date}


`;

  // Check if this is a Capital Gains Tax report by looking for specific fields
  if (data.title?.includes("Capital Gains Tax") && 'assetType' in data && 'capitalGainType' in data) {
    // This is a Capital Gains Tax Report - use specialized format
    report += `
CAPITAL GAINS TAX CALCULATION
----------------------------
Asset Name: ${data.assetName || 'Not specified'}
Asset Type: ${data.assetType || ''}
${data.isPre2001Asset ? `Fair Market Value (01-04-2001): ${INR(data.fairMarketValue2001 || 0)}` : ''}

TRANSACTION DETAILS
-----------------
Purchase Cost: ${INR(data.purchaseCost || 0)}
Purchase Financial Year: ${data.purchaseFinancialYear || ''}
${data.improvementCosts && data.improvementCosts.length > 0 ? 
  `Improvement Costs: ${INR(data.totalImprovementCost || 0)}` : 
  'No improvement costs recorded'}
Sale Price: ${INR(data.salePrice || 0)}
Sale Expenses: ${INR(data.saleExpenses || 0)}
Sale Date: ${data.saleDate || ''}
Net Sale Proceeds: ${INR(data.saleProceeds || 0)}

CAPITAL GAIN CALCULATION
----------------------
Holding Period: ${data.holdingPeriodYears || '0'} years (${data.holdingPeriodMonths || 0} months)
Capital Gain Type: ${data.capitalGainType || ''}
${data.capitalGainType === 'LTCG' ? 
  `Indexed Purchase Cost: ${INR(data.indexedPurchaseCost || 0)}
Indexed Improvement Cost: ${INR(data.indexedImprovementCost || 0)}
Total Indexed Cost: ${INR(data.totalIndexedCost || 0)}` : 
  `Total Cost: ${INR((data.purchaseCost || 0) + (data.totalImprovementCost || 0))}`}
Capital Gain: ${INR(data.capitalGain || 0)}

TAX CALCULATION
-------------
${data.capitalGainType === 'STCG' && data.assetType !== 'Equity Shares (Listed) / Equity Mutual Funds' ? 
  `Tax Slab Rate: ${data.taxSlab || 0}%` : ''}
Capital Gain Tax: ${INR(data.capitalGainTax || 0)}
Effective Tax Rate: ${data.effectiveTaxRate || '0'}%
Net Profit After Tax: ${INR(data.netProfitAfterTax || 0)}
${data.taxExemptionInfo ? `\nExemption Note: ${data.taxExemptionInfo}` : ''}

${data.taxTips ? `\nTAX TIPS\n--------\n${Array.isArray(data.taxTips) ? data.taxTips.join('\n\n') : data.taxTips}` : ''}
`;
  } else {
    // Standard investment report format
    report += `INVESTMENT SUMMARY
-----------------
Monthly Investment: ${INR(data.monthlyInvestment)}
Duration: ${data.duration} years
Expected Return Rate: ${PCT(data.annualReturn)}
Total Amount Invested: ${INR(data.totalInvested)}
Future Value: ${INR(data.futureValue)}
Wealth Gained: ${INR(data.wealthGained)}
ROI: ${PCT((data.wealthGained / data.totalInvested) * 100)}
`;
  }

  // Add comments if included
  if (opts.includeComments && opts.comments) {
    report += `

COMMENTS
--------
${opts.comments}`;
  }

  // Add suggestions if provided
  if (opts.suggestions) {
    report += `




SUGGESTIONS & NEXT STEPS
-----------------------
${opts.suggestions}`;
  }

  return report;
};

/* ════════════════════════════════
   2. Template PDF functions (new)
   ════════════════════════════════ */

// Load a PDF template and fill it with data
export const fillPDFTemplate = async (
  template: ArrayBuffer,
  data: ReportData,
  opts: ReportOptionsData,
  yearly: (YearRow | SIPYearRow)[] = []
) => {
  // Import PDF libraries dynamically
  const pdfLib = await import('pdf-lib');
  const { PDFDocument } = pdfLib;
  
  try {
    // Load the template PDF
    const pdfDoc = await PDFDocument.load(template);
    
    // Get the form from the template
    const form = pdfDoc.getForm();
    
    // Prepare data for template filling
    const formattedData = {
      // Client information
      'clientName': opts.clientName,
      'reportDate': new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
      
      // Investment details
      'reportTitle': data.title,
      'monthlyInvestment': INR(data.monthlyInvestment),
      'duration': `${data.duration} years`,
      'expectedReturn': PCT(data.annualReturn),
      'totalInvested': INR(data.totalInvested),
      'futureValue': INR(data.futureValue),
      'wealthGained': INR(data.wealthGained),
      'roi': PCT((data.wealthGained / data.totalInvested) * 100),
      
      // Comments and suggestions
      'comments': opts.includeComments ? opts.comments : '',
      'suggestions': opts.suggestions || '',
    };
    
    // Fill in form fields
    for (const [key, value] of Object.entries(formattedData)) {
      try {
        // Attempt to get the field - it may not exist in the template
        const field = form.getTextField(key);
        if (field) {
          field.setText(String(value));
        }
      } catch (err) {
        console.log(`Field ${key} not found in template or is not a text field`);
      }
    }
    
    // If there's a yearly breakdown table in the template, try to fill it
    if (yearly.length > 0 && opts.reportType === 'detailed') {
      // Attempt to fill yearly data (field names would depend on your template)
      for (let i = 0; i < Math.min(yearly.length, 30); i++) { // Limit to 30 years
        const row = yearly[i];
        const yearPrefix = `year${i+1}`;
        
        try {
          // For YearRow (lumpsum type)
          if ('openingBalance' in row) {
            trySetField(form, `${yearPrefix}Year`, String(row.year));
            trySetField(form, `${yearPrefix}Opening`, INR((row as YearRow).openingBalance));
            trySetField(form, `${yearPrefix}Interest`, INR((row as YearRow).interestEarned));
            trySetField(form, `${yearPrefix}Closing`, INR((row as YearRow).closingBalance));
          } 
          // For SIPYearRow type
          else if ('totalInvested' in row) {
            trySetField(form, `${yearPrefix}Year`, String(row.year));
            trySetField(form, `${yearPrefix}Invested`, INR((row as SIPYearRow).totalInvested));
            trySetField(form, `${yearPrefix}Gain`, INR((row as SIPYearRow).wealthGained));
            trySetField(form, `${yearPrefix}Future`, INR((row as SIPYearRow).futureValue));
          }
        } catch (err) {
          console.log(`Error setting year ${i+1} data: ${err}`);
        }
      }
    }
    
    // Save the filled PDF
    return new Uint8Array(await pdfDoc.save());
  } catch (error) {
    console.error("Error filling PDF template:", error);
    throw error;
  }
};

// Helper function to try setting a form field
function trySetField(form: any, fieldName: string, value: string) {
  try {
    const field = form.getTextField(fieldName);
    if (field) {
      field.setText(value);
    }
  } catch (e) {
    // Field doesn't exist or isn't a text field
  }
}

/* ════════════════════════════════
   3. Core PDF builder (internal)
   ════════════════════════════════ */
const loadJsPDF = async () => {
  const mod: any = await import("jspdf");
  return mod.jsPDF ?? mod.default;
};

const buildPdf = async (
  plainText: string,
  opts?: ReportOptionsData,
  data?: ReportData,
  yearly: (YearRow | SIPYearRow)[] = []
) => {
  const jsPDF    = await loadJsPDF();
  const autoTable = (await import("jspdf-autotable")).default;

  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  pdf.setFont("Helvetica");

  const W = pdf.internal.pageSize.width;
  const H = pdf.internal.pageSize.height;
  const M = { l: 50, r: 50, t: 60, b: 60 };
  let y   = M.t;
  const usableW = W - M.l - M.r;

  const ensure = (h: number) => {
    if (y + h > H - M.b) {
      pdf.addPage();
      y = M.t;
    }
  };
  const banner = (txt: string) => {
    ensure(36);
    pdf.setDrawColor(...PDF_COLORS.primary);
    pdf.setFillColor(...PDF_COLORS.primary);
    pdf.rect(M.l, y, usableW, 36, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(18);
    pdf.text(txt, M.l + 12, y + 24);
    y += 36 + 12;
  };
  const head = (txt: string) => {
    ensure(30);
    pdf.setTextColor(...PDF_COLORS.primary);
    pdf.setFontSize(16);
    pdf.setFont("Helvetica", "bold");
    pdf.text(txt, M.l, y + 24);
    y += 30;
    pdf.setDrawColor(...PDF_COLORS.primary);
    pdf.setLineWidth(1);
    pdf.line(M.l, y, M.l + usableW, y);
    y += 8;
    pdf.setFont("Helvetica", "normal");
  };
  const text = (txt: string, size = 12) => {
    pdf.setFontSize(size);
    pdf.setTextColor(...PDF_COLORS.text);
    const lines = pdf.splitTextToSize(txt, usableW);
    const height = lines.length * (size + 2);
    ensure(height);
    pdf.text(lines, M.l, y + size);
    y += height + 8;
  };

  // Add a simple logo/header area
  if (opts && opts.clientName && data) {
    banner("INVESTMENT REPORT");
    text(`Prepared for: ${opts.clientName}`);
    text(`Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, 11);
    text(`Calculator: ${data.title}`, 11);
    ensure(20);
    y += 20;

    // Investment Summary Section
    head("INVESTMENT SUMMARY");
    const summaryTableBody = [
      ["Monthly Investment", INR(data.monthlyInvestment)],
      ["Duration", `${data.duration} years`],
      ["Expected Return Rate", PCT(data.annualReturn)],
      ["Total Amount Invested", INR(data.totalInvested)],
      ["Future Value", INR(data.futureValue)],
      ["Wealth Gained", INR(data.wealthGained)],
      ["ROI", PCT((data.wealthGained / data.totalInvested) * 100)],
    ];

    autoTable(pdf, {
      startY: y,
      head: [],
      body: summaryTableBody,
      theme: 'plain',
      styles: {
        fontSize: 12,
        textColor: [51, 51, 51],
        cellPadding: 8,
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 200 },
        1: { cellWidth: 'auto' },
      },
    });
    y = (pdf as any).lastAutoTable.finalY + 20;
  
    // For detailed reports, add the yearly breakdown
    if (opts.reportType === 'detailed' && yearly.length > 0) {
      head("YEARLY BREAKDOWN");
      
      // Determine if we're dealing with SIP or standard YearRow data
      const isSIPData = 'totalInvested' in yearly[0];
      
      let yearlyTableHead;
      let yearlyTableBody;
      
      if (isSIPData) {
        // SIP data has different column structure
        yearlyTableHead = [['Year', 'Total Invested', 'Future Value', 'Wealth Gained']];
        yearlyTableBody = (yearly as SIPYearRow[]).map(row => [
          row.year,
          INR(row.totalInvested),
          INR(row.futureValue),
          INR(row.wealthGained),
        ]);
      } else {
        // Standard lumpsum data
        yearlyTableHead = [['Year', 'Opening Balance', 'Interest', 'Closing Balance']];
        yearlyTableBody = (yearly as YearRow[]).map(row => [
          row.year,
          INR(row.openingBalance),
          INR(row.interestEarned),
          INR(row.closingBalance),
        ]);
      }
      
      autoTable(pdf, {
        startY: y,
        head: yearlyTableHead,
        body: yearlyTableBody,
        headStyles: {
          fillColor: [16, 142, 102], // Spring Money green
          textColor: [255, 255, 255],
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [232, 242, 232], // Light Spring Money green
        },
        styles: {
          fontSize: 11,
          cellPadding: 6,
        },
      });
      
      
      y = (pdf as any).lastAutoTable.finalY + 20;
    }
    
    // Comments section if included
    if (opts.includeComments && opts.comments) {
      head("COMMENTS");
      text(opts.comments);
      y += 10;
    }
    
    // Suggestions section if provided
    if (opts.suggestions) {
      head("SUGGESTIONS & NEXT STEPS");
      text(opts.suggestions);
    }
  } else {
    // Fallback to plain text if we don't have the structured data
    text(plainText);
  }
  
  // Add footer with page numbers
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(10);
    pdf.setTextColor(...PDF_COLORS.textLight);
    
    // Disclaimer
    pdf.text(
      sanitizeText("Illustrative purpose only – not investment advice."),
      M.l,
      H - M.b + 20
    );
    
    // Page number
    pdf.text(
      sanitizeText(`Page ${i} of ${totalPages}`),
      W - M.r,
      H - M.b + 20,
      { align: "right" }
    );
  }
  
  return new Uint8Array(pdf.output("arraybuffer"));
};

/* ════════════════════════════════
   4. Modern PDF report generation
   ════════════════════════════════ */

export const generateModernPDFReport = async (
  opts: ReportOptionsData,
  data: ReportData,
  yearly: (YearRow | SIPYearRow)[] = [],
  chartImages?: { [key: string]: string }
) => {
  // Import PDF-lib dynamically
  const pdfLib = await import('pdf-lib');
  const { PDFDocument, rgb, StandardFonts } = pdfLib;
  
  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    
    // Embed fonts that have better character support
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Load company logo
    let logoImage = null;
    try {
      // Try to load the Spring Money logo as PNG first since PDF-lib supports it natively
      const logoImageBytes = await fetch('/images/spring-money-logo.png')
        .then(res => {
          if (!res.ok) {
            throw new Error('Spring Money logo PNG not found');
          }
          return res.arrayBuffer();
        })
        .catch(async () => {
          // If PNG fails, try SVG but note that we'll need to convert it to PNG
          console.log('Falling back to SVG logo');
          return null;
        });
      
      if (logoImageBytes) {
      logoImage = await pdfDoc.embedPng(new Uint8Array(logoImageBytes));
      }
    } catch (error) {
      console.error('Error loading Spring Money logo:', error);
      // Continue without logo if there's an error
    }
    
    // Load arrow image for design elements
    let arrowImage: PDFImage | null = null;
    try {
      const arrowImageBytes = await fetch('/svg/arrow.png')
        .then(res => {
          if (!res.ok) {
            throw new Error('Arrow PNG not found');
          }
          return res.arrayBuffer();
        });
      
      arrowImage = await pdfDoc.embedPng(new Uint8Array(arrowImageBytes));
    } catch (error) {
      console.error('Error loading arrow image:', error);
      // Continue without arrow if there's an error
    }
    
    // Define colors based on Spring Money design
    const primaryColor = rgb(16/255, 142/255, 102/255); // Spring Money green (#108E66)
    const secondaryColor = rgb(13/255, 122/255, 90/255); // Darker green (#0d7a5a)
    const textColor = rgb(39/255, 43/255, 42/255); // Spring Money text (#272B2A)
    const textLightColor = rgb(128/255, 128/255, 128/255); // Medium gray (#808080)
    const borderColor = rgb(220/255, 220/255, 220/255); // Light gray for borders (#DDDDDD)
    const neutralBorderColor = rgb(229/255, 229/255, 229/255); // Neutral border (#E5E5E5)
    const whiteColor = rgb(1, 1, 1); // White (#FFFFFF)
    const cardBgColor = rgb(252/255, 255/255, 254/255); // Spring Money background (#FCFFFE)
    const highlightBgColor = rgb(232/255, 242/255, 232/255); // Light green background (#E8F2E8)
    const tableHeaderBgColor = rgb(232/255, 242/255, 232/255); // Light Spring Money green background (#E8F2E8)
    
    // Format date
    const currentDate = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    
    // Truncate comments and suggestions to 1000 characters
    const truncatedComments = truncateText(opts.comments);
    const truncatedSuggestions = truncateText(opts.suggestions);
    
    // Use the truncated values for the rest of the function
    const modifiedOpts = {
      ...opts,
      comments: truncatedComments,
      suggestions: truncatedSuggestions
    };
    
    // Determine required number of pages
    const hasComments = modifiedOpts.includeComments && truncatedComments && truncatedComments.trim().length > 0;
    const hasSuggestions = truncatedSuggestions && truncatedSuggestions.trim().length > 0;
    const hasCharts = modifiedOpts.includeGraphs && chartImages && (chartImages.lineChart || chartImages.barChart);
    const hasDetailedTable = yearly && yearly.length > 0 && opts.reportType === 'detailed';
    
    // Create required pages - only create pages that will have content
    const page1 = pdfDoc.addPage([595, 842]); // A4 size
    let page2;
    if (hasComments || hasSuggestions || hasCharts) {
      page2 = pdfDoc.addPage([595, 842]);
    }
    
    let page3;
    if (hasDetailedTable) {
      page3 = pdfDoc.addPage([595, 842]);
    }
    
    // Remove the unnecessary page4 creation
    // let page4;
    // if (hasDetailedTable) {
    //   page4 = pdfDoc.addPage([595, 842]);
    // }
    
    // Draw header on all pages with sanitized text
    const drawPageHeader = (page: PDFPage, showTitle = true) => {
      // On first page, match the exact layout from the image
      if (showTitle) {
        // Draw logo in top left - match size and position from the image
        if (logoImage) {
          // Use the specified dimensions
          const logoWidth = 160;
          const logoHeight = 40;
          
          page.drawImage(logoImage, {
            x: 60, // Position to match image
            y: page.getHeight() - 70, // Moved up to reduce space above logo (from 100 to 70)
            width: logoWidth,
            height: logoHeight,
          });
        } else {
          // Fallback text if logo is not available
          page.drawText(sanitizeText("Spring Money"), {
            x: 60,
            y: page.getHeight() - 55, // Adjusted to match new logo position
            size: 18,
            font: helveticaBold,
        color: primaryColor,
      });
        }
        
        // Format the title to match the image exactly
        // Make sure to use proper formatting for each calculator type
        let formattedTitle = data.title;
        if (formattedTitle.toLowerCase().includes("lumpsum")) {
          formattedTitle = "Lumpsum + SIP Calculator Report";
        } else if (formattedTitle.toLowerCase().includes("step")) {
          formattedTitle = "Step-Up SIP Calculator Report";
        } else if (formattedTitle.toLowerCase().includes("retirement")) {
          formattedTitle = "Retirement Calculator Report";
        }
        
        // Draw title to match image - large green text
        page.drawText(sanitizeText(formattedTitle), {
          x: 60,
          y: page.getHeight() - 120, // Adjusted to account for new logo position (from 150 to 120)
          size: 28, // Size to match image
          font: helveticaBold,
          color: primaryColor, // Spring Money green instead of dark blue
        });
        
        // Add client and date on same line below title with blue line underneath
        page.drawText(sanitizeText(`Prepared for: ${modifiedOpts.clientName || "Client"}`), {
          x: 60,
          y: page.getHeight() - 160, // Adjusted to account for new title position (from 190 to 160)
          size: 12,
          font: helvetica,
          color: textColor,
        });
        
        // Add date aligned to right on same line as client
        const dateText = sanitizeText(`Date: ${currentDate}`);
        const dateWidth = helvetica.widthOfTextAtSize(dateText, 12);
        page.drawText(dateText, {
          x: page.getWidth() - 60 - dateWidth,
          y: page.getHeight() - 160, // Same Y position as client name
          size: 12,
          font: helvetica,
          color: textColor,
        });
        
        // Draw green line below client/date info - with 24px spacing above and below
        page.drawLine({
          start: { x: 60, y: page.getHeight() - (160 + 24) }, // 24px below the text
          end: { x: page.getWidth() - 60, y: page.getHeight() - (160 + 24) },
          thickness: 1,
          color: primaryColor,
        });
      } else {
        // For subsequent pages, use a simpler header
      // Draw logo if available
      if (logoImage) {
          // Use the specified dimensions
        const logoWidth = 160;
        const logoHeight = 40;
          
        page.drawImage(logoImage, {
            x: 60,
            y: page.getHeight() - 50,
          width: logoWidth,
          height: logoHeight,
        });
      } else {
        // Fallback text if logo is not available
          page.drawText(sanitizeText("Spring Money"), {
            x: 60,
            y: page.getHeight() - 40,
            size: 14,
          font: helveticaBold,
            color: primaryColor,
          });
        }
        
        // Format the title to match the image
        let formattedTitle = data.title;
        if (formattedTitle.toLowerCase().includes("lumpsum")) {
          formattedTitle = "Lumpsum + SIP Calculator Report";
        } else if (formattedTitle.toLowerCase().includes("step")) {
          formattedTitle = "Step-Up SIP Calculator Report";
        } else if (formattedTitle.toLowerCase().includes("retirement")) {
          formattedTitle = "Retirement Calculator Report";
        }
        
        // Title on other pages
        page.drawText(sanitizeText(formattedTitle), {
          x: page.getWidth() - 250,
          y: page.getHeight() - 50,
          size: 12, // Reset back to 12px
          font: helveticaBold,
          color: primaryColor, // Spring Money green instead of dark blue
        });
        
        // Draw green line below header on other pages - with 24px spacing above and below
        page.drawLine({
          start: { x: 60, y: page.getHeight() - (50 + 24) }, // 24px below the text
          end: { x: page.getWidth() - 60, y: page.getHeight() - (50 + 24) },
          thickness: 1,
          color: primaryColor,
        });
      }
    };
    
    // Draw footer on all pages
    const drawFooter = (page: PDFPage, pageNum: number, totalPages: number) => {
      const footerY = 40; // Position from bottom of page
      
      // Footer line - with 24px spacing above and below
      page.drawLine({
        start: { x: 35, y: footerY + 24 }, // 24px above the footer text
        end: { x: page.getWidth() - 35, y: footerY + 24 },
        thickness: 0.5,
        color: rgb(0.9, 0.9, 0.9),
      });
      
      // Disclaimer text
      page.drawText(sanitizeText("Illustrative purpose only – not investment advice."), {
        x: 35,
        y: footerY,
        size: 8,
        font: helvetica,
        color: textColor,
      });
      page.drawText(sanitizeText("Spring Money"), {
        x: 35,
        y: footerY - 10,
        size: 8,
        font: helveticaBold,
        color: primaryColor,
      });
      
      // Page number - ensure it stays within right margin
      const pageText = sanitizeText(`Page ${pageNum} of ${totalPages}`);
      const pageTextWidth = helvetica.widthOfTextAtSize(pageText, 8);
      page.drawText(pageText, {
        x: page.getWidth() - 35 - pageTextWidth,
        y: footerY,
        size: 8,
        font: helvetica,
        color: textColor,
      });
    };
    
    // Calculate total pages
    let pageCount = 1; // Start with 1 for first page
    if (hasComments || hasSuggestions || hasCharts) pageCount++;
    if (hasDetailedTable) pageCount++;
    
    // Draw headers and footers on all pages
    drawPageHeader(page1, true);
    if (page2) drawPageHeader(page2, false);
    if (page3) drawPageHeader(page3, false);
    
    // Add footers with correct page count
    drawFooter(page1, 1, pageCount);
    let currentPage = 1;
    if (page2) drawFooter(page2, ++currentPage, pageCount);
    if (page3) drawFooter(page3, ++currentPage, pageCount);
    
    // PAGE 1: Client info and investment snapshot
    const snapshotY = page1.getHeight() - 210; // Adjusted to match the new header spacing (from 240 to 210)
    
    page1.drawText(sanitizeText("Investment Snapshot"), {
      x: 60, // Match the left margin from header
      y: snapshotY,
      size: 16,
      font: helveticaBold,
      color: textColor,
    });
    
    // Investment snapshot cards - using full page width
    const pageWidth = page1.getWidth();
    const margins = 60; // Standard margin on each side
    const gapBetweenCards = 10; // Gap between cards
    const availableWidth = pageWidth - (2 * margins); // Available width after margins
    const cardWidth = (availableWidth - (2 * gapBetweenCards)) / 3; // Width for each of the 3 cards
    const cardHeight = 70;
    const cardY = snapshotY - 20;
    
    // Card drawing function
    const drawCard = (x: number, y: number, title: string, value: string) => {
      // Card border and background
      page1.drawRectangle({
        x,
        y: y - cardHeight,
        width: cardWidth,
        height: cardHeight,
        borderColor: neutralBorderColor,
        borderWidth: 0.5,
        color: whiteColor,
      });
      
      // Title
      page1.drawText(sanitizeText(title), {
        x: x + 15,
        y: y - 20,
        size: 10,
        font: helvetica,
        color: textColor,
      });
      
      // Value
      page1.drawText(sanitizeText(value), {
        x: x + 15,
        y: y - 40,
        size: 14,
        font: helveticaBold,
        color: textColor,
      });
    };
    
    // Calculate ROI for all calculator types
    const roi = (data.wealthGained / data.totalInvested) * 100;
    
    // Draw the three cards with proper spacing to utilize full width
    // Customize cards based on calculator type
    if (data.title.toLowerCase().includes("capital gains tax")) {
      // Capital Gains Tax Calculator
      drawCard(margins, cardY, "Sale Proceeds", formatINR(data.futureValue));
      drawCard(margins + cardWidth + gapBetweenCards, cardY, "Capital Gain", formatINR(data.wealthGained));
      drawCard(margins + (cardWidth * 2) + (gapBetweenCards * 2), cardY, "Tax Payable", formatINR(data.capitalGainTax || 0));
    }
    else if (data.title.toLowerCase().includes("lumpsum")) {
      // Lumpsum + SIP Calculator
      drawCard(margins, cardY, "Monthly SIP", formatINR(data.monthlyInvestment));
      drawCard(margins + cardWidth + gapBetweenCards, cardY, "Combined Future Value", formatINR(data.futureValue));
      drawCard(margins + (cardWidth * 2) + (gapBetweenCards * 2), cardY, "Total ROI", formatPCT(roi));
    } 
    else if (data.title.toLowerCase().includes("step")) {
      // Step-Up SIP Calculator
      drawCard(margins, cardY, "Initial Monthly SIP", formatINR(data.monthlyInvestment));
      drawCard(margins + cardWidth + gapBetweenCards, cardY, "Total Future Value", formatINR(data.futureValue));
      drawCard(margins + (cardWidth * 2) + (gapBetweenCards * 2), cardY, "Total ROI", formatPCT(roi));
    } 
    else if (data.title.toLowerCase().includes("retirement")) {
      // Retirement Calculator
      drawCard(margins, cardY, "Monthly Contribution", formatINR(data.monthlyInvestment));
      drawCard(margins + cardWidth + gapBetweenCards, cardY, "Retirement Corpus", formatINR(data.futureValue));
      drawCard(margins + (cardWidth * 2) + (gapBetweenCards * 2), cardY, "Wealth Multiplier", formatPCT(roi));
    }
    else {
      // Default for any other calculator
      drawCard(margins, cardY, "Monthly Investment", formatINR(data.monthlyInvestment));
      drawCard(margins + cardWidth + gapBetweenCards, cardY, "Future Value", formatINR(data.futureValue));
      drawCard(margins + (cardWidth * 2) + (gapBetweenCards * 2), cardY, "Total ROI", formatPCT(roi));
    }
    
    // Adjust the divider position - with 24px spacing above and below
    const dividerY1 = cardY - cardHeight - 24; // Changed to 24px space below cards
    page1.drawLine({
      start: { x: 60, y: dividerY1 },
      end: { x: page1.getWidth() - 60, y: dividerY1 },
      thickness: 0.5,
      color: neutralBorderColor,
    });
    
    // Investment Summary Section - with 24px spacing below divider
    const summaryY = dividerY1 - 24; // 24px below the divider
    page1.drawText(sanitizeText("Investment Summary"), {
      x: 60,
      y: summaryY,
      size: 16,
      font: helveticaBold,
      color: textColor,
    });
    
    // Investment summary items in a grid - customized based on calculator type
    let summaryItems = [];
    
    if (data.title.toLowerCase().includes("capital gains tax")) {
      // Capital Gains Tax Calculator
      const holdingPeriod = data.holdingPeriodYears 
        ? data.holdingPeriodYears 
        : data.holdingPeriodMonths 
          ? `${Math.floor(data.holdingPeriodMonths / 12)} years, ${data.holdingPeriodMonths % 12} months`
          : "N/A";
          
      summaryItems = [
        { label: "Asset Type", value: data.assetType || "Not specified" },
        { label: "Purchase Cost", value: formatINR(data.purchaseCost || 0) },
        { label: "Purchase FY", value: data.purchaseFinancialYear || "Not specified" },
        { label: "Sale Price", value: formatINR(data.salePrice || 0) },
        { label: "Sale Expenses", value: formatINR(data.saleExpenses || 0) },
        { label: "Net Sale Proceeds", value: formatINR(data.futureValue) },
        { label: "Holding Period", value: holdingPeriod },
        { label: "Capital Gain Type", value: data.capitalGainType || "N/A" },
        { label: "Capital Gain", value: formatINR(data.wealthGained) },
        { label: "Tax Payable", value: formatINR(data.capitalGainTax || 0) },
        { label: "Effective Tax Rate", value: data.effectiveTaxRate || "0%" },
        { label: "Net Profit After Tax", value: formatINR(data.netProfitAfterTax || 0) }
      ];
    }
    else if (data.title.toLowerCase().includes("lumpsum")) {
      // Lumpsum + SIP Calculator
      summaryItems = [
        { label: "Lumpsum Investment", value: formatINR(data.totalInvested - (data.monthlyInvestment * 12 * data.duration)) },
        { label: "Monthly SIP", value: formatINR(data.monthlyInvestment) },
        { label: "Duration", value: `${data.duration} years` },
        { label: "Expected Return (p.a.)", value: formatPCT(data.annualReturn) },
        { label: "Total Invested", value: formatINR(data.totalInvested) },
        { label: "Combined Future Value", value: formatINR(data.futureValue) },
        { label: "Wealth Gained", value: formatINR(data.wealthGained) },
        { label: "ROI", value: formatPCT((data.wealthGained / data.totalInvested) * 100) }
      ];
    }
    else if (data.title.toLowerCase().includes("step")) {
      // Step-Up SIP Calculator - assuming annual step-up rate is around 10%
      const estimatedStepRate = 10; // Default step rate if not available
      
      summaryItems = [
        { label: "Initial Monthly SIP", value: formatINR(data.monthlyInvestment) },
        { label: "Annual Step-Up Rate", value: formatPCT(estimatedStepRate) },
        { label: "Duration", value: `${data.duration} years` },
        { label: "Expected Return (p.a.)", value: formatPCT(data.annualReturn) },
        { label: "Total Invested", value: formatINR(data.totalInvested) },
        { label: "Final Monthly SIP", value: formatINR(data.monthlyInvestment * Math.pow(1 + estimatedStepRate/100, data.duration - 1)) },
        { label: "Projected Future Value", value: formatINR(data.futureValue) },
        { label: "Wealth Gained", value: formatINR(data.wealthGained) },
        { label: "ROI", value: formatPCT((data.wealthGained / data.totalInvested) * 100) }
      ];
    }
    else if (data.title.toLowerCase().includes("retirement")) {
      // Retirement Calculator
      summaryItems = [
        { label: "Monthly Contribution", value: formatINR(data.monthlyInvestment) },
        { label: "Years to Retirement", value: `${data.duration} years` },
        { label: "Pre-Retirement Return (p.a.)", value: formatPCT(data.annualReturn) },
        { label: "Post-Retirement Return (est.)", value: formatPCT(data.annualReturn * 0.7) }, // Estimate lower post-retirement returns
        { label: "Total Invested", value: formatINR(data.totalInvested) },
        { label: "Retirement Corpus", value: formatINR(data.futureValue) },
        { label: "Wealth Accumulated", value: formatINR(data.wealthGained) },
        { label: "Potential Monthly Income", value: formatINR(data.futureValue * 0.004) } // Estimated 4% withdrawal rate
      ];
    }
    else {
      // Default for any other calculator
      summaryItems = [
        { label: "Monthly Investment", value: formatINR(data.monthlyInvestment) },
        { label: "Duration", value: `${data.duration} years` },
        { label: "Expected Return (p.a.)", value: formatPCT(data.annualReturn) },
        { label: "Total Invested", value: formatINR(data.totalInvested) },
        { label: "Projected Future Value", value: formatINR(data.futureValue) },
        { label: "Wealth Gained", value: formatINR(data.wealthGained) },
        { label: "ROI", value: formatPCT((data.wealthGained / data.totalInvested) * 100) }
      ];
    }
    
    const itemsPerRow = 3;
    const itemWidth = (availableWidth) / itemsPerRow; // Using same availableWidth as cards for consistency
    const itemHeight = 40;
    
    summaryItems.forEach((item, index) => {
      const row = Math.floor(index / itemsPerRow);
      const col = index % itemsPerRow;
      const x = margins + col * itemWidth; // Using margins const for consistency
      const y = summaryY - 35 - row * itemHeight; // Adjusted from -30 to -35 for better spacing
      
      // Label
      page1.drawText(sanitizeText(item.label), {
        x,
        y,
        size: 10,
        font: helvetica,
        color: textLightColor,
      });
      
      // Value
      page1.drawText(sanitizeText(item.value), {
        x,
        y: y - 15,
        size: 12,
        font: helvetica,
        color: textColor,
      });
    });
    
    // Another divider - with 24px spacing above and below
    // Calculate position based on the last row of summary items
    const lastRowIndex = Math.floor((summaryItems.length - 1) / itemsPerRow);
    const lastItemY = summaryY - 35 - (lastRowIndex * itemHeight) - 15 - 24; // Last item position minus 24px spacing
    const dividerY2 = lastItemY;
    
    page1.drawLine({
      start: { x: 60, y: dividerY2 },
      end: { x: page1.getWidth() - 60, y: dividerY2 },
      thickness: 0.5,
      color: neutralBorderColor,
    });
    
    // Growth Visualization or Capital Gains Breakdown Section - with 24px spacing below divider
    const growthY = dividerY2 - 24; // 24px below divider
    
    if (data.title.toLowerCase().includes("capital gains tax")) {
      // Capital Gains Tax Breakdown Table
      page1.drawText(sanitizeText("Capital Gains Tax Breakdown"), {
        x: 60,
        y: growthY,
        size: 16,
        font: helveticaBold,
        color: textColor,
      });
      
      // Draw table header
      const tableY = growthY - 30;
      const tableWidth = page1.getWidth() - 120;
      const colWidths = [tableWidth * 0.4, tableWidth * 0.3, tableWidth * 0.3];
      
      // Header background
      page1.drawRectangle({
        x: 60,
        y: tableY,
        width: tableWidth,
        height: 30,
        color: highlightBgColor, // Light green background instead of gray
      });
      
      // Header text
      page1.drawText(sanitizeText("Component"), {
        x: 70,
        y: tableY - 20,
        size: 11,
        font: helveticaBold,
        color: textColor,
      });
      
      page1.drawText(sanitizeText("Original Value"), {
        x: 60 + colWidths[0] + 10,
        y: tableY - 20,
        size: 11,
        font: helveticaBold,
        color: textColor,
      });
      
      page1.drawText(sanitizeText("Indexed Value"), {
        x: 60 + colWidths[0] + colWidths[1] + 10,
        y: tableY - 20,
        size: 11,
        font: helveticaBold,
        color: textColor,
      });
      
      // Table rows
      const rowHeight = 30;
      const rows = [
        { 
          component: "Purchase Cost", 
          original: data.purchaseCost || 0, 
          indexed: data.indexedPurchaseCost || 0
        },
        { 
          component: "Improvement Cost", 
          original: data.totalImprovementCost || 0, 
          indexed: data.indexedImprovementCost || 0
        },
        { 
          component: "Total Cost", 
          original: (data.purchaseCost || 0) + (data.totalImprovementCost || 0), 
          indexed: data.totalIndexedCost || 0
        },
        { 
          component: "Sale Proceeds", 
          original: data.futureValue, 
          indexed: data.futureValue
        },
        { 
          component: "Capital Gain", 
          original: data.futureValue - ((data.purchaseCost || 0) + (data.totalImprovementCost || 0)), 
          indexed: data.wealthGained
        },
        { 
          component: "Tax Payable", 
          original: "-", 
          indexed: data.capitalGainTax || 0
        }
      ];
      
      rows.forEach((row, i) => {
        const rowY = tableY - (i + 1) * rowHeight;
        
        // Row background (alternating)
        page1.drawRectangle({
          x: 60,
          y: rowY,
          width: tableWidth,
          height: rowHeight,
          color: i % 2 === 0 ? cardBgColor : whiteColor, // Spring Money colors instead of gray
        });
        
        // Component name
        page1.drawText(sanitizeText(row.component), {
          x: 70,
          y: rowY + 10,
          size: 10,
          font: helvetica,
          color: textColor,
        });
        
        // Original value
        page1.drawText(sanitizeText(typeof row.original === 'string' ? row.original : formatINR(row.original)), {
          x: 60 + colWidths[0] + 10,
          y: rowY + 10,
          size: 10,
          font: helvetica,
          color: textColor,
        });
        
        // Indexed value
        page1.drawText(sanitizeText(typeof row.indexed === 'string' ? row.indexed : formatINR(row.indexed)), {
          x: 60 + colWidths[0] + colWidths[1] + 10,
          y: rowY + 10,
          size: 10,
          font: helvetica,
          color: textColor,
        });
      });
    } else {
      // Regular Growth Visualization Section
      page1.drawText(sanitizeText("Growth Visualization"), {
        x: 60,
        y: growthY,
        size: 16,
        font: helveticaBold,
        color: textColor,
      });
    }
    
    // Create a horizontal bar visualization with principal and growth - reduced spacing
    if (!data.title.toLowerCase().includes("capital gains tax")) {
      const visualizationY = growthY - 30; // Reduced from -50 to -30 to decrease spacing
      const visualizationWidth = page1.getWidth() - 120; // Full width minus margins
      const visualizationHeight = 40; // Height of the bar
  
      // Calculate the proportion of principal vs growth
      const totalValue = data.totalInvested + data.wealthGained;
      const principalProportion = data.totalInvested / totalValue;
  
      // Draw the background container with rounded corners
      page1.drawRectangle({
        x: 60,
        y: visualizationY - visualizationHeight,
        width: visualizationWidth,
        height: visualizationHeight,
        borderColor: rgb(0.9, 0.9, 0.9),
        borderWidth: 0.5,
        color: rgb(0.95, 0.95, 0.95), // Light gray background
      });
  
      // Draw the growth section (light green background)
      page1.drawRectangle({
        x: 60,
        y: visualizationY - visualizationHeight,
        width: visualizationWidth,
        height: visualizationHeight,
        color: highlightBgColor, // Light green for growth instead of light blue
      });
  
      // Draw the principal section (light gray background)
      const principalWidth = visualizationWidth * principalProportion;
      page1.drawRectangle({
        x: 60,
        y: visualizationY - visualizationHeight,
        width: principalWidth,
        height: visualizationHeight,
        color: rgb(0.95, 0.95, 0.95), // Light gray for principal
      });
    } else {
      // Skip visualization for Capital Gains Tax calculator
      // The table is already displayed above
    }

    if (!data.title.toLowerCase().includes("capital gains tax")) {
      // Regular visualization for investment calculators
      const visualizationY = growthY - 30;
      const visualizationWidth = page1.getWidth() - 120;
      const visualizationHeight = 40;
      const totalValue = data.totalInvested + data.wealthGained;
      const principalProportion = data.totalInvested / totalValue;
      const principalWidth = visualizationWidth * principalProportion;
      
      // Draw the slider indicator at the division between principal and growth
      const sliderX = 60 + principalWidth;
      const sliderY = visualizationY - visualizationHeight/2;
      const sliderRadius = 5;
  
      // Draw slider circle
      page1.drawCircle({
        x: sliderX,
        y: sliderY,
        size: sliderRadius,
        color: primaryColor,
      });
  
      // Draw arrow from slider
      page1.drawLine({
        start: { x: sliderX, y: sliderY },
        end: { x: sliderX + 20, y: sliderY },
        thickness: 1.5,
        color: primaryColor,
      });
  
      // Draw arrowhead
      page1.drawLine({
        start: { x: sliderX + 15, y: sliderY + 3 },
        end: { x: sliderX + 20, y: sliderY },
        thickness: 1.5,
        color: primaryColor,
      });
      page1.drawLine({
        start: { x: sliderX + 15, y: sliderY - 3 },
        end: { x: sliderX + 20, y: sliderY },
        thickness: 1.5,
        color: primaryColor,
      });
  
      // Add labels inside the visualization
      page1.drawText(sanitizeText("Principal"), {
        x: 80, // Left aligned inside principal section
        y: visualizationY - visualizationHeight/2 + 5,
        size: 12,
        font: helveticaBold,
        color: textColor,
      });
      
      page1.drawText(sanitizeText("Growth"), {
        x: page1.getWidth() - 120, // Right aligned inside growth section
        y: visualizationY - visualizationHeight/2 + 5,
        size: 12,
        font: helveticaBold,
        color: primaryColor,
      });
      
      // Add the values below the visualization
      const legendY = visualizationY - visualizationHeight - 30;
      
      // Principal value with square box indicator
      page1.drawRectangle({
        x: 60,
        y: legendY,
        width: 16,
        height: 16,
        borderColor: rgb(0.7, 0.7, 0.7),
        borderWidth: 0.5,
        color: rgb(0.95, 0.95, 0.95), // Light gray for principal
      });
      
      page1.drawText(sanitizeText("Principal Today"), {
        x: 85,
        y: legendY + 5,
        size: 12,
        font: helvetica,
        color: textColor,
      });
      
      // Ensure the value stays within borders with right alignment
      const principalValueText = formatINR(data.totalInvested);
      const principalValueWidth = helveticaBold.widthOfTextAtSize(principalValueText, 12);
      page1.drawText(sanitizeText(principalValueText), {
        x: page1.getWidth() - 60 - principalValueWidth, // Right-aligned with 60px margin
        y: legendY + 5,
        size: 12,
        font: helveticaBold,
        color: textColor,
      });
      
      // Growth value with green square box indicator
      const growthLegendY = legendY - 25;
  
      page1.drawRectangle({
        x: 60,
        y: growthLegendY,
        width: 16,
        height: 16,
        borderColor: primaryColor,
        borderWidth: 0.5,
        color: highlightBgColor, // Light green for growth instead of light blue
      });
      
      // Growth value
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + data.duration);
      const futureMonth = futureDate.toLocaleString('default', { month: 'long' });
      const futureYear = futureDate.getFullYear();
      
      page1.drawText(sanitizeText(`Growth by ${futureMonth} ${futureYear}`), {
        x: 85,
        y: growthLegendY + 5,
        size: 12,
        font: helvetica,
        color: textColor,
      });
      
      // Ensure the growth value stays within borders with right alignment
      const growthValueText = formatINR(data.wealthGained);
      const growthValueWidth = helveticaBold.widthOfTextAtSize(growthValueText, 12);
      page1.drawText(sanitizeText(growthValueText), {
        x: page1.getWidth() - 60 - growthValueWidth, // Right-aligned with 60px margin
        y: growthLegendY + 5,
        size: 12,
        font: helveticaBold,
        color: primaryColor,
      });
    } else {
      // For Capital Gains Tax calculator, add tax tips instead of visualization
      const taxTipsY = growthY - 200; // Position below the table
      
      if (data.taxTips) {
        page1.drawText(sanitizeText("Tax Planning Tips"), {
          x: 60,
          y: taxTipsY,
          size: 16,
          font: helveticaBold,
          color: textColor,
        });
        
        const tips = Array.isArray(data.taxTips) ? data.taxTips : [data.taxTips];
        let tipY = taxTipsY - 30;
        
        tips.forEach((tip, index) => {
          // Draw bullet point
          page1.drawCircle({
            x: 65,
            y: tipY,
            size: 2,
            color: primaryColor,
          });
          
          // Draw tip text with wrapping
          drawMultiLineText(
            sanitizeText(tip),
            80,
            tipY + 5,
            10,
            15,
            page1.getWidth() - 140,
            helvetica,
            page1,
            textColor
          );
          
          tipY -= 40; // Move down for next tip
        });
      }
    }
    
    // PAGE 2: Comments/Suggestions and Charts
    if (page2) {
      let currentY = page2.getHeight() - 120;
      
      // Add comments if present
      if (hasComments) {
        page2.drawText(sanitizeText("Comments"), {
          x: 60,
          y: currentY,
          size: 16,
          font: helveticaBold,
          color: textColor,
        });
        
        currentY -= 30;
        
        // Draw comments text with word wrapping
        drawMultiLineText(
          sanitizeText(truncatedComments),
          60,
          currentY,
          12,
          16,
          page2.getWidth() - 120,
          helvetica,
          page2,
          textColor
        );
        
        currentY -= 60; // Space after comments
      }
      
      // Add suggestions if present
      if (hasSuggestions) {
        page2.drawText(sanitizeText("Suggestions"), {
          x: 60,
          y: currentY,
          size: 16,
          font: helveticaBold,
          color: textColor,
        });
        
        currentY -= 30;
        
        // Draw suggestions text with word wrapping
        drawMultiLineText(
          sanitizeText(truncatedSuggestions),
          60,
          currentY,
          12,
          16,
          page2.getWidth() - 120,
          helvetica,
          page2,
          textColor
        );
        
        currentY -= 60; // Space after suggestions
      }
      
      // Add charts if present
      if (hasCharts) {
        // Add space between text and charts
        if (hasComments || hasSuggestions) {
          currentY -= 40;
        }
        
        page2.drawText(sanitizeText("Investment Growth Charts"), {
          x: 60,
          y: currentY,
          size: 16,
          font: helveticaBold,
          color: textColor,
        });
        
        currentY -= 40; // Space after title
        
        // Line chart - First chart to display
        if (chartImages.lineChart) {
          try {
            const lineChartImage = await pdfDoc.embedPng(dataURLToUint8Array(chartImages.lineChart));
            
            // Calculate optimal dimensions to fit within page borders
            const maxWidth = page2.getWidth() - 120; // 60px margins on each side
            const aspectRatio = lineChartImage.width / lineChartImage.height;
            const targetWidth = Math.min(maxWidth, 300); // Reset back to 300px width
            const targetHeight = targetWidth / aspectRatio;
            
            // Calculate center position for the chart
            const chartX = (page2.getWidth() - targetWidth) / 2; // Center the chart
            
            // Add chart title
            page2.drawText(sanitizeText("Investment Growth Over Time"), {
              x: chartX,
              y: currentY,
              size: 12, // Reset back to 12px
              font: helveticaBold,
              color: textColor,
            });
            
            currentY -= 20; // Space between title and chart
            
            page2.drawImage(lineChartImage, {
              x: chartX,
              y: currentY - targetHeight,
              width: targetWidth,
              height: targetHeight,
            });
            
            currentY -= (targetHeight + 20); // Space after chart
            
            // Center-align explanation text for line chart
            const explanationLine1 = "This chart shows how your investment grows over time, including both";
            const explanationLine2 = "principal investment and accumulated returns.";
            const textWidth1 = helvetica.widthOfTextAtSize(sanitizeText(explanationLine1), 10);
            const textWidth2 = helvetica.widthOfTextAtSize(sanitizeText(explanationLine2), 10);
            const centerX = (page2.getWidth() / 2);
            
            page2.drawText(sanitizeText(explanationLine1), {
              x: centerX - (textWidth1 / 2),
              y: currentY,
              size: 10, // Reset back to 10px
              font: helvetica, // Reset back to regular font
              color: textColor,
            });
            
            page2.drawText(sanitizeText(explanationLine2), {
              x: centerX - (textWidth2 / 2),
              y: currentY - 15,
              size: 10, // Reset back to 10px
              font: helvetica, // Reset back to regular font
              color: textColor,
            });
            
            currentY -= 40; // Space after explanation
            
            // Add divider line between charts
            page2.drawLine({
              start: { x: 60, y: currentY },
              end: { x: page2.getWidth() - 60, y: currentY },
              thickness: 0.5,
              color: neutralBorderColor,
            });
            
            currentY -= 30; // Space after divider line
          } catch (error) {
            console.error('Error embedding line chart:', error);
          }
        }
        
        // Bar chart - Second chart to display
        if (chartImages.barChart) {
          try {
            const barChartImage = await pdfDoc.embedPng(dataURLToUint8Array(chartImages.barChart));
            
            // Calculate optimal dimensions
            const maxWidth = page2.getWidth() - 120;
            const aspectRatio = barChartImage.width / barChartImage.height;
            const targetWidth = Math.min(maxWidth, 300); // Reset back to 300px width
            const targetHeight = targetWidth / aspectRatio;
            
            // Calculate center position for the chart
            const chartX = (page2.getWidth() - targetWidth) / 2; // Center the chart
            
            // Add chart title
            page2.drawText(sanitizeText("Year-by-Year Investment Breakdown"), {
              x: chartX,
              y: currentY,
              size: 12, // Reset back to 12px
              font: helveticaBold,
              color: textColor,
            });
            
            currentY -= 20; // Space between title and chart
            
            page2.drawImage(barChartImage, {
              x: chartX,
              y: currentY - targetHeight,
              width: targetWidth,
              height: targetHeight,
            });
            
            currentY -= (targetHeight + 20);
            
            // Center-align explanation text for bar chart
            const barExplanationLine1 = "This chart illustrates the annual breakdown between your invested amount";
            const barExplanationLine2 = "and the returns generated each year.";
            const barTextWidth1 = helvetica.widthOfTextAtSize(sanitizeText(barExplanationLine1), 10);
            const barTextWidth2 = helvetica.widthOfTextAtSize(sanitizeText(barExplanationLine2), 10);
            const barCenterX = (page2.getWidth() / 2);
            
            page2.drawText(sanitizeText(barExplanationLine1), {
              x: barCenterX - (barTextWidth1 / 2),
              y: currentY,
              size: 10, // Reset back to 10px
              font: helvetica, // Reset back to regular font
              color: textColor,
            });
            
            page2.drawText(sanitizeText(barExplanationLine2), {
              x: barCenterX - (barTextWidth2 / 2),
              y: currentY - 15,
              size: 10, // Reset back to 10px
              font: helvetica, // Reset back to regular font
              color: textColor,
            });
          } catch (error) {
            console.error('Error embedding bar chart:', error);
          }
        }
      }
    }
    
    // PAGE 3: Detailed table - only if detailed report is selected
    if (page3 && hasDetailedTable) {
      const breakdownY = page3.getHeight() - 120;
      
      page3.drawText(sanitizeText("Year-by-Year Breakdown"), {
        x: 60,
        y: breakdownY,
        size: 16,
        font: helveticaBold,
        color: textColor,
      });
      
      // Table container with border
      const tableY = breakdownY - 30;
      const tableWidth = page3.getWidth() - 100;
      const rowHeight = 24;
      
      // Calculate table height and handle pagination
      const rowsPerPage = 15; // Maximum rows to fit on one page
      const additionalPages = Math.ceil(yearly.length / rowsPerPage) - 1;
      
      // Add additional pages if needed for the complete table
      const totalPages = pdfDoc.getPageCount();
      const extraPages: PDFPage[] = [];
      
      for (let i = 0; i < additionalPages; i++) {
        const newPage = pdfDoc.addPage();
        extraPages.push(newPage);
        drawPageHeader(newPage, false);
        // Update totalPagesCount for footer display
        const updatedTotalPages = pageCount + additionalPages;
        drawFooter(newPage, totalPages + i + 1, updatedTotalPages);
      }
      
      // Determine if we're dealing with SIP or standard YearRow data
      const isSIPData = yearly.length > 0 && 'totalInvested' in yearly[0];
      
      // Define column widths
      const colWidths = [60, (tableWidth - 60) / 3, (tableWidth - 60) / 3, (tableWidth - 60) / 3];
      
      // Draw table on each page
      let currentPage = page3;
      
      for (let pageIdx = 0; pageIdx <= additionalPages; pageIdx++) {
        if (pageIdx > 0) {
          currentPage = extraPages[pageIdx - 1];
        }
        
        const startIdx = pageIdx * rowsPerPage;
        const endIdx = Math.min(yearly.length, (pageIdx + 1) * rowsPerPage);
        const rows = yearly.slice(startIdx, endIdx);
        const tableHeight = rows.length * rowHeight + rowHeight; // rows + header
        
        // Draw page title if it's not the first page
        if (pageIdx > 0) {
          currentPage.drawText(sanitizeText("Year-by-Year Breakdown (continued)"), {
            x: 60,
            y: currentPage.getHeight() - 120,
            size: 16,
            font: helveticaBold,
            color: textColor,
          });
        }
        
        const pageTableY = pageIdx === 0 ? tableY : currentPage.getHeight() - 150;
        
        // Table container with border
        currentPage.drawRectangle({
          x: 60,
          y: pageTableY - tableHeight + rowHeight,
        width: tableWidth,
        height: tableHeight,
        borderColor: neutralBorderColor,
        borderWidth: 0.5,
          color: undefined,
      });
      
      // Table header
        currentPage.drawRectangle({
          x: 60,
          y: pageTableY,
        width: tableWidth,
        height: rowHeight,
        color: highlightBgColor, // Light green background instead of gray
        borderColor: neutralBorderColor,
        borderWidth: 0.5,
      });
      
      // Header texts
      const headerTexts = isSIPData 
          ? ["Year", "Total Invested", "Wealth Gained", "Future Value"] 
          : ["Year", "Opening Balance", "Interest", "Closing Balance"];
      
      // Draw header texts
        for (let i = 0; i < headerTexts.length; i++) {
          const x = i === 0 
            ? 60 + 15 
            : 60 + colWidths[0] + (i-1) * ((tableWidth - colWidths[0]) / 3) + 15;
          
          currentPage.drawText(sanitizeText(headerTexts[i]), {
            x,
            y: pageTableY - rowHeight/2 + 5,
          size: 10,
          font: helveticaBold,
            color: textColor,
          });
        }
        
        // Draw vertical lines between columns
        for (let i = 1; i < 4; i++) {
          const x = i === 1 
            ? 60 + colWidths[0] 
            : 60 + colWidths[0] + (i-1) * ((tableWidth - colWidths[0]) / 3);
          
          currentPage.drawLine({
            start: { x, y: pageTableY },
            end: { x, y: pageTableY - tableHeight + rowHeight },
            thickness: 0.5,
            color: neutralBorderColor,
          });
        }
        
        // Draw rows
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const rowY = pageTableY - (i + 1) * rowHeight;
        
        // Alternating row background
        if (i % 2 === 0) {
            currentPage.drawRectangle({
              x: 60,
            y: rowY,
            width: tableWidth,
            height: rowHeight,
              color: cardBgColor, // Spring Money background instead of light gray
          });
        }
        
        // Row border
          currentPage.drawLine({
            start: { x: 60, y: rowY },
            end: { x: 60 + tableWidth, y: rowY },
          thickness: 0.5,
          color: neutralBorderColor,
        });
        
        // Year column
          currentPage.drawText(sanitizeText(`Year ${row.year}`), {
            x: 60 + 15,
            y: rowY + rowHeight/2 - 4,
          size: 10,
          font: helvetica,
          color: textColor,
        });
        
        // Data columns
        if (isSIPData) {
            // SIP data
          const sipRow = row as SIPYearRow;
            const cols = [
              sanitizeText(formatINR(sipRow.totalInvested)),
              sanitizeText(formatINR(sipRow.wealthGained)),
              sanitizeText(formatINR(sipRow.futureValue))
            ];
            
            for (let j = 0; j < cols.length; j++) {
              currentPage.drawText(sanitizeText(cols[j]), {
                x: 60 + colWidths[0] + j * ((tableWidth - colWidths[0]) / 3) + 15,
                y: rowY + rowHeight/2 - 4,
            size: 10,
            font: helvetica,
            color: textColor,
          });
            }
        } else {
            // Standard YearRow data
          const yearRow = row as YearRow;
            const cols = [
              sanitizeText(formatINR(yearRow.openingBalance)),
              sanitizeText(formatINR(yearRow.interestEarned)),
              sanitizeText(formatINR(yearRow.closingBalance))
            ];
            
            for (let j = 0; j < cols.length; j++) {
              currentPage.drawText(sanitizeText(cols[j]), {
                x: 60 + colWidths[0] + j * ((tableWidth - colWidths[0]) / 3) + 15,
                y: rowY + rowHeight/2 - 4,
            size: 10,
            font: helvetica,
            color: textColor,
          });
            }
          }
        }
      }
    }
    
    // Serialize the PDF to bytes
    const pdfBytes = await pdfDoc.save();
    return new Uint8Array(await pdfDoc.save());
  } catch (error) {
    console.error('Error generating PDF report:', error);
    throw error;
  }
};

// Helper function to convert data URL to Uint8Array with validation
function dataURLToUint8Array(dataURL: string): Uint8Array {
  try {
    // Validate that this is a PNG data URL
    if (!dataURL || !dataURL.startsWith('data:image/png;base64,')) {
      throw new Error('Invalid PNG data URL format');
    }
    
    const base64 = dataURL.split(',')[1];
    if (!base64) {
      throw new Error('Invalid base64 data in URL');
    }
    
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    return bytes;
  } catch (error) {
    console.error('Error processing data URL:', error);
    throw new Error('Failed to process image data');
  }
}

/* ════════════════════════════════
   5. Public API Functions
   ════════════════════════════════ */
export const generatePDFReport = async (
  opts: ReportOptionsData,
  data: ReportData,
  yearly: (YearRow | SIPYearRow)[] = []
) => buildPdf("", opts, data, yearly);

export const downloadReport = async (
  reportContent: string,
  clientName: string,
  reportOptions?: ReportOptionsData,
  calculatorData?: ReportData | null,
  yearlyData: (YearRow | SIPYearRow)[] = [],
  pdfTemplate?: ArrayBuffer,
  chartImages?: { [key: string]: string }
) => {
  try {
    // Prepare the filename
    const safeClientName = safeName(clientName || "report");
    const filename = `${safeClientName}_investment_report.pdf`;
    
    // Generate PDF based on options
    let pdfBytes: Uint8Array;
    
    if (reportOptions && calculatorData) {
      if (pdfTemplate) {
        // Use template-based PDF if provided
        pdfBytes = await fillPDFTemplate(pdfTemplate, calculatorData, reportOptions, yearlyData);
      } else {
        // Use modern PDF format
        pdfBytes = await generateModernPDFReport(reportOptions, calculatorData, yearlyData, chartImages);
      }
    } else {
      // Use simple PDF format as fallback
      const defaultOptions: ReportOptionsData = {
        clientName: clientName || "Client",
        includeGraphs: false,
        includeComments: false,
        reportType: "summary",
        comments: ""
      };
      pdfBytes = await generatePDFReport(reportOptions || defaultOptions, calculatorData || {
        title: "Investment Report",
        totalInvested: 0,
        futureValue: 0,
        wealthGained: 0,
        monthlyInvestment: 0,
        duration: 0,
        annualReturn: 0
      }, yearlyData);
    }
    
    // Create a blob from the PDF bytes
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    
    // Create a link element, set the download attribute, and click it
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    
    // Clean up
    URL.revokeObjectURL(link.href);
    return true;
  } catch (error) {
    console.error("Error downloading report:", error);
    return false;
  }
};

export const sendReportViaWhatsApp = async (
  reportContent: string,
  mobileNumber: string,
  reportOptions?: ReportOptionsData,
  calculatorData?: ReportData | null,
  yearlyData: (YearRow | SIPYearRow)[] = [],
  pdfTemplate?: ArrayBuffer,
  chartImages?: { [key: string]: string }
) => {
  try {
    // Format mobile number
    const formattedNumber = mobileNumber.startsWith('+') ? mobileNumber : `+91${mobileNumber}`;
    
    // Generate PDF
    let pdfBytes: Uint8Array;
    
    if (reportOptions && calculatorData) {
      if (pdfTemplate) {
        // Use template-based PDF if provided
        pdfBytes = await fillPDFTemplate(pdfTemplate, calculatorData, reportOptions, yearlyData);
      } else {
        // Use modern PDF format
        pdfBytes = await generateModernPDFReport(reportOptions, calculatorData, yearlyData, chartImages);
      }
    } else {
      // Use simple PDF format as fallback
      const defaultOptions: ReportOptionsData = {
        clientName: "Client",
        includeGraphs: false,
        includeComments: false,
        reportType: "summary",
        comments: ""
      };
      
      const defaultData: ReportData = {
        title: "Investment Report",
        totalInvested: 0,
        futureValue: 0,
        wealthGained: 0,
        monthlyInvestment: 0,
        duration: 0,
        annualReturn: 0
      };
      
      pdfBytes = await generatePDFReport(
        reportOptions || defaultOptions, 
        calculatorData || defaultData, 
        yearlyData
      );
    }
    
    // Create a WhatsApp message with report content
    const message = encodeURIComponent(reportContent);
    const whatsappUrl = `https://wa.me/${formattedNumber}?text=${message}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
    
    return true;
  } catch (error) {
    console.error("Error sending report via WhatsApp:", error);
    return false;
  }
};

// Handle multi-line text properly in comments and suggestions
const drawMultiLineText = (text: string, x: number, y: number, fontSize: number, lineHeight: number, maxWidth: number, font: PDFFont, page: PDFPage, color: RGB) => {
  if (!text) return;
  
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  
  for (const word of words) {
    const testLine = line + word + ' ';
    const testWidth = font.widthOfTextAtSize(sanitizeText(testLine), fontSize);
    
    if (testWidth > maxWidth && line !== '') {
      page.drawText(sanitizeText(line), {
        x,
        y: currentY,
        size: fontSize,
        font,
        color,
      });
      line = word + ' ';
      currentY -= lineHeight;
    } else {
      line = testLine;
    }
  }
  
  if (sanitizeText(line).trim() !== '') {
    page.drawText(sanitizeText(line), {
      x,
      y: currentY,
      size: fontSize,
      font,
      color,
    });
  }
};
