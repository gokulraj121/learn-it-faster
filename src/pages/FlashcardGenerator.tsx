
import { useState } from "react";
import { ChevronLeft, Download, FileText, Copy, RotateCw } from "lucide-react";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Flashcard {
  question: string;
  answer: string;
}

const mockFlashcards: Flashcard[] = [
  {
    question: "What is the law of conservation of energy?",
    answer: "Energy cannot be created or destroyed, only transformed from one form to another."
  },
  {
    question: "What is the capital of France?",
    answer: "Paris is the capital city of France."
  },
  {
    question: "What is photosynthesis?",
    answer: "The process by which green plants and some other organisms use sunlight to synthesize nutrients from carbon dioxide and water."
  }
];

export default function FlashcardGenerator() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [flipped, setFlipped] = useState(false);
  
  const handleFileUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
    setFlashcards([]);
    setActiveCard(null);
  };
  
  const generateFlashcards = () => {
    setLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setFlashcards(mockFlashcards);
      setLoading(false);
      setActiveCard(0);
    }, 2000);
  };
  
  const handleCardClick = (index: number) => {
    setActiveCard(index);
    setFlipped(false);
  };
  
  const downloadAsTxt = () => {
    if (flashcards.length === 0) return;
    
    const content = flashcards.map((card, index) => (
      `Card ${index + 1}:\nQ: ${card.question}\nA: ${card.answer}\n\n`
    )).join("");
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flashcards.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="min-h-screen p-6 md:p-10 max-w-6xl mx-auto">
      <div className="mb-10">
        <Link to="/" className="flex items-center text-muted-foreground hover:text-primary transition-colors gap-1 mb-6">
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">🧠 Flashcard Generator</h1>
        <p className="text-muted-foreground">Upload a PDF file and generate study flashcards from its contents</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4">Upload Your PDF</h2>
            <FileUpload 
              acceptedTypes=".pdf" 
              onFileUpload={handleFileUpload} 
              label="Upload PDF Document"
            />
            
            <div className="mt-6">
              <Button 
                className="w-full" 
                disabled={!file || loading}
                onClick={generateFlashcards}
              >
                {loading ? (
                  <>
                    <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating Flashcards...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Flashcards
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {flashcards.length > 0 && (
            <div className="glass-card p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Download Options</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={downloadAsTxt}>
                    <Download className="mr-2 h-4 w-4" />
                    TXT
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => {}}>
                    <Download className="mr-2 h-4 w-4" />
                    PDF
                  </Button>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Generated {flashcards.length} flashcards from {file?.name}</p>
              </div>
            </div>
          )}
        </div>
        
        <div>
          {flashcards.length > 0 ? (
            <div className="space-y-6">
              <div 
                className={`glass-card aspect-[4/3] relative ${flipped ? 'bg-accent/10' : 'bg-white/5'} cursor-pointer transition-all duration-300`}
                onClick={() => setFlipped(!flipped)}
              >
                <div className="absolute inset-0 p-8 flex flex-col justify-center items-center text-center">
                  <div className="w-full h-full flex items-center justify-center">
                    {!flipped ? (
                      <>
                        <span className="absolute top-3 left-3 text-xs text-muted-foreground">Question</span>
                        <h3 className="text-xl font-medium">{flashcards[activeCard ?? 0]?.question}</h3>
                      </>
                    ) : (
                      <>
                        <span className="absolute top-3 left-3 text-xs text-muted-foreground">Answer</span>
                        <p>{flashcards[activeCard ?? 0]?.answer}</p>
                      </>
                    )}
                  </div>
                  <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                    Click to flip
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                {flashcards.map((_, index) => (
                  <Button
                    key={index}
                    variant={activeCard === index ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCardClick(index)}
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="glass-card p-8 h-[400px] flex flex-col items-center justify-center text-center">
              <FileText className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No Flashcards Yet</h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-xs">
                Upload a PDF document and generate flashcards to see them here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
