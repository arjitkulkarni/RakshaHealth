// Sample medical records for demo purposes

export type MedicalRecord = {
  id: string;
  vid: string;
  hospitalName: string;
  hospitalId: string;
  uploadedAt: string;
  fileName: string;
  fileType: string;
  fileDataUrl: string;
};

const hospitals = [
  { name: "Apollo Hospital", id: "APL001" },
  { name: "Fortis Healthcare", id: "FRT002" },
  { name: "Max Hospital", id: "MAX003" },
  { name: "Medanta", id: "MED004" },
  { name: "AIIMS Delhi", id: "AIM005" },
  { name: "Lilavati Hospital", id: "LIL006" },
  { name: "Manipal Hospital", id: "MAN007" },
  { name: "Narayana Health", id: "NAR008" },
];

const recordTemplates = [
  { fileName: "Blood Test Report - Complete Blood Count.pdf", type: "application/pdf", category: "lab" },
  { fileName: "Prescription - Diabetes Medication.pdf", type: "application/pdf", category: "prescription" },
  { fileName: "X-Ray Chest - Routine Checkup.pdf", type: "application/pdf", category: "imaging" },
  { fileName: "Lab Report - Lipid Profile.pdf", type: "application/pdf", category: "lab" },
  { fileName: "Prescription - Hypertension Treatment.pdf", type: "application/pdf", category: "prescription" },
  { fileName: "MRI Scan - Brain.pdf", type: "application/pdf", category: "imaging" },
  { fileName: "Discharge Summary - Post Surgery.pdf", type: "application/pdf", category: "discharge" },
  { fileName: "Vaccination Certificate - COVID-19.pdf", type: "application/pdf", category: "vaccine" },
  { fileName: "ECG Report - Cardiac Screening.pdf", type: "application/pdf", category: "lab" },
  { fileName: "Blood Test - Thyroid Function.pdf", type: "application/pdf", category: "lab" },
  { fileName: "Ultrasound Report - Abdominal.pdf", type: "application/pdf", category: "imaging" },
  { fileName: "Prescription - Antibiotic Course.pdf", type: "application/pdf", category: "prescription" },
  { fileName: "Lab Report - Kidney Function Test.pdf", type: "application/pdf", category: "lab" },
  { fileName: "CT Scan - Chest.pdf", type: "application/pdf", category: "imaging" },
  { fileName: "Vaccination Record - Hepatitis B.pdf", type: "application/pdf", category: "vaccine" },
];

// Generate fake medical data based on category
const generateMedicalData = (category: string, fileName: string): string => {
  const random = (min: number, max: number) => (Math.random() * (max - min) + min).toFixed(2);
  const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);
  
  switch (category) {
    case "lab":
      if (fileName.includes("Complete Blood Count") || fileName.includes("CBC")) {
        return `
COMPLETE BLOOD COUNT (CBC)

Hemoglobin: ${random(12, 16)} g/dL (Normal: 12-16 g/dL)
RBC Count: ${random(4.0, 5.5)} million/mcL (Normal: 4.0-5.5 million/mcL)
WBC Count: ${randomInt(4000, 11000)} cells/mcL (Normal: 4000-11000 cells/mcL)
Platelet Count: ${randomInt(150000, 400000)} /mcL (Normal: 150000-400000 /mcL)
Hematocrit: ${random(36, 46)}% (Normal: 36-46%)
MCV: ${random(80, 100)} fL (Normal: 80-100 fL)
MCH: ${random(27, 33)} pg (Normal: 27-33 pg)
MCHC: ${random(32, 36)} g/dL (Normal: 32-36 g/dL)

Differential Count:
- Neutrophils: ${randomInt(40, 70)}%
- Lymphocytes: ${randomInt(20, 40)}%
- Monocytes: ${randomInt(2, 8)}%
- Eosinophils: ${randomInt(1, 4)}%
- Basophils: ${randomInt(0, 1)}%

Interpretation: All values within normal range. No abnormalities detected.`;
      } else if (fileName.includes("Lipid Profile")) {
        return `
LIPID PROFILE

Total Cholesterol: ${randomInt(150, 220)} mg/dL (Desirable: <200 mg/dL)
LDL Cholesterol: ${randomInt(70, 130)} mg/dL (Optimal: <100 mg/dL)
HDL Cholesterol: ${randomInt(40, 70)} mg/dL (Desirable: >40 mg/dL)
Triglycerides: ${randomInt(80, 180)} mg/dL (Normal: <150 mg/dL)
VLDL Cholesterol: ${randomInt(10, 40)} mg/dL (Normal: 10-40 mg/dL)
TC/HDL Ratio: ${random(3.0, 5.0)} (Optimal: <5.0)
LDL/HDL Ratio: ${random(1.5, 3.5)} (Optimal: <3.5)

Interpretation: Lipid levels are within acceptable range. 
Recommendation: Maintain healthy diet and regular exercise.`;
      } else if (fileName.includes("Thyroid")) {
        return `
THYROID FUNCTION TEST

TSH (Thyroid Stimulating Hormone): ${random(0.5, 4.5)} mIU/L (Normal: 0.5-5.0 mIU/L)
T3 (Triiodothyronine): ${random(80, 180)} ng/dL (Normal: 80-200 ng/dL)
T4 (Thyroxine): ${random(5.0, 12.0)} mcg/dL (Normal: 5.0-12.0 mcg/dL)
Free T3: ${random(2.3, 4.2)} pg/mL (Normal: 2.3-4.2 pg/mL)
Free T4: ${random(0.8, 1.8)} ng/dL (Normal: 0.8-1.8 ng/dL)

Anti-TPO Antibodies: ${random(0, 30)} IU/mL (Normal: <35 IU/mL)

Interpretation: Thyroid function is normal. No signs of hypothyroidism or hyperthyroidism.`;
      } else if (fileName.includes("Kidney Function")) {
        return `
KIDNEY FUNCTION TEST (KFT)

Blood Urea Nitrogen (BUN): ${randomInt(7, 20)} mg/dL (Normal: 7-20 mg/dL)
Serum Creatinine: ${random(0.6, 1.2)} mg/dL (Normal: 0.6-1.2 mg/dL)
Uric Acid: ${random(3.5, 7.0)} mg/dL (Normal: 3.5-7.2 mg/dL)
Sodium (Na+): ${randomInt(135, 145)} mEq/L (Normal: 135-145 mEq/L)
Potassium (K+): ${random(3.5, 5.0)} mEq/L (Normal: 3.5-5.0 mEq/L)
Chloride (Cl-): ${randomInt(96, 106)} mEq/L (Normal: 96-106 mEq/L)
Calcium: ${random(8.5, 10.5)} mg/dL (Normal: 8.5-10.5 mg/dL)
Phosphorus: ${random(2.5, 4.5)} mg/dL (Normal: 2.5-4.5 mg/dL)

eGFR: ${randomInt(90, 120)} mL/min/1.73m² (Normal: >90 mL/min/1.73m²)

Interpretation: Kidney function is normal. All parameters within reference range.`;
      } else if (fileName.includes("ECG")) {
        return `
ELECTROCARDIOGRAM (ECG) REPORT

Heart Rate: ${randomInt(60, 100)} bpm (Normal: 60-100 bpm)
Rhythm: Regular Sinus Rhythm
PR Interval: ${randomInt(120, 200)} ms (Normal: 120-200 ms)
QRS Duration: ${randomInt(80, 120)} ms (Normal: 80-120 ms)
QT Interval: ${randomInt(350, 450)} ms (Normal: 350-450 ms)
QTc (Corrected): ${randomInt(380, 460)} ms (Normal: <460 ms)

Axis: Normal (0° to +90°)
P Wave: Normal morphology
QRS Complex: Normal
T Wave: Normal
ST Segment: No elevation or depression

Interpretation: Normal ECG. No evidence of ischemia, infarction, or arrhythmia.
Recommendation: Continue routine cardiac health monitoring.`;
      }
      return "Lab test results within normal parameters.";
      
    case "prescription":
      if (fileName.includes("Diabetes")) {
        return `
PRESCRIPTION

Patient Diagnosis: Type 2 Diabetes Mellitus

Medications Prescribed:

1. Metformin 500mg
   - Dosage: 1 tablet twice daily (morning and evening)
   - Duration: 30 days
   - Instructions: Take with meals

2. Glimepiride 2mg
   - Dosage: 1 tablet once daily (morning)
   - Duration: 30 days
   - Instructions: Take 30 minutes before breakfast

3. Vitamin B12 1500mcg
   - Dosage: 1 tablet once daily
   - Duration: 30 days
   - Instructions: Take after breakfast

Dietary Recommendations:
- Avoid sugar and refined carbohydrates
- Include whole grains, vegetables, and lean proteins
- Monitor blood glucose levels regularly

Follow-up: Schedule appointment after 30 days for review.`;
      } else if (fileName.includes("Hypertension")) {
        return `
PRESCRIPTION

Patient Diagnosis: Essential Hypertension (Stage 1)

Medications Prescribed:

1. Amlodipine 5mg
   - Dosage: 1 tablet once daily (morning)
   - Duration: 30 days
   - Instructions: Take at the same time each day

2. Telmisartan 40mg
   - Dosage: 1 tablet once daily (evening)
   - Duration: 30 days
   - Instructions: Take with or without food

3. Aspirin 75mg (Low dose)
   - Dosage: 1 tablet once daily (after dinner)
   - Duration: 30 days
   - Instructions: Take with food to avoid gastric irritation

Lifestyle Modifications:
- Reduce salt intake (<5g per day)
- Regular exercise (30 minutes daily)
- Maintain healthy weight
- Limit alcohol consumption
- Monitor blood pressure regularly

Follow-up: Review after 2 weeks to assess response.`;
      } else if (fileName.includes("Antibiotic")) {
        return `
PRESCRIPTION

Patient Diagnosis: Acute Bacterial Infection (Upper Respiratory Tract)

Medications Prescribed:

1. Amoxicillin 500mg
   - Dosage: 1 capsule three times daily
   - Duration: 7 days
   - Instructions: Take with meals, complete full course

2. Azithromycin 250mg
   - Dosage: 1 tablet once daily
   - Duration: 5 days
   - Instructions: Take on empty stomach (1 hour before or 2 hours after meals)

3. Paracetamol 650mg
   - Dosage: 1 tablet as needed for fever (max 3 times daily)
   - Duration: As needed
   - Instructions: Take with water

4. Cetirizine 10mg
   - Dosage: 1 tablet once daily (evening)
   - Duration: 5 days
   - Instructions: For allergic symptoms

General Instructions:
- Complete the full antibiotic course even if symptoms improve
- Stay hydrated
- Get adequate rest
- Avoid cold beverages

Follow-up: If symptoms persist after 5 days, return for review.`;
      }
      return "Prescription details for prescribed medications.";
      
    case "imaging":
      if (fileName.includes("X-Ray")) {
        return `
X-RAY CHEST REPORT

Examination: Chest X-Ray (PA View)
Clinical Indication: Routine health checkup

Findings:
- Heart size: Normal (Cardiothoracic ratio: ${random(0.45, 0.50)})
- Lung fields: Clear, no infiltrates or consolidation
- Costophrenic angles: Sharp bilaterally
- Mediastinum: Normal width and contour
- Trachea: Central
- Bones: No fractures or abnormalities detected
- Soft tissues: Normal

Impression:
Normal chest X-ray. No active cardiopulmonary disease.
Lungs are clear with no evidence of infection, mass, or fluid collection.

Recommendation: No immediate follow-up required. Continue routine health monitoring.`;
      } else if (fileName.includes("MRI")) {
        return `
MRI BRAIN REPORT

Examination: MRI Brain with contrast
Clinical Indication: Routine neurological assessment

Technique: Multiplanar T1, T2, FLAIR, and DWI sequences

Findings:
- Brain parenchyma: Normal signal intensity, no focal lesions
- Ventricles: Normal size and configuration
- Cerebellum: Normal
- Brainstem: Normal
- Gray-white matter differentiation: Preserved
- No evidence of hemorrhage, infarction, or mass effect
- Cerebral sulci and cisterns: Normal
- No abnormal enhancement post-contrast
- Major intracranial vessels: Patent, no aneurysm

Impression:
Normal MRI brain study. No acute intracranial abnormality.
No evidence of stroke, tumor, or demyelinating disease.

Recommendation: No immediate intervention required.`;
      } else if (fileName.includes("CT Scan")) {
        return `
CT SCAN CHEST REPORT

Examination: CT Chest with IV contrast
Clinical Indication: Evaluation of chest symptoms

Findings:
- Lungs: Clear, no nodules or masses
- Airways: Patent, no obstruction
- Pleura: No effusion or thickening
- Mediastinum: Normal lymph nodes (<10mm)
- Heart: Normal size
- Great vessels: Normal caliber, no aneurysm
- Chest wall: Intact, no abnormalities
- Bones: No lytic or blastic lesions

Impression:
Normal CT chest examination.
No evidence of pulmonary embolism, pneumonia, or malignancy.

Recommendation: Routine follow-up as clinically indicated.`;
      } else if (fileName.includes("Ultrasound")) {
        return `
ULTRASOUND ABDOMEN REPORT

Examination: Ultrasound Abdomen (Complete)
Clinical Indication: Abdominal pain evaluation

Findings:
- Liver: Normal size (${random(13, 15)} cm), homogeneous echotexture, no focal lesions
- Gallbladder: Normal, no stones or wall thickening
- Pancreas: Normal size and echogenicity
- Spleen: Normal size (${random(9, 11)} cm)
- Kidneys: 
  * Right: ${random(9.5, 11)} cm, normal cortical thickness
  * Left: ${random(9.5, 11)} cm, normal cortical thickness
  * No stones or hydronephrosis
- Urinary bladder: Normal, well-distended
- No free fluid in abdomen
- Aorta: Normal caliber

Impression:
Normal ultrasound abdomen study.
No evidence of stones, masses, or organomegaly.

Recommendation: Clinical correlation advised.`;
      }
      return "Imaging study shows normal findings.";
      
    case "discharge":
      return `
DISCHARGE SUMMARY

Admission Date: ${new Date(Date.now() - randomInt(3, 7) * 24 * 60 * 60 * 1000).toLocaleDateString()}
Discharge Date: ${new Date().toLocaleDateString()}

Diagnosis: Post-operative recovery (Laparoscopic Cholecystectomy)

Hospital Course:
Patient was admitted for elective laparoscopic cholecystectomy for symptomatic cholelithiasis.
Surgery was performed successfully without complications. Post-operative recovery was uneventful.
Patient tolerated oral diet well and pain was managed effectively.

Vital Signs at Discharge:
- Blood Pressure: ${randomInt(110, 130)}/${randomInt(70, 85)} mmHg
- Heart Rate: ${randomInt(70, 85)} bpm
- Temperature: ${random(97.5, 98.6)}°F
- Respiratory Rate: ${randomInt(14, 18)} breaths/min

Discharge Medications:
1. Paracetamol 650mg - As needed for pain
2. Pantoprazole 40mg - Once daily for 2 weeks
3. Antibiotic (as prescribed) - Complete course

Discharge Instructions:
- Keep surgical site clean and dry
- Avoid heavy lifting for 2 weeks
- Resume normal diet gradually
- Follow-up in 1 week for wound check
- Return immediately if fever, severe pain, or wound discharge

Condition at Discharge: Stable and improved

Follow-up: Outpatient clinic in 7 days`;
      
    case "vaccine":
      if (fileName.includes("COVID-19")) {
        return `
VACCINATION CERTIFICATE

Vaccine Name: COVISHIELD (ChAdOx1 nCoV-19)
Manufacturer: Serum Institute of India

Dose 1:
- Date: ${new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toLocaleDateString()}
- Batch Number: 4120Z${randomInt(100, 999)}
- Vaccination Center: ${hospitals[randomInt(0, hospitals.length - 1)].name}

Dose 2:
- Date: ${new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toLocaleDateString()}
- Batch Number: 4121Z${randomInt(100, 999)}
- Vaccination Center: ${hospitals[randomInt(0, hospitals.length - 1)].name}

Booster Dose:
- Date: ${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
- Batch Number: 4122Z${randomInt(100, 999)}
- Vaccination Center: ${hospitals[randomInt(0, hospitals.length - 1)].name}

This certificate is valid for international travel and official purposes.

Vaccinated against: COVID-19 (SARS-CoV-2)
Vaccination Status: Fully Vaccinated with Booster`;
      } else if (fileName.includes("Hepatitis B")) {
        return `
VACCINATION CERTIFICATE

Vaccine Name: Hepatitis B Vaccine (Recombinant)
Manufacturer: Bharat Biotech

Vaccination Schedule (3-dose series):

Dose 1:
- Date: ${new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toLocaleDateString()}
- Batch Number: HBV${randomInt(1000, 9999)}
- Site: Left deltoid

Dose 2:
- Date: ${new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toLocaleDateString()}
- Batch Number: HBV${randomInt(1000, 9999)}
- Site: Left deltoid

Dose 3:
- Date: ${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
- Batch Number: HBV${randomInt(1000, 9999)}
- Site: Left deltoid

Vaccination Status: Complete (3/3 doses)
Next Booster: Not required (lifetime immunity expected)

This certificate confirms completion of Hepatitis B vaccination series.`;
      }
      return "Vaccination record details.";
      
    default:
      return "Medical record details.";
  }
};

// Generate a detailed PDF data URL with medical data
const generatePDFDataUrl = (fileName: string, hospitalName: string, date: string, category: string): string => {
  const medicalData = generateMedicalData(category, fileName);
  
  // Create a simple HTML-based representation that can be converted to PDF
  // For demo purposes, we'll create a text-based PDF with proper formatting
  const lines = medicalData.split('\n').filter(line => line.trim());
  
  // Build PDF content with proper escaping
  let yPosition = 700;
  let contentLines = '';
  
  // Add header
  contentLines += `BT\n`;
  contentLines += `/F1 20 Tf\n`;
  contentLines += `50 ${yPosition} Td\n`;
  contentLines += `(MEDICAL RECORD) Tj\n`;
  yPosition -= 30;
  
  contentLines += `/F1 11 Tf\n`;
  contentLines += `0 -30 Td\n`;
  contentLines += `(Document: ${fileName.replace('.pdf', '').replace(/[()]/g, '')}) Tj\n`;
  contentLines += `0 -15 Td\n`;
  contentLines += `(Hospital: ${hospitalName.replace(/[()]/g, '')}) Tj\n`;
  contentLines += `0 -15 Td\n`;
  contentLines += `(Date: ${date}) Tj\n`;
  contentLines += `0 -25 Td\n`;
  
  // Add medical data content
  contentLines += `/F2 9 Tf\n`;
  
  lines.forEach((line, index) => {
    const cleanLine = line.trim().replace(/[()\\]/g, ' ').substring(0, 80); // Limit line length and remove special chars
    if (cleanLine && index < 40) { // Limit to 40 lines to fit on one page
      contentLines += `(${cleanLine}) Tj\n`;
      contentLines += `0 -13 Td\n`;
    }
  });
  
  contentLines += `ET\n`;
  
  // Calculate content length
  const contentLength = contentLines.length;
  
  // Build complete PDF
  const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> /F2 << /Type /Font /Subtype /Type1 /BaseFont /Courier >> >> >> >>
endobj
4 0 obj
<< /Length ${contentLength} >>
stream
${contentLines}endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000366 00000 n 
trailer
<< /Size 5 /Root 1 0 R >>
startxref
${466 + contentLength}
%%EOF`;
  
  // Properly encode to base64
  try {
    return `data:application/pdf;base64,${btoa(unescape(encodeURIComponent(pdfContent)))}`;
  } catch (e) {
    // Fallback: use simpler encoding
    return `data:application/pdf;base64,${btoa(pdfContent)}`;
  }
};

export const generateSampleRecords = (vid: string, count: number = 8): MedicalRecord[] => {
  const records: MedicalRecord[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const hospital = hospitals[Math.floor(Math.random() * hospitals.length)];
    const template = recordTemplates[Math.floor(Math.random() * recordTemplates.length)];
    
    // Generate dates from the last 6 months
    const daysAgo = Math.floor(Math.random() * 180);
    const uploadDate = new Date(now);
    uploadDate.setDate(uploadDate.getDate() - daysAgo);
    
    const record: MedicalRecord = {
      id: `record_${Date.now()}_${i}`,
      vid: vid,
      hospitalName: hospital.name,
      hospitalId: hospital.id,
      uploadedAt: uploadDate.toISOString(),
      fileName: template.fileName,
      fileType: template.type,
      fileDataUrl: generatePDFDataUrl(
        template.fileName, 
        hospital.name, 
        uploadDate.toLocaleDateString('en-IN'),
        template.category
      ),
    };
    
    records.push(record);
  }
  
  return records;
};

export const seedSampleRecords = (vid: string): void => {
  const STORAGE_KEY = "medination_records_by_vid";
  
  try {
    const index = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    
    // Check if user already has records
    if (index[vid] && index[vid].length > 0) {
      console.log("User already has records, skipping seed");
      return;
    }
    
    // Generate sample records
    const sampleRecords = generateSampleRecords(vid, 8);
    
    // Store in localStorage
    index[vid] = sampleRecords;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(index));
    
    console.log(`Seeded ${sampleRecords.length} sample records for VID: ${vid}`);
  } catch (error) {
    console.error("Error seeding sample records:", error);
  }
};

export const addSampleRecordsIfEmpty = (vid: string): boolean => {
  const STORAGE_KEY = "medination_records_by_vid";
  
  try {
    const index = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const existingRecords = index[vid] || [];
    
    if (existingRecords.length === 0) {
      seedSampleRecords(vid);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error checking/adding sample records:", error);
    return false;
  }
};
