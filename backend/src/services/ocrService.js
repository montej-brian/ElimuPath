const { GoogleGenerativeAI } = require('@google/generative-ai');

const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_KEY || process.env.GEMINI_API_KEY;

const EXTRACTION_PROMPT = `You are a KCSE (Kenya Certificate of Secondary Education) result slip parser.
Analyze this image of a KCSE result slip / certificate and extract:

1. **subjects**: An object where keys are subject codes and values are letter grades.
   Use these standard codes: MAT (Mathematics), ENG (English), KIS (Kiswahili), 
   BIO (Biology), CHE (Chemistry), PHY (Physics), HIS (History), GEO (Geography), 
   CRE (CRE/IRE), AGR (Agriculture), BST (Business Studies), CSC (Computer Studies),
   FRE (French), GER (German), ARA (Arabic), MUS (Music), ART (Art & Design),
   HEC (Home Science), AVT (Aviation), PWR (Power Mechanics), WDW (Woodwork),
   MTW (Metalwork), BLD (Building Construction), ELC (Electricity).

2. **meanGrade**: The overall mean grade (e.g. "B+", "C", "A-").

3. **aggregatePoints**: The total/overall aggregate points (an integer 0-84). 
   This is often printed as "Total Points", "Aggregate Points", "Overall Points", 
   or simply a number next to the mean grade.

Return ONLY a valid JSON object in this exact format (no markdown, no code fences):
{
  "subjects": { "MAT": "B+", "ENG": "A-", ... },
  "meanGrade": "B+",
  "aggregatePoints": 62,
  "confidence": 0.95
}

If you cannot read certain fields, set "confidence" lower and include what you can read.
If you absolutely cannot parse any subjects, return:
{ "subjects": {}, "meanGrade": null, "aggregatePoints": null, "confidence": 0 }
`;

async function parseResultSlip(imageBuffer, mimeType) {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured. Set GOOGLE_GEMINI_KEY or GEMINI_API_KEY in .env');
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const imagePart = {
    inlineData: {
      data: imageBuffer.toString('base64'),
      mimeType: mimeType || 'image/jpeg',
    },
  };

  const result = await model.generateContent([EXTRACTION_PROMPT, imagePart]);
  const response = await result.response;
  let text = response.text().trim();

  // Strip markdown code fences if present
  text = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '');

  try {
    const parsed = JSON.parse(text);
    
    // Validate structure
    if (!parsed.subjects || typeof parsed.subjects !== 'object') {
      parsed.subjects = {};
    }
    if (parsed.aggregatePoints !== null && parsed.aggregatePoints !== undefined) {
      parsed.aggregatePoints = parseInt(parsed.aggregatePoints, 10);
      if (isNaN(parsed.aggregatePoints) || parsed.aggregatePoints < 0 || parsed.aggregatePoints > 84) {
        parsed.aggregatePoints = null;
      }
    }
    if (typeof parsed.confidence !== 'number') {
      parsed.confidence = 0.5;
    }

    return parsed;
  } catch (parseErr) {
    console.error('Failed to parse Gemini OCR response:', text);
    throw new Error('OCR processing failed: Could not parse AI response');
  }
}

module.exports = { parseResultSlip };
