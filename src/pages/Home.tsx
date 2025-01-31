// src/app/page.tsx (or src/pages/Home.tsx depending on your router setup)
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { LogIn, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from '@/hooks/use-auth';
import AuthenticatedHome from './AuthenticatedHome';

interface Branch {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export default function Home() {
  const { user } = useAuth();

  if (user) {
    return <AuthenticatedHome />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <nav className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">
            NSUT Syllabus Tracker
          </h1>
          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link to="/auth">
              <LogIn className="h-4 w-4" />
              Login
            </Link>
          </Button>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Your Complete NSUT Study Companion
          </h2>
          <p className="text-xl text-gray-600">
            Access comprehensive syllabus, study materials, and track your progress across all semesters.
          </p>
          <div className="space-y-4">
            <Button asChild size="lg" className="px-8">
              <Link to="/auth">
                Get Started
              </Link>
            </Button>
          </div>

          {/* Feature Section */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="text-3xl mb-4">📚</div>
              <h3 className="text-lg font-semibold mb-2">Complete Syllabus</h3>
              <p className="text-gray-600">Access detailed course content for all branches</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="text-3xl mb-4">📝</div>
              <h3 className="text-lg font-semibold mb-2">Progress Tracking</h3>
              <p className="text-gray-600">Keep track of your learning journey</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold mb-2">Study Resources</h3>
              <p className="text-gray-600">Access video lectures and PDF notes</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white mt-12 py-6 text-center text-gray-500">
        <p>© 2024 NSUT Syllabus Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
}