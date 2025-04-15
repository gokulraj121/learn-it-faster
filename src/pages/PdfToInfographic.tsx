
import { useState } from "react";
import { ChevronLeft, Download, FileText, RotateCw, PieChart, BarChart3, LineChart } from "lucide-react";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface InfographicData {
  title: string;
  summary: string;
  keyPoints: string[];
  stats: {
    label: string;
    value: number;
  }[];
}

// Mock data for demonstration
const mockInfographicData: InfographicData = {
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
};

export default function PdfToInfographic() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [infographicData, setInfographicData] = useState<InfographicData | null>(null);
  const [activeTab, setActiveTab] = useState("modern");
  
  const handleFileUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
    setInfographicData(null);
  };
  
  const generateInfographic = () => {
    setLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setInfographicData(mockInfographicData);
      setLoading(false);
    }, 2000);
  };
  
  const downloadInfographic = () => {
    // In a real app, this would generate and download the infographic
    alert("In a real app, this would download your infographic as an image.");
  };
  
  return (
    <div className="min-h-screen p-6 md:p-10 max-w-6xl mx-auto">
      <div className="mb-10">
        <Link to="/" className="flex items-center text-muted-foreground hover:text-primary transition-colors gap-1 mb-6">
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">📊 PDF to Infographic</h1>
        <p className="text-muted-foreground">Transform your PDF documents into visually appealing infographics</p>
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
                onClick={generateInfographic}
              >
                {loading ? (
                  <>
                    <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating Infographic...
                  </>
                ) : (
                  <>
                    <PieChart className="mr-2 h-4 w-4" />
                    Generate Infographic
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {infographicData && (
            <div className="glass-card p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Download Options</h2>
                <Button variant="default" size="sm" onClick={downloadInfographic}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
              <div className="flex gap-2 mb-4">
                <Button variant="outline" size="sm" onClick={() => {}}>
                  PNG
                </Button>
                <Button variant="outline" size="sm" onClick={() => {}}>
                  JPG
                </Button>
                <Button variant="outline" size="sm" onClick={() => {}}>
                  PDF
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Generated from {file?.name}
              </p>
            </div>
          )}
        </div>
        
        <div>
          {infographicData ? (
            <div className="glass-card p-0 overflow-hidden">
              <Tabs defaultValue="modern" onValueChange={setActiveTab} className="w-full">
                <div className="px-4 pt-4 bg-black/20">
                  <TabsList className="w-full">
                    <TabsTrigger value="modern">Modern</TabsTrigger>
                    <TabsTrigger value="minimal">Minimal</TabsTrigger>
                    <TabsTrigger value="colorful">Colorful</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="modern" className="m-0">
                  <div className="p-6 bg-gradient-to-br from-black/30 to-primary/10">
                    <h2 className="text-xl font-bold mb-4 text-gradient-primary">{infographicData.title}</h2>
                    
                    <p className="text-sm mb-6">{infographicData.summary}</p>
                    
                    <div className="mb-6">
                      <h3 className="text-sm font-medium mb-2">Key Points</h3>
                      <div className="space-y-2">
                        {infographicData.keyPoints.map((point, index) => (
                          <div key={index} className="flex items-center gap-2 bg-white/5 p-3 rounded-md">
                            <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 text-sm">
                              {index + 1}
                            </div>
                            <p className="text-sm">{point}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Statistics</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {infographicData.stats.map((stat, index) => (
                          <div key={index} className="bg-white/5 p-4 rounded-md flex flex-col items-center">
                            <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                            <div className="text-xs text-center text-muted-foreground">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="minimal" className="m-0">
                  <div className="p-6 bg-black/20">
                    <h2 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">{infographicData.title}</h2>
                    
                    <p className="text-sm mb-6">{infographicData.summary}</p>
                    
                    <div className="mb-6">
                      <h3 className="text-sm font-medium mb-2">Key Points</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {infographicData.keyPoints.map((point, index) => (
                          <li key={index} className="text-sm">{point}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Statistics</h3>
                      <div className="space-y-2">
                        {infographicData.stats.map((stat, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-sm">{stat.label}</span>
                            <span className="text-sm font-bold">{stat.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="colorful" className="m-0">
                  <div className="p-6 bg-gradient-to-tr from-primary/30 via-black/20 to-accent/20">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-gradient">{infographicData.title}</h2>
                      <PieChart className="h-8 w-8 text-primary" />
                    </div>
                    
                    <p className="text-sm mb-6 bg-white/5 p-3 rounded-md">{infographicData.summary}</p>
                    
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        <h3 className="text-sm font-medium">Key Points</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {infographicData.keyPoints.map((point, index) => (
                          <div key={index} className="bg-white/5 hover:bg-white/10 transition-colors p-3 rounded-md border-l-2 border-primary">
                            <p className="text-xs">{point}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <LineChart className="h-5 w-5 text-primary" />
                        <h3 className="text-sm font-medium">Statistics</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {infographicData.stats.map((stat, index) => (
                          <div key={index} className="bg-gradient-to-br from-primary/20 to-accent/10 p-4 rounded-md flex flex-col items-center">
                            <div className="text-2xl font-bold text-gradient-primary mb-1">{stat.value}</div>
                            <div className="text-xs text-center">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="glass-card p-8 h-[400px] flex flex-col items-center justify-center text-center">
              <PieChart className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No Infographic Yet</h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-xs">
                Upload a PDF document and generate an infographic to see it here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
