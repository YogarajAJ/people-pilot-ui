import { toast } from "sonner";

export interface Employee {
  id: string;
  name: string;
  email: string;
  designation: string;
  date_of_birth: string;
  phone_number: string;
  address: string;
  age: number;
  blood_type: string;
  ctc: number | string;
  employee_shift_hours: string | {
    days_per_week: number;
    end_time: string;
    hours_per_day: number;
    shift_type: string;
    start_time: string;
    weekend_work: boolean;
  };
}

export interface AttendanceLocation {
  type: 'inside' | 'outside';
  coordinates: {
    lat: number;
    lng: number;
  };
  distance_km?: number;
}

export interface ApiAttendanceLocation {
  distance_km: number;
  latitude: number;
  longitude: number;
  type: string; // "clock_in" or "clock_out"
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  clockIn: string;
  clockOut: string | null;
  location: {
    clockIn: AttendanceLocation;
    clockOut?: AttendanceLocation;
  };
  status: 'present' | 'absent' | 'late' | 'leave';
}

export interface ApiAttendanceRecord {
  id: string;
  employee_id: string;
  date: string;
  clock_in: string;
  clock_out: string;
  location: ApiAttendanceLocation;
  clock_out_location: ApiAttendanceLocation;
  status: string;
  clock_out_status: string;
  created_date: string;
  last_modified_date: string;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface AttendanceDate {
  date: string;
  day: string;
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  totalLeave: number;
  totalEmployees: number;
}

export interface DashboardData {
  attendance_summary: {
    date: string;
    total_employees: number;
    present_count: number;
    late_count: number;
    absent_count: number;
    present_percentage: number;
    late_percentage: number;
    absent_percentage: number;
  };
  recent_activity: Array<{
    employee_id: string;
    name: string;
    action: string;
    time: string;
    is_late: boolean;
  }>;
  weekly_overview: Array<{
    date: string;
    display_date: string;
    present: number;
    total: number;
  }>;
}

// API base URLs
const EMPLOYEE_API_BASE_URL = 'https://people-pilot-employee-service.onrender.com';
const ATTENDANCE_API_BASE_URL = 'https://people-pilot.onrender.com';

const mapApiAttendanceToRecord = async (apiRecord: ApiAttendanceRecord, employeeName?: string): Promise<AttendanceRecord> => {
  let status: 'present' | 'absent' | 'late' | 'leave' = 'present';
  
  if (apiRecord.status === 'INVALID_LOCATION') {
    status = 'late';
  } else if (apiRecord.status === 'ABSENT') {
    status = 'absent';
  } else if (apiRecord.status === 'LEAVE') {
    status = 'leave';
  }
  
  const name = employeeName || `Employee ${apiRecord.employee_id}`;
  
  const clockInTime = apiRecord.clock_in.split('T')[1]?.substring(0, 5) || '';
  const clockOutTime = apiRecord.clock_out ? apiRecord.clock_out.split('T')[1]?.substring(0, 5) : null;
  
  const locationType = apiRecord.location.distance_km < 0.1 ? 'inside' : 'outside';
  const clockOutLocationType = apiRecord.clock_out_location.distance_km < 0.1 ? 'inside' : 'outside';
  
  return {
    id: apiRecord.id,
    employeeId: apiRecord.employee_id,
    employeeName: name,
    date: apiRecord.date,
    clockIn: clockInTime,
    clockOut: clockOutTime,
    location: {
      clockIn: {
        type: locationType as 'inside' | 'outside',
        coordinates: {
          lat: apiRecord.location.latitude,
          lng: apiRecord.location.longitude
        },
        distance_km: apiRecord.location.distance_km
      },
      clockOut: {
        type: clockOutLocationType as 'inside' | 'outside',
        coordinates: {
          lat: apiRecord.clock_out_location.latitude,
          lng: apiRecord.clock_out_location.longitude
        },
        distance_km: apiRecord.clock_out_location.distance_km
      }
    },
    status
  };
};

const handleApiError = (error: unknown, fallbackMessage = 'An error occurred') => {
  console.error(error);
  if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error(fallbackMessage);
  }
  throw error;
};

export const getDashboardData = async (): Promise<DashboardData> => {
  try {
    const response = await fetch(`${ATTENDANCE_API_BASE_URL}/api/dashboard`);
    const data = await response.json();
    
    if (!data || !data.data) {
      throw new Error('Invalid response format from API');
    }
    
    console.log('Fetched dashboard data from API:', data.data);
    return data.data;
  } catch (error) {
    return handleApiError(error, 'Failed to fetch dashboard data');
  }
};

export const getAllEmployees = async (): Promise<Employee[]> => {
  try {
    console.log('Fetching all employees from API - this should only be called when needed');
    const response = await fetch(`${EMPLOYEE_API_BASE_URL}/api/employee/all`);
    const data = await response.json();
    
    if (!data || !data.data) {
      throw new Error('Invalid response format from API');
    }
    
    console.log('Fetched employees from API:', data.data);
    return data.data;
  } catch (error) {
    return handleApiError(error, 'Failed to fetch employees');
  }
};

export const getTotalEmployeeCount = async (): Promise<number> => {
  try {
    const employees = await getAllEmployees();
    return employees.length;
  } catch (error) {
    console.error('Error getting employee count:', error);
    return 0;
  }
};

export const getEmployeeById = async (id: string): Promise<Employee> => {
  try {
    console.log(`Fetching employee details for ID: ${id}`);
    const response = await fetch(`${EMPLOYEE_API_BASE_URL}/api/employee/${id}`);
    const data = await response.json();
    
    if (!data || !data.data) {
      throw new Error(`Employee with ID ${id} not found`);
    }
    
    return data.data;
  } catch (error) {
    return handleApiError(error, 'Failed to fetch employee details');
  }
};

export const getAttendanceByDate = async (date: string): Promise<AttendanceRecord[]> => {
  try {
    console.log(`Calling attendance by date API: ${ATTENDANCE_API_BASE_URL}/api/attendance/date?date=${date}`);
    const response = await fetch(`${ATTENDANCE_API_BASE_URL}/api/attendance/date?date=${date}`);
    const data: ApiResponse<ApiAttendanceRecord[]> = await response.json();
    
    if (!data || !data.data) {
      throw new Error('Invalid response format from API');
    }
    
    const records = data.data.map(record => {
      return mapApiAttendanceToRecord(record, undefined);
    });
    
    return Promise.all(records);
  } catch (error) {
    return handleApiError(error, 'Failed to fetch attendance records');
  }
};

export const getAttendanceDates = async (page = 1, pageSize = 10): Promise<{dates: AttendanceDate[], totalPages: number}> => {
  try {
    const dates: AttendanceDate[] = [];
    const today = new Date();
    const totalDays = 30; // Show last 30 days
    const totalPages = Math.ceil(totalDays / pageSize);
    
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalDays);
    
    const totalEmployees = await getTotalEmployeeCount();
    console.log('Total employees count:', totalEmployees);
    
    for (let i = startIndex; i < endIndex; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      const formattedDate = date.toISOString().split('T')[0];
      const day = date.toLocaleDateString('en-US', { weekday: 'long' });
      
      try {
        const attendanceRecords = await getAttendanceByDate(formattedDate);
        
        const uniqueEmployeeIds = new Set<string>();
        attendanceRecords.forEach(record => uniqueEmployeeIds.add(record.employeeId));
        
        const presentEmployees = attendanceRecords.filter(r => r.status === 'present');
        const lateEmployees = attendanceRecords.filter(r => r.status === 'late');
        const absentEmployees = attendanceRecords.filter(r => r.status === 'absent');
        const leaveEmployees = attendanceRecords.filter(r => r.status === 'leave');
        
        const uniquePresent = Array.from(new Set(presentEmployees.map(e => e.employeeId))).length;
        const uniqueLate = Array.from(new Set(lateEmployees.map(e => e.employeeId))).length;
        const uniqueAbsent = Array.from(new Set(absentEmployees.map(e => e.employeeId))).length;
        const uniqueLeave = Array.from(new Set(leaveEmployees.map(e => e.employeeId))).length;
        
        const totalStatuses = uniquePresent + uniqueLate + uniqueAbsent + uniqueLeave;
        
        let adjustedPresent = uniquePresent;
        let adjustedLate = uniqueLate;
        let adjustedAbsent = uniqueAbsent;
        let adjustedLeave = uniqueLeave;
        
        if (totalStatuses > totalEmployees && totalStatuses > 0) {
          const scalingFactor = totalEmployees / totalStatuses;
          adjustedPresent = Math.round(uniquePresent * scalingFactor);
          adjustedLate = Math.round(uniqueLate * scalingFactor);
          adjustedAbsent = Math.round(uniqueAbsent * scalingFactor);
          adjustedLeave = Math.round(uniqueLeave * scalingFactor);
          
          const roundingDiff = totalEmployees - (adjustedPresent + adjustedLate + adjustedAbsent + adjustedLeave);
          
          if (roundingDiff !== 0) {
            const maxStatus = Math.max(adjustedPresent, adjustedLate, adjustedAbsent, adjustedLeave);
            if (maxStatus === adjustedPresent) adjustedPresent += roundingDiff;
            else if (maxStatus === adjustedLate) adjustedLate += roundingDiff;
            else if (maxStatus === adjustedAbsent) adjustedAbsent += roundingDiff;
            else adjustedLeave += roundingDiff;
          }
        }
        
        dates.push({
          date: formattedDate,
          day,
          totalPresent: adjustedPresent,
          totalAbsent: adjustedAbsent,
          totalLate: adjustedLate,
          totalLeave: adjustedLeave,
          totalEmployees
        });
      } catch (error) {
        console.error(`Error fetching attendance for date ${formattedDate}:`, error);
        dates.push({
          date: formattedDate,
          day,
          totalPresent: 0,
          totalAbsent: 0,
          totalLate: 0,
          totalLeave: 0,
          totalEmployees
        });
      }
    }
    
    return { dates, totalPages };
  } catch (error) {
    console.error('Failed to generate attendance dates:', error);
    return { dates: [], totalPages: 0 };
  }
};

export const getEmployeeAttendance = async (employeeId: string): Promise<AttendanceRecord[]> => {
  try {
    const startDate = '2025-03-01';
    const endDate = new Date().toISOString().split('T')[0];
    
    const response = await fetch(`${ATTENDANCE_API_BASE_URL}/api/attendance/employee/${employeeId}?start_date=${startDate}&end_date=${endDate}`);
    const data: ApiResponse<ApiAttendanceRecord[]> = await response.json();
    
    if (!data || !data.data) {
      throw new Error('Invalid response format from API');
    }
    
    let employeeName: string;
    try {
      const employee = await getEmployeeById(employeeId);
      employeeName = employee.name;
    } catch (error) {
      console.error(`Failed to fetch employee name for ID ${employeeId}:`, error);
      employeeName = `Employee ${employeeId}`;
    }
    
    const promises = data.data.map(record => mapApiAttendanceToRecord(record, employeeName));
    return Promise.all(promises);
  } catch (error) {
    return handleApiError(error, 'Failed to fetch employee attendance');
  }
};
