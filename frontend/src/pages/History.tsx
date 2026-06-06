import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowRight } from 'lucide-react';

export default function History() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/resume/history');
        setHistory(response.data);
      } catch (error) {
        console.error('Failed to fetch history', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analysis History</h1>
        <p className="text-muted-foreground mt-1">View your past resume analyses.</p>
      </div>

      {history.length === 0 ? (
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <p className="text-muted-foreground mb-4">No analysis history found.</p>
            <Button onClick={() => navigate('/')}>Analyze a Resume</Button>
          </CardContent>
        </Card>
      ) : (
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
      )}
    </div>
  );
}
