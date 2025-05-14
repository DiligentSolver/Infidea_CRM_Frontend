import { TableBody, TableCell, TableRow } from "@windmill/react-ui";
import { useTranslation } from "react-i18next";

// Internal imports
import { formatLongDate, formatLongDateAndTime } from "@/utils/dateFormatter";
import { FaEdit, FaEye } from "react-icons/fa";
import { joiningStatusOptions } from "@/utils/optionsData";

const JoiningsTable = ({joinings, onView}) => {

  // Helper function to get status color
  const getStatusColor = (status) => {
    // Ensure status is a non-empty string before applying color
    if (!status) return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    
    // Use joiningStatusOptions instead of general statusOptions
    const found = joiningStatusOptions.find((option) => option.value === status);
    return found
      ? found.colorClass
      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  };

  return (
    <>
      <TableBody className="dark:bg-gray-900">
        {joinings?.map((joining, i) => (
          <TableRow key={i} className="text-center">

            {/* Actions*/}
          <TableCell className="flex justify-center items-center">
            <div className="flex space-x-2">
              <button
                onClick={() => onView(joining)}
                className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-900 text-blue-600 hover:text-blue-700 dark:hover:text-blue-500"
                title="View details"
              >
                <FaEye className="w-3.5 h-3.5" />
              </button>
            </div>
          </TableCell>

           {/* Entry Date */}
           <TableCell>
            <span className="text-sm">{formatLongDateAndTime(joining?.createdAt)}</span>
          </TableCell>

            {/* Entry Updated Date */}
            <TableCell>
            <span className="text-sm">{formatLongDateAndTime(joining?.updatedAt)}</span>
          </TableCell>

          {/* Name */}
          <TableCell>
            <span className="text-sm">{joining?.name || joining?.candidateName}</span>
          </TableCell>

          {/* Contact Number */}
          <TableCell>
            <span className="text-sm">{joining?.contactNumber}</span>
          </TableCell>

        {/* Company */}
        <TableCell>
          <span className="text-sm" >
            {joining?.company}
          </span>
        </TableCell>
        
        {/* Process */}
        <TableCell>
          <span className="text-sm" >
            {joining?.process}
          </span>
        </TableCell>

        {/* Joining Type */}
        <TableCell>
          <span className="text-sm" >
            {joining?.joiningType}
          </span>
        </TableCell>

         {/* Joining Date */}
         <TableCell>
          <span className="text-sm" >
            {formatLongDate(joining?.joiningDate)}
          </span>
        </TableCell>


          {/* Status*/}
          <TableCell>
          {joining?.status ? (
            <span className={`px-1.5 py-0.5 text-xs rounded-full ${getStatusColor(joining?.status)}`}>
              {joining.status}
            </span>
          ) : (
            <span className="text-sm text-gray-500">No status</span>
          )}
          </TableCell>

          {/*Eligibility*/}
          <TableCell>
            <span className="text-sm" >
              {joining?.incentives?.eligible ? "Yes" : "No"}
            </span>
          </TableCell>

          {/*Incentives*/}
          <TableCell>
            <span className="text-sm" >
              {joining?.incentives?.amount ? `₹${joining?.incentives?.amount}` : "₹0"}
            </span>
          </TableCell>
      </TableRow>
    ))}
  </TableBody>
</>
);
};

export default JoiningsTable; 