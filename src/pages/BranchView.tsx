import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabase';
import { ChevronLeft } from 'lucide-react';
import { useNavigationRefresh } from '@/hooks/use-navigation';
import ProgressBar from '@/components/ProgressBar';

interface Semester {
  id: string;
  number: number;
  branch_id: string;
}

interface Subject {
  id: string;
  name: string;
  semester_id: string;
  progress: number;
}

export default function BranchView() {
  const { branchId } = useParams();
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [branchName, setBranchName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<Semester | null>(null);
  
  useNavigationRefresh();

  useEffect(() => {
    let mounted = true;

    async function fetchBranchData() {
      try {
        console.log('Fetching branch:', branchId);

        // Fetch branch details
        const { data: branchData, error: branchError } = await supabase
          .from('branches')
          .select('name')
          .eq('id', branchId)
          .single();

        if (branchError) throw branchError;
        setBranchName(branchData.name);

        // Fetch semesters for this branch
        const { data: semesterData, error: semesterError } = await supabase
          .from('semesters')
          .select('*')
          .eq('branch_id', branchId)
          .order('number');

        if (semesterError) throw semesterError;
        
        if (mounted) {
          setSemesters(semesterData || []);
          
          if (semesterData && semesterData.length > 0) {
            setSelectedSemester(semesterData[0]);
            
            // Fetch subjects for all semesters
            const { data: subjectData, error: subjectError } = await supabase
              .from('subjects')
              .select('*')
              .in('semester_id', semesterData.map(sem => sem.id))
              .order('name');

            if (subjectError) throw subjectError;
            setSubjects(subjectData || []);
          }
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          const errorMessage = err instanceof Error ? 
            err.message : 
            'Failed to fetch branch data. Please try again later.';
          setError(errorMessage);
          console.error('Detailed error:', err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchBranchData();

    return () => {
      mounted = false;
    };
  }, [branchId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              <ChevronLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
          <h1 className="text-xl font-bold text-gray-800">{branchName || 'Loading...'}</h1>
        </div>
      </nav>

      <div className="container mx-auto p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-3 bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b">
              <h2 className="font-semibold">Semesters</h2>
            </div>
            <ScrollArea className="h-[calc(100vh-250px)]">
              <div className="p-2">
                {loading ? (
                  Array(8).fill(0).map((_, i) => (
                    <div key={i} className="p-2">
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))
                ) : (
                  semesters.map((semester) => (
                    <Button
                      key={semester.id}
                      variant={selectedSemester?.id === semester.id ? "default" : "ghost"}
                      className="w-full justify-start mb-1"
                      onClick={() => setSelectedSemester(semester)}
                    >
                      Semester {semester.number}
                    </Button>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            {error ? (
              <div className="text-center text-red-500 bg-red-50 p-4 rounded-lg">
                {error}
              </div>
            ) : loading ? (
              <div className="grid gap-4">
                {Array(6).fill(0).map((_, i) => (
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
            ) : selectedSemester ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-6">
                  Semester {selectedSemester.number} Subjects
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {subjects
                    .filter(subject => subject.semester_id === selectedSemester.id)
                    .map(subject => (
                      <Card key={subject.id} className="hover:shadow-md transition-shadow relative">
                        <CardHeader>
                          <CardTitle>{subject.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-between items-center">
                          <Button asChild>
                            <Link to={`/subject/${subject.id}`}>
                              View Units
                            </Link>
                          </Button>
                          <ProgressBar progress={subject.progress} className="ml-2" />
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                Select a semester to view subjects
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 