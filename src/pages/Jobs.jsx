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
  } from "@windmill/react-ui";
  import React, { useState } from "react";
  import { useTranslation } from "react-i18next";
  
  //internal import
  import JobsTable from "@/components/jobs/jobsTable";
  import TableLoading from "@/components/preloader/TableLoading";
  import NotFound from "@/components/table/NotFound";
  import PageTitle from "@/components/Typography/PageTitle";
  import useAsync from "@/hooks/useAsync";
  import useFilter from "@/hooks/useFilter";
  import EmployeeServices from "@/services/EmployeeServices";
  import AnimatedContent from "@/components/common/AnimatedContent";
  import { SidebarContext } from "@/context/SidebarContext";
  import { useContext } from "react";
  import DownloadDataModal from "@/components/modal/DownloadDataModal";
  import { notifySuccess, notifyError } from "@/utils/toast";
  import DatePicker from "react-datepicker";  
  import { Label, Select } from "@windmill/react-ui";
  import 'react-datepicker/dist/react-datepicker.css';
  import { IoCalendarOutline, IoTrashOutline, } from "react-icons/io5";
import { MdDownload, MdFilterList, MdResetTv } from "react-icons/md";
import { useEffect } from "react";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import MultipleDeleteModal from "@/components/modal/MultipleDeleteModal";
    const Jobs = () => {

  const { currentPage, handleChangePage, resultsPerPage, setResultsPerPage } = useContext(SidebarContext);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const { title, handleMultipleDeleteModalOpen, serviceIds, setIsCheck} = useToggleDrawer();
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [queryParams, setQueryParams] = useState({
    page: currentPage,
    limit: resultsPerPage
  });
  const [data, setData] = useState({ jobs: [], totalJobs: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchData = async (params) => {
    setLoading(true);
    try {
      const result = await EmployeeServices.getAllJobs(params);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch and refresh when queryParams or refreshKey changes
  useEffect(() => {
    fetchData(queryParams);
  }, [queryParams, refreshKey]);

  // Add refresh function
  const refreshTable = () => {
    setRefreshKey(prev => prev + 1);
  };

  
    const {
      jobRef,  
      dataTable,
      serviceData,
      setSearchJobs,
      handleSubmitJobs,
      sortBy,
      setSortBy,
      sortOrder,
      setSortOrder,
      dateRange,
      handleDateRangeChange,
      handleDateRangeTypeChange,
      dateRangeType,
      setDateRangeType,
      setDateRange,
      handleSortChange,
    } = useFilter(data?.jobs);
  
    const { t } = useTranslation();
    const handleResetField = () => {
      setSearchJobs("");
      jobRef.current.value = "";
      setSortBy("");
      setSortOrder("asc");
      setDateRange({ startDate: null, endDate: null });
      setDateRangeType("day");
      handleSubmitJobs();
    };

    const handleSelectJob = (jobId) => {
      setSelectedJobs(prevSelected => {
        if (prevSelected.includes(jobId)) {
          return prevSelected.filter(id => id !== jobId);
        } else {
          return [...prevSelected, jobId];
        }
      });
    };

    const handleSelectAll = () => {
      if (selectedJobs.length === dataTable.length) {
        setSelectedJobs([]);
      } else {
        setSelectedJobs(dataTable.map(job => job._id));
      }
    };

    const handleDeleteSelected = async () => {
      if (selectedJobs.length === 0) return;
      
      const selectedJobsData = data.jobs.filter(job => 
        selectedJobs.includes(job._id)
      );
      
      if (selectedJobsData.length === 0) {
        notifyError("Selected jobs not found in the data");
        return;
      }

      const jobNames = selectedJobsData.map(job => job.jobTitle).join(", ");
      
      handleMultipleDeleteModalOpen(selectedJobs, jobNames);
      // Refresh table after deletion
      refreshTable();
    };

    // Toggle sort order when header is clicked
  const handleSortByField = (field) => {
    handleSortChange(field);
  };
  
    // All available columns
  const availableColumns = [
    { key: 'jobId', label: 'Job ID' },
    { key: 'createdAt', label: 'Posted On' },
    { key: 'jobTitle', label: 'Job Title' },
    { key: 'companyName', label: 'Company Name' },
    { key: 'jobDescription', label: 'Job Description' },
    { key: 'jobLocation', label: 'Location' },
    { key: 'jobLocality', label: 'Locality' },
    { key: 'jobSalary', label: 'Salary' },
    { key: 'jobIndustry', label: 'Industry' },
    { key: 'jobDepartment', label: 'Department' },
    { key: 'jobWorkMode', label: 'Job Type' },
    { key: 'jobExperience', label: 'Experience Level' },
    { key: 'jobExperienceRange', label: 'Experience' },
    { key: 'jobQualification', label: 'Qualification' },
    { key: 'jobSpecificDegree', label: 'Specific Degree' },
    { key: 'jobJoining', label: 'Joining' },
    { key: 'jobSkills', label: 'Skills' },
    { key: 'jobInterview', label: 'Interview Mode' },
    { key: 'jobAppliedApplicants', label: 'Applicants' },
    { key: 'jobHiredApplicants', label: 'Hired Applicants' },
    { key: 'jobShortlistedApplicants', label: 'Shortlisted Applicants' },
    { key: 'jobRejectedApplicants', label: 'Rejected Applicants' },
    { key: 'jobSelectedApplicants', label: 'Selected Applicants' },
    { key: 'updatedAt', label: 'Updated On' },
  ];

  // Handle download request from the modal
  const handleDownloadRequest = async (selectedColumnKeys, onlySelected) => {
    try {
      const response = await EmployeeServices.generateTempRoute();
      const baseUrl = `${import.meta.env.VITE_APP_API_BASE_URL}/admin${response.tempRoute}?type=jobs`;
      
      let url = baseUrl;
      
      // Add selected columns to the URL if not all columns are selected
      if (selectedColumnKeys.length > 0 && selectedColumnKeys.length < availableColumns.length) {
        url += `&columns=${selectedColumnKeys.join(',')}`;
      }
      
      // Add selected jobs if downloading only selected
      if (onlySelected && selectedJobs.length > 0) {
        url += `&jobIds=${selectedJobs.join(',')}`;
      }
      
      window.open(url, '_blank');
      setIsDownloadModalOpen(false);
      notifySuccess("Jobs download initiated successfully");
    } catch (error) {
      notifyError("Something went wrong");
    }
  };

    // Available sort fields
    const sortOptions = [
      { value: "", label: "-- Select Sort Field --" },
      { value: "jobId", label: "Job ID" },
      { value: "createdAt", label: "Posted On" },
      { value: "title", label: "Job Title" },
      { value: "companyName", label: "Company Name" },
      { value: "jobLocation", label: "Location" },
      { value: "jobLocality", label: "Locality" },
      { value: "jobSalary", label: "Salary" },
      { value: "jobIndustry", label: "Industry" },
      { value: "jobDepartment", label: "Department" },
      { value: "jobWorkMode", label: "Work Mode" },
      { value: "jobExperience", label: "Experience Level" },
      { value: "jobExperienceRange", label: "Experience" },
      { value: "jobQualification", label: "Qualification" },
      { value: "jobSpecificDegree", label: "Specific Degree" },
      { value: "jobJoining", label: "Joining" },
      { value: "jobSkills", label: "Skills" },
      { value: "jobInterview", label: "Interview Mode" },
    ];

     // Date range type options 
  const dateRangeTypeOptions = [
    { value: "day", label: "Day to Day" },
    { value: "month", label: "Month to Month" },
    { value: "year", label: "Year to Year" },
  ];

  const resultsPerPageOptions = [
    { value: 20, label: '20' },
    { value: 40, label: '40' },
    { value: 60, label: '60' },
    { value: 80, label: '80' },
    { value: 160, label: '160' },
  ]; 

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
  
    return (
      <>
        <PageTitle>{t("JobsPage")}</PageTitle>

                {/* Use the reusable download modal component */}
      <DownloadDataModal 
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        title="Download Jobs Data"
        availableColumns={availableColumns}
        selectedItems={selectedJobs}
        onClearSelection={() => setSelectedJobs([])}
        onDownload={handleDownloadRequest}
        entityName="Jobs"
      />
  
  <MultipleDeleteModal 
    ids={serviceIds} 
    title={title} 
    onSuccess={refreshTable}
  />
       

        <AnimatedContent>
  <Card className="min-w-0 shadow-xs overflow-visible bg-white dark:bg-gray-800 mb-5">
    <CardBody>
      <form
        onSubmit={handleSubmitJobs}
        className="py-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        {/* Search Input - Full width on all screen sizes */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 relative">
          <Label>Search By</Label>
          <Input
            ref={jobRef}
            type="search"
            name="search"
            placeholder={t("JobsPageSearchPlaceholder")}
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
          <Button type="submit" className="h-12 w-full bg-sky-900 hover:bg-sky-700 active:bg-sky-800 text-white">
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
            {t('DownloadJobs')}
          </Button>

<div className=" w-20 justify-self-end">
           {selectedJobs.length > 0 && (
            <Button
              onClick={handleDeleteSelected}
              disabled={isDeleteLoading}
              className="h-12 w-full bg-red-600 hover:bg-red-700"
            >
              <IoTrashOutline className="mr-2 size-4"/> ({selectedJobs.length})
            </Button>
          )}
          </div>
        </div>
      </form>
    </CardBody>
  </Card>
</AnimatedContent>
  
        {loading ? (
          // <Loading loading={loading} />
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
    totalResults={data?.totalJobs}
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
                      className="form-checkbox h-5 w-5 text-emerald-600 cursor-pointer "
                      checked={selectedJobs.length > 0 && selectedJobs.length === dataTable.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                <TableCell 
                  className="cursor-pointer text-center"
                  onClick={() => handleSortByField("jobId")}
                >
                  {t("JobId")}
                  {sortBy === "jobId" && (
                    <span className="ml-2">{sortOrder === "asc" ? "▲" : "▼"}</span>
                  )}
                </TableCell>
                  <TableCell onClick={() => handleSortByField("createdAt")} className="text-center">{t("PostedOn")} {sortBy === "createdAt" && (
                    <span className="ml-2 text-white">{sortOrder === "asc" ? "▲" : "▼"}</span>
                  )}</TableCell>
                  <TableCell onClick={() => handleSortByField("title")} className="text-center">{t("JobTitle")} {sortBy === "title" && (
                    <span className="ml-2 text-white">{sortOrder === "asc" ? "▲" : "▼"}</span>
                  )}</TableCell>
                  <TableCell onClick={() => handleSortByField("companyName")} className="text-center">{t("CompanyName")} {sortBy === "companyName" && (
                    <span className="ml-2 text-white">{sortOrder === "asc" ? "▲" : "▼"}</span>
                  )}</TableCell>
                  <TableCell onClick={() => handleSortByField("jobLocation")} className="text-center">{t("Location")} {sortBy === "jobLocation" && (
                    <span className="ml-2 text-white">{sortOrder === "asc" ? "▲" : "▼"}</span>
                  )}</TableCell>
                  <TableCell className="text-center">{t("Actions")}</TableCell>
                </tr>
              </TableHeader>

              <JobsTable 
                jobs={dataTable} 
                selectedJobs={selectedJobs} 
                onSelectJob={handleSelectJob} 
              />
            </Table>
            
          </TableContainer>
        ) : (
          <NotFound title="Sorry, There are no jobs right now." />
        )}
      </>
    );
  };
  
  export default Jobs;
  