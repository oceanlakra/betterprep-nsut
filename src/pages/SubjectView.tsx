import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { fetchSubjectData } from '@/features/subjectSlice';
import { ChevronLeft } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Youtube, FileText } from 'lucide-react';

export default function SubjectView() {
  const { subjectId } = useParams();
  const dispatch = useAppDispatch();
  const { subject, loading, error } = useAppSelector((state) => state.subject);

  useEffect(() => {
    if (subjectId) {
      console.log('Fetching subject data for ID:', subjectId);
      dispatch(fetchSubjectData(subjectId));
    }
  }, [subjectId, dispatch]);

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
          <div>Loading...</div>
        ) : (
          <Accordion type="single" collapsible>
            {subject?.units.map(unit => (
              <AccordionItem key={unit.id} value={unit.id}>
                <AccordionTrigger>
                  <div className="flex justify-between items-center p-4 cursor-pointer bg-gray-100 hover:bg-gray-200">
                    <h2 className="font-semibold">Unit {unit.order_no}: {unit.name}</h2>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Card className="p-4">
                    <div className="mt-4 space-y-3">
                      {unit.topics.map(topic => (
                        <div key={topic.id} className="flex items-center justify-between border-b py-2">
                          <Checkbox className="mr-2" />
                          <span className="flex-1 text-sm">{topic.title}</span>
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={topic.video_links[0]} target="_blank">
                              <Youtube className="h-5 w-5" />
                            </Link>
                          </Button>
                          {topic.pdf_path && (
                            <Button variant="ghost" size="icon" asChild>
                              <Link to={topic.pdf_path} target="_blank">
                                <FileText className="h-5 w-5" />
                              </Link>
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </main>
    </div>
  );
} 