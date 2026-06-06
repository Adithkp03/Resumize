import { useState, useCallback, type ChangeEvent } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, File, Loader2 } from 'lucide-react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please upload a resume.');
      return;
    }
    if (!role.trim()) {
      setError('Please enter a target role.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('role', role);

    try {
      const response = await axios.post('http://localhost:5000/api/resume/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Navigate to dashboard with results
      navigate('/dashboard', { state: { result: response.data, role } });
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'An error occurred during analysis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-2xl border-border/40 shadow-2xl bg-card">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-extrabold tracking-tight mb-2">AI Resume Analyzer</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Upload your resume and get instant, AI-driven ATS feedback.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="role" className="text-base">Target Job Role</Label>
            <Input
              id="role"
              placeholder="e.g. Frontend Developer, Product Manager"
              value={role}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setRole(e.target.value)}
              className="h-12 text-lg"
            />
          </div>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50'}
              ${file ? 'border-primary/50 bg-primary/5' : ''}
            `}
          >
            <input {...getInputProps()} />
            {file ? (
              <div className="flex flex-col items-center space-y-3">
                <div className="p-3 bg-primary/10 rounded-full">
                  <File className="h-8 w-8 text-primary" />
                </div>
                <div className="text-sm font-medium">{file.name}</div>
                <div className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-3">
                <div className="p-4 bg-muted rounded-full">
                  <UploadCloud className="h-10 w-10 text-muted-foreground" />
                </div>
                <div className="text-lg font-semibold">Drag & drop your resume here</div>
                <div className="text-sm text-muted-foreground">or click to browse</div>
                <div className="text-xs text-muted-foreground mt-2">Supports PDF, DOCX (Max 5MB)</div>
              </div>
            )}
          </div>

          {error && <div className="text-destructive text-sm font-medium text-center">{error}</div>}

          <Button 
            className="w-full h-12 text-lg font-bold" 
            size="lg" 
            onClick={handleAnalyze} 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing with AI...
              </>
            ) : (
              'Analyze Resume'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
