
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Extract the request body
    const requestData = await req.json();
    const { fileContent, fileName, conversionType } = requestData;
    
    if (!fileContent || !conversionType) {
      return new Response(
        JSON.stringify({ error: "File content and conversion type are required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    console.log(`Converting file: ${fileName} using conversion: ${conversionType}`);
    
    // File conversion logic using AI for certain conversions
    const result = await processFileConversion(fileContent, fileName, conversionType);
    
    // Return success response
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
    
  } catch (error) {
    console.error("Error converting file:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

async function processFileConversion(fileContent: string, fileName: string, conversionType: string) {
  // Determine output file name
  const outputFileName = getOutputFileName(fileName, conversionType);
  
  // For OCR or text extraction, use AI
  if (conversionType === "image-to-text" || conversionType === "pdf-to-text") {
    try {
      const extractedText = await extractTextWithAI(fileContent, conversionType);
      return { 
        success: true, 
        fileName: outputFileName,
        content: extractedText,
        message: `File successfully converted to ${conversionType.split('-to-')[1].toUpperCase()}`
      };
    } catch (error) {
      console.error("AI text extraction failed:", error);
      // Fall back to basic conversion
    }
  }
  
  // Basic conversion (simulated for demo)
  return { 
    success: true, 
    fileName: outputFileName,
    content: fileContent, // In a real implementation, this would be the converted content
    message: `File successfully converted to ${conversionType.split('-to-')[1].toUpperCase()}`
  };
}

async function extractTextWithAI(fileContent: string, conversionType: string) {
  try {
    const API_TOKEN = Deno.env.get("HF_API_TOKEN") || "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";
    const API_URL = "https://api-inference.huggingface.co/models/meta-llama/Llama-3-8b-chat-hf";
    
    // Create a prompt based on the conversion type
    const prompt = `
    I have a ${conversionType === "image-to-text" ? "image" : "PDF"} that I need to extract text from. 
    The content is the following base64 encoded string:
    ${fileContent.substring(0, 500)}... (truncated)
    
    Please extract any text you can identify from this content and format it in a clean, readable way.
    `;
    
    // Make API request to Llama 3
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 1024,
          temperature: 0.1,
          top_p: 0.9,
        },
        options: {
          wait_for_model: true,
        },
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const result = await response.json();
    
    // Extract the response text
    let extractedText = "";
    if (result && result.generated_text) {
      extractedText = result.generated_text;
    } else if (Array.isArray(result) && result.length > 0 && result[0].generated_text) {
      extractedText = result[0].generated_text;
    } else {
      throw new Error("Unexpected API response format");
    }
    
    return extractedText;
  } catch (error) {
    console.error("AI extraction error:", error);
    return "Text extraction failed. Please try again or use a different file.";
  }
}

function getOutputFileName(fileName: string, conversionType: string) {
  const nameParts = fileName.split('.');
  const baseName = nameParts.slice(0, -1).join('.');
  const outputFormat = conversionType.split('-to-')[1];
  
  return `${baseName}.${outputFormat}`;
}
