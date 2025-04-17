
import { useState } from "react";
import { ChevronLeft, Download, FileIcon, RotateCw, ArrowDownUp } from "lucide-react";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
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
  const [loading, setLoading] = useState(false);
  const [converted, setConverted] = useState(false);
  const [outputFileName, setOutputFileName] = useState<string | null>(null);
  const [convertedContent, setConvertedContent] = useState<string | null>(null);
  const { toast } = useToast();
  
  const currentOption = conversionOptions.find(option => option.id === conversionType);
  
  const handleFileUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setConverted(false);
    setOutputFileName(null);
    setConvertedContent(null);
  };
  
  const handleConvert = async () => {
    if (!file) return;
    
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('sourceFormat', conversionType.split('-to-')[0]);
      formData.append('targetFormat', conversionType.split('-to-')[1]);
      
      const response = await fetch('/api/converter/convert-file', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Conversion failed');
      }
      
      // Get output filename from response headers if available
      const contentDisposition = response.headers.get('Content-Disposition');
      let generatedFileName = `converted.${conversionType.split('-to-')[1]}`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename=(.*?)(;|$)/i);
        if (filenameMatch && filenameMatch[1]) {
          generatedFileName = filenameMatch[1].replace(/["']/g, "");
        }
      }
      
      // Create and store blob URL for download
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      setConvertedContent(blobUrl);
      setConverted(true);
      setOutputFileName(generatedFileName);
      
      toast({
        title: "File converted",
        description: "Your file has been converted successfully",
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
    if (!converted || !outputFileName || !convertedContent) {
      toast({
        title: "Download error",
        description: "Missing conversion data. Please try converting again.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Create anchor element and initiate download
      const a = document.createElement('a');
      a.href = convertedContent;
      a.download = outputFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: "File downloaded",
        description: `${outputFileName} has been downloaded`,
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download failed",
        description: "There was an error downloading your file",
        variant: "destructive",
      });
    }
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
            }}
          >
            <SelectTrigger className="w-full bg-white dark:bg-gray-900 shadow-sm">
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
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
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
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
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
