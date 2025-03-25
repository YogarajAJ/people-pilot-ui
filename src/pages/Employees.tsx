
import React, { useState, useEffect } from 'react';
import EmployeeList from '@/components/employees/EmployeeList';
import { Employee, getAllEmployees } from '@/lib/api';
import { toast } from 'sonner';
import { Users } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setCurrentPage } = useAppContext();
  
  useEffect(() => {
    setCurrentPage('employees');
    
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        const data = await getAllEmployees();
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
        toast.error('Failed to load employees. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEmployees();
  }, [setCurrentPage]);
  
  return (
    <div className="space-y-6 pb-8">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700/50 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gradient">Employee Directory</h1>
            <p className="text-muted-foreground">
              Manage your employees and view their profiles.
            </p>
          </div>
        </div>
      </div>
      
      <div className="animate-content-fade-in animate-delay-200">
        <EmployeeList 
          employees={employees} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
};

export default Employees;
