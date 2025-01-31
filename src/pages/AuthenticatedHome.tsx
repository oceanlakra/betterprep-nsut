import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from '@/hooks/use-auth';
import { useNavigationRefresh } from '@/hooks/use-navigation';

interface Branch {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export default function AuthenticatedHome() {
  const { user } = useAuth();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useNavigationRefresh();

  useEffect(() => {
    let mounted = true;

    async function fetchBranches() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('branches')
          .select('*')
          .order('name');

        if (error) throw error;
        if (mounted) {
          setBranches(data || []);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch branches');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchBranches();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">
            NSUT Syllabus Tracker
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Welcome, {user?.email?.split('@')[0]}
            </span>
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link to="/dashboard">
                <LayoutDashboard className="h-4 w-4" />
                My Progress
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto p-6">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Browse Branches</h2>
            <p className="text-gray-500">
              Select your branch to view the complete syllabus
            </p>
          </div>

          {error && (
            <div className="text-center text-red-500 bg-red-50 p-4 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array(6).fill(0).map((_, i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Skeleton className="h-8 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))
            ) : branches.length > 0 ? (
              branches.map((branch) => (
                <Card key={branch.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">{branch.icon}</span>
                      {branch.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500">{branch.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link to={`/branch/${branch.id}`}>
                        View Syllabus
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                No branches found
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white mt-12 py-6 text-center text-gray-500">
        <p>© 2024 NSUT Syllabus Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
} 