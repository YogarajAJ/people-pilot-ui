
import React, { useState, useEffect } from 'react';
import EmployeeStats from '@/components/dashboard/EmployeeStats';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import { useAppContext } from '@/context/AppContext';
import { useQuery } from '@tanstack/react-query';
import { getDashboardData } from '@/lib/api';

// Define interfaces for the dashboard data
interface AttendanceSummary {
  date: string;
  total_employees: number;
  present_count: number;
  late_count: number;
  absent_count: number;
  present_percentage: number;
  late_percentage: number;
  absent_percentage: number;
}

interface RecentActivityItem {
  employee_id: string;
  name: string;
  action: string;
  time: string;
  is_late: boolean;
}

interface WeeklyOverviewItem {
  date: string;
  display_date: string;
  present: number;
  total: number;
}

interface DashboardData {
  attendance_summary: AttendanceSummary;
  recent_activity: RecentActivityItem[];
  weekly_overview: WeeklyOverviewItem[];
}

const Dashboard = () => {
  const { setCurrentPage } = useAppContext();
  
  useEffect(() => {
    setCurrentPage('dashboard');
  }, [setCurrentPage]);

  // Use react-query to fetch dashboard data with corrected options
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboardData'],
    queryFn: getDashboardData,
    retry: 1,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  // If there's an error, show toast notification
  useEffect(() => {
    if (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data. Please try again later.');
    }
  }, [error]);

  // Format chart data from the weekly overview
  const chartData = dashboardData?.weekly_overview?.map(day => ({
    day: day.display_date,
    date: day.date,
    totalPresent: day.present,
    totalAbsent: day.total - day.present,
    totalEmployees: day.total
  })) || [];

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the HR Admin Portal. Here's an overview of your employee attendance.
        </p>
      </div>
      
      <EmployeeStats 
        totalEmployees={dashboardData?.attendance_summary?.total_employees || 0}
        presentToday={dashboardData?.attendance_summary?.present_count || 0}
        lateToday={dashboardData?.attendance_summary?.late_count || 0}
        absentToday={dashboardData?.attendance_summary?.absent_count || 0}
        isLoading={isLoading}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass lg:col-span-2 animate-fade-in [animation-delay:300ms]">
          <CardHeader>
            <CardTitle>Weekly Attendance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground">Loading chart data...</p>
                </div>
              ) : chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                    barGap={0}
                    barCategoryGap={10}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        border: 'none' 
                      }} 
                    />
                    <Bar dataKey="totalPresent" name="Present" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="totalAbsent" name="Absent" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground">No attendance data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <RecentActivity 
          activities={dashboardData?.recent_activity || []}
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
};

export default Dashboard;
