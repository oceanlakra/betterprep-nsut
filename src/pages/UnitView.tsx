import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from '@/lib/supabase';
import { ChevronLeft, Video, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigationRefresh } from '@/hooks/use-navigation';
import { useAuth } from '@/hooks/use-auth';

interface Unit {
  id: string;
  name: string;
  order_no: number;
  subject_id: string;
}

interface Topic {
  id: string;
  title: string;
  unit_id: string;
  video_links: string[];
  pdf_path: string;
  completed?: boolean;
}

export default function UnitView() {
  const { unitId } = useParams();
  const { user } = useAuth();
  const [unit, setUnit] = useState<Unit | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openUnits, setOpenUnits] = useState<Record<string, boolean>>({});
  
  useNavigationRefresh();

  useEffect(() => {
    let mounted = true;

    async function fetchUnitData() {
      try {
        // Fetch unit details
        const { data: unitData, error: unitError } = await supabase
          .from('units')
          .select('*')
          .eq('id', unitId)
          .single();

        if (unitError) throw unitError;
        if (mounted) {
          setUnit(unitData);
        }

        // Fetch topics for this unit
        const { data: topicData, error: topicError } = await supabase
          .from('topics')
          .select('*')
          .eq('unit_id', unitId)
          .order('title');

        if (topicError) throw topicError;

        // Fetch completion status
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('topic_id, completed')
          .eq('user_id', user?.id)
          .in('topic_id', topicData?.map(t => t.id) || []);

        if (mounted) {
          const topicsWithProgress = topicData?.map(topic => ({
            ...topic,
            completed: progressData?.find(p => p.topic_id === topic.id)?.completed || false
          })) || [];
          setTopics(topicsWithProgress);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch unit data');
          console.error('Error:', err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchUnitData();

    return () => {
      mounted = false;
    };
  }, [unitId, user?.id]);

  const handleCheckboxChange = async (topicId: string, checked: boolean) => {
    try {
      // Update local state immediately
      setTopics(prev => prev.map(topic => 
        topic.id === topicId ? { ...topic, completed: checked } : topic
      ));

      // Update database
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          topic_id: topicId,
          user_id: user?.id,
          completed: checked,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (err) {
      console.error('Error updating progress:', err);
      // Revert on error
      setTopics(prev => prev.map(topic => 
        topic.id === topicId ? { ...topic, completed: !checked } : topic
      ));
    }
  };

  const toggleUnit = (unitId: string) => {
    setOpenUnits(prev => ({
      ...prev,
      [unitId]: !prev[unitId]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/subject/${unit?.subject_id}`}>
              <ChevronLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
          <h1 className="text-xl font-bold text-gray-800">{unit?.name || 'Loading...'}</h1>
        </div>
      </nav>

      <main className="container mx-auto p-6">
        {error ? (
          <div className="text-center text-red-500 bg-red-50 p-4 rounded-lg">
            {error}
          </div>
        ) : loading ? (
          <div className="space-y-4">
            {Array(4).fill(0).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-1/3" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {topics.map(topic => (
              <Card key={topic.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Checkbox
                        checked={topic.completed}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange(topic.id, checked as boolean)
                        }
                      />
                      <CardTitle>{topic.title}</CardTitle>
                    </div>
                    <Button onClick={() => toggleUnit(topic.id)}>
                      {openUnits[topic.id] ? <ChevronUp /> : <ChevronDown />}
                    </Button>
                  </div>
                </CardHeader>
                {openUnits[topic.id] && (
                  <CardContent>
                    <div className="flex flex-wrap gap-4">
                      {topic.video_links?.map((link, index) => (
                        <Button key={index} variant="outline" size="sm" asChild>
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                          >
                            <Video className="h-4 w-4" />
                            Video {index + 1}
                          </a>
                        </Button>
                      ))}
                      {topic.pdf_path && (
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={topic.pdf_path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                          >
                            <FileText className="h-4 w-4" />
                            Notes
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 