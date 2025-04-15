
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
    const { fileContent, fileName, sourceType = "file" } = requestData;
    
    if (!fileContent) {
      return new Response(
        JSON.stringify({ error: "Content is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    console.log(`Generating infographic for ${sourceType}: ${fileName}`);
    
    // Process content based on source type
    let processedContent = fileContent;
    let contentTitle = fileName;
    
    // If URL, extract domain as category
    if (sourceType === "url") {
      try {
        const url = new URL(fileContent);
        const domain = url.hostname;
        contentTitle = domain.replace("www.", "");
        console.log(`Processing URL from domain: ${domain}`);
        
        // In a real implementation, we would fetch and extract content from the URL
        // For this demo, we'll simulate URL processing
        processedContent = `Content extracted from ${domain}`;
      } catch (error) {
        console.error("Invalid URL:", error);
      }
    }
    
    // Mock AI processing - in a real implementation, you would use NLP and image recognition
    const contentType = determineContentType(fileName, sourceType);
    const infographicData = generateMockInfographicData(contentType, processedContent);
    
    // Generate a title based on the content type and source
    const title = generateTitle(fileName, sourceType, contentType);
    
    // Return the processed infographic data
    return new Response(
      JSON.stringify({ 
        success: true, 
        infographicData,
        title
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
    
  } catch (error) {
    console.error("Error generating infographic:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

// Determine content type based on filename and source type
function determineContentType(fileName: string, sourceType: string): string {
  if (sourceType === "url") {
    return "website";
  }
  
  if (sourceType === "text") {
    return "blog";
  }
  
  // For files, check extension
  if (fileName.toLowerCase().endsWith('.pdf')) {
    return "research";
  }
  
  return "general";
}

// Generate a title based on the content
function generateTitle(fileName: string, sourceType: string, contentType: string): string {
  if (sourceType === "file") {
    return fileName.split('.')[0] || "Document Summary";
  }
  
  if (sourceType === "url") {
    try {
      const url = new URL(fileName);
      return `${url.hostname.replace("www.", "")} Summary`;
    } catch {
      return "Website Summary";
    }
  }
  
  // For blog text, generate a title based on content type
  const titles = {
    "research": "Research Summary",
    "blog": "Blog Post Summary",
    "website": "Website Summary",
    "general": "Content Summary"
  };
  
  return titles[contentType] || "Content Summary";
}

// Mock function to generate sample infographic data based on content type
function generateMockInfographicData(contentType: string, content: string) {
  const infographicTypes = {
    "research": {
      title: "Research Findings Summary",
      summary: "This research examines key trends and findings in the field, highlighting important discoveries and their potential implications for future study.",
      keyPoints: [
        "Major finding 1: Significant correlation between variables X and Y",
        "Methodology revealed innovative approaches to data collection",
        "Results contradict previous studies in three key areas",
        "Implications suggest a paradigm shift in current theoretical models"
      ],
      stats: [
        { label: "Study Duration (months)", value: 18 },
        { label: "Sample Size", value: 1250 },
        { label: "Success Rate (%)", value: 78 },
        { label: "Confidence Level (%)", value: 95 }
      ]
    },
    "blog": {
      title: "Blog Post Analysis",
      summary: "This blog explores important concepts and provides insights on current trends and best practices in the industry.",
      keyPoints: [
        "The main argument centers on improving productivity through strategic approaches",
        "Case studies demonstrate successful implementation in various contexts",
        "Author provides actionable steps for readers to implement immediately",
        "Contrasting perspectives are analyzed to provide a balanced view"
      ],
      stats: [
        { label: "Reading Time (min)", value: 8 },
        { label: "Key Insights", value: 5 },
        { label: "Actionable Tips", value: 7 },
        { label: "Citation Count", value: 12 }
      ]
    },
    "website": {
      title: "Website Content Overview",
      summary: "This website provides comprehensive information on products, services, and resources for users seeking solutions in this domain.",
      keyPoints: [
        "The platform offers various tools for productivity enhancement",
        "User testimonials highlight significant improvements in workflow",
        "Pricing structure provides options for different user segments",
        "Integration capabilities with other popular platforms"
      ],
      stats: [
        { label: "Features", value: 15 },
        { label: "User Rating", value: 4.7 },
        { label: "Satisfaction (%)", value: 92 },
        { label: "ROI Multiple", value: 3.5 }
      ]
    },
    "general": {
      title: "Content Summary",
      summary: "This content provides valuable information on the subject matter, covering important aspects and considerations for the audience.",
      keyPoints: [
        "Main theme focuses on optimizing processes for better outcomes",
        "Multiple perspectives are presented to provide comprehensive coverage",
        "Practical examples illustrate theoretical concepts effectively",
        "Recommendations are provided based on evidence and best practices"
      ],
      stats: [
        { label: "Key Concepts", value: 6 },
        { label: "Implementation Ideas", value: 8 },
        { label: "Learning Value", value: 4.2 },
        { label: "Relevance Score", value: 8.5 }
      ]
    }
  };
  
  // Customize the data slightly based on the content provided
  const baseData = infographicTypes[contentType] || infographicTypes.general;
  
  // In a real implementation, we would use NLP to analyze the content
  // and generate custom infographic data
  
  return baseData;
}
