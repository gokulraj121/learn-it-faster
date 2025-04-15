
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
    const { fileContent, fileName } = requestData;
    
    if (!fileContent) {
      return new Response(
        JSON.stringify({ error: "File content is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    console.log(`Generating infographic for file: ${fileName}`);
    
    // Mock AI processing - in a real implementation, you would use an AI service
    // This simulates extracting data for an infographic from the document
    const infographicData = generateMockInfographicData(fileName);
    
    // Return the processed infographic data
    return new Response(
      JSON.stringify({ 
        success: true, 
        infographicData,
        title: fileName?.split('.')[0] || "Document Summary"
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

// Mock function to generate sample infographic data for demonstration
function generateMockInfographicData(fileName: string) {
  const topics = [
    "Climate Change Report", 
    "Business Analysis", 
    "Healthcare Study",
    "Education Statistics",
    "Technology Trends"
  ];
  
  const selectedTopic = topics[Math.floor(Math.random() * topics.length)];
  
  const infographicDataSets = {
    "Climate Change Report": {
      title: "Climate Change Impact Report",
      summary: "This report analyzes the potential impacts of climate change on global ecosystems over the next century, with a focus on vulnerable regions.",
      keyPoints: [
        "Global temperatures are projected to rise by 1.5-4.5°C by 2100",
        "Sea levels may rise by up to 1 meter, affecting coastal communities",
        "Extreme weather events will become more frequent and intense",
        "Biodiversity loss will accelerate, with up to 30% of species at risk"
      ],
      stats: [
        { label: "Temperature Increase (°C)", value: 2.7 },
        { label: "Sea Level Rise (cm)", value: 50 },
        { label: "Species at Risk (%)", value: 30 },
        { label: "Economic Impact ($ Trillion)", value: 5.4 }
      ]
    },
    "Business Analysis": {
      title: "Annual Business Performance Summary",
      summary: "Overview of key business metrics and performance indicators for the fiscal year, highlighting growth areas and challenges.",
      keyPoints: [
        "Revenue increased by 15% compared to previous year",
        "Customer acquisition costs decreased by 7%",
        "New market expansion achieved in 3 countries",
        "Product line diversification led to 22% more SKUs"
      ],
      stats: [
        { label: "Revenue Growth (%)", value: 15 },
        { label: "Profit Margin (%)", value: 23 },
        { label: "Customer Retention (%)", value: 84 },
        { label: "Market Share (%)", value: 12 }
      ]
    },
    "Healthcare Study": {
      title: "Healthcare Accessibility Report",
      summary: "Analysis of healthcare accessibility across different demographics and regions, with recommendations for policy improvements.",
      keyPoints: [
        "Rural areas have 35% less access to specialized care",
        "Telehealth adoption increased by 280% over the past year",
        "Preventive care initiatives reduced hospitalizations by 12%",
        "Medical costs remain the leading cause of personal bankruptcy"
      ],
      stats: [
        { label: "Telehealth Adoption (%)", value: 280 },
        { label: "Uninsured Population (%)", value: 9.2 },
        { label: "Prevention Savings ($B)", value: 25 },
        { label: "Life Expectancy (Years)", value: 78.6 }
      ]
    },
    "Education Statistics": {
      title: "National Education Performance Data",
      summary: "Comprehensive analysis of educational outcomes and trends across different age groups, regions, and socioeconomic backgrounds.",
      keyPoints: [
        "High school graduation rates increased to 86% nationally",
        "STEM education enrollment grew by 14% in the past five years",
        "Student debt average reached $37,500 per graduate",
        "Online learning platforms saw 340% growth in users"
      ],
      stats: [
        { label: "Graduation Rate (%)", value: 86 },
        { label: "STEM Growth (%)", value: 14 },
        { label: "Avg. Student Debt ($K)", value: 37.5 },
        { label: "Teacher-Student Ratio", value: 1.24 }
      ]
    },
    "Technology Trends": {
      title: "Emerging Technology Landscape",
      summary: "Analysis of current technology trends and adoption rates across industries, with forecasts for the upcoming year.",
      keyPoints: [
        "AI implementation increased by 63% across enterprise businesses",
        "Quantum computing research funding doubled to $2.5 billion",
        "Cybersecurity incidents rose by 32% compared to previous year",
        "Renewable energy tech saw cost reductions of 21% on average"
      ],
      stats: [
        { label: "AI Adoption Growth (%)", value: 63 },
        { label: "5G Coverage (%)", value: 42 },
        { label: "Cybersecurity Breaches (%)", value: 32 },
        { label: "Cloud Migration (%)", value: 78 }
      ]
    }
  };
  
  return infographicDataSets[selectedTopic];
}
