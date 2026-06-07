import { useState, useCallback, type ChangeEvent } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UploadCloud, File, Loader2, Briefcase, FileText, ArrowRight } from 'lucide-react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [role, setRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
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
    if (jobDescription.trim()) {
      formData.append('jobDescription', jobDescription);
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await axios.post(`${API_URL}/resume/analyze`, formData, {
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
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 py-12 sm:px-6 lg:px-8 bg-background">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-foreground">
          Resumize
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Upload your resume and the target job description to get instant, deep ATS feedback and actionable career insights.
        </p>
      </div>

      <div className="w-full max-w-5xl bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border/40 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left Column: Target Context */}
          <div className="p-8 md:p-10 lg:p-12 border-b md:border-b-0 md:border-r border-border/40 bg-muted/10">
            <div className="mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Target Context</h2>
              <p className="text-sm text-muted-foreground mt-1">Tell us what you're applying for to tailor the analysis.</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-semibold flex items-center text-foreground/80">
                  <Briefcase className="w-4 h-4 mr-2 text-primary/70" />
                  Job Role <span className="text-destructive ml-1">*</span>
                </Label>
                <Input
                  id="role"
                  placeholder="e.g. Senior Product Designer"
                  value={role}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setRole(e.target.value)}
                  className="h-12 bg-background border-border/50 focus-visible:ring-primary/20 transition-all rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="jobDescription" className="text-sm font-semibold flex items-center text-foreground/80">
                    <FileText className="w-4 h-4 mr-2 text-primary/70" />
                    Job Description
                  </Label>
                  <span className="text-xs text-muted-foreground font-medium">Optional</span>
                </div>
                <Textarea
                  id="jobDescription"
                  placeholder="Paste the full job description here for the most accurate keyword matching and ATS scoring..."
                  value={jobDescription}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setJobDescription(e.target.value)}
                  className="min-h-[160px] bg-background border-border/50 focus-visible:ring-primary/20 transition-all resize-y rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Your Resume */}
          <div className="p-8 md:p-10 lg:p-12 flex flex-col justify-between">
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Your Resume</h2>
                <p className="text-sm text-muted-foreground mt-1">Upload your current document securely.</p>
              </div>

              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 min-h-[220px] flex flex-col items-center justify-center
                  ${isDragActive ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-border/60 hover:border-primary/40 hover:bg-muted/30'}
                  ${file ? 'border-primary/50 bg-primary/5' : ''}
                `}
              >
                <input {...getInputProps()} />
                {file ? (
                  <div className="flex flex-col items-center space-y-4 animate-in zoom-in duration-300">
                    <div className="p-4 bg-primary/10 rounded-full text-primary">
                      <File className="h-8 w-8" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">{file.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-4 text-muted-foreground hover:text-foreground transition-colors">
                    <div className="p-4 bg-background border border-border/50 shadow-sm rounded-full">
                      <UploadCloud className="h-6 w-6 text-primary/70" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        <span className="text-primary font-semibold">Click to upload</span> or drag and drop
                      </div>
                      <div className="text-xs mt-2 opacity-70">PDF or DOCX (max. 5MB)</div>
                    </div>
                  </div>
                )}
              </div>
              
              {error && (
                <div className="text-destructive text-sm font-medium mt-4 p-3 bg-destructive/10 rounded-lg border border-destructive/20 flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive mr-2" />
                  {error}
                </div>
              )}
            </div>

            <div className="mt-8">
              <Button 
                className="w-full h-14 text-base font-semibold shadow-md hover:shadow-lg transition-all rounded-xl" 
                size="lg" 
                onClick={handleAnalyze} 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing your profile...
                  </>
                ) : (
                  <>
                    Generate Insights
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
