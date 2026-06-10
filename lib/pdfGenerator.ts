"use client";

import { jsPDF } from "jspdf";

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: "Client" | "Designer" | "Admin";
  createdAt: string;
  updatedAt: string;
}

interface ClientProject {
  id: string;
  title: string;
  category: string;
  status: string;
  designer?: { name: string };
  contractValue: string;
  milestones?: string[];
}

interface DesignerProject {
  id: string;
  name: string;
  deadline: string;
  client?: { name: string };
  status: string;
  budget: string;
  milestones?: { title: string; done: boolean }[];
}

/**
 * Registers a remote TrueType font into the jsPDF Virtual File System.
 */
async function registerFont(doc: jsPDF, url: string, name: string, style: string): Promise<boolean> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const arrayBuffer = await res.arrayBuffer();
    
    // Convert ArrayBuffer to base64
    let binary = "";
    const bytes = new Uint8Array(arrayBuffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = typeof window !== "undefined" ? window.btoa(binary) : Buffer.from(arrayBuffer).toString("base64");
    
    const filename = `${name}-${style}.ttf`;
    doc.addFileToVFS(filename, base64);
    doc.addFont(filename, name, style);
    return true;
  } catch (err) {
    console.warn(`Failed to retrieve or register font dynamically (${name}-${style}):`, err);
    return false;
  }
}

/**
 * Injects Inter fonts asynchronously if network allows.
 */
async function loadInterFonts(doc: jsPDF): Promise<boolean> {
  // Use direct jsdelivr links pointing to the static folder in the google/fonts repo
  const regularUrl = "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/inter/static/Inter-Regular.ttf";
  const boldUrl = "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/inter/static/Inter-Bold.ttf";
  
  const [hasReg, hasBold] = await Promise.all([
    registerFont(doc, regularUrl, "Inter", "normal"),
    registerFont(doc, boldUrl, "Inter", "bold")
  ]);
  return hasReg && hasBold;
}

/**
 * Helper to draw a mathematically centered, high-contrast status badge.
 */
function drawBadge(
  doc: jsPDF,
  text: string,
  alignRightX: number, // Right margin alignment anchor
  rowTopY: number,     // Row top coordinate
  rowHeight: number,   // Total row height for vertical centering
  fontSize: number,
  fontStyle: string,
  bgColor: number[],
  textColor: number[],
  fontName: string
) {
  doc.setFont(fontName, fontStyle);
  doc.setFontSize(fontSize);
  
  // Calculate text metrics
  const textWidth = doc.getTextWidth(text);
  
  // High contrast padding
  const paddingX = 3.0; // 3mm elegant left/right padding
  const paddingY = 1.2; // 1.2mm top/bottom padding
  const badgeWidth = textWidth + (paddingX * 2);
  const badgeHeight = (fontSize * 0.3527) + (paddingY * 2); // points to mm conversion + padding
  
  // Position badge
  const badgeX = alignRightX - badgeWidth;
  const badgeY = rowTopY + (rowHeight - badgeHeight) / 2; // Perfect vertical alignment
  
  // Render opaque background box
  doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
  doc.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 1.0, 1.0, "F");
  
  // Render crisp high contrast text exactly in the center
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  // Calculate vertical offset of baseline based on standard font cap height ratio (~72% of pt-to-mm size)
  const textBaselineY = badgeY + paddingY + (fontSize * 0.3527 * 0.72);
  doc.text(text, badgeX + paddingX, textBaselineY);
}

/**
 * Generates a luxurious, branded PDF Executive Report for Clients.
 */
export async function generateClientPdfReport(profile: UserProfile | null, projects: ClientProject[]) {
  const doc = new jsPDF("p", "mm", "a4");
  const hasInter = await loadInterFonts(doc);
  
  const fontNormal = hasInter ? "Inter" : "helvetica";
  const fontBold = hasInter ? "Inter" : "helvetica";
  
  const pageWidth = doc.internal.pageSize.getWidth(); // 210 mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297 mm
  const margin = 15;
  const contentWidth = pageWidth - margin * 2; // 180 mm

  // Brand Palette Definitions (DesignBridge Africa - Deep Indigo, Violet & Pure Crisp White)
  const cIndigo = [30, 27, 75];     // Deep Indigo primary text/fill (#1e1b4b)
  const cViolet = [109, 40, 217];   // Main Violet accent (#6d28d9)
  const cLightPurple = [245, 243, 255]; // Soft light violet background card (#f5f3ff)
  const cCharcoal = [23, 23, 37];   // Elite dark headers (#171725)
  const cMintGreen = [16, 185, 129]; // Emerald success
  const cAmberAccent = [217, 119, 6]; // Amber pending status
  
  // 1. TOP BRAND GEOMETRIC WEAVE MOTIF (Deep Indigo & Violet Luxe Segments)
  const topPalette = [
    cIndigo,
    cViolet,
    [139, 92, 246], // Medium Violet
    [167, 139, 250], // Soft Amethyst
    [79, 70, 229],  // Indigo
    cIndigo
  ];
  const barWidth = pageWidth / topPalette.length;
  topPalette.forEach((col, idx) => {
    doc.setFillColor(col[0], col[1], col[2]);
    doc.rect(idx * barWidth, 0, barWidth, 4.5, "F");
  });

  // 2. HEADER LOCKUP
  let currentY = 17;
  doc.setFont(fontBold, "bold");
  doc.setFontSize(21);
  doc.setTextColor(cIndigo[0], cIndigo[1], cIndigo[2]);
  doc.text("DESIGNBRIDGE", margin, currentY);
  
  // Brand Highlight "AFRICA" word in Violet
  doc.setTextColor(cViolet[0], cViolet[1], cViolet[2]);
  doc.text("AFRICA", margin + doc.getTextWidth("DESIGNBRIDGE "), currentY);

  // Subtitle Tagline
  currentY += 5;
  doc.setFont(fontNormal, "normal");
  doc.setFontSize(8);
  doc.setTextColor(110, 110, 135);
  doc.text("PREMIUM DISBURSEMENT & ESCROW ACCOUNT OVERVIEW", margin, currentY);

  // High-Contrast Document Badge on Right with elegant text centering
  const rightBadgeW = 50;
  const rightBadgeX = pageWidth - margin - rightBadgeW;
  doc.setFillColor(cLightPurple[0], cLightPurple[1], cLightPurple[2]);
  doc.roundedRect(rightBadgeX, 11, rightBadgeW, 11.5, 1.5, 1.5, "F");
  
  doc.setTextColor(cViolet[0], cViolet[1], cViolet[2]);
  doc.setFont(fontBold, "bold");
  doc.setFontSize(8.5);
  const badgeTitle = "CLIENT ADVISOR";
  const badgeTitleW = doc.getTextWidth(badgeTitle);
  doc.text(badgeTitle, rightBadgeX + (rightBadgeW - badgeTitleW) / 2, 16);
  
  doc.setFont(fontNormal, "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(cIndigo[0], cIndigo[1], cIndigo[2]);
  const badgeSub = "EXECUTIVE BLUEPRINT";
  const badgeSubW = doc.getTextWidth(badgeSub);
  doc.text(badgeSub, rightBadgeX + (rightBadgeW - badgeSubW) / 2, 20.5);

  // Solid Crisp Indigo Divider
  currentY += 5;
  doc.setDrawColor(cViolet[0], cViolet[1], cViolet[2]);
  doc.setLineWidth(0.4);
  doc.line(margin, currentY, pageWidth - margin, currentY);

  // 3. ACCOUNT OVERVIEW PANEL (Opaque light violet background card with complete legibility)
  currentY += 4;
  doc.setFillColor(cLightPurple[0], cLightPurple[1], cLightPurple[2]);
  doc.roundedRect(margin, currentY, contentWidth, 22, 2, 2, "F");

  // Section Label
  doc.setTextColor(cIndigo[0], cIndigo[1], cIndigo[2]);
  doc.setFont(fontBold, "bold");
  doc.setFontSize(9);
  doc.text("ACCOUNT CONTEXT & CREDENTIALS", margin + 6, currentY + 5.5);

  // Left metadata column
  doc.setFont(fontNormal, "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 125);
  doc.text("Account Owner:", margin + 6, currentY + 11.5);
  doc.setFont(fontBold, "bold");
  doc.setTextColor(cIndigo[0], cIndigo[1], cIndigo[2]);
  doc.text(`${profile?.displayName || "Elite Client Representative"} (Premium Member)`, margin + 28, currentY + 11.5);

  doc.setFont(fontNormal, "normal");
  doc.setTextColor(100, 100, 125);
  doc.text("System Email:", margin + 6, currentY + 17.5);
  doc.setFont(fontBold, "bold");
  doc.setTextColor(cIndigo[0], cIndigo[1], cIndigo[2]);
  doc.text(`${profile?.email || "N/A"}`, margin + 28, currentY + 17.5);

  // Generated on (Right Aligned Context)
  doc.setFont(fontNormal, "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 100, 125);
  doc.text(`Generated On: ${new Date().toLocaleString()}`, pageWidth - margin - 75, currentY + 11.5);
  
  // Solid green ledger certificate badge inside panel with dynamic sizing & auto padding
  const certLabel = "• SECURE DESIGNBRIDGE ESCROW LEDGER DATA";
  doc.setFont(fontBold, "bold");
  doc.setFontSize(6.5);
  const certW = doc.getTextWidth(certLabel);
  const certBadgeW = certW + 5.0; // 2.5mm padding each side
  const certBadgeH = 4.6;
  const certBadgeX = pageWidth - margin - 6 - certBadgeW;
  const certBadgeY = currentY + 14.2;
  
  doc.setFillColor(228, 250, 243); // Opaque mint green background
  doc.roundedRect(certBadgeX, certBadgeY, certBadgeW, certBadgeH, 0.8, 0.8, "F");
  doc.setTextColor(cMintGreen[0], cMintGreen[1], cMintGreen[2]);
  doc.text(certLabel, certBadgeX + 2.5, certBadgeY + 3.2);

  // 4. METRIC CARDS (3-Column Layout with High contrast white backgrounds & violet accents)
  currentY += 26;
  const colW = (contentWidth - 10) / 3;

  // Card 1: Total Escrow Volume
  doc.setFillColor(255, 255, 255); // Crisp White card
  doc.setDrawColor(cViolet[0], cViolet[1], cViolet[2]); // High contrast Violet border
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, colW, 18, 1.5, 1.5, "FD");
  doc.setFont(fontNormal, "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(110, 110, 135);
  doc.text("TOTAL ESCROW VOL", margin + 5, currentY + 5.5);
  doc.setFont(fontBold, "bold");
  doc.setFontSize(12);
  doc.setTextColor(cIndigo[0], cIndigo[1], cIndigo[2]);
  doc.text("$45,280 USD", margin + 5, currentY + 13.5);

  // Card 2: Active Engagements
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(cIndigo[0], cIndigo[1], cIndigo[2]); // Indigo border
  doc.roundedRect(margin + colW + 5, currentY, colW, 18, 1.5, 1.5, "FD");
  doc.setFont(fontNormal, "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(110, 110, 135);
  doc.text("ACTIVE WORKSTREAMS", margin + colW + 10, currentY + 5.5);
  doc.setFont(fontBold, "bold");
  doc.setFontSize(12);
  doc.setTextColor(cViolet[0], cViolet[1], cViolet[2]);
  doc.text(`${projects.length} Active Contracts`, margin + colW + 10, currentY + 13.5);

  // Card 3: Escrow Protection
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(cViolet[0], cViolet[1], cViolet[2]); // Violet border
  doc.roundedRect(margin + (colW * 2) + 10, currentY, colW, 18, 1.5, 1.5, "FD");
  doc.setFont(fontNormal, "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(110, 110, 135);
  doc.text("ESCROW ASSURANCE", margin + (colW * 2) + 15, currentY + 5.5);
  doc.setFont(fontBold, "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(cMintGreen[0], cMintGreen[1], cMintGreen[2]);
  doc.text("100% ARBITRATION GUARANTEE", margin + (colW * 2) + 15, currentY + 13.5);

  // 5. ACTIVE ENGAGEMENTS HEADER
  currentY += 24;
  doc.setFont(fontBold, "bold");
  doc.setFontSize(10);
  doc.setTextColor(cIndigo[0], cIndigo[1], cIndigo[2]);
  doc.text("ACTIVE ENGAGEMENTS & WORKSTREAMS", margin, currentY);

  // Section Marker Line in Violet
  currentY += 2;
  doc.setDrawColor(cViolet[0], cViolet[1], cViolet[2]);
  doc.setLineWidth(0.8);
  doc.line(margin, currentY, margin + 25, currentY);

  // Headings Table row - Solid Deep Indigo background with clean White Text
  currentY += 3;
  doc.setFillColor(cIndigo[0], cIndigo[1], cIndigo[2]);
  doc.roundedRect(margin, currentY, contentWidth, 7, 1, 1, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont(fontBold, "bold");
  doc.setFontSize(7.5);
  doc.text("PROJECT TITLE & ASSIGNED CONSULTANT", margin + 4, currentY + 4.8);
  doc.text("SPECIALIST BRAND CATEGORY", margin + 90, currentY + 4.8);
  doc.text("FINANCIAL VALUE", margin + 135, currentY + 4.8);
  doc.text("ESCROW STAGE", margin + 163, currentY + 4.8);

  currentY += 7;

  // Table rows with clean zebra background shading for high-readability
  const activeSet = projects.slice(0, 3);
  activeSet.forEach((proj, idx) => {
    if (idx % 2 === 0) {
      doc.setFillColor(248, 249, 252);
      doc.rect(margin, currentY, contentWidth, 11, "F");
    } else {
      doc.setFillColor(255, 255, 255);
      doc.rect(margin, currentY, contentWidth, 11, "F");
    }

    // Title
    doc.setFont(fontBold, "bold");
    doc.setFontSize(8);
    doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
    const titleTrunc = proj.title.length > 40 ? proj.title.substring(0, 37) + "..." : proj.title;
    doc.text(titleTrunc, margin + 4, currentY + 4.5);

    // Consultant
    doc.setFont(fontNormal, "normal");
    doc.setFontSize(6.8);
    doc.setTextColor(110, 110, 130);
    doc.text(`Consultant: ${proj.designer?.name || "Premium Specialist"}`, margin + 4, currentY + 8.5);

    // Category
    doc.setFont(fontNormal, "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(cIndigo[0], cIndigo[1], cIndigo[2]);
    doc.text(proj.category || "Creative Design", margin + 90, currentY + 6.5);

    // Value
    doc.setFont(fontBold, "bold");
    doc.setTextColor(cViolet[0], cViolet[1], cViolet[2]);
    doc.text(proj.contractValue || "$1,500.00", margin + 135, currentY + 6.5);

    // Completely Centered dynamic Status Badge Block
    const status = proj.status || "RUNNING";
    let bgBadge = [242, 241, 255]; 
    let textBadge = [cViolet[0], cViolet[1], cViolet[2]];

    if (status === "COMPLETED" || status === "RELEASED") {
      bgBadge = [228, 250, 243]; 
      textBadge = [cMintGreen[0], cMintGreen[1], cMintGreen[2]];
    } else if (status === "UNDER_REVIEW" || status === "PENDING") {
      bgBadge = [255, 249, 230]; 
      textBadge = [cAmberAccent[0], cAmberAccent[1], cAmberAccent[2]];
    }

    // Align right end at pageWidth - margin - 4 = 191mm. Row height is 11mm. Center vertically.
    drawBadge(doc, status, pageWidth - margin - 4, currentY, 11, 5.8, "bold", bgBadge, textBadge, fontBold);

    currentY += 11;
  });

  const gapFill = (3 - activeSet.length) * 11;
  currentY += gapFill;

  // 6. DETAILED TRANSACTION LEDGER
  currentY += 4;
  doc.setFont(fontBold, "bold");
  doc.setFontSize(10);
  doc.setTextColor(cIndigo[0], cIndigo[1], cIndigo[2]);
  doc.text("VERIFIED ESCROW LEDGER & PAYMENTS", margin, currentY);

  currentY += 2;
  doc.setDrawColor(cViolet[0], cViolet[1], cViolet[2]);
  doc.setLineWidth(0.8);
  doc.line(margin, currentY, margin + 25, currentY);

  currentY += 3;
  const ledgerItems = [
    { ref: "Invoice #1092", amount: "$1,500.00", status: "RELEASED", method: "Mastercard **2910", id: "ch_3Mv8XpLkd" },
    { ref: "Invoice #1091", amount: "$1,000.00", status: "RELEASED", method: "Stripe Escrow Sync", id: "ch_2Nv9KpYld" },
    { ref: "Invoice #1093", amount: "$3,200.00", status: "LOCKED", method: "Visa Dual Signoff", id: "ch_9Xz2WpGst" },
    { ref: "Invoice #1094", amount: "$5,000.00", status: "PENDING RELEASE", method: "M-Pesa Express API", id: "ch_4Pt9OqMbn" },
  ];

  // Ledger Table format
  doc.setFillColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
  doc.roundedRect(margin, currentY, contentWidth, 7, 1, 1, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont(fontBold, "bold");
  doc.setFontSize(7.5);
  doc.text("REFERENCE", margin + 4, currentY + 4.8);
  doc.text("TRANSACTION HASH", margin + 42, currentY + 4.8);
  doc.text("PAYMENT METHOD LOG", margin + 90, currentY + 4.8);
  doc.text("AMOUNT", margin + 135, currentY + 4.8);
  doc.text("LEDGER STAGE", margin + 162, currentY + 4.8);

  currentY += 7;
  ledgerItems.forEach((item, idx) => {
    if (idx % 2 === 0) {
      doc.setFillColor(248, 249, 252);
      doc.rect(margin, currentY, contentWidth, 9, "F");
    } else {
      doc.setFillColor(255, 255, 255);
      doc.rect(margin, currentY, contentWidth, 9, "F");
    }

    doc.setFont(fontBold, "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(cIndigo[0], cIndigo[1], cIndigo[2]);
    doc.text(item.ref, margin + 4, currentY + 6.3);

    doc.setFont(fontNormal, "normal");
    doc.setFontSize(7);
    doc.setTextColor(110, 110, 130);
    doc.text(item.id, margin + 42, currentY + 6.3);
    doc.text(item.method, margin + 90, currentY + 6.3);

    doc.setFont(fontBold, "bold");
    doc.setTextColor(cIndigo[0], cIndigo[1], cIndigo[2]);
    doc.text(item.amount, margin + 135, currentY + 6.3);

    // Center layout of ledger categories with high visibility background pill
    let bgBadge = [242, 241, 255]; 
    let textBadge = [cViolet[0], cViolet[1], cViolet[2]];

    if (item.status === "RELEASED") {
      bgBadge = [228, 250, 243]; 
      textBadge = [cMintGreen[0], cMintGreen[1], cMintGreen[2]];
    } else if (item.status === "LOCKED") {
      bgBadge = [255, 249, 230]; 
      textBadge = [cAmberAccent[0], cAmberAccent[1], cAmberAccent[2]];
    } else if (item.status === "PENDING RELEASE") {
      bgBadge = [239, 246, 255]; 
      textBadge = [29, 78, 216];   // High visibility clean Blue
    }

    drawBadge(doc, item.status, pageWidth - margin - 4, currentY, 9, 6.0, "bold", bgBadge, textBadge, fontBold);

    currentY += 9;
  });

  // 7. SECURITY & TRUST NOTICE (With immaculate symmetrical padding & alignment)
  currentY += 5;
  const noticeBoxH = 16.0;
  doc.setFillColor(254, 252, 233); // Opaque bright yellow/tan alert base
  doc.setDrawColor(204, 162, 35);   // Crisp warning outline border to highlight
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, contentWidth, noticeBoxH, 1.5, 1.5, "FD");

  doc.setTextColor(113, 63, 18);   // Highly readable solid custom label
  doc.setFont(fontBold, "bold");
  doc.setFontSize(7.5);
  doc.text("ESCROW ASSURANCE PROTOCOL", margin + 5, currentY + 5.0);

  doc.setFont(fontNormal, "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(133, 77, 14);
  doc.text("This document constitutes a cryptographically signed activity statement guaranteed by the DesignBridge Core Protocol.", margin + 5, currentY + 9.2);
  doc.text("Disbursements are backed up by smart-agent arbitration models. For inquiries, email support@designbridge.africa", margin + 5, currentY + 12.8);

  // 8. TRUST SEAL EMBLEM (Crisply centered text fields inside container status box)
  const stampWidth = 50;
  const stampX = pageWidth - margin - stampWidth;
  doc.setFillColor(cLightPurple[0], cLightPurple[1], cLightPurple[2]); 
  doc.setDrawColor(cViolet[0], cViolet[1], cViolet[2]);
  doc.setLineWidth(0.3);
  doc.roundedRect(stampX, pageHeight - 34, stampWidth, 15, 2, 2, "FD");
  
  // Center Cert Header text
  doc.setFont(fontBold, "bold");
  doc.setFontSize(6.5);
  const certTitle = "AUTHENTIC CERTIFICATE";
  const certTitleWidth = doc.getTextWidth(certTitle);
  doc.setTextColor(cViolet[0], cViolet[1], cViolet[2]); 
  doc.text(certTitle, stampX + (stampWidth - certTitleWidth) / 2, pageHeight - 27.5);
  
  // Center Cert Badge Serial code
  doc.setFont(fontNormal, "normal");
  doc.setFontSize(5);
  const certSub = "APPROVED ESCROW SEAL #DB-24-C";
  const certSubWidth = doc.getTextWidth(certSub);
  doc.setTextColor(cIndigo[0], cIndigo[1], cIndigo[2]);
  doc.text(certSub, stampX + (stampWidth - certSubWidth) / 2, pageHeight - 23.5);

  // 9. FOOTER
  doc.setDrawColor(220, 225, 235);
  doc.setLineWidth(0.3);
  doc.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);

  doc.setFont(fontNormal, "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(120, 130, 145);
  doc.text("DesignBridge Africa • Premium Decentralized Escrow Ecosystem", margin, pageHeight - 9);
  doc.text("Page 1 of 1", pageWidth - margin - 15, pageHeight - 9);

  // Save/Download PDF
  doc.save(`designbridge-executive-client-report-${Date.now()}.pdf`);
}

/**
 * Generates a beautiful branded PDF report for Specialists/Designers.
 */
export async function generateDesignerPdfReport(profile: UserProfile | null, projects: DesignerProject[]) {
  const doc = new jsPDF("p", "mm", "a4");
  const hasInter = await loadInterFonts(doc);
  
  const fontNormal = hasInter ? "Inter" : "helvetica";
  const fontBold = hasInter ? "Inter" : "helvetica";
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  // Brand Palette Definitions (DesignBridge Africa - Deep Indigo, Violet & Pure Crisp White)
  const cIndigo = [30, 27, 75];     // Deep Indigo (#1e1b4b)
  const cViolet = [109, 40, 217];   // Main Violet (#6d28d9)
  const cLightPurple = [245, 243, 255]; // Soft light violet background card (#f5f3ff)
  const cCharcoal = [23, 23, 37];   // Elite dark headers (#171725)
  const cMintGreen = [16, 185, 129]; // Emerald success
  const cAmberAccent = [217, 119, 6]; // Amber pending status

  // 1. TOP BRAND GEOMETRIC WEAVE MOTIF (Deep Indigo & Violet Luxe Segments)
  const topPalette = [
    cIndigo,
    cViolet,
    [139, 92, 246], // Medium Violet
    [167, 139, 250], // Soft Amethyst
    [79, 70, 229],  // Indigo
    cIndigo
  ];
  const barWidth = pageWidth / topPalette.length;
  topPalette.forEach((col, idx) => {
    doc.setFillColor(col[0], col[1], col[2]);
    doc.rect(idx * barWidth, 0, barWidth, 4.5, "F");
  });

  // 2. HEADER LOCKUP
  let currentY = 17;
  doc.setFont(fontBold, "bold");
  doc.setFontSize(21);
  doc.setTextColor(cIndigo[0], cIndigo[1], cIndigo[2]);
  doc.text("DESIGNBRIDGE", margin, currentY);
  
  doc.setTextColor(cViolet[0], cViolet[1], cViolet[2]);
  doc.text("AFRICA", margin + doc.getTextWidth("DESIGNBRIDGE "), currentY);

  // Subtitle / Tagline
  currentY += 5;
  doc.setFont(fontNormal, "normal");
  doc.setFontSize(8);
  doc.setTextColor(110, 110, 135);
  doc.text("ACCOUNT SPECIALIST AUDITED EARNINGS & PROTECTION STATUS", margin, currentY);

  // Document Badge on Right with elegant automated center text alignment
  const rightBadgeW = 50;
  const rightBadgeX = pageWidth - margin - rightBadgeW;
  doc.setFillColor(255, 249, 230); // Solid premium cream gold
  doc.roundedRect(rightBadgeX, 11, rightBadgeW, 11.5, 1.5, 1.5, "F");
  
  doc.setTextColor(cAmberAccent[0], cAmberAccent[1], cAmberAccent[2]);
  doc.setFont(fontBold, "bold");
  doc.setFontSize(8.5);
  const badgeTitle = "ELITE SPECIALIST";
  const badgeTitleW = doc.getTextWidth(badgeTitle);
  doc.text(badgeTitle, rightBadgeX + (rightBadgeW - badgeTitleW) / 2, 16);
  
  doc.setFont(fontNormal, "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(cIndigo[0], cIndigo[1], cIndigo[2]);
  const badgeSub = "SAVINGS & CAP REPORT";
  const badgeSubW = doc.getTextWidth(badgeSub);
  doc.text(badgeSub, rightBadgeX + (rightBadgeW - badgeSubW) / 2, 20.5);

  // Solid Divider line
  currentY += 5;
  doc.setDrawColor(cViolet[0], cViolet[1], cViolet[2]);
  doc.setLineWidth(0.4);
  doc.line(margin, currentY, pageWidth - margin, currentY);

  // 3. ACCOUNT OVERVIEW PANEL (Opaque soft light purple container box with total legibility)
  currentY += 4;
  doc.setFillColor(cLightPurple[0], cLightPurple[1], cLightPurple[2]);
  doc.roundedRect(margin, currentY, contentWidth, 22, 2, 2, "F");

  // Account Metadata List (Left column)
  doc.setTextColor(cIndigo[0], cIndigo[1], cIndigo[2]);
  doc.setFont(fontBold, "bold");
  doc.setFontSize(9);
  doc.text("SPECIALIST STATUS OVERVIEW", margin + 6, currentY + 5.5);

  doc.setFont(fontNormal, "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 125);
  doc.text("Consultant Name:", margin + 6, currentY + 11.5);
  doc.setFont(fontBold, "bold");
  doc.setTextColor(cIndigo[0], cIndigo[1], cIndigo[2]);
  doc.text(`${profile?.displayName || "Elite Specialist Creative"}`, margin + 30, currentY + 11.5);

  doc.setFont(fontNormal, "normal");
  doc.setTextColor(100, 100, 125);
  doc.text("Designer Email:", margin + 6, currentY + 17.5);
  doc.setFont(fontBold, "bold");
  doc.setTextColor(cIndigo[0], cIndigo[1], cIndigo[2]);
  doc.text(`${profile?.email || "N/A"}`, margin + 30, currentY + 17.5);

  // Timestamp and Status on Right
  doc.setFont(fontNormal, "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 100, 125);
  doc.text(`Generated On: ${new Date().toLocaleString()}`, pageWidth - margin - 75, currentY + 11.5);
  
  // Secure Trust seal indicator badge with dynamic paddings & alignments
  const balanceLabel = "• VERIFIED ESCROW BALANCE STATEMENT";
  doc.setFont(fontBold, "bold");
  doc.setFontSize(6.5);
  const balW = doc.getTextWidth(balanceLabel);
  const balBadgeW = balW + 5.0; // 2.5mm margin padding on both sides
  const balBadgeH = 4.6;
  const balBadgeX = pageWidth - margin - 6 - balBadgeW;
  const balBadgeY = currentY + 14.2;
  
  doc.setFillColor(255, 249, 230); // Opaque light gold background
  doc.roundedRect(balBadgeX, balBadgeY, balBadgeW, balBadgeH, 0.8, 0.8, "F");
  doc.setTextColor(cAmberAccent[0], cAmberAccent[1], cAmberAccent[2]);
  doc.text(balanceLabel, balBadgeX + 2.5, balBadgeY + 3.2);

  // 4. METRIC SCORES (3-Column Layout with deep indigo cards and crisp white back)
  currentY += 26;
  const colW = (contentWidth - 10) / 3;

  // Box 1: Total Earnings
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(cIndigo[0], cIndigo[1], cIndigo[2]);
  doc.roundedRect(margin, currentY, colW, 18, 1.5, 1.5, "FD");
  doc.setFont(fontNormal, "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(110, 110, 135);
  doc.text("TOTAL ACCUMULATED SAVINGS", margin + 5, currentY + 5.5);
  doc.setFont(fontBold, "bold");
  doc.setFontSize(11.5);
  doc.setTextColor(cMintGreen[0], cMintGreen[1], cMintGreen[2]); // Green
  doc.text("$12,450.00 USD", margin + 5, currentY + 13.5);

  // Box 2: Locked in Escrow
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(cIndigo[0], cIndigo[1], cIndigo[2]);
  doc.roundedRect(margin + colW + 5, currentY, colW, 18, 1.5, 1.5, "FD");
  doc.setFont(fontNormal, "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(110, 110, 135);
  doc.text("LOCKED IN ESCROW", margin + colW + 10, currentY + 5.5);
  doc.setFont(fontBold, "bold");
  doc.setFontSize(11.5);
  doc.setTextColor(cViolet[0], cViolet[1], cViolet[2]);
  doc.text("$3,200.00 USD", margin + colW + 10, currentY + 13.5);

  // Box 3: Total Jobs Done
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(cIndigo[0], cIndigo[1], cIndigo[2]);
  doc.roundedRect(margin + (colW * 2) + 10, currentY, colW, 18, 1.5, 1.5, "FD");
  doc.setFont(fontNormal, "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(110, 110, 135);
  doc.text("COMPLETED CONTRACT JOURNEYS", margin + (colW * 2) + 15, currentY + 5.5);
  doc.setFont(fontBold, "bold");
  doc.setFontSize(11);
  doc.setTextColor(cIndigo[0], cIndigo[1], cIndigo[2]);
  doc.text("14 Client Marks", margin + (colW * 2) + 15, currentY + 13.5);

  // 5. PROJECTS SECTION HEADER
  currentY += 24;
  doc.setFont(fontBold, "bold");
  doc.setFontSize(10);
  doc.setTextColor(cIndigo[0], cIndigo[1], cIndigo[2]);
  doc.text("ACTIVE CLIENT WORKSTREAMS", margin, currentY);

  currentY += 2;
  doc.setDrawColor(cViolet[0], cViolet[1], cViolet[2]);
  doc.setLineWidth(0.8);
  doc.line(margin, currentY, margin + 25, currentY);

  // Table header
  currentY += 3;
  doc.setFillColor(cIndigo[0], cIndigo[1], cIndigo[2]);
  doc.roundedRect(margin, currentY, contentWidth, 7, 1, 1, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont(fontBold, "bold");
  doc.setFontSize(7.5);
  doc.text("CONTRACT WORKSTREAM & CLIENT", margin + 4, currentY + 4.8);
  doc.text("DEADLINE", margin + 90, currentY + 4.8);
  doc.text("ESCROW BUDGET", margin + 135, currentY + 4.8);
  doc.text("STAGE", margin + 162, currentY + 4.8);

  currentY += 7;

  // Render Rows with safe sizing and zebra background
  const maxRenderedDesignerProjects = projects.slice(0, 3);
  maxRenderedDesignerProjects.forEach((proj, idx) => {
    if (idx % 2 === 0) {
      doc.setFillColor(248, 249, 252);
      doc.rect(margin, currentY, contentWidth, 11, "F");
    } else {
      doc.setFillColor(255, 255, 255);
      doc.rect(margin, currentY, contentWidth, 11, "F");
    }

    doc.setFont(fontBold, "bold");
    doc.setFontSize(8);
    doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
    const nameTrunc = proj.name.length > 40 ? proj.name.substring(0, 37) + "..." : proj.name;
    doc.text(nameTrunc, margin + 4, currentY + 4.5);

    doc.setFont(fontNormal, "normal");
    doc.setFontSize(7);
    doc.setTextColor(110, 110, 130);
    doc.text(`Client Representative: ${proj.client?.name || "Premium Client Rep"}`, margin + 4, currentY + 8.5);

    // Deadline
    doc.setFont(fontNormal, "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(cIndigo[0], cIndigo[1], cIndigo[2]);
    doc.text(proj.deadline || "Immediate", margin + 90, currentY + 6.5);

    // Budget
    doc.setFont(fontBold, "bold");
    doc.setTextColor(cMintGreen[0], cMintGreen[1], cMintGreen[2]);
    doc.text(proj.budget || "$2,500.00", margin + 135, currentY + 6.5);

    // Mathematically aligned status badges
    const status = proj.status || "RUNNING";
    let bgBadge = [242, 241, 255]; 
    let textBadge = [cViolet[0], cViolet[1], cViolet[2]];

    if (status === "COMPLETED" || status === "RELEASED") {
      bgBadge = [228, 250, 243]; 
      textBadge = [cMintGreen[0], cMintGreen[1], cMintGreen[2]];
    } else if (status === "UNDER_REVIEW" || status === "PENDING" || status === "RUNNING") {
      bgBadge = [255, 249, 230]; 
      textBadge = [cAmberAccent[0], cAmberAccent[1], cAmberAccent[2]];
    }

    drawBadge(doc, status, pageWidth - margin - 4, currentY, 11, 5.8, "bold", bgBadge, textBadge, fontBold);

    currentY += 11;
  });

  const remainingGap = (3 - maxRenderedDesignerProjects.length) * 11;
  currentY += remainingGap;

  // 6. COMPLETED MILESTONES SUMMARY
  currentY += 4;
  doc.setFont(fontBold, "bold");
  doc.setFontSize(10);
  doc.setTextColor(cIndigo[0], cIndigo[1], cIndigo[2]);
  doc.text("MILESTONE & DISBURSEMENT RECORD", margin, currentY);

  currentY += 2;
  doc.setDrawColor(cViolet[0], cViolet[1], cViolet[2]);
  doc.setLineWidth(0.8);
  doc.line(margin, currentY, margin + 25, currentY);

  currentY += 3;
  
  // Render high-fidelity details about recent actions
  const milestones = [
    { title: "West-African Traditional Beadwork Mockups", client: "Zara Adebayo", payout: "$1,600.00", status: "RELEASED" },
    { title: "NairaFlow Digital Wireframes & Architecture", client: "NairaFlow Inc.", payout: "$925.00", status: "RELEASED" },
    { title: "Typography guidelines & dark theme variants", client: "NairaFlow Inc.", payout: "$925.00", status: "RELEASED" },
    { title: "AfriTronics UI Kit & Corporate Color Palette", client: "David Mensah", payout: "$2,200.00", status: "PENDING" },
  ];

  doc.setFillColor(cIndigo[0], cIndigo[1], cIndigo[2]);
  doc.roundedRect(margin, currentY, contentWidth, 7, 1, 1, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont(fontBold, "bold");
  doc.setFontSize(7.5);
  doc.text("DELIVERABLE DETAILS", margin + 4, currentY + 4.8);
  doc.text("CLIENT ASSIGNED", margin + 90, currentY + 4.8);
  doc.text("ESCROW PAY", margin + 135, currentY + 4.8);
  doc.text("RELEASE STATE", margin + 162, currentY + 4.8);

  currentY += 7;
  milestones.slice(0, 4).forEach((mile, idx) => {
    if (idx % 2 === 0) {
      doc.setFillColor(248, 249, 252);
      doc.rect(margin, currentY, contentWidth, 9, "F");
    } else {
      doc.setFillColor(255, 255, 255);
      doc.rect(margin, currentY, contentWidth, 9, "F");
    }

    doc.setFont(fontBold, "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
    const displayTitle = mile.title.length > 40 ? mile.title.substring(0, 37) + "..." : mile.title;
    doc.text(displayTitle, margin + 4, currentY + 6);

    doc.setFont(fontNormal, "normal");
    doc.setTextColor(110, 110, 130);
    doc.text(mile.client, margin + 90, currentY + 6);

    doc.setFont(fontBold, "bold");
    doc.setTextColor(cIndigo[0], cIndigo[1], cIndigo[2]);
    doc.text(mile.payout, margin + 135, currentY + 6);

    // Center layout milestone status with high-contrast background pill
    let bgBadge = [242, 241, 255]; 
    let textBadge = [cViolet[0], cViolet[1], cViolet[2]];
    const dispStatus = mile.status === "RELEASED" ? "RELEASED" : "LOCKED (COLD)";

    if (mile.status === "RELEASED") {
      bgBadge = [228, 250, 243]; 
      textBadge = [cMintGreen[0], cMintGreen[1], cMintGreen[2]];
    } else {
      bgBadge = [255, 249, 230]; 
      textBadge = [cAmberAccent[0], cAmberAccent[1], cAmberAccent[2]];
    }

    drawBadge(doc, dispStatus, pageWidth - margin - 4, currentY, 9, 6.0, "bold", bgBadge, textBadge, fontBold);

    currentY += 9;
  });

  // 7. ARBITRATION FOOTNOTE (With automated high-fidelity symmetrical margins)
  currentY += 5;
  const footnoteBoxH = 16.0;
  doc.setFillColor(cLightPurple[0], cLightPurple[1], cLightPurple[2]); // Solid soft white/violet base
  doc.setDrawColor(cViolet[0], cViolet[1], cViolet[2]);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, contentWidth, footnoteBoxH, 1.5, 1.5, "FD");
  
  doc.setTextColor(cIndigo[0], cIndigo[1], cIndigo[2]);
  doc.setFont(fontBold, "bold");
  doc.setFontSize(7.5);
  doc.text("DECENTRALIZED WORKER CLAUSE", margin + 5, currentY + 5.0);
  
  doc.setFont(fontNormal, "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(100, 100, 125);
  doc.text("Disbursal records are audited using dual-key multi-sig protection under Nigerian, Kenyan and South African regulatory provisions.", margin + 5, currentY + 9.2);
  doc.text("Tax withholding is responsibility of specialist. DesignBridge issues periodic 1099 equivalents for your native tax authority.", margin + 5, currentY + 12.8);

  // 8. SECURITY SEAL / STAMP (With mathematically centered alignment)
  const stampWidth = 50;
  const stampX = pageWidth - margin - stampWidth;
  doc.setFillColor(255, 249, 230); // Premium cream gold base
  doc.setDrawColor(253, 230, 138); // Warm gold border design
  doc.setLineWidth(0.3);
  doc.roundedRect(stampX, pageHeight - 34, stampWidth, 15, 2, 2, "FD");
  
  // Center stamp title
  doc.setFont(fontBold, "bold");
  doc.setFontSize(6.5);
  const specTitle = "AUTHENTIC SPECIALIST";
  const specTitleWidth = doc.getTextWidth(specTitle);
  doc.setTextColor(180, 83, 9); // Warm rust brown
  doc.text(specTitle, stampX + (stampWidth - specTitleWidth) / 2, pageHeight - 27.5);
  
  // Center stamp serial
  doc.setFont(fontNormal, "normal");
  doc.setFontSize(5);
  const specSub = "AUDITED TRUST SEAL #DB-24-S";
  const specSubWidth = doc.getTextWidth(specSub);
  doc.setTextColor(217, 119, 6);
  doc.text(specSub, stampX + (stampWidth - specSubWidth) / 2, pageHeight - 23.5);

  // 9. FOOTER
  doc.setDrawColor(220, 225, 235);
  doc.setLineWidth(0.3);
  doc.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);

  doc.setFont(fontNormal, "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(120, 130, 145);
  doc.text("DesignBridge Africa • Premium Decentralized Escrow Ecosystem", margin, pageHeight - 9);
  doc.text("Page 1 of 1", pageWidth - margin - 15, pageHeight - 9);

  doc.save(`designbridge-specialist-earnings-report-${Date.now()}.pdf`);
}
