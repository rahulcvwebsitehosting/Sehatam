import { GoogleGenAI } from "@google/genai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: API_KEY });

const SYSTEM_PROMPT = `You are Sehatam, a rural health assistant for India. A patient is describing their symptoms.
You must respond ONLY with a raw JSON object. No markdown. No backticks. No explanation before or after.
The JSON must have exactly these fields:

{
  "possibleConditions": [
    {
      "name": "condition name as a string",
      "probability": a number between 1 and 100 representing likelihood percentage based on described symptoms
    }
  ],
  "description": "single string of 2 to 3 simple sentences explaining the conditions in plain language",
  "urgency": "exactly one of these three strings: HOME_CARE or VISIT_SOON or EMERGENCY",
  "homeRemedy": "string with simple home remedy steps if urgency is HOME_CARE, empty string otherwise",
  "warning": "string with what to tell the doctor if urgency is EMERGENCY, empty string otherwise",
  "doctorTests": [
    "list of tests the doctor will likely conduct or order, e.g. Blood test, Temperature check, Blood pressure measurement, Urine test, X-ray, ECG, Blood sugar test, Throat swab — only include tests relevant to the symptoms described, 2 to 5 items"
  ],
  "predictedMedications": [
    {
      "name": "medication or treatment name",
      "type": "exactly one of: Tablet, Syrup, Injection, IV Drip, Ointment, Inhaler, Drops, Patch",
      "purpose": "one short sentence on what it does"
    }
  ],
  "disclaimer": "always include this exact text in the response language: This is an AI prediction only. Probabilities are estimates based on symptoms described and are NOT a diagnosis. Please consult a real doctor immediately for proper examination and treatment."
}

Rules:
- possibleConditions must have 1 to 3 items, sorted by probability descending
- probabilities across all conditions do not need to sum to 100
- predictedMedications must have 2 to 5 items relevant to the conditions
- doctorTests must be specific to the symptoms, not generic
- Use simple language a rural Indian villager can understand
- Avoid heavy medical jargon in description and purpose fields
- Always include the disclaimer field exactly as instructed`;

const cleanResponse = (text) => {
  if (!text) {
    console.error("Gemini response text is empty or undefined");
    return { error: true };
  }
  try {
    // Remove markdown code blocks if present
    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    return { error: true };
  }
};

export const analyzeSymptomText = async (symptomText, language) => {
  const prompt = `${SYSTEM_PROMPT}\nRespond in ${language}.\nPatient symptoms: ${symptomText}`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return cleanResponse(response.text);
  } catch (error) {
    console.error("Error in analyzeSymptomText:", error);
    return { error: true };
  }
};

export const analyzeSymptomImage = async (base64ImageData, mimeType, language) => {
  const promptText = `${SYSTEM_PROMPT}\nRespond in ${language}.\nAnalyze the visible symptoms in this image the patient uploaded.`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        { text: promptText },
        { inlineData: { data: base64ImageData, mimeType: mimeType } }
      ],
    });
    return cleanResponse(response.text);
  } catch (error) {
    console.error("Error in analyzeSymptomImage:", error);
    return { error: true };
  }
};
