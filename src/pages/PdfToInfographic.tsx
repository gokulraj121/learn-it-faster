
import { useState } from "react";
import { ChevronLeft, Download, FileText, Globe, RotateCw, PieChart, BarChart3, LineChart, Users, BookOpen, School, BrainCircuit, TrendingUp, Lightbulb, Building, Heart } from "lucide-react";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Link, Navigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";

interface InfographicData {
  title: string;
  summary: string;
  keyPoints: string[];
  stats: {
    label: string;
    value: number;
  }[];
}

interface UseCaseData {
  icon: any;
  title: string;
  description: string;
}

export default function PdfToInfographic() {
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [infographicData, setInfographicData] = useState<InfographicData | null>(null);
  const [activeTab, setActiveTab] = useState("modern");
  const [url, setUrl] = useState("");
  const [sourceType, setSourceType] = useState<"file" | "url" | "text">("file");
  const [blogText, setBlogText] = useState("");
  const [promptTemplate, setPromptTemplate] = useState(`
Create a visually appealing and easy-to-understand infographic based on the following content. The infographic should be structured with clear sections, include concise text, bullet points where needed, and use engaging visuals like icons, charts, or illustrations. Each section should have a bold heading. The tone should be friendly and professional. Format it to be ideal for sharing on social media or embedding in a blog post.

📌 Topic:
[Insert your topic here – e.g., How Solar Energy Works, 5 Benefits of Meditation, Startup Launch Checklist]

🧠 Key Points to Include:
[Main point 1]
[Main point 2]
[Main point 3]
[Main point 4]
[Main point 5]

🎨 Design Preferences:
Color palette: [Choose colors – e.g., pastel, vibrant, minimal black & white]
Font style: [e.g., modern sans-serif]
Icon style: [flat / outline / 3D / simple]
Layout style: [e.g., vertical scroll, horizontal blocks, grid-style]

🧾 Branding (Optional):
Brand name: [Your brand name]
Logo: [Link or note – optional]
Font/Color guidelines: [if any]

📤 Output Format:
Provide the infographic in image format (PNG/JPEG).
Include a text-based version of the infographic for accessibility.

✅ Final Goal:
The infographic should help [target audience, e.g., students, entrepreneurs, eco-conscious consumers] easily understand and remember the key takeaways. It should be engaging enough for social media sharing and visually polished for professional use.
  `);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Redirect to auth page if not logged in
  if (!user) {
    toast({
      title: "Authentication required",
      description: "Please sign in to use this feature",
      variant: "destructive",
    });
    return <Navigate to="/auth" />;
  }
  
  const handleFileUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setInfographicData(null);
    setSourceType("file");
    
    // Read file content
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFileContent(content);
    };
    reader.readAsText(uploadedFile);
  };
  
  const generateInfographic = async () => {
    let contentToProcess = "";
    let sourceName = "";
    
    if (sourceType === "file" && (!file || !fileContent)) {
      toast({
        title: "No file selected",
        description: "Please upload a file first",
        variant: "destructive",
      });
      return;
    }
    
    if (sourceType === "url" && !url) {
      toast({
        title: "URL is empty",
        description: "Please enter a URL to process",
        variant: "destructive",
      });
      return;
    }
    
    if (sourceType === "text" && !blogText) {
      toast({
        title: "Blog text is empty",
        description: "Please enter some text to process",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Prepare the content based on source type
      if (sourceType === "file") {
        contentToProcess = fileContent!;
        sourceName = file!.name;
      } else if (sourceType === "url") {
        contentToProcess = url;
        sourceName = new URL(url).hostname;
      } else if (sourceType === "text") {
        contentToProcess = blogText;
        sourceName = "Blog Text";
      }
      
      // Call Supabase Edge Function to process the content
      const { data, error } = await supabase.functions.invoke('generate-infographic', {
        body: {
          fileContent: contentToProcess,
          fileName: sourceName,
          sourceType: sourceType,
          promptTemplate: promptTemplate
        }
      });
      
      if (error) throw error;
      
      setInfographicData(data.infographicData);
      
      // Save to Supabase
      await supabase.from('infographics').insert({
        user_id: user.id,
        title: data.title,
        content: data.infographicData,
        original_filename: sourceName
      });
      
      toast({
        title: "Infographic generated",
        description: "Your infographic has been created successfully",
      });
      
    } catch (error: any) {
      console.error("Error generating infographic:", error);
      toast({
        title: "Error generating infographic",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const downloadInfographic = () => {
    if (!infographicData) return;
    
    // In a real app, this would generate and download the infographic as an image
    // For demonstration, we'll create a text representation
    const content = `
      # ${infographicData.title}
      
      ${infographicData.summary}
      
      ## Key Points
      ${infographicData.keyPoints.map((point, i) => `${i+1}. ${point}`).join('\n')}
      
      ## Statistics
      ${infographicData.stats.map(stat => `- ${stat.label}: ${stat.value}`).join('\n')}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${infographicData.title.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Infographic downloaded",
      description: "Your infographic has been saved as a text file",
    });
  };

  const useCases: UseCaseData[] = [
    {
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      title: "🎓 Students",
      description: "Summarize textbooks, research papers, or notes visually. Create engaging project presentations and posters."
    },
    {
      icon: <School className="h-6 w-6 text-primary" />,
      title: "👩‍🏫 Educators / Teachers",
      description: "Convert lesson plans into visual teaching materials. Simplify complex topics for easier understanding."
    },
    {
      icon: <FileText className="h-6 w-6 text-primary" />,
      title: "✍️ Bloggers / Content Writers",
      description: "Turn long-form blog posts into shareable infographics. Increase engagement and reach on social platforms."
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-primary" />,
      title: "📈 Digital Marketers",
      description: "Create content for social media campaigns. Improve SEO with engaging visual content."
    },
    {
      icon: <BrainCircuit className="h-6 w-6 text-primary" />,
      title: "🧠 Coaches / Consultants",
      description: "Visualize frameworks, methods, or step-by-step guides. Add value to client materials or workshops."
    },
    {
      icon: <Building className="h-6 w-6 text-primary" />,
      title: "🏢 Businesses & Startups",
      description: "Explain services, workflows, or stats in an easy format. Use infographics in internal communication."
    },
    {
      icon: <Heart className="h-6 w-6 text-primary" />,
      title: "🏥 NGOs / Nonprofits",
      description: "Share awareness campaigns visually. Explain causes or social problems in simple terms."
    }
  ];
  
  return (
    <div className="min-h-screen p-6 pt-24 md:p-10 md:pt-28 max-w-6xl mx-auto">
      <Navbar />
      
      <div className="mb-10">
        <Link to="/" className="flex items-center text-muted-foreground hover:text-primary transition-colors gap-1 mb-6">
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">📊 Content to Infography</h1>
        <p className="text-muted-foreground">Transform your PDFs, blogs, and URLs into visually appealing infographics</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4">Choose Your Content</h2>
            
            <Tabs defaultValue="file" onValueChange={(value) => setSourceType(value as "file" | "url" | "text")}>
              <TabsList className="w-full mb-4">
                <TabsTrigger value="file">Upload File</TabsTrigger>
                <TabsTrigger value="url">Enter URL</TabsTrigger>
                <TabsTrigger value="text">Blog Text</TabsTrigger>
              </TabsList>
              
              <TabsContent value="file">
                <FileUpload 
                  acceptedTypes=".pdf,.txt" 
                  onFileUpload={handleFileUpload} 
                  label="Upload PDF Document or Text File"
                />
              </TabsContent>
              
              <TabsContent value="url">
                <div className="space-y-2">
                  <label htmlFor="url" className="text-sm font-medium">Enter a blog or article URL</label>
                  <Input 
                    id="url" 
                    placeholder="https://example.com/blog-post" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">We'll extract the content from this URL and convert it to an infographic</p>
                </div>
              </TabsContent>
              
              <TabsContent value="text">
                <div className="space-y-2">
                  <label htmlFor="blogText" className="text-sm font-medium">Paste your blog text</label>
                  <textarea
                    id="blogText"
                    className="w-full min-h-[200px] p-3 border rounded-md bg-background"
                    placeholder="Paste your blog post or article text here..."
                    value={blogText}
                    onChange={(e) => setBlogText(e.target.value)}
                  />
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6">
              <Button 
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all" 
                disabled={loading || (sourceType === "file" && !file) || (sourceType === "url" && !url) || (sourceType === "text" && !blogText)}
                onClick={generateInfographic}
              >
                {loading ? (
                  <>
                    <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating Infography...
                  </>
                ) : (
                  <>
                    <PieChart className="mr-2 h-4 w-4" />
                    Generate Infography
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
                <Button variant="outline" size="sm" onClick={downloadInfographic}>
                  PNG
                </Button>
                <Button variant="outline" size="sm" onClick={downloadInfographic}>
                  JPG
                </Button>
                <Button variant="outline" size="sm" onClick={downloadInfographic}>
                  PDF
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Generated from {sourceType === "file" ? file?.name : sourceType === "url" ? new URL(url).hostname : "Blog Text"}
              </p>
            </div>
          )}
          
          {/* Use Cases Section */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4">Popular Use Cases</h2>
            <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto pr-2">
              {useCases.map((useCase, index) => (
                <div key={index} className="flex gap-3 p-3 bg-black/10 rounded-lg">
                  <div className="flex-shrink-0">
                    {useCase.icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{useCase.title}</h3>
                    <p className="text-sm text-muted-foreground">{useCase.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
            <div className="glass-card p-8 h-full flex flex-col items-center justify-center text-center">
              <PieChart className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No Infographic Yet</h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-xs">
                Upload a PDF, enter a URL, or paste blog text to generate an infographic
              </p>
              
              <div className="mt-4 grid grid-cols-1 gap-4 w-full max-w-md">
                <Card className="bg-black/10 border-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-primary" />
                      PDF to Infography
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Transform research papers, documents and reports into visual summaries
                    </CardDescription>
                  </CardContent>
                </Card>
                
                <Card className="bg-black/10 border-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Globe className="h-5 w-5 mr-2 text-primary" />
                      URL to Infography
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Convert any website article or blog post into a shareable visual
                    </CardDescription>
                  </CardContent>
                </Card>
                
                <Card className="bg-black/10 border-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Users className="h-5 w-5 mr-2 text-primary" />
                      For Everyone
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Perfect for students, educators, marketers, businesses and more
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
