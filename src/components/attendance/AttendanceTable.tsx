
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AttendanceRecord } from '@/lib/api';
import { Search, Filter, MapPin, Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AttendanceTableProps {
  records: AttendanceRecord[];
  date: string;
  isLoading: boolean;
}

const AttendanceTable = ({ records, date, isLoading }: AttendanceTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  
  // Use the records passed from the parent component, which were already fetched with a single API call
  // This ensures we don't make redundant API calls
  const uniqueEmployeeIds = new Set<string>();
  const uniqueRecords = records.filter(record => {
    if (uniqueEmployeeIds.has(record.employeeId)) {
      return false;
    }
    uniqueEmployeeIds.add(record.employeeId);
    return true;
  });
  
  const filteredRecords = uniqueRecords.filter((record) => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    const matchesLocation = locationFilter === 'all' || 
                           (locationFilter === 'inside' && record.location.clockIn.type === 'inside') || 
                           (locationFilter === 'outside' && record.location.clockIn.type === 'outside');
    
    return matchesSearch && matchesStatus && matchesLocation;
  });
  
  // Get status badge
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
        return <Badge className="bg-green-500">Present</Badge>;
    }
  };
  
  // Get location badge
  const getLocationBadge = (type: 'inside' | 'outside') => {
    if (type === 'inside') {
      return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">Office</Badge>;
    }
    return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-200">Remote</Badge>;
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse p-4">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 animate-fade-in p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="present">Present</SelectItem>
              <SelectItem value="late">Late</SelectItem>
              <SelectItem value="absent">Absent</SelectItem>
              <SelectItem value="leave">Leave</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-[150px]">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <SelectValue placeholder="Location" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="inside">Office</SelectItem>
              <SelectItem value="outside">Remote</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="rounded-lg glass overflow-hidden border border-slate-200 dark:border-slate-700/50">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Employee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Clock In</span>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Clock Out</span>
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  No attendance records found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredRecords.map((record) => (
                <TableRow key={record.id} className="hover:bg-muted/20 transition-colors">
                  <TableCell>
                    <Link to={`/employees/${record.employeeId}`} className="hover:text-primary transition-colors font-medium flex items-center gap-2">
                      <div className="bg-muted rounded-full p-1.5">
                        <User className="h-4 w-4" />
                      </div>
                      {record.employeeName}
                    </Link>
                  </TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                  <TableCell>
                    {record.status !== 'absent' && record.status !== 'leave' && 
                     getLocationBadge(record.location.clockIn.type)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{record.status !== 'absent' && record.status !== 'leave' ? record.clockIn : '-'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{record.clockOut || '-'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/employees/${record.employeeId}`}>
                        View Details
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AttendanceTable;
