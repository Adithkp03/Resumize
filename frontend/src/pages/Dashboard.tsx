import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2, XCircle, AlertCircle, BookOpen, Briefcase } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { result: any; role: string } | null;

  if (!state || !state.result) {
    return <Navigate to="/" replace />;
  }

  const { result, role } = state;
  const scoreColor = result.ats_score >= 80 ? '#22c55e' : result.ats_score >= 60 ? '#eab308' : '#ef4444';

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analysis Results</h1>
          <p className="text-muted-foreground mt-1">Target Role: <span className="font-medium text-foreground">{role}</span></p>
        </div>
        <Button variant="outline" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Analyze Another
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Score Card */}
        <Card className="md:col-span-1 flex flex-col items-center justify-center p-6 bg-card border-border/40 shadow-sm">
          <CardHeader className="text-center pb-2">
            <CardTitle>ATS Match Score</CardTitle>
            <CardDescription>Based on role requirements</CardDescription>
          </CardHeader>
          <CardContent className="w-48 h-48 mt-4">
            <CircularProgressbar
              value={result.ats_score}
              text={`${result.ats_score}%`}
              styles={buildStyles({
                pathColor: scoreColor,
                textColor: 'hsl(var(--foreground))',
                trailColor: 'hsl(var(--muted))',
                textSize: '24px',
              })}
            />
          </CardContent>
        </Card>

        {/* Summary Card */}
        <Card className="md:col-span-2 bg-card border-border/40 shadow-sm">
          <CardHeader>
            <CardTitle>Executive Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed text-muted-foreground">
              {result.summary}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Strengths */}
        <Card className="border-border/40 shadow-sm">
          <CardHeader className="flex flex-row items-center space-x-2 pb-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <CardTitle>Strengths</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 mt-4">
              {result.strengths.map((item: string, i: number) => (
                <li key={i} className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 mr-3 shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Weaknesses */}
        <Card className="border-border/40 shadow-sm">
          <CardHeader className="flex flex-row items-center space-x-2 pb-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <CardTitle>Weaknesses</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 mt-4">
              {result.weaknesses.map((item: string, i: number) => (
                <li key={i} className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 mr-3 shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Skills Gap */}
      <Card className="border-border/40 shadow-sm">
        <CardHeader className="flex flex-row items-center space-x-2 pb-2">
          <XCircle className="w-5 h-5 text-yellow-500" />
          <CardTitle>Missing Key Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mt-2">
            {result.missing_skills.length > 0 ? (
              result.missing_skills.map((skill: string, i: number) => (
                <Badge key={i} variant="secondary" className="text-sm py-1 px-3 bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 dark:text-yellow-400">
                  {skill}
                </Badge>
              ))
            ) : (
              <p className="text-muted-foreground">Great job! No major skills missing for this role.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Improvements */}
        <Card className="border-border/40 shadow-sm">
          <CardHeader>
            <CardTitle>Improvement Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {result.improvements.map((item: string, i: number) => (
                <li key={i} className="p-4 rounded-lg bg-muted/50 text-sm border border-border/50">
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Projects */}
          <Card className="border-border/40 shadow-sm bg-primary/5 border-primary/20">
            <CardHeader className="flex flex-row items-center space-x-2 pb-2">
              <Briefcase className="w-5 h-5 text-primary" />
              <CardTitle>Recommended Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mt-2 list-disc list-inside text-sm text-muted-foreground">
                {result.recommended_projects.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Roadmap */}
          <Card className="border-border/40 shadow-sm bg-primary/5 border-primary/20">
            <CardHeader className="flex flex-row items-center space-x-2 pb-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <CardTitle>Learning Roadmap</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mt-2 list-decimal list-inside text-sm text-muted-foreground">
                {result.learning_roadmap.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
