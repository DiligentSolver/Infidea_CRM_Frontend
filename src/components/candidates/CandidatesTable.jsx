import { TableBody, TableCell, TableRow } from "@windmill/react-ui";
import { useState } from "react";
import { FaEdit, FaEye, FaLock, FaUnlock, FaInfoCircle } from "react-icons/fa";

// Internal imports
import { formatLongDateAndTime } from "@/utils/dateFormatter";
import { MdInfo } from "react-icons/md";
import { getStatusColorClass } from "@/utils/optionsData";

const CandidatesTable = ({candidates, onView, onEdit}) => {

  // Use a wrapper function that handles null/undefined status values
  const getStatusColor = (status) => {
    // Ensure status is a non-empty string before applying color
    if (!status) return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    return getStatusColorClass(status);
  };

  // Calculate total call duration from call history
  const getTotalCallDuration = (employeeCallHistory) => {
    if (!employeeCallHistory || employeeCallHistory.length === 0) return "No call made yet";
    
    const totalMinutes = employeeCallHistory.reduce((total, call) => {
      // Extract numeric value from duration string (assuming format like "5 min")
      const minutes = parseInt(call.duration?.split(' ')[0]) || 0;
      return total + minutes;
    }, 0);
    
    return totalMinutes <= 1 ? `${totalMinutes} minute` : `${totalMinutes} minutes`;
  };

  // Format individual call history for tooltip
  const formatCallHistory = (employeeCallHistory) => {
    if (!employeeCallHistory || employeeCallHistory.length === 0) return "No call history";
    
    // Sort the call history to show latest calls at the top (descending order by date)
    const sortedHistory = [...employeeCallHistory].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
    
    return sortedHistory.sort((a, b) => new Date(b.date) - new Date(a.date)).map((call, index) => (
      `Call ${employeeCallHistory.length - index}: ${call.duration<=1?`${call.duration} minute`:`${call.duration} minutes`} (${formatLongDateAndTime(call.date)})`
    )).join('\n');
  };

  const formatCallSummary = (employeeCallHistory) => {
    if (!employeeCallHistory || employeeCallHistory.length === 0) return "No call summary";
    
    return employeeCallHistory?.map((call) => call.summary).join('\n');
  };


  return (
    <>
      <TableBody className="dark:bg-gray-900">
        {candidates?.map((candidate, i) => (
          <TableRow key={i} className="text-center hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-150" onClick={()=>onView(candidate)}>
        
          {/* Actions*/}
          <TableCell className="flex justify-center items-center">
            <div className="flex space-x-2">
              <button
                onClick={() => onView(candidate)}
                className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-900 text-blue-600 hover:text-blue-700 dark:hover:text-blue-500"
                title="View details"
              >
                <FaEye className="w-3.5 h-3.5" />
              </button>
              {candidate?.editable && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(candidate);
                  }}
                  className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-900 text-green-600 hover:text-green-700 dark:hover:text-green-500"
                  title="Edit"
                >
                  <FaEdit className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </TableCell>

          {/*Entry By*/}
          <TableCell>
            <span className="text-sm">{candidate?.lastRegisteredByName}</span>
          </TableCell>

          {/* Updated Date */}
          <TableCell>
            <span className="text-sm">{formatLongDateAndTime(candidate?.updatedAt)}</span>
          </TableCell>

             {/* Locked */}
             <TableCell>
              {candidate?.isLocked ? (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 text-xs font-medium">
                  <FaLock className="w-3 h-3 mr-1" />
                  {candidate?.isLockedByMe ? 'Under me' : 'Locked'}
                </span>
              ) : (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs font-medium">
                  <FaUnlock className="w-3 h-3 mr-1" />
                  Open for All
                </span>
              )}
            </TableCell>
          
             {/* Expiry */}
             <TableCell>
              {candidate?.remainingTime
                ? (
                  <span className="text-sm rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs font-medium px-1.5 py-0.5">
                    {candidate.remainingTime}
                  </span>
                )
                : candidate?.remainingDays
                  ? (
                    <span className="text-sm rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs font-medium px-1.5 py-0.5">
                      {candidate.remainingDays==1?`${candidate.remainingDays} day`:`${candidate.remainingDays} days`}
                    </span>
                  )
                  : (
                    <span className="text-sm inline-flex items-center rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-300 text-xs font-medium px-1.5 py-0.5">
                  Free to use
                    </span>
                  )
                  
              }
            </TableCell>
            
          {/* Call Duration*/}
          <TableCell>
            <div className="flex items-center justify-center space-x-1">
              <span className="text-sm">{getTotalCallDuration(candidate?.employeeCallHistory)}</span>
              {candidate?.employeeCallHistory && candidate.employeeCallHistory.length > 0 && (
                <div className="group inline-block">
                  <MdInfo 
                    className="w-3.5 h-3.5 text-blue-500 cursor-help hover:text-blue-700" 
                  />
                  <div className="hidden group-hover:block fixed z-[9000] w-64 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg text-left transform -translate-y-full -translate-x-1/2 mt-1">
                    <div className="text-xs font-medium text-gray-800 dark:text-gray-200 whitespace-pre-line overflow-y-auto max-h-40">
                      {formatCallHistory(candidate.employeeCallHistory)}
                    </div>
                    <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white dark:border-t-gray-800 mx-auto"></div>
                  </div>
                </div>
              )}
            </div>
          </TableCell>

          {/* Name*/}
          <TableCell onClick={() => onView(candidate)} className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400">
            <span className="text-sm">
              {candidate?.name}
            </span>
          </TableCell>

          {/* Contact Number */}
          <TableCell 
          >
            <span className="text-sm">
              {candidate?.mobileNo}
            </span>
          </TableCell>


          {/* Call Status*/}
          <TableCell>
          <span className={`px-1.5 py-0.5 text-xs rounded-full ${getStatusColor(candidate?.callStatus)}`}>
          {candidate?.callStatus || 'No status'}
        </span>
          </TableCell>

          
          {/* WhatsApp Number*/}
          <TableCell>
            <span className="text-sm">
              {candidate?.whatsappNo}
            </span>
          </TableCell>

          {/* Qualification*/}
          <TableCell>
          <span className="text-sm" >
            {candidate?.qualification}
          </span>
        </TableCell>

        {/* Location*/}
        <TableCell>
          <span className="text-sm" >
            {candidate?.city}
          </span>
        </TableCell>

        {/* Locality*/}
        <TableCell>
          <span className="text-sm" >
            {candidate?.locality||"-"}
          </span>
        </TableCell>

{/* Experience Level*/}
<TableCell>
          <span className="text-sm" >
            {candidate?.experience}
          </span>
        </TableCell>

        {/* Communication */}
        <TableCell>
          <span className="text-sm" >
            {candidate?.communication}
          </span>
        </TableCell>

        {/* Company Profile */}
        <TableCell>
          <span className="text-sm" >
            {candidate?.companyProfile}
          </span>
        </TableCell>

        {/* Salary Expectation */}
        <TableCell>
          <span className="text-sm" >
            {candidate?.salaryExpectation}
          </span>
        </TableCell>

        {/* Work Shift*/}
        <TableCell>
          <span className="text-sm" >
            {candidate?.shift}
          </span>
        </TableCell>

        {/* Notice Period*/}
        <TableCell>
          <span className="text-sm" >
            {candidate?.noticePeriod}
          </span>
        </TableCell>

        {/* Gender*/}
        <TableCell>
          <span className="text-sm" >
            {candidate?.gender}
          </span>
        </TableCell>

        {/* Call Source*/}
        <TableCell>
          <span className="text-sm" >
            {candidate?.source}
          </span>
        </TableCell>

        {/* Call Summary*/}
        <TableCell>
          <span className="text-sm max-w-xs inline-block overflow-hidden text-ellipsis whitespace-nowrap" title={formatCallSummary(candidate?.callDurationHistory)}>
            {formatCallSummary(candidate?.callDurationHistory) ? (formatCallSummary(candidate?.callDurationHistory).length > 50 ? formatCallSummary(candidate?.callDurationHistory).substring(0, 50) + '...' : formatCallSummary(candidate?.callDurationHistory)) : ''}
          </span>
        </TableCell>

        {/* Status
        <TableCell>
          <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
            candidate?.status === "Not Picked" ? "bg-emerald-100 text-emerald-600" : 
            candidate?.status === "Not Reachable" ? "bg-red-100 text-red-600" : 
            candidate?.status === "Messaged" ? "bg-blue-100 text-blue-600" : 
            candidate?.status === "Called" ? "bg-yellow-100 text-yellow-600" : 
            candidate?.status === "Pending" ? "bg-orange-100 text-orange-600" :
            "bg-gray-100 text-gray-600"
          }`}>
            {candidate?.status?.charAt(0).toUpperCase() + candidate?.status?.slice(1)}
          </span>
        </TableCell> */}
        
      
      </TableRow>
    ))}
  </TableBody>
</>
);
};

export default CandidatesTable; 