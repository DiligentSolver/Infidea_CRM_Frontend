import {
  Card,
  Button,
  CardBody,
  Input,
  Pagination,
  Table,
  TableCell,
  TableContainer,
  TableHeader,
  Label,
  Select,
} from "@windmill/react-ui";
import React, { useState, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { IoTrashOutline, IoCalendarOutline } from "react-icons/io5";
//internal import
import UserTable from "@/components/user/UserTable";
import TableLoading from "@/components/preloader/TableLoading";
import NotFound from "@/components/table/NotFound";
import PageTitle from "@/components/Typography/PageTitle";
import useAsync from "@/hooks/useAsync";
import useFilter from "@/hooks/useFilter";
import EmployeeServices from "@/services/EmployeeServices";
import AnimatedContent from "@/components/common/AnimatedContent";
import { SidebarContext } from "@/context/SidebarContext";
import { notifySuccess, notifyError } from "@/utils/toast";
import DownloadDataModal from "@/components/modal/DownloadDataModal";
import { MdDownload, MdFilterList, MdResetTv } from "react-icons/md";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import MultipleDeleteModal from "@/components/modal/MultipleDeleteModal"; 

const Users = () => {
  const {handleChangePage, currentPage, resultsPerPage, setResultsPerPage} = useContext(SidebarContext);
  const { title, handleMultipleDeleteModalOpen, serviceIds} = useToggleDrawer();  
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const [queryParams, setQueryParams] = useState({
    page: currentPage,
    limit: resultsPerPage
  });

  const [data, setData] = useState({ users: [], totalUsers: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async (params) => {
    setLoading(true);
    try {
      const result = await EmployeeServices.getAllUsers(params);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData(queryParams);
  }, [queryParams]);

  const {
    userRef,
    dataTable,
    serviceData,
    handleSubmitUser,
    setSearchUser,
    sortBy,
    sortOrder,
    dateRange,
    dateRangeType,
    setSortBy,
    setSortOrder,
    setDateRange,
    setDateRangeType,
    handleSortChange,
    handleDateRangeChange,
    handleDateRangeTypeChange
  } = useFilter(data.users);

  const { t } = useTranslation();
  
  // Available sort fields
  const sortOptions = [
    { value: "", label: "-- Select Sort Field --" },
    { value: "fullName", label: "Name" },
    { value: "email", label: "Email" },
    { value: "mobile", label: "Mobile" },
    { value: "createdAt", label: "Date Created" },
    { value: "age", label: "Age" },
    { value: "currentCity", label: "City" },
    { value: "experience", label: "Experience" },
  ];

  // Date range type options 
  const dateRangeTypeOptions = [
    { value: "day", label: "Day to Day" },
    { value: "month", label: "Month to Month" },
    { value: "year", label: "Year to Year" },
  ];

  const handleResetField = () => {
    setSearchUser("");
    userRef.current.value = "";
    setSelectedUsers([]);
    // Reset sorting and date range filters
    setSortBy("");
    setSortOrder("asc");
    setDateRange({ startDate: null, endDate: null });
    setDateRangeType("day");
    handleSubmitUser();
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prevSelected => {
      if (prevSelected.includes(userId)) {
        return prevSelected.filter(id => id !== userId);
      } else {
        return [...prevSelected, userId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === dataTable.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(dataTable.map(user => user._id || user.id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedUsers.length === 0) return;
    
    // Get all selected companies from the data
    const selectedUsersData = data.users.filter(user => 
      selectedUsers.includes(user._id)
    );
    
    // If no companies are found, show an error and return
    if (selectedUsersData.length === 0) {
      notifyError("Selected users not found in the data");
      return;
    }

    // Create a string of company names
    const userNames = selectedUsersData.map(user => user.firstName).join(", ");
    
    console.log('userNames', title);

    handleMultipleDeleteModalOpen(selectedUsers, userNames);
  };

  const handleResultsPerPageChange = (e) => {
    const newLimit = parseInt(e.target.value, 10);
    setResultsPerPage(newLimit);
    handleChangePage(1);
    
    setQueryParams({
      ...queryParams,
      page: 1,
      limit: newLimit
    });
  };

  // All available columns
  const availableColumns = [
    { key: 'userId', label: 'Candidate ID' },
    { key: 'fullName', label: 'Full Name' },
    { key: 'fatherName', label: 'Father Name' },
    { key: 'mobile', label: 'Mobile' },
    { key: 'whatsappNo', label: 'WhatsApp Number' },
    { key: 'email', label: 'Email' },
    { key: 'dob', label: 'Date of Birth' },
    { key: 'age', label: 'Age' },
    { key: 'gender', label: 'Gender' },
    { key: 'experiencelevel', label: 'Experience Level' },
    { key: 'highestQualification', label: 'Highest Qualification' },
    { key: 'pursuing', label: 'Currently Studying' },
    { key: 'graduateDegree', label: 'Graduate Degree' },
    { key: 'graduatePassingYear', label: 'Graduate Passing Year' },
    { key: 'postGraduateDegree', label: 'Post Graduate Degree' },
    { key: 'postGraduatePassingYear', label: 'Post Graduate Passing Year' },
    { key: 'state', label: 'State' },
    { key: 'currentCity', label: 'Current City' },
    { key: 'currentLocality', label: 'Current Locality' },
    { key: 'preferredCities', label: 'Preferred Cities' },
    { key: 'totalExperience', label: 'Total Experience' },
    { key: 'currentCompany', label: 'Current Company' },
    { key: 'currentProfile', label: 'Current Profile' },
    { key: 'currentSalary', label: 'Current Salary' },
    { key: 'expectedSalary', label: 'Expected Salary' },
    { key: 'noticePeriod', label: 'Notice Period' },
    { key: 'jobPreference', label: 'Job Preference' },
    { key: 'languagesKnown', label: 'Languages Known' },
    { key: 'maritalStatus', label: 'Marital Status' },
    { key: 'createdAt', label: 'Created On' },
    // New columns to add
    { key: 'alternateMobile', label: 'Alternate Mobile' },
    { key: 'currentAddress', label: 'Current Address' },
    { key: 'experienceInMonths', label: 'Experience (Months)' },
    { key: 'jobType', label: 'Job Type' },
    { key: 'workMode', label: 'Work Mode' },
    { key: 'workShift', label: 'Work Shift' },
    { key: 'willingToRelocate', label: 'Willing To Relocate' },
    { key: 'skills', label: 'Skills' },
    { key: 'hobbies', label: 'Hobbies' },
    { key: 'linkedInId', label: 'LinkedIn ID' },
    { key: 'about', label: 'About' },
    { key: 'portfolio', label: 'Portfolio URL' },
    { key: 'resume', label: 'Resume URL' },
    { key: 'profileImage', label: 'Profile Image' },
    { key: 'isVerified', label: 'Is Verified' },
    { key: 'isEmailVerified', label: 'Is Email Verified' },
    { key: 'isNewUser', label: 'Is New User' },
  ];

  const resultsPerPageOptions = [
    { value: 20, label: '20' },
    { value: 40, label: '40' },
    { value: 60, label: '60' },
    { value: 80, label: '80' },
    { value: 160, label: '160' },
  ]; 
  
  // Handle download request from the modal
  const handleDownloadRequest = async (selectedColumnKeys, onlySelected) => {
    try {
      const response = await EmployeeServices.generateTempRoute();
      const baseUrl = `${import.meta.env.VITE_APP_API_BASE_URL}/admin${response.tempRoute}?type=jobseekers`;
      
      let url = baseUrl;
      
      // Add selected columns to the URL if not all columns are selected
      if (selectedColumnKeys.length > 0 && selectedColumnKeys.length < availableColumns.length) {
        url += `&columns=${selectedColumnKeys.join(',')}`;
      }
      
      // Add selected users if downloading only selected
      if (onlySelected && selectedUsers.length > 0) {
        url += `&jobseekerIds=${selectedUsers.join(',')}`;
      }
      
      window.open(url, '_blank');
      setIsDownloadModalOpen(false);
      notifySuccess("Job Seekers download initiated successfully");
    } catch (error) {
      notifyError("Something went wrong");
    }
  };

  // Toggle sort order when header is clicked
  const handleSortByField = (field) => {
    handleSortChange(field);
  };

  return (
    <>
      <PageTitle>{t("UsersPage")}</PageTitle>

       {/* Use the reusable download modal component */}
       <DownloadDataModal 
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        title="Download Users Data"
        availableColumns={availableColumns}
        selectedItems={selectedUsers}
        onClearSelection={() => setSelectedUsers([])}
        onDownload={handleDownloadRequest}
        entityName="Users"
        requireSelection={true}
      />

      <MultipleDeleteModal ids={serviceIds} title={title} />

      <AnimatedContent>
  <Card className="min-w-0 shadow-xs overflow-visible bg-white dark:bg-gray-800 mb-5">
    <CardBody>
      <form
        onSubmit={handleSubmitUser}
        className="py-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        {/* Search Input - Full width on all screen sizes */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 relative">
          <Input
            ref={userRef}
            type="search"
            name="search"
            placeholder={t("JobSeekersPageSearchPlaceholder")}
          />
          <button
            type="submit"
            className="absolute right-0 top-0 mt-5 mr-1"
          ></button>
        </div>

        {/* Filter Controls - Each takes one column */}
        <div>
          <Label>Sort By</Label>
          <Select
            className="w-full mt-1"
            name="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
              
        {/* Sort Order - Only show if sort field is selected */}
        <div className={sortBy ? "" : "hidden"}>
          <Label>Sort Order</Label>
          <Select
            className="w-full mt-1"
            name="sortOrder"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </Select>
        </div>

        {/* Date Range Type Selection */}
        <div>
          <Label>Date Range</Label>
          <Select
            className="w-full mt-1"
            name="dateRangeType"
            value={dateRangeType}
            onChange={(e) => handleDateRangeTypeChange(e.target.value)}
          >
            {dateRangeTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
{/* Date Range Picker - From */}
<div>
  <Label className="font-medium text-gray-700 dark:text-gray-300">From</Label>
  <div className="relative">
    <DatePicker
      selected={dateRange.startDate}
      onChange={(date) => handleDateRangeChange(date, dateRange.endDate)}
      selectsStart
      startDate={dateRange.startDate}
      endDate={dateRange.endDate}
      dateFormat={dateRangeType === 'year' ? 'yyyy' : dateRangeType === 'month' ? 'MMM-yyyy' : 'dd-MMM-yyyy'}
      showMonthYearPicker={dateRangeType === 'month'}
      showYearPicker={dateRangeType === 'year'}
      className="w-full mt-1 p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
      popperClassName="z-50"
    />
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-emerald-400 mt-1">
      <IoCalendarOutline className="size-5 text-gray-500 dark:text-emerald-400"/>
    </div>
  </div>
</div>

{/* Date Range Picker - To */}
<div>
  <Label className="font-medium text-gray-700 dark:text-gray-300">To</Label>
  <div className="relative">
    <DatePicker
      selected={dateRange.endDate}
      onChange={(date) => handleDateRangeChange(dateRange.startDate, date)}
      selectsEnd
      startDate={dateRange.startDate}
      endDate={dateRange.endDate}
      minDate={dateRange.startDate}
      dateFormat={dateRangeType === 'year' ? 'yyyy' : dateRangeType === 'month' ? 'MMM-yyyy' : 'dd-MMM-yyyy'}
      showMonthYearPicker={dateRangeType === 'month'}
      showYearPicker={dateRangeType === 'year'}
      className="w-full mt-1 p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
      popperClassName="z-50"
    />
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-emerald-400 mt-1">
      <IoCalendarOutline className="size-5 text-gray-500 dark:text-emerald-400"/>
    </div>
  </div>
</div>
        

       
        {/* Action Buttons - spread across the bottom */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-2">
          <Button type="submit" className="h-12 w-full text-white bg-sky-900 hover:bg-sky-700 active:bg-sky-800">
            <MdFilterList className="size-5 ml-2 text-white mr-2"/>
            Filter
          </Button>

          <Button
            onClick={handleResetField}
            type="reset"
            className="h-12 w-full bg-violet-900 hover:bg-violet-700 active:bg-violet-800 text-white"
          >
            <MdResetTv className="size-5 ml-2 text-white mr-2"/>
            Reset
          </Button>

          <Button
          
            onClick={() => {
              setIsDownloadModalOpen(true);
            }}
            className="h-12 w-full bg-indigo-800 hover:bg-indigo-600 active:bg-indigo-700 text-white"
          >
              <MdDownload className="size-5 ml-2 text-white mr-2"/>
            {t('DownloadUsers')}
          </Button>

<div className=" w-20 justify-self-end">
           {selectedUsers.length > 0 && (
            <Button
              onClick={handleDeleteSelected}
              disabled={isDeleteLoading}
              className="h-12 w-full bg-red-600 hover:bg-red-700"
            >
              <IoTrashOutline className="mr-2 size-4"/> ({selectedUsers.length})
            </Button>
          )}
          </div>
        </div>
      </form>
    </CardBody>
  </Card>
</AnimatedContent>

      {loading ? (
        <TableLoading row={12} col={6} width={190} height={20} />
      ) : error ? (
        <span className="text-center mx-auto text-red-500">{error}</span>
      ) : serviceData?.length !== 0 ? (
        <TableContainer className="mb-8">
          {dateRange.startDate && dateRange.endDate && (
            <div className="my-2 p-2">
              <span className="text-sm text-amber-900 dark:text-white font-bold">
                Filtering by date: {dateRange.startDate.toLocaleDateString()} to {dateRange.endDate.toLocaleDateString()} 
              </span>
              <Button 
                  size="small" 
                  layout="link" 
                  onClick={() => setDateRange({ startDate: null, endDate: null })}
                  className="ml-2 text-white dark:text-white  bg-sky-900 hover:bg-sky-700 active:bg-sky-800"
                >
                  Clear
                </Button>
            </div>
          )}


<div className="flex flex-wrap justify-between items-center gap-4 pl-2 pr-2">
  <Pagination
    totalResults={data?.totalUsers}
    resultsPerPage={resultsPerPage}
    onChange={handleChangePage}
    label="Table navigation"
  />

  <div className="flex items-center gap-2">
    <Label className="text-sm whitespace-nowrap">Results Per Page</Label>
    <Select
      className="w-24 h-8 text-sm px-2 py-1 border border-gray-300 rounded-md"
      name="resultsPerPage"
      value={resultsPerPage}
      onChange={handleResultsPerPageChange}
    >
      {resultsPerPageOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  </div>
</div>
          <Table>
            <TableHeader>
              <tr className="bg-gray-700 text-white dark:bg-gray-600 dark:text-white">
                <TableCell className="text-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-emerald-600 cursor-pointer"
                    checked={selectedUsers.length > 0 && selectedUsers.length === dataTable.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell 
                  className="cursor-pointer text-center"
                  onClick={() => handleSortByField("userId")}
                >
                  {t("JobSeekerId")}
                  {sortBy === "userId" && (
                    <span className="ml-2">{sortOrder === "asc" ? "▲" : "▼"}</span>
                  )}
                </TableCell>
                <TableCell 
                  className="cursor-pointer text-center"
                  onClick={() => handleSortByField("createdAt")}
                >
                  {t("JobSeekerJoiningDate")}
                  {sortBy === "createdAt" && (
                    <span className="ml-2">{sortOrder === "asc" ? "▲" : "▼"}</span>
                  )}
                </TableCell>
                <TableCell 
                  className="cursor-pointer text-center"
                  onClick={() => handleSortByField("fullName")}
                >
                  {t("JobSeekerName")}
                  {sortBy === "fullName" && (
                    <span className="ml-2">{sortOrder === "asc" ? "▲" : "▼"}</span>
                  )}
                </TableCell>
                <TableCell 
                  className="cursor-pointer text-center"
                  onClick={() => handleSortByField("mobile")}
                >
                  {t("JobSeekerMobile")}
                  {sortBy === "mobile" && (
                    <span className="ml-2">{sortOrder === "asc" ? "▲" : "▼"}</span>
                  )}
                </TableCell>
                <TableCell 
                  className="cursor-pointer text-center"
                  onClick={() => handleSortByField("email")}
                >
                  {t("JobSeekerEmail")}
                  {sortBy === "email" && (
                    <span className="ml-2 text-white">{sortOrder === "asc" ? "▲" : "▼"}</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {t("Actions")}
                </TableCell>
              </tr>
            </TableHeader>
            <UserTable 
              customers={dataTable} 
              selectedUsers={selectedUsers} 
              onSelectUser={handleSelectUser} 
            />
          </Table>
          
        </TableContainer>
      ) : (
        <NotFound title="Sorry, There are no job seekers right now." />
      )}
    </>
  );
};

export default Users;
