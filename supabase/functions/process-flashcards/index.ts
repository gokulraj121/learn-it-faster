
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
    
    // Mock AI processing - in a real implementation, you would use OpenAI or another AI service
    // This simulates extracting Q&A pairs from the document
    const flashcards = generateMockFlashcards(fileName);
    
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

// Mock function to generate sample flashcards for demonstration
function generateMockFlashcards(fileName: string) {
  const topics = [
    "Biology", "Chemistry", "Physics", "Mathematics", 
    "History", "Literature", "Computer Science"
  ];
  
  const selectedTopic = topics[Math.floor(Math.random() * topics.length)];
  
  const flashcardSets = {
    "Biology": [
      { question: "What is photosynthesis?", answer: "The process by which green plants and some other organisms use sunlight to synthesize nutrients from carbon dioxide and water." },
      { question: "What is cellular respiration?", answer: "The process by which cells break down glucose and release energy in the form of ATP." },
      { question: "What is the function of mitochondria?", answer: "Often called the powerhouse of the cell, mitochondria generate most of the cell's supply of ATP, the energy currency of cells." },
      { question: "What is DNA?", answer: "Deoxyribonucleic acid, a self-replicating material present in nearly all living organisms as the main constituent of chromosomes." },
      { question: "What are the four main types of tissue in the human body?", answer: "Epithelial, connective, muscular, and nervous tissue." }
    ],
    "Chemistry": [
      { question: "What is the periodic table?", answer: "A tabular arrangement of chemical elements, organized by atomic number, electron configuration, and recurring chemical properties." },
      { question: "What is an isotope?", answer: "Variants of a particular chemical element which differ in neutron number but have the same number of protons." },
      { question: "What is the pH scale?", answer: "A logarithmic scale used to specify the acidity or basicity of an aqueous solution, ranging from 0 (most acidic) to 14 (most basic)." },
      { question: "What is a catalyst?", answer: "A substance that increases the rate of a chemical reaction without itself undergoing any permanent chemical change." },
      { question: "What is a chemical bond?", answer: "A lasting attraction between atoms, ions or molecules that enables the formation of chemical compounds." }
    ],
    "Physics": [
      { question: "What is Newton's First Law of Motion?", answer: "An object will remain at rest or in uniform motion in a straight line unless acted upon by an external force." },
      { question: "What is the law of conservation of energy?", answer: "Energy can neither be created nor destroyed; rather, it can only be transformed or transferred from one form to another." },
      { question: "What is Ohm's Law?", answer: "The current through a conductor between two points is directly proportional to the voltage across the two points (I = V/R)." },
      { question: "What is quantum mechanics?", answer: "A fundamental theory in physics that provides a description of the physical properties of nature at the scale of atoms and subatomic particles." },
      { question: "What are the three states of matter?", answer: "Solid, liquid, and gas (plasma is sometimes considered the fourth state)." }
    ],
    "Mathematics": [
      { question: "What is the Pythagorean theorem?", answer: "In a right-angled triangle, the square of the length of the hypotenuse equals the sum of squares of the other two sides (a² + b² = c²)." },
      { question: "What is a prime number?", answer: "A natural number greater than 1 that is not a product of two smaller natural numbers." },
      { question: "What is calculus?", answer: "The mathematical study of continuous change, with two major branches: differential calculus and integral calculus." },
      { question: "What is a function in mathematics?", answer: "A relation between a set of inputs and a set of permissible outputs where each input is related to exactly one output." },
      { question: "What is a logarithm?", answer: "The power to which a base must be raised to produce a given number." }
    ],
    "History": [
      { question: "When did World War II end?", answer: "World War II ended in 1945 with the surrender of Germany in May and Japan in September." },
      { question: "Who was the first President of the United States?", answer: "George Washington, who served from 1789 to 1797." },
      { question: "What was the Renaissance?", answer: "A period in European history marking the transition from the Middle Ages to modernity, characterized by an emphasis on art, literature, and learning." },
      { question: "What was the Industrial Revolution?", answer: "The transition to new manufacturing processes in Europe and the United States, in the period from about 1760 to 1840." },
      { question: "What was the Cold War?", answer: "A period of geopolitical tension between the Soviet Union and the United States and their respective allies from 1947 to 1991." }
    ],
    "Literature": [
      { question: "Who wrote 'Romeo and Juliet'?", answer: "William Shakespeare." },
      { question: "What is a metaphor?", answer: "A figure of speech in which a word or phrase is applied to an object or action to which it is not literally applicable." },
      { question: "What is the 'stream of consciousness' technique?", answer: "A narrative mode that seeks to portray an individual's point of view by giving the written equivalent of the character's thought processes." },
      { question: "Who wrote '1984'?", answer: "George Orwell." },
      { question: "What is a protagonist?", answer: "The leading character or one of the major characters in a drama, movie, novel, or other fictional text." }
    ],
    "Computer Science": [
      { question: "What is an algorithm?", answer: "A step-by-step procedure for solving a problem or accomplishing a task." },
      { question: "What is a variable in programming?", answer: "A storage location paired with an associated symbolic name which contains a value." },
      { question: "What is object-oriented programming?", answer: "A programming paradigm based on the concept of 'objects', which can contain data and code: data in the form of fields, and code in the form of procedures." },
      { question: "What is a database?", answer: "An organized collection of data, generally stored and accessed electronically from a computer system." },
      { question: "What is machine learning?", answer: "A field of study that gives computers the ability to learn without being explicitly programmed." }
    ]
  };
  
  return flashcardSets[selectedTopic];
}
