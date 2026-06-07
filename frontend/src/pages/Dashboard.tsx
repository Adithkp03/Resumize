import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2, XCircle, AlertCircle, BookOpen, Download, Copy } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { result: any; role: string } | null;

  if (!state || !state.result) {
    return <Navigate to="/" replace />;
  }

  const { result, role } = state;
  const scoreColor = result.ats_score >= 80 ? '#22c55e' : result.ats_score >= 60 ? '#eab308' : '#ef4444';

  const handlePrint = () => {
    window.print();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12 print:pb-0">
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analysis Results</h1>
          <p className="text-muted-foreground mt-1">Target Role: <span className="font-medium text-foreground">{role}</span></p>
        </div>
        <div className="space-x-4">
          <Button variant="outline" onClick={handlePrint}>
            <Download className="mr-2 h-4 w-4" /> Download Report
          </Button>
          <Button variant="default" onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Analyze Another
          </Button>
        </div>
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

        {/* Section Breakdown & Benchmark */}
        <Card className="md:col-span-2 bg-card border-border/40 shadow-sm">
          <CardHeader>
            <CardTitle>Score Breakdown & Benchmark</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {Object.entries(result.breakdown || {}).map(([key, value]) => (
                <div key={key} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{key.replace('_', ' ')}</span>
                    <span className="font-medium">{value as number}%</span>
                  </div>
                  <Progress value={value as number} className="h-2" />
                </div>
              ))}
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground">Top Candidate Comparison</h3>
              <div className="flex items-center space-x-4">
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>You</span>
                    <span className="font-medium">{result.ats_score}%</span>
                  </div>
                  <Progress value={result.ats_score} className="h-2 [&>div]:bg-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Top Candidate</span>
                    <span className="font-medium">{result.top_candidate_score}%</span>
                  </div>
                  <Progress value={result.top_candidate_score} className="h-2 [&>div]:bg-green-500" />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-sm font-medium mr-2">Top Candidate Gaps:</span>
                {(result.top_candidate_gaps || []).map((gap: string, i: number) => (
                  <Badge key={i} variant="secondary" className="text-xs">{gap}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Skills Heatmap */}
        <Card className="border-border/40 shadow-sm">
          <CardHeader>
            <CardTitle>ATS Keyword Heatmap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center text-green-600 dark:text-green-400">
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Found Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(result.matched_skills || []).map((skill: string, i: number) => (
                    <Badge key={i} variant="outline" className="border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400">
                      {skill} ✓
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center text-red-600 dark:text-red-400">
                  <XCircle className="w-4 h-4 mr-2" /> Missing Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(result.missing_skills || []).map((skill: string, i: number) => (
                    <Badge key={i} variant="outline" className="border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-400">
                      {skill} ✗
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills Tree */}
        <Card className="border-border/40 shadow-sm">
          <CardHeader>
            <CardTitle>Skills Categorization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {(result.skills_by_category || []).map((cat: any, i: number) => (
                <div key={i}>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-2">{cat.category}</h4>
                  <div className="grid grid-cols-2 gap-2 pl-4 border-l-2 border-border/50">
                    {cat.skills.map((skill: any, j: number) => (
                      <div key={j} className="flex items-center text-sm">
                        {skill.found ? (
                          <CheckCircle2 className="w-3 h-3 text-green-500 mr-2 shrink-0" />
                        ) : (
                          <XCircle className="w-3 h-3 text-red-500 mr-2 shrink-0" />
                        )}
                        <span className={skill.found ? '' : 'text-muted-foreground'}>{skill.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rewrite Assistant */}
      <Card className="border-border/40 shadow-sm bg-muted/30">
        <CardHeader>
          <CardTitle>Resume Rewrite Assistant</CardTitle>
          <CardDescription>High-impact, metric-driven suggestions for your bullet points.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(result.rewrites || []).map((rewrite: any, i: number) => (
              <div key={i} className="flex flex-col md:flex-row gap-4 p-4 rounded-lg bg-background border border-border/50">
                <div className="flex-1 space-y-2">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Original</div>
                  <p className="text-sm line-through text-muted-foreground">{rewrite.original}</p>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="text-xs font-semibold text-primary uppercase tracking-wider">AI Suggestion</div>
                  <p className="text-sm font-medium">{rewrite.rewritten}</p>
                </div>
                <div className="flex items-center justify-end md:justify-center">
                  <Button variant="secondary" size="sm" onClick={() => copyToClipboard(rewrite.rewritten)} className="print:hidden">
                    <Copy className="w-4 h-4 mr-2" /> Copy
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Interview Prep */}
        <Card className="border-border/40 shadow-sm">
          <CardHeader className="flex flex-row items-center space-x-2 pb-2">
            <AlertCircle className="w-5 h-5 text-primary" />
            <CardTitle>Likely Interview Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 mt-2 list-decimal list-inside text-sm">
              {(result.interview_questions || []).map((q: string, i: number) => (
                <li key={i} className="text-foreground/90 pl-2 leading-relaxed">{q}</li>
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
            <div className="space-y-6 mt-2 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
              {(result.learning_roadmap || []).map((week: any, i: number) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary text-primary-foreground font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    {week.week}
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-border/50 bg-background shadow-sm">
                    <div className="font-bold text-primary mb-1">{week.title}</div>
                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                      {week.tasks.map((task: string, j: number) => (
                        <li key={j}>{task}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
