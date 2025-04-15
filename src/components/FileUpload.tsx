
import React, { useState, useRef } from "react";
import { Upload, X, FileIcon, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  acceptedTypes?: string;
  onFileUpload: (file: File) => void;
  maxSize?: number; // in MB
  label?: string;
}

export function FileUpload({
  acceptedTypes = ".pdf,.docx,.doc,.jpg,.jpeg,.png",
  onFileUpload,
  maxSize = 10,
  label = "Upload a file",
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    processFile(selectedFile);
  };

  const processFile = (selectedFile?: File) => {
    setError(null);
    
    if (!selectedFile) return;
    
    // Check file size
    if (selectedFile.size > maxSize * 1024 * 1024) {
      setError(`File size exceeds ${maxSize}MB limit`);
      return;
    }
    
    setFile(selectedFile);
    onFileUpload(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    processFile(droppedFile);
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {!file ? (
        <div
          className={`glass-card p-8 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all ${
            isDragging ? "border-primary bg-white/10" : ""
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-2">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium">{label}</h3>
          <p className="text-sm text-muted-foreground text-center">
            Drag and drop your file here, or click to select
          </p>
          <p className="text-xs text-muted-foreground">
            Accepted formats: {acceptedTypes.replace(/\./g, ' ').replace(/,/g, ', ')}
          </p>
          {error && <p className="text-sm text-destructive mt-2">{error}</p>}
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept={acceptedTypes}
            ref={fileInputRef}
          />
        </div>
      ) : (
        <div className="glass-card p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
              <FileIcon className="h-6 w-6 text-primary" />
            </div>
            <div className="flex flex-col">
              <p className="font-medium text-sm truncate max-w-[200px]">
                {file.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
