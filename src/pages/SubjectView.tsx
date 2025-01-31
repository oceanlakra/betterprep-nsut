import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabase';
import { ChevronLeft } from 'lucide-react';

interface Subject {
  id: string;
  name: string;
  semester_id: string;
}

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
}

export default function SubjectView() {
  const { subjectId } = useParams();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubjectData() {
      try {
        // Fetch subject details
        const { data: subjectData, error: subjectError } = await supabase
          .from('subjects')
          .select('*')
          .eq('id', subjectId)
          .single();

        if (subjectError) throw subjectError;
        setSubject(subjectData);

        // Fetch units for this subject
        const { data: unitData, error: unitError } = await supabase
          .from('units')
          .select('*')
          .eq('subject_id', subjectId)
          .order('order_no');

        if (unitError) throw unitError;
        setUnits(unitData || []);

        // Fetch topics for all units
        if (unitData && unitData.length > 0) {
          const { data: topicData, error: topicError } = await supabase
            .from('topics')
            .select('*')
            .in('unit_id', unitData.map(unit => unit.id))
            .order('title');

          if (topicError) throw topicError;
          setTopics(topicData || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch subject data');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchSubjectData();
  }, [subjectId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/branch/${subject?.semester_id}`}>
              <ChevronLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
          <h1 className="text-xl font-bold text-gray-800">
            {subject?.name || 'Loading...'}
          </h1>
        </div>
      </nav>

      <main className="container mx-auto p-6">
        {error ? (
          <div className="text-center text-red-500 bg-red-50 p-4 rounded-lg">
            {error}
          </div>
        ) : loading ? (
          <div className="grid gap-4">
            {Array(3).fill(0).map((_, i) => (
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
          <div className="space-y-8">
            {units.map(unit => (
              <Card key={unit.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Unit {unit.order_no}: {unit.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button asChild>
                    <Link to={`/unit/${unit.id}`}>
                      View Topics
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 