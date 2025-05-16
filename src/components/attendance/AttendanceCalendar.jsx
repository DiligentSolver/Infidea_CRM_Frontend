import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import EmployeeServices from '@/services/EmployeeServices';
// Import icons
import { 
  FaCheck, FaRunning, FaBed, FaUmbrella, 
  FaPlane, FaClock, FaExclamationCircle, FaSyncAlt, FaHome,
  FaHamburger, FaCalendarAlt, FaChevronLeft, FaChevronRight,
  FaBan
} from 'react-icons/fa';
import { MdHourglassEmpty } from 'react-icons/md';

const AttendanceCalendar = ({ leaves = [], loading: parentLoading = false, refresh }) => {
  const [calendarData, setCalendarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1); // 1-12
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState(null);

  // Fetch calendar data for the selected month and year
  useEffect(() => {
    const fetchCalendarData = async () => {
      setLoading(true);
      try {
        const response = await EmployeeServices.getAttendanceCalendarData(currentMonth, currentYear);
        if (response.success) {
          setCalendarData(response.data);
        } else {
          throw new Error(response.message || 'Failed to fetch calendar data');
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching calendar data');
        console.error('Calendar fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarData();
  }, [currentMonth, currentYear, leaves]); // Add leaves to the dependency array to refresh when leaves change

  console.log(calendarData);

  // Get month name
  const getMonthName = (month) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[month - 1];
  };

  // Navigate to previous month
  const goToPrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // Navigate to next month
  const goToNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Generate the days of the week header
  const renderDaysHeader = () => {
    const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    return (
      <div className="grid grid-cols-7 gap-1 max-w-full overflow-hidden">
        {daysOfWeek.map((day, index) => (
          <div 
            key={`day-header-${index}`}
            className={`text-center text-xs sm:text-sm font-semibold py-1 sm:py-2 ${
              index === 0 
                ? 'text-rose-500 dark:text-rose-400' 
                : index === 6 
                  ? 'text-blue-500 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            {day}
          </div>
        ))}
      </div>
    );
  };


  // Generate calendar days for the current month with a modern card design
  const renderCalendarDays = () => {
    if (!calendarData) return null;

    const { year, month, calendar } = calendarData;
    const daysInMonth = calendarData.totalDays;
    const firstDay = new Date(year, month - 1, 1).getDay();
    
    // Create an array to hold all calendar cells (empty + days)
    const calendarCells = [];
    
    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < firstDay; i++) {
      calendarCells.push(
        <div key={`empty-${i}`} className="h-8 sm:h-11 md:h-14 rounded-md"></div>
      );
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayData = calendar[day] || { status: 'Present', type: 'P' };
      const isToday = 
        new Date().getDate() === day && 
        new Date().getMonth() === month - 1 && 
        new Date().getFullYear() === year;
      const isSelected = selectedDay === day;
      const isPending = dayData.status.toLowerCase().includes("pending") || 
                       (dayData.leaveDetails && dayData.leaveDetails.status === "Pending");
      const isRejected = dayData.status.toLowerCase().includes("rejected") ||
                        (dayData.leaveDetails && dayData.leaveDetails.status === "Rejected");
      
      // Get day name
      const dayOfWeek = new Date(year, month - 1, day).getDay();
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayName = dayNames[dayOfWeek];
      
      // Get status icon
      let icon = null;
      let statusClass = null;
      let statusText = null;
      if (isPending && dayData.type !== 'P' && dayData.type !== 'WO' && dayData.type !== 'NR') {
        icon = <FaSyncAlt className="text-orange-500 dark:text-orange-400 animate-spin-slow text-[8px] md:text-[12px] lg:text-[14px]" />;
        statusText = "Pending";
      } else if(dayData.type==='P'||dayData?.attendanceDetails?.present){
        icon = <FaCheck className="text-green-500 dark:text-green-400 text-[8px] md:text-[12px] lg:text-[14px]" />;
        statusText = "Present";
      }
      else if(dayData.type==='NR'){
        icon = <MdHourglassEmpty className="bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400" />;
        statusText = "No record";
      }else if (dayData.type.includes('WO')) {
        icon = <FaHome className="text-green-500 dark:text-green-400 text-[8px] md:text-[12px] lg:text-[14px]" />;
        statusClass = "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
        statusText = "Week Off";
      } else if (dayData.type.includes('SL')) {
        icon = <FaBed className="text-red-500 dark:text-red-400 text-[8px] md:text-[12px] lg:text-[14px]" />;
        statusText = "Sick Leave";
      }  else if (dayData.type.includes('CL')) {
        icon = <FaUmbrella className="text-amber-500 dark:text-amber-400 text-[8px] md:text-[12px] lg:text-[14px]" />;
    
        statusText = "Casual Leave";
      } else if (dayData.type.includes('PL')) {
        icon = <FaPlane className="text-blue-500 dark:text-blue-400 text-[8px] md:text-[12px] lg:text-[14px]" />;
        statusText = "Privilege Leave";
      }else if (dayData.type.includes('SDL')) {
        icon = <FaHamburger className="text-orange-500 dark:text-orange-400 text-[8px] md:text-[12px] lg:text-[14px]" />;
        statusText = "Sandwich Leave";
      }
      
      // Handle approval status
      if (isRejected && dayData.type !== 'P' && dayData.type !== 'WO' && dayData.type !== 'U') {
        icon = <FaBan className="text-red-500 dark:text-red-400 text-[8px] md:text-[12px] lg:text-[14px]" />;
      }
      
      // Add indicators for half-day and early logout
      let badges = [];
      if (dayData.type && dayData.type.includes('-HD')) {
        badges.push(
          <FaClock size={10} className="text-indigo-500 dark:text-indigo-400 absolute top-0.5 right-0.5 sm:top-1 sm:right-1 text-[8px] md:text-[12px] lg:text-[14px]" />
        );
      }
      if (dayData.type && dayData.type.includes('-EL')) {
        badges.push(
          <FaRunning size={10} className="text-gray-500 dark:text-gray-400 absolute top-0.5 right-0.5 sm:top-1 sm:right-1 text-[8px] md:text-[12px] lg:text-[14px]" />
        );
      }
      
      // Check if it's a Sunday (0) and includes leave data
      if ((dayOfWeek === 0) && dayData.type && !dayData.type.includes('WO') && dayData.leaveReason) {
        badges.push(
          <FaHome size={10} className="text-green-500 dark:text-green-400 absolute top-0.5 right-0.5 sm:top-1 sm:right-1 text-[8px] md:text-[12px] lg:text-[14px]" />,
        );
        statusClass = "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
      }
      
      // Check if it's a second or fourth Saturday 
      if (dayOfWeek === 6) { // Saturday
        // Get all Saturdays in this month
        const firstDayOfMonth = new Date(year, month - 1, 1);
        // Get day of first Saturday (if first day is Saturday, it's 1, otherwise find first Saturday)
        const firstSaturdayDate = 7 - ((firstDayOfMonth.getDay() + 1) % 7 || 7) + 1;
        
        // Calculate which Saturday this is (e.g., 1st, 2nd, 3rd, 4th, or 5th)
        const saturdayIndex = Math.floor((day - firstSaturdayDate) / 7) + 1;
        
        // Second and fourth Saturdays are typically off
        if (saturdayIndex === 2 || saturdayIndex === 4) {
          // If it's not already marked as a week off and doesn't have leave data
          if (!dayData.type.includes('WO')) {
            if (dayData.leaveReason) {
              badges.push(
                <FaHome size={10} className="text-green-500 dark:text-green-400 absolute top-0.5 right-0.5 sm:top-1 sm:right-1 text-[8px] md:text-[12px] lg:text-[14px]" />,
              );
            } else {
              // If no other status assigned, mark it as a week off
              if (icon === null || dayData.type === 'P') {
                icon =                 <FaHome size={10} className="text-green-500 dark:text-green-400 absolute top-0.5 right-0.5 sm:top-1 sm:right-1 text-[8px] md:text-[12px] lg:text-[14px]" />,
                statusText = "Weekend Off";
              }
            }
            statusClass = "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"

          }
        }
      }
      
     if(dayData.approved===false&&dayData.type.includes('PL')){
        badges.push(
          <FaPlane size={10} className="text-blue-500 dark:text-blue-400 absolute bottom-0.5 right-0.5 sm:bottom-1 sm:right-1 text-[8px] md:text-[12px] lg:text-[14px]" />
        );
      }if(dayData.approved===false&&dayData.type.includes('CL')){
        badges.push(
          <FaUmbrella size={10} className="text-red-500 dark:text-red-400 absolute bottom-0.5 right-0.5 sm:bottom-1 sm:right-1 text-[8px] md:text-[12px] lg:text-[14px]" />
        );
      }if(dayData.approved===false&&dayData.type.includes('SDL')){
        badges.push(
          <FaHamburger size={10} className="text-orange-500 dark:text-orange-400 absolute bottom-0.5 right-0.5 sm:bottom-0.5 sm:right-1 text-[8px] md:text-[12px] lg:text-[14px]" />
        );
      }if(dayData.approved===false&&dayData.type.includes('SL')){
        badges.push(
          <FaBed size={10} className="text-red-500 dark:text-red-400 absolute bottom-0.5 right-0.5 sm:bottom-1 sm:right-1 text-[8px] md:text-[12px] lg:text-[14px]" />
        );
      }if(dayData.approved===false&&dayData?.attendanceDetails?.present){
        badges.push(
          <FaCheck className="text-green-500 dark:text-green-400 absolute bottom-0.5 left-1 sm:bottom-1 sm:right-1 text-[8px] md:text-[12px] lg:text-[14px]" />
        );
      }

      // Add status indicators
      if (isPending) {
        badges.push(
          <span key="pending" className="absolute top-0 left-0 w-0 h-0 border-solid border-t-[6px] md:border-t-[8px] border-t-orange-500 dark:border-t-orange-400 border-r-[6px] md:border-r-[8px] border-r-transparent"></span>
        );
      }
      
      if (isRejected) {
        badges.push(
          <span key="rejected" className="absolute top-0 left-0 w-0 h-0 border-solid border-t-[6px] md:border-t-[8px] border-t-red-500 dark:border-t-red-400 border-r-[6px] md:border-r-[8px] border-r-transparent"></span>
        );
      }
      
      // Classes for the day cell
      let cellClasses = `relative h-8 sm:h-11 md:h-14 rounded-md border ${dayData.type.includes('P')?null:statusClass} flex flex-col items-center justify-center cursor-pointer`;
      
      if (isToday) {
        cellClasses += " ring-1 sm:ring-2 ring-blue-500 dark:ring-blue-400 ring-offset-1 sm:ring-offset-2 dark:ring-offset-gray-900 ring-opacity-70";
      }
      
      if (isSelected) {
        cellClasses += " transform scale-95 shadow-inner dark:shadow-gray-900";
      } else {
        cellClasses += " border-1 sm:border-2 border-gray-200 dark:border-gray-700 hover:shadow-md dark:hover:shadow-gray-900 hover:-translate-y-1";
      }

      // Add pending status visual indicator
      if (isPending) {
        cellClasses += " bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800";
      }

      calendarCells.push(
        <div
          key={`day-${day}`}
          className={cellClasses}
          onClick={() => setSelectedDay(isSelected ? null : day)}
        >
          <div className="flex flex-col items-center">
            <span className="text-[6px] sm:text-[8px] md:text-[10px] text-gray-500 dark:text-gray-400">{dayName}</span>
            <span className={`font-semibold text-2xs xs:text-xs ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-800 dark:text-gray-200'}`}>{day}</span>
          </div>
          <div className="flex items-center justify-center my-0.5 sm:my-1 text-center text-[6px] md:text-[12px] lg:text-[14px]">
            {icon}
          </div>
          {badges}
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-7 gap-0.5 xs:gap-1 sm:gap-1 max-w-full overflow-hidden">
        {calendarCells}
      </div>
    );
  };

  // Render legend items with icons
  const renderLegend = () => {
    const legendItems = [
      { icon: <FaCheck className="text-[8px] md:text-[12px] lg:text-[14px]" />, color: "bg-green-50 dark:bg-green-900/20 text-green-500 dark:text-green-400", text: "Present" },
      { icon: <FaHome className="text-[8px] md:text-[12px] lg:text-[14px]" />, color: "bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400", text: "Week Off" },
      { icon: <MdHourglassEmpty className="text-[8px] md:text-[12px] lg:text-[14px]" />, color: "bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400", text: "No Record" },
      { icon: <FaSyncAlt className="text-[8px] md:text-[12px] lg:text-[14px] animate-spin-slow" />, color: "bg-orange-50 dark:bg-orange-900/20 text-orange-500 dark:text-orange-400", text: "Pending" },
      { icon: <FaBan className="text-[8px] md:text-[12px] lg:text-[14px]" />, color: "bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400", text: "Rejected" },
      { icon: <FaBed className="text-[8px] md:text-[12px] lg:text-[14px]" />, color: "bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400", text: "Sick" },
      { icon: <FaUmbrella className="text-[8px] md:text-[12px] lg:text-[14px]" />, color: "bg-amber-50 dark:bg-amber-900/20 text-amber-500 dark:text-amber-400", text: "Casual" },
      { icon: <FaPlane className="text-[8px] md:text-[12px] lg:text-[14px]" />, color: "bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400", text: "Privilege" },
      { icon: <FaClock className="text-[8px] md:text-[12px] lg:text-[14px]" />, color: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 dark:text-indigo-400", text: "Half Day" },
      { icon: <FaRunning className="text-[8px] md:text-[12px] lg:text-[14px]" />, color: "bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400", text: "Early Out" },
      { icon: <FaHamburger className="text-[8px] md:text-[12px] lg:text-[14px]" />, color: "bg-amber-100 dark:bg-amber-900/30 text-orange-500 dark:text-orange-400", text: "Sandwich" },
    ];
    
    return (
      <div className="flex flex-wrap justify-center gap-1 xs:gap-2 mt-2 sm:mt-4 px-1">
        {legendItems.map((item, idx) => (
          <div key={idx} className="legend-pill flex items-center px-1 xs:px-1 py-0.5 xs:py-0.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-2xs xs:text-xs shadow-sm dark:shadow-gray-900 mb-1">
            <span className={`flex items-center justify-center w-4 h-4 xs:w-5 xs:h-5 rounded-full mr-0.5 xs:mr-1 ${item.color}`}>
              {item.icon}
            </span>
            <span className="text-gray-800 dark:text-gray-200 text-[8px] md:text-[12px] lg:text-[14px]">{item.text}</span>
          </div>
        ))}
      </div>
    );
  };

  // Render detailed view of selected day
  const renderDetailView = () => {
    if (!selectedDay || !calendarData?.calendar[selectedDay]) return null;
    
    const dayData = calendarData.calendar[selectedDay];
    
    // Get full day name
    const dayOfWeek = new Date(currentYear, currentMonth - 1, selectedDay).getDay();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = dayNames[dayOfWeek];
    
    return (
      <div className="mt-2 sm:mt-4 p-2 sm:p-3 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 dark:shadow-gray-900 animate-fadeIn">
        <div className="flex items-center justify-between mb-1 sm:mb-2">
          <h3 className="text-sm sm:text-base font-medium text-gray-800 dark:text-gray-200">
            {dayName}, {getMonthName(currentMonth)} {selectedDay}, {currentYear}
          </h3>
          <button 
            onClick={() => setSelectedDay(null)}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex flex-col text-xs sm:text-sm">
          <div className="flex items-center py-0.5 sm:py-1">
            <span className="font-semibold text-gray-700 dark:text-gray-300 w-16 sm:w-24">Status:</span>
            <span className="text-gray-800 dark:text-gray-200">{dayData.status || 'Present'}</span>
          </div>
          
          {dayData.leaveType && (
            <div className="flex items-center py-0.5 sm:py-1">
              <span className="font-semibold text-gray-700 dark:text-gray-300 w-16 sm:w-24">Type:</span>
              <span className="text-gray-800 dark:text-gray-200">{dayData.leaveType}</span>
            </div>
          )}

          {dayData.leaveReason && (
            <div className="flex items-center py-0.5 sm:py-1">
              <span className="font-semibold text-gray-700 dark:text-gray-300 w-16 sm:w-24">Reason:</span>
              <span className="text-gray-800 dark:text-gray-200">{dayData.leaveReason}</span>
            </div>
          )}
          
          {dayData.description && (
            <div className="flex flex-col sm:flex-row items-start py-0.5 sm:py-1">
              <span className="font-semibold text-gray-700 dark:text-gray-300 w-16 sm:w-24 mb-0.5 sm:mb-0">Description:</span>
              <span className="text-gray-800 dark:text-gray-200 break-words">{dayData.description}</span>
            </div>
          )}
          
        </div>
      </div>
    );
  };

  // Refresh button handler
  const handleRefresh = () => {
    if (refresh && typeof refresh === 'function') {
      refresh(); // Call the parent's refresh function
    } else {
      // If no refresh function is provided, just reload the current page
      window.location.reload();
    }
  };

  return (
    
    <div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-lg sm:rounded-xl shadow-md dark:shadow-gray-900 overflow-hidden">

    {renderLegend()}

      {/* Calendar header with month navigation */}
      <div className="p-2 sm:p-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <button 
            className="p-1 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={goToPrevMonth}
          >
            <FaChevronLeft className="text-gray-600 dark:text-gray-400 text-xs sm:text-base" />
          </button>
          
          <div className="flex items-center">
            <FaCalendarAlt className="text-blue-500 dark:text-blue-400 mr-1 sm:mr-2 text-xs sm:text-base" />
            <h2 className="text-sm sm:text-xl font-semibold text-gray-800 dark:text-gray-200">
              {getMonthName(currentMonth)} {currentYear}
            </h2>
          </div>
          
          <div className="flex items-center">
            <button 
              className="p-1 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 mr-1"
              onClick={handleRefresh}
              title="Refresh calendar"
            >
              <FaSyncAlt className="text-gray-600 dark:text-gray-400 text-xs sm:text-base" />
            </button>
            
            <button 
              className="p-1 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={goToNextMonth}
            >
              <FaChevronRight className="text-gray-600 dark:text-gray-400 text-xs sm:text-base" />
            </button>
          </div>
        </div>
      </div>

      
      {/* Calendar content */}
      <div className="p-2 sm:p-3">
        {loading || parentLoading ? (
          <div className="flex items-center justify-center py-8 sm:py-16">
            <div className="loader"></div>
            <span className="ml-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400">Loading...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-8 sm:py-16 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-3 sm:mb-4">
              <FaExclamationCircle className="text-red-500 dark:text-red-400" size={20} />
            </div>
            <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 mb-3 sm:mb-4">{error}</p>
            <button 
              onClick={handleRefresh}
              className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-500 dark:bg-blue-600 text-white text-xs sm:text-sm rounded-md hover:bg-blue-600 dark:hover:bg-blue-500"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {renderDaysHeader()}
            {renderCalendarDays()}
            {renderDetailView()}          </>
        )}
      </div>
      
      <style jsx>{`
        .loader {
          border: 2px solid #f3f3f3;
          border-top: 2px solid #3498db;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          animation: spin 1s linear infinite;
        }

        @media (min-width: 640px) {
          .loader {
            border-width: 3px;
            width: 24px;
            height: 24px;
          }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
        
        
        
        .legend-pill:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .tooltip {
          animation: fadeIn 0.2s ease-out forwards;
        }

        /* Custom text size for very small screens */
        .text-2xs {
          font-size: 0.65rem;
          line-height: 0.9rem;
        }

        /* Custom screen size */
        @media (min-width: 480px) {
          .xs\:text-xs {
            font-size: 0.75rem;
            line-height: 1rem;
          }
          .xs\:gap-2 {
            gap: 0.5rem;
          }
          .xs\:px-2 {
            padding-left: 0.5rem;
            padding-right: 0.5rem;
          }
          .xs\:py-1 {
            padding-top: 0.25rem;
            padding-bottom: 0.25rem;
          }
          .xs\:mr-1 {
            margin-right: 0.25rem;
          }
          .xs\:w-5 {
            width: 1.25rem;
          }
          .xs\:h-5 {
            height: 1.25rem;
          }
          .xs\:gap-1 {
            gap: 0.25rem;
          }
        }

        /* Dark mode style for loader */
        @media (prefers-color-scheme: dark) {
          .loader {
            border-color: #374151;
            border-top-color: #60a5fa;
          }
        }
      `}</style>
    </div>
  );
};

export default AttendanceCalendar; 