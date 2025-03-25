
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Employee, AttendanceRecord } from '@/lib/api';
import { 
  Mail, 
  Phone, 
  Calendar, 
  Briefcase, 
  Building, 
  MapPin, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  User,
  Home,
  Droplet
} from 'lucide-react';

interface EmployeeProfileProps {
  employee: Employee;
  attendanceRecords: AttendanceRecord[];
  isLoading: boolean;
}

const EmployeeProfile = ({ employee, attendanceRecords, isLoading }: EmployeeProfileProps) => {
  if (isLoading) {
    return (
      <div className="grid gap-6 animate-pulse">
        <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
        <div className="h-60 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
        <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
      </div>
    );
  }
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Calculate statistics
  const presentDays = attendanceRecords.filter(r => r.status === 'present').length;
  const lateDays = attendanceRecords.filter(r => r.status === 'late').length;
  const absentDays = attendanceRecords.filter(r => r.status === 'absent').length;
  const leaveDays = attendanceRecords.filter(r => r.status === 'leave').length;
  
  const totalDays = presentDays + lateDays + absentDays + leaveDays;
  const attendanceRate = totalDays > 0 ? ((presentDays + lateDays) / totalDays) * 100 : 0;
  const punctualityRate = (presentDays + lateDays) > 0 ? (presentDays / (presentDays + lateDays)) * 100 : 0;
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Format shift hours
  const formatShiftHours = () => {
    if (typeof employee.employee_shift_hours === 'string') {
      return employee.employee_shift_hours;
    }
    
    const shift = employee.employee_shift_hours;
    return `${shift.start_time} - ${shift.end_time} (${shift.shift_type.charAt(0).toUpperCase() + shift.shift_type.slice(1)} Shift)`;
  };
  
  // Get the status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-500">Present</Badge>;
      case 'late':
        return <Badge className="bg-amber-500">Late</Badge>;
      case 'absent':
        return <Badge className="bg-red-500">Absent</Badge>;
      case 'leave':
        return <Badge className="bg-purple-500">Leave</Badge>;
      default:
        return null;
    }
  };
  
  // Get the location badge
  const getLocationBadge = (type: 'inside' | 'outside') => {
    if (type === 'inside') {
      return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">Office</Badge>;
    }
    return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-200">Remote</Badge>;
  };
  
  return (
    <div className="grid gap-6">
      {/* Employee Information Card */}
      <Card className="glass overflow-hidden animate-fade-in">
        <div className="relative h-32 bg-gradient-to-r from-primary/20 to-primary/10">
          <div className="absolute -bottom-16 left-8">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarFallback className="bg-primary/10 text-primary text-4xl">
                {getInitials(employee.name)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        
        <CardContent className="pt-20 pb-6 px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <h2 className="text-2xl font-bold">{employee.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{employee.designation}</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-full">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button size="sm" className="rounded-full">
                <Phone className="h-4 w-4 mr-2" />
                Call
              </Button>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Employee ID</p>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <span>{employee.id}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Email</p>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>{employee.email}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Phone</p>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>{employee.phone_number}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Date of Birth</p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>{formatDate(employee.date_of_birth)} ({employee.age} years)</span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Blood Type</p>
              <div className="flex items-center gap-2">
                <Droplet className="h-4 w-4 text-primary" />
                <span>{employee.blood_type}</span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Address</p>
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-primary" />
                <span className="truncate">{employee.address}</span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Shift Hours</p>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>{formatShiftHours()}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">CTC</p>
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-primary" />
                <span>${typeof employee.ctc === 'number' ? employee.ctc.toLocaleString() : employee.ctc}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Attendance Statistics */}
      <Card className="glass animate-fade-in [animation-delay:100ms]">
        <CardHeader>
          <CardTitle>Attendance Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-green-500/10 flex flex-col items-center text-center">
              <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
              <span className="text-2xl font-bold">{presentDays}</span>
              <span className="text-sm text-muted-foreground">Present Days</span>
            </div>
            
            <div className="p-4 rounded-lg bg-amber-500/10 flex flex-col items-center text-center">
              <Clock className="h-8 w-8 text-amber-500 mb-2" />
              <span className="text-2xl font-bold">{lateDays}</span>
              <span className="text-sm text-muted-foreground">Late Days</span>
            </div>
            
            <div className="p-4 rounded-lg bg-red-500/10 flex flex-col items-center text-center">
              <XCircle className="h-8 w-8 text-red-500 mb-2" />
              <span className="text-2xl font-bold">{absentDays}</span>
              <span className="text-sm text-muted-foreground">Absent Days</span>
            </div>
            
            <div className="p-4 rounded-lg bg-purple-500/10 flex flex-col items-center text-center">
              <Calendar className="h-8 w-8 text-purple-500 mb-2" />
              <span className="text-2xl font-bold">{leaveDays}</span>
              <span className="text-sm text-muted-foreground">Leave Days</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="p-4 rounded-lg border">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Attendance Rate</span>
                <span className="text-sm">{attendanceRate.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full" 
                  style={{ width: `${attendanceRate}%` }}
                />
              </div>
            </div>
            
            <div className="p-4 rounded-lg border">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Punctuality Rate</span>
                <span className="text-sm">{punctualityRate.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full" 
                  style={{ width: `${punctualityRate}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Recent Attendance Records */}
      <Card className="glass animate-fade-in [animation-delay:200ms]">
        <CardHeader>
          <CardTitle>Recent Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          {attendanceRecords.length === 0 ? (
            <p className="text-center py-6 text-muted-foreground">No attendance records found.</p>
          ) : (
            <div className="space-y-4">
              {attendanceRecords.slice(0, 5).map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{formatDate(record.date)}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusBadge(record.status)}
                        {record.location.clockIn.type && getLocationBadge(record.location.clockIn.type)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{record.status !== 'absent' && record.status !== 'leave' ? record.clockIn : '-'}</span>
                    </div>
                    <div className="flex items-center justify-end gap-1 mt-1 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{record.clockOut || '-'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeProfile;
