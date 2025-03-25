
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Clock, X } from 'lucide-react';

interface RecentActivityItem {
  employee_id: string;
  name: string;
  action: string;
  time: string;
  is_late: boolean;
}

interface ActivityItemProps {
  avatar: string;
  name: string;
  action: string;
  time: string;
  isLate: boolean;
  delay: number;
}

const ActivityItem = ({ avatar, name, action, time, isLate, delay }: ActivityItemProps) => {
  const getActionIcon = () => {
    if (action.includes('late') || isLate) {
      return <Clock className="h-4 w-4 text-amber-500" />;
    } else if (action.includes('clocked in')) {
      return <Check className="h-4 w-4 text-green-500" />;
    } else if (action.includes('clocked out')) {
      return <Clock className="h-4 w-4 text-blue-500" />;
    } else if (action.includes('absent')) {
      return <X className="h-4 w-4 text-red-500" />;
    }
    return <Check className="h-4 w-4 text-green-500" />;
  };

  return (
    <div className={`flex items-center gap-3 py-3 animate-fade-in`} style={{ animationDelay: `${delay}ms` }}>
      <div className="h-9 w-9 rounded-full overflow-hidden border border-border flex-shrink-0">
        <img src={avatar} alt={name} className="h-full w-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{name}</p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>{action}</span>
          <span className="text-muted-foreground/50">•</span>
          <span>{time}</span>
        </div>
      </div>
      <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
        {getActionIcon()}
      </div>
    </div>
  );
};

interface RecentActivityProps {
  activities: RecentActivityItem[];
  isLoading?: boolean;
}

const RecentActivity = ({ activities = [], isLoading = false }: RecentActivityProps) => {
  // Transform the API data into the format needed for the ActivityItem component
  const activityItems = activities.map((activity, index) => {
    // Get default avatar based on employee ID
    const avatarNumber = parseInt(activity.employee_id.replace('EMP', '')) % 100;
    const gender = avatarNumber % 2 === 0 ? 'men' : 'women';
    
    return {
      avatar: `https://randomuser.me/api/portraits/${gender}/${avatarNumber}.jpg`,
      name: activity.name,
      action: activity.action,
      time: activity.time,
      isLate: activity.is_late,
      delay: 100 + (index * 100)
    };
  });

  return (
    <Card className="glass h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center gap-3 py-2 animate-pulse">
                <div className="h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/2"></div>
                </div>
                <div className="h-7 w-7 rounded-md bg-gray-200 dark:bg-gray-700"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {activityItems.map((activity, index) => (
              <ActivityItem key={index} {...activity} />
            ))}
            {activityItems.length === 0 && (
              <div className="py-8 text-center text-muted-foreground">
                <p>No recent activity found</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
