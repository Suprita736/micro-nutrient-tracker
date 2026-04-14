import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { UserProfile, nutrients as allNutrientDefinitions, getFoodsForNutrient } from "@/data/nutrients";
import { HistoryEntry } from "@/store/trackingStore";

export const generateNutritionReport = (userProfile: UserProfile | null, history: HistoryEntry[]) => {
  if (!userProfile) return;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let currentY = 20;

  // 1. Title
  doc.setFont("serif", "bold");
  doc.setFontSize(22);
  doc.text("MicroTrack Nutrition Report", 20, currentY);
  
  currentY += 10;
  doc.setFont("sans", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${new Date().toLocaleDateString("en-GB")}`, 20, currentY);

  // 2. User Profile
  currentY += 15;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont("serif", "bold");
  doc.text("User Profile", 20, currentY);
  
  currentY += 4;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(20, currentY, pageWidth - 20, currentY);

  currentY += 10;
  doc.setFont("sans", "normal");
  doc.setFontSize(10);
  // Column 1
  doc.text(`Name: ${userProfile.name}`, 20, currentY);
  doc.text(`Age: ${userProfile.age} years`, 20, currentY + 7);
  // Column 2
  doc.text(`Weight: ${userProfile.weight} kg`, 100, currentY);
  doc.text(`Activity Level: ${userProfile.activityLevel}`, 100, currentY + 7);

  // Filter nutrients (exclude calories)
  const targetNutrients = allNutrientDefinitions.filter(n => n.id !== "calories");

  // --- SECTION 1: LATEST DAY SUMMARY ---
  currentY += 25;
  doc.setFont("serif", "bold");
  doc.setFontSize(14);
  doc.text("Latest Day Summary", 20, currentY);
  
  currentY += 4;
  doc.line(20, currentY, pageWidth - 20, currentY);
  currentY += 6;

  const latestEntry = history[0];
  if (latestEntry) {
    const latestTableData = targetNutrients.map(n => {
      const snap = latestEntry.nutrients[n.id];
      const consumed = snap?.current ?? 0;
      const required = snap?.required ?? 0;
      const pct = required > 0 ? Math.round(Math.min((consumed / required) * 100, 100)) : 0;
      
      return [
        n.name,
        `${formatNum(consumed)}${n.unit}`,
        `${formatNum(required)}${n.unit}`,
        `${pct}%`
      ];
    });

    autoTable(doc, {
      startY: currentY,
      head: [["Nutrient", "Consumed", "Required", "Completion %"]],
      body: latestTableData,
      theme: "striped",
      headStyles: { fillColor: [200, 200, 200], textColor: 0, fontStyle: "bold", font: "sans" },
      bodyStyles: { font: "sans", fontSize: 9 },
      margin: { left: 20, right: 20 }
    });
    
    currentY = (doc as any).lastAutoTable.finalY + 15;
  } else {
    doc.setFont("sans", "italic");
    doc.text("No history available for latest day summary.", 20, currentY);
    currentY += 15;
  }

  // Check for page overflow
  if (currentY > 230) {
    doc.addPage();
    currentY = 20;
  }

  // --- SECTION 2: 14-DAY AVERAGE TREND ---
  doc.setFont("serif", "bold");
  doc.setFontSize(14);
  doc.text("14-Day Average Trend", 20, currentY);
  
  currentY += 4;
  doc.line(20, currentY, pageWidth - 20, currentY);
  currentY += 6;

  const entriesToAnalyze = history.slice(0, 14);
  const avgTableData = targetNutrients.map(n => {
    let totalConsumed = 0;
    let totalRequired = 0;
    let count = 0;

    entriesToAnalyze.forEach(entry => {
      const snap = entry.nutrients[n.id];
      if (snap) {
        totalConsumed += snap.current;
        totalRequired += snap.required;
        count++;
      }
    });

    const avgConsumed = count > 0 ? totalConsumed / count : 0;
    const avgRequired = count > 0 ? totalRequired / count : 0;
    const pct = avgRequired > 0 ? Math.round(Math.min((avgConsumed / avgRequired) * 100, 100)) : 0;

    return [
      n.name,
      `${formatNum(avgConsumed)}${n.unit}`,
      `${formatNum(avgRequired)}${n.unit}`,
      `${pct}%`
    ];
  });

  autoTable(doc, {
    startY: currentY,
    head: [["Nutrient", "Consumed (Avg)", "Required (Avg)", "Completion %"]],
    body: avgTableData,
    theme: "striped",
    headStyles: { fillColor: [200, 200, 200], textColor: 0, fontStyle: "bold", font: "sans" },
    bodyStyles: { font: "sans", fontSize: 9 },
    margin: { left: 20, right: 20 }
  });

  currentY = (doc as any).lastAutoTable.finalY + 20;

  // --- SECTION 3: DEFICIENCY PATTERNS ---
  if (currentY > 240) {
    doc.addPage();
    currentY = 20;
  }
  
  doc.setFont("serif", "bold");
  doc.setFontSize(14);
  doc.text("Deficiency Patterns", 20, currentY);
  
  currentY += 4;
  doc.line(20, currentY, pageWidth - 20, currentY);

  currentY += 10;
  doc.setFont("sans", "normal");
  doc.setFontSize(10);

  let patternFound = false;
  targetNutrients.forEach(n => {
    const historicalPcts = entriesToAnalyze.map(entry => {
      const snap = entry.nutrients[n.id];
      return snap && snap.required > 0 ? (snap.current / snap.required) * 100 : 0;
    });

    const lowDays = historicalPcts.filter(v => v < 80).length;
    if (lowDays >= 4 && historicalPcts.length > 0) {
      patternFound = true;
      
      if (currentY > 270) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFont("sans", "bold");
      doc.text(`${n.name} was below recommended intake on ${lowDays} of last ${historicalPcts.length} tracked days.`, 20, currentY);
      currentY += 6;
      
      doc.setFont("sans", "normal");
      doc.setFontSize(9);
      doc.text("Consider increasing:", 20, currentY);
      currentY += 5;
      
      const suggestions = getFoodsForNutrient(n.id, userProfile.country).slice(0, 3).map(f => f.name).join(", ");
      doc.setFont("sans", "italic");
      doc.text(suggestions || "Relevant nutrient-rich foods.", 25, currentY);
      
      currentY += 12;
      doc.setFontSize(10);
    }
  });

  if (!patternFound) {
    doc.text("No significant deficiency patterns detected in the last 14 days.", 20, currentY);
  }

  doc.save("MicroTrack_Report.pdf");
};

const formatNum = (n: number) => (Number.isInteger(n) ? n : n.toFixed(1));

