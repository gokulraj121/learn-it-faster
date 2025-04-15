
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
    
    // In a real implementation, you would perform the actual conversion here
    // For demonstration, we'll just simulate a successful conversion
    
    const outputFileName = getOutputFileName(fileName, conversionType);
    
    // Simulate a delay for processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        fileName: outputFileName,
        message: `File successfully converted to ${conversionType.split('-to-')[1].toUpperCase()}`
      }),
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

function getOutputFileName(fileName: string, conversionType: string) {
  const nameParts = fileName.split('.');
  const baseName = nameParts.slice(0, -1).join('.');
  const outputFormat = conversionType.split('-to-')[1];
  
  return `${baseName}.${outputFormat}`;
}
