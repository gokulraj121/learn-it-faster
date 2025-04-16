
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
    
    console.log(`Processing flashcards for file: ${fileName}`);
    
    // Use Llama 3 AI to generate flashcards
    const flashcards = await generateFlashcardsWithAI(fileContent, fileName);
    
    // Return the processed flashcards
    return new Response(
      JSON.stringify({ 
        success: true, 
        flashcards,
        title: fileName?.split('.')[0] || "Study Notes"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
    
  } catch (error) {
    console.error("Error processing flashcards:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

async function generateFlashcardsWithAI(content: string, fileName: string) {
  try {
    const API_TOKEN = Deno.env.get("HF_API_TOKEN") || "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";
    const API_URL = "https://api-inference.huggingface.co/models/meta-llama/Llama-3-8b-chat-hf";
    
    // Extract actual content from base64 if needed
    let processedContent = content;
    if (content.startsWith('data:')) {
      // For PDFs and images in base64 format, we send the raw base64
      processedContent = content;
    }
    
    // Prepare the prompt for flashcard generation
    const prompt = `
    I have the following document content:
    ---
    ${processedContent.substring(0, 4000)} ${processedContent.length > 4000 ? '...(truncated)' : ''}
    ---
    
    Please create 10 useful flashcards from this content. Each flashcard should have a specific question and a comprehensive answer that helps with studying this material.
    
    The questions should cover key concepts, definitions, facts, and important points from the content.
    The answers should be detailed but concise, complete sentences that fully address the question.
    
    Format the response as a JSON array with objects that have "question" and "answer" properties. ONLY return the JSON array without any other text.
    
    Example format:
    [
      {
        "question": "What is the capital of France?",
        "answer": "The capital of France is Paris."
      },
      {
        "question": "When did World War II end?",
        "answer": "World War II ended in 1945 with the surrender of Germany in May and Japan in September."
      }
    ]
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
          max_new_tokens: 2000,
          temperature: 0.2,
          top_p: 0.95,
          do_sample: true,
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
    console.log("Raw AI response:", result);
    
    let flashcardContent = "";
    
    // Extract the response content
    if (result && result.generated_text) {
      flashcardContent = result.generated_text;
    } else if (Array.isArray(result) && result.length > 0 && result[0].generated_text) {
      flashcardContent = result[0].generated_text;
    } else {
      throw new Error("Unexpected API response format");
    }
    
    // Try to extract JSON from the response
    const jsonMatch = flashcardContent.match(/\[[\s\S]*\]/);
    let flashcards = [];
    
    if (jsonMatch) {
      try {
        flashcards = JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.error("Failed to parse JSON from response:", e);
      }
    }
    
    // If parsing failed or no JSON was found, use fallback parsing
    if (!flashcards.length) {
      console.log("Using fallback parsing for flashcards");
      
      // Simple fallback: look for patterns like "Question: X, Answer: Y"
      const lines = flashcardContent.split('\n');
      let currentQuestion = null;
      
      for (const line of lines) {
        if (line.toLowerCase().startsWith('question:') || line.match(/^\d+\.\s*q:/i)) {
          if (currentQuestion && currentQuestion.answer) {
            flashcards.push(currentQuestion);
          }
          currentQuestion = { 
            question: line.replace(/^(?:\d+\.\s*)?(?:question:|\s*q:)\s*/i, '').trim(),
            answer: ''
          };
        } else if (currentQuestion && (line.toLowerCase().startsWith('answer:') || line.match(/^a:/i))) {
          currentQuestion.answer = line.replace(/^(?:answer:|\s*a:)\s*/i, '').trim();
        } else if (currentQuestion && currentQuestion.question && !currentQuestion.answer) {
          currentQuestion.answer = line.trim();
        }
      }
      
      if (currentQuestion && currentQuestion.answer) {
        flashcards.push(currentQuestion);
      }
    }
    
    // If we still couldn't parse flashcards, generate from the content directly
    if (!flashcards.length) {
      console.warn("Couldn't parse flashcards from AI response, generating manually");
      
      const sentences = processedContent
        .replace(/\n/g, ' ')
        .replace(/\s+/g, ' ')
        .split(/[.!?]+/)
        .filter(s => s.trim().length > 20)
        .slice(0, 10);
      
      flashcards = sentences.map((sentence, index) => {
        const cleanSentence = sentence.trim();
        const words = cleanSentence.split(' ');
        
        if (words.length < 5) return null;
        
        // Create a question by removing a key word or phrase
        const keyWordIndex = Math.floor(words.length / 2);
        const keyWord = words[keyWordIndex];
        
        const question = cleanSentence.replace(keyWord, "________");
        
        return {
          question: `What word or phrase fits in the blank? "${question}"`,
          answer: keyWord
        };
      }).filter(Boolean);
    }
    
    return flashcards;
  } catch (error) {
    console.error("AI processing error:", error);
    throw new Error("Failed to generate flashcards. Please try again with a different file.");
  }
}
