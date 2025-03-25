
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AttendanceTable from '@/components/attendance/AttendanceTable';
import { useAppContext } from '@/context/AppContext';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchAttendanceByDate } from '@/store/slices/attendanceSlice';

const AttendanceDetail = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const { setCurrentPage } = useAppContext();
  const dispatch = useAppDispatch();
  const { records, isLoading } = useAppSelector(state => state.attendance);
  
  useEffect(() => {
    setCurrentPage('attendance');
    
    if (date) {
      console.log('Fetching attendance for date:', date);
      // Now we fetch the data only when this page is loaded (when user clicks on a date)
      dispatch(fetchAttendanceByDate(date));
    }
  }, [date, setCurrentPage, dispatch]);
  
  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  const currentDateRecords = date ? records[date] || [] : [];
  
  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-muted/10 p-4 rounded-lg border border-muted animate-fade-in">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 hover:bg-primary hover:text-white transition-all" 
            onClick={() => navigate('/attendance')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight text-primary">Attendance Details</h1>
        </div>
        
        <div className="text-sm text-muted-foreground">
          {formatDate(date)}
        </div>
      </div>
      
      <AttendanceTable 
        records={currentDateRecords} 
        date={date || ''} 
        isLoading={isLoading} 
      />
    </div>
  );
};

export default AttendanceDetail;
