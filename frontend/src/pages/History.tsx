import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function History() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await axios.get(`${API_URL}/resume/history`);
        setHistory(response.data);
      } catch (error) {
        console.error('Failed to fetch history', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const chartData = useMemo(() => {
    // Sort history oldest to newest for the chart
    return [...history].reverse().map(item => ({
      date: new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      score: item.ats_score,
      role: item.target_role
    }));
  }, [history]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analysis History</h1>
        <p className="text-muted-foreground mt-1">View your past resume analyses and track progress.</p>
      </div>

      {history.length === 0 ? (
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <p className="text-muted-foreground mb-4">No analysis history found.</p>
            <Button onClick={() => navigate('/')}>Analyze a Resume</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {history.length > 1 && (
            <Card className="border-border/40 shadow-sm mb-8">
              <CardHeader>
                <CardTitle>Score Progression</CardTitle>
                <CardDescription>Your ATS scores over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        name="ATS Score"
                        stroke="hsl(var(--primary))" 
                        strokeWidth={3}
                        dot={{ r: 4, fill: 'hsl(var(--primary))' }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {history.map((item) => (
              <Card key={item.id} className="flex flex-col border-border/40 hover:border-primary/50 transition-colors shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl truncate" title={item.filename}>
                        {item.filename}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {new Date(item.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge variant={item.ats_score >= 80 ? 'default' : item.ats_score >= 60 ? 'secondary' : 'destructive'} className="text-sm font-bold">
                      {item.ats_score}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between">
                  <div className="space-y-2 mb-4">
                    <div className="text-sm font-medium">Target Role:</div>
                    <Badge variant="outline">{item.target_role}</Badge>
                  </div>
                  <Button 
                    variant="secondary" 
                    className="w-full mt-auto" 
                    onClick={() => navigate('/dashboard', { state: { result: item.analysis_result, role: item.target_role } })}
                  >
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
