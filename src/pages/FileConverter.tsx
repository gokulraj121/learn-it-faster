
import { useState } from "react";
import { ChevronLeft, Download, FileIcon, RotateCw, ArrowDownUp } from "lucide-react";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

type ConversionType = "pdf-to-word" | "word-to-pdf" | "jpg-to-png" | "png-to-jpg" | "pdf-to-text" | "image-to-text";

interface ConversionOption {
  id: ConversionType;
  label: string;
  acceptedTypes: string;
  outputFormat: string;
}

const conversionOptions: ConversionOption[] = [
  { id: "pdf-to-word", label: "PDF to Word", acceptedTypes: ".pdf", outputFormat: "DOCX" },
  { id: "word-to-pdf", label: "Word to PDF", acceptedTypes: ".doc,.docx", outputFormat: "PDF" },
  { id: "jpg-to-png", label: "JPG to PNG", acceptedTypes: ".jpg,.jpeg", outputFormat: "PNG" },
  { id: "png-to-jpg", label: "PNG to JPG", acceptedTypes: ".png", outputFormat: "JPG" },
  { id: "pdf-to-text", label: "PDF to Text", acceptedTypes: ".pdf", outputFormat: "TXT" },
  { id: "image-to-text", label: "Image to Text (OCR)", acceptedTypes: ".jpg,.jpeg,.png", outputFormat: "TXT" },
];

export default function FileConverter() {
  const [conversionType, setConversionType] = useState<ConversionType>("pdf-to-word");
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [converted, setConverted] = useState(false);
  const [outputFileName, setOutputFileName] = useState<string | null>(null);
  const [convertedContent, setConvertedContent] = useState<string | null>(null);
  const [contentType, setContentType] = useState<string | null>(null);
  const { toast } = useToast();
  
  const currentOption = conversionOptions.find(option => option.id === conversionType);
  
  const handleFileUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setConverted(false);
    setOutputFileName(null);
    setConvertedContent(null);
    setContentType(null);
    
    // Read file content as base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFileContent(content);
    };
    
    // Handle different file types appropriately
    if (conversionType.includes("pdf") || conversionType.includes("image")) {
      reader.readAsDataURL(uploadedFile); // Read as base64 for binary files
    } else {
      reader.readAsText(uploadedFile); // Read as text for text-based files
    }
  };
  
  const handleConvert = async () => {
    if (!file || !fileContent) return;
    
    setLoading(true);
    
    try {
      // Call Supabase Edge Function to convert the file
      const { data, error } = await supabase.functions.invoke('convert-file', {
        body: {
          fileContent,
          fileName: file.name,
          conversionType
        }
      });
      
      if (error) throw error;
      
      setConverted(true);
      setOutputFileName(data.fileName);
      setConvertedContent(data.content);
      setContentType(data.contentType || "application/octet-stream");
      
      toast({
        title: "File converted",
        description: data.message,
      });
      
    } catch (error: any) {
      console.error("Error converting file:", error);
      toast({
        title: "Error converting file",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const downloadResult = () => {
    if (!converted || !outputFileName || !convertedContent) return;
    
    // Create the appropriate content for the file based on the conversion type
    let content: string | Uint8Array = convertedContent;
    let mimeType = contentType || "application/octet-stream";
    
    // For text-based outputs, use the content directly
    if (mimeType.startsWith("text/") || mimeType.includes("word") || mimeType.includes("document")) {
      content = convertedContent;
    } 
    // For binary outputs (like images), try to handle the base64 data
    else if (convertedContent.startsWith("data:")) {
      // Handle data URLs
      const base64Content = convertedContent.split(',')[1];
      content = Uint8Array.from(atob(base64Content), c => c.charCodeAt(0));
    } 
    // For base64 encoded content without data URL prefix
    else if (/^[A-Za-z0-9+/=]+$/.test(convertedContent.slice(0, 100))) {
      try {
        content = Uint8Array.from(atob(convertedContent), c => c.charCodeAt(0));
      } catch (e) {
        console.error("Failed to decode base64:", e);
        // Fallback to text
        content = convertedContent;
        mimeType = "text/plain";
      }
    }
    
    // Create a blob with the content
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const a = document.createElement('a');
    a.href = url;
    a.download = outputFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "File downloaded",
      description: `${outputFileName} has been downloaded`,
    });
  };
  
  return (
    <div className="min-h-screen p-6 pt-24 md:p-10 md:pt-28 max-w-6xl mx-auto">
      <Navbar />
      
      <div className="mb-10">
        <Link to="/" className="flex items-center text-muted-foreground hover:text-primary transition-colors gap-1 mb-6">
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">🔁 File Converter</h1>
        <p className="text-muted-foreground">Convert between various file formats with just a few clicks</p>
      </div>
      
      <div className="glass-card p-8 max-w-xl mx-auto">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Conversion Type</h2>
          <Select 
            value={conversionType} 
            onValueChange={(value) => {
              setConversionType(value as ConversionType);
              setFile(null);
              setConverted(false);
              setOutputFileName(null);
              setConvertedContent(null);
              setContentType(null);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select conversion type" />
            </SelectTrigger>
            <SelectContent>
              {conversionOptions.map(option => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Upload Your File</h2>
          <FileUpload
            acceptedTypes={currentOption?.acceptedTypes || ""}
            onFileUpload={handleFileUpload}
            label={`Upload ${currentOption?.acceptedTypes.replace(/\./g, '').toUpperCase()} File`}
          />
        </div>
        
        {file && (
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center gap-4 w-full mb-8">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-2">
                  <FileIcon className="h-8 w-8 text-primary/80" />
                </div>
                <p className="text-xs text-muted-foreground">{file.name.split('.').pop()?.toUpperCase()}</p>
              </div>
              
              <ArrowDownUp className="h-6 w-6 text-muted-foreground rotate-90" />
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-2">
                  <FileIcon className="h-8 w-8 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground">{currentOption?.outputFormat}</p>
              </div>
            </div>
            
            {!converted ? (
              <Button
                disabled={loading}
                onClick={handleConvert}
                className="w-full"
              >
                {loading ? (
                  <>
                    <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                    Converting...
                  </>
                ) : (
                  "Convert File"
                )}
              </Button>
            ) : (
              <Button
                variant="default"
                onClick={downloadResult}
                className="w-full"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Converted File
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
