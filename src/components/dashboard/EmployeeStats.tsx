
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Check, Clock, CalendarX } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
  className?: string;
  isLoading?: boolean;
}

const StatCard = ({ title, value, icon, description, className, isLoading }: StatCardProps) => (
  <Card className={`glass card-hover overflow-hidden ${className}`}>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      ) : (
        <div className="text-2xl font-bold">{value !== null && value !== undefined ? value : 0}</div>
      )}
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </CardContent>
  </Card>
);

interface EmployeeStatsProps {
  totalEmployees: number;
  presentToday: number;
  lateToday: number;
  absentToday: number;
  presentPercentage?: number;
  latePercentage?: number;
  absentPercentage?: number;
  isLoading?: boolean;
}

const EmployeeStats = ({ 
  totalEmployees = 0, 
  presentToday = 0, 
  lateToday = 0, 
  absentToday = 0,
  presentPercentage,
  latePercentage,
  absentPercentage,
  isLoading = false 
}: EmployeeStatsProps) => {
  // Calculate percentages for descriptions if not provided
  const calculatedPresentPercentage = presentPercentage ?? (totalEmployees > 0 ? ((presentToday / totalEmployees) * 100).toFixed(1) : '0');
  const calculatedLatePercentage = latePercentage ?? (totalEmployees > 0 ? ((lateToday / totalEmployees) * 100).toFixed(1) : '0');
  const calculatedAbsentPercentage = absentPercentage ?? (totalEmployees > 0 ? ((absentToday / totalEmployees) * 100).toFixed(1) : '0');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Employees"
        value={totalEmployees || 0}
        icon={<Users className="h-4 w-4 text-primary" />}
        description="Active employees in the system"
        className="animate-fade-in [animation-delay:100ms]"
        isLoading={isLoading}
      />
      <StatCard
        title="Present Today"
        value={presentToday || 0}
        icon={<Check className="h-4 w-4 text-green-500" />}
        description={`${calculatedPresentPercentage}% of total workforce`}
        className="animate-fade-in [animation-delay:200ms]"
        isLoading={isLoading}
      />
      <StatCard
        title="Late Today"
        value={lateToday || 0}
        icon={<Clock className="h-4 w-4 text-amber-500" />}
        description={`${calculatedLatePercentage}% of total workforce`}
        className="animate-fade-in [animation-delay:300ms]"
        isLoading={isLoading}
      />
      <StatCard
        title="Absent Today"
        value={absentToday || 0}
        icon={<CalendarX className="h-4 w-4 text-red-500" />}
        description={`${calculatedAbsentPercentage}% of total workforce`}
        className="animate-fade-in [animation-delay:400ms]"
        isLoading={isLoading}
      />
    </div>
  );
};

export default EmployeeStats;
