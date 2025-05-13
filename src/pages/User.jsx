import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  IoPersonCircle,
  IoMailOutline,
  IoCallOutline,
  IoLocationOutline,
  IoBriefcaseOutline,
  IoSchoolOutline,
  IoHomeOutline,
  IoCashOutline,
  IoLanguageOutline,
  IoSettingsOutline,
  IoArrowUpOutline,
  IoDocumentText,
  IoPersonOutline,
  IoMaleFemaleOutline,
  IoHeartOutline,
  IoDesktopOutline,
  IoTimeOutline,
  IoAlarmOutline,
  IoNavigateOutline,
  IoRibbonOutline,
  IoCodeSlashOutline,
  IoLinkOutline,
  IoGlobeOutline,
  IoLogoWhatsapp,
  IoLogoLinkedin,
  IoCloseCircleOutline,
  IoEyeOff,
  IoCalendarOutline,
} from "react-icons/io5";

import { MdOutlineCorporateFare, MdCalendarMonth, MdFilterList, MdResetTv, MdDownload} from "react-icons/md";
import { RiProfileLine } from "react-icons/ri";
import { FaUserGraduate } from "react-icons/fa";
import { TableContainer, Table, TableHeader, TableCell, TableLoading, Pagination, Label, Select } from "@windmill/react-ui";
import { SidebarContext } from "@/context/SidebarContext";
import { useContext } from "react";
import UserAnalyticsTable from "@/components/user/UserAnalyticsTable";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// Internal imports
import useAsync from "@/hooks/useAsync";
import EmployeeServices from "@/services/EmployeeServices";
import PageTitle from "@/components/Typography/PageTitle";
import Loading from "@/components/preloader/Loading";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import AnimatedContent from "@/components/common/AnimatedContent";
import { Card, CardBody, Button, Input } from "@windmill/react-ui";
import useFilter from "@/hooks/useFilter";
// First, create a new ExperienceCard component above the main component
const ExperienceCard = ({ exp }) => {
  const [showFullResp, setShowFullResp] = useState(false);
  const { showDateFormat } = useUtilsFunction();
  
  
  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-700/30 rounded-lg flex flex-col h-full">
      <div className="flex flex-col gap-2 flex-grow">
        <h4 className="font-semibold text-gray-800 dark:text-gray-200 line-clamp-2">
          {exp.role || "Role Not Specified"}
        </h4>
        <p className="text-gray-600 dark:text-gray-400 line-clamp-1">
          {exp.companyName || "Company Not Specified"}
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <MdCalendarMonth className="text-lg flex-shrink-0" />
          <span className="line-clamp-1">
            {exp.startDate ? showDateFormat(exp.startDate) : "Start Date Not Specified"} - {exp.endDate ? showDateFormat(exp.endDate) : "Present"}
          </span>
        </div>
        {exp.salary && (
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <IoCashOutline className="text-lg text-green-600 dark:text-green-400 flex-shrink-0" />
            <span className="line-clamp-1">{exp.salary}</span>
          </div>
        )}
        {exp.responsibilities && (
          <div className="mt-2">
            <p className={`text-sm text-gray-600 dark:text-gray-400 ${!showFullResp ? 'line-clamp-3' : ''}`}>
              {exp.responsibilities}
            </p>
            {exp.responsibilities.length > 150 && (
              <button
                onClick={() => setShowFullResp(!showFullResp)}
                className="text-blue-600 dark:text-blue-400 text-sm mt-1 hover:underline"
              >
                {showFullResp ? 'Show Less' : 'Show More'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// First, update the EducationCard component to be more tile-like
const EducationCard = ({ edu }) => {
  const [showFullDetails, setShowFullDetails] = useState(false);
  const { showDateFormat } = useUtilsFunction();
  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-700/30 rounded-lg flex flex-col w-full mb-4">
      <div className="flex flex-col gap-3">
        {/* Education Level with Icon */}
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gray-200 dark:bg-gray-600 rounded-full">
            <IoSchoolOutline className="text-2xl text-gray-700 dark:text-gray-300" />
          </div>
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-lg">
            {edu.educationLevel || "Education Level Not Specified"}
          </h4>
        </div>

        {/* Graduate Details */}
        {edu.graduateDegree && (
          <div className="flex flex-col md:flex-row gap-6 pl-12">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <IoSchoolOutline className="text-lg flex-shrink-0 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  {edu.graduateDegree}
                </span>
              </div>
              {edu.graduateCollege && (
                <div className="flex items-center gap-2">
                  <MdOutlineCorporateFare className="text-lg flex-shrink-0 text-gray-600 dark:text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {edu.graduateCollege}
                  </span>
                </div>
              )}
              {edu.graduateUniversity && (
                <div className="flex items-center gap-2">
                  <MdOutlineCorporateFare className="text-lg flex-shrink-0 text-gray-600 dark:text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {edu.graduateUniversity}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 min-w-[200px]">
              <MdCalendarMonth className="text-lg flex-shrink-0 text-gray-600 dark:text-gray-400" />
              <span>
                {edu.startingYear ? `${showDateFormat(edu.startingYear)} - ` : ''}{edu.passingYear ? showDateFormat(edu.passingYear) : "Not Specified"}
              </span>
            </div>
          </div>
        )}

        {/* Post Graduate Details */}
        {edu.postgraduateDegree && (
          <div className="flex flex-col md:flex-row gap-6 pl-12 mt-4 pt-4 border-t dark:border-gray-700">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <IoSchoolOutline className="text-lg flex-shrink-0 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  {edu.postgraduateDegree}
                </span>
              </div>
              {edu.postgraduateCollege && (
                <div className="flex items-center gap-2">
                  <MdOutlineCorporateFare className="text-lg flex-shrink-0 text-gray-600 dark:text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {edu.postgraduateCollege}
                  </span>
                </div>
              )}
              {edu.postgraduateUniversity && (
                <div className="flex items-center gap-2">
                  <MdOutlineCorporateFare className="text-lg flex-shrink-0 text-gray-600 dark:text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {edu.postgraduateUniversity}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 min-w-[200px]">
              <MdCalendarMonth className="text-lg flex-shrink-0 text-gray-600 dark:text-gray-400" />
              <span>
                {edu.postgraduateStartingYear ? `${showDateFormat(edu.postgraduateStartingYear)} - ` : ''}{edu.postgraduatePassingYear ? showDateFormat(edu.postgraduatePassingYear) : "Not Specified"}
              </span>
            </div>
          </div>
        )}

        {/* Diploma Details */}
        {edu.diplomaDegree && (
          <div className="flex flex-col md:flex-row gap-6 pl-12 mt-4 pt-4 border-t dark:border-gray-700">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <IoSchoolOutline className="text-lg flex-shrink-0 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  {edu.diplomaDegree}
                </span>
              </div>
              {edu.diplomaCollege && (
                <div className="flex items-center gap-2">
                  <MdOutlineCorporateFare className="text-lg flex-shrink-0 text-gray-600 dark:text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {edu.diplomaCollege}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 min-w-[200px]">
              <MdCalendarMonth className="text-lg flex-shrink-0 text-gray-600 dark:text-gray-400" />
              <span>
                {edu.diplomaStartingYear ? `${showDateFormat(edu.diplomaStartingYear)} - ` : ''}{edu.diplomaPassingYear ? showDateFormat(edu.diplomaPassingYear) : "Not Specified"}
              </span>
            </div>
          </div>
        )}

        {/* Show More/Less button if content is long */}
        {(edu.description || edu.achievements) && (
          <div className="mt-4 pl-12">
            <div className={`text-sm text-gray-600 dark:text-gray-400 ${!showFullDetails ? 'line-clamp-3' : ''}`}>
              {edu.description && <p>{edu.description}</p>}
              {edu.achievements && <p className="mt-1">{edu.achievements}</p>}
            </div>
            <button
              onClick={() => setShowFullDetails(!showFullDetails)}
              className="text-blue-600 dark:text-blue-400 text-sm mt-1 hover:underline"
            >
              {showFullDetails ? 'Show Less' : 'Show More'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Add this component at the top of the file, before the User component
const JobStatusBadge = ({ status }) => {
  let badgeClass = '';
  
  switch(status) {
    case 'Hired':
      badgeClass = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      break;
    case 'Rejected':
      badgeClass = 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      break;
    case 'Shortlisted':
      badgeClass = 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      break;
    default:
      badgeClass = 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
  }
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${badgeClass}`}>
      {status}
    </span>
  );
};

// Add this component before the User component
const StatCard = ({ icon: Icon, label, value, bgColor = "bg-gray-100", textColor = "text-gray-800" }) => (
  <div className={`${bgColor} dark:bg-gray-700/30 p-4 rounded-lg`}>
    <div className="flex items-center gap-3 mb-2">
      <Icon className={`text-2xl ${textColor}`} />
      <h4 className="font-medium text-gray-700 dark:text-gray-300">{label}</h4>
    </div>
    <p className={`text-2xl font-semibold ${textColor} dark:text-gray-200`}>
      {value}
    </p>
  </div>
);

const User = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [showFullAbout, setShowFullAbout] = useState(false);
  const { showDateFormat } = useUtilsFunction();

  const { data, loading, error } = useAsync(() =>
    EmployeeServices.getUserById(id)
  );

  const { currentPage, handleChangePage, resultsPerPage } = useContext(SidebarContext);
  
  const { data: appliedJobs, loading: appliedJobsLoading, error: appliedJobsError } = useAsync(() =>
    EmployeeServices.getUserAppliedJobs({ userId: id, page: currentPage, limit: resultsPerPage })
  );

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
    dateRangeType,
  } = useFilter(appliedJobs?.jobs);

  const handleResetField = () => {
    setSearchJobs("");
    jobRef.current.value = "";
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
  // Add this helper function inside the component
  const calculateTotalExperience = (experienceDetails) => {
    if (!experienceDetails || experienceDetails.length === 0) return null;

    const parseDate = (dateString) => {
      if (!dateString) return null;

      try {
        let date;
        
        // Handle DD-MM-YYYY format
        if (dateString.includes('-')) {
          const parts = dateString.split('-');
          if (parts[0].length === 2) {
            // DD-MM-YYYY format
            const [day, month, year] = parts;
            date = new Date(year, month - 1, day);
          } else {
            // YYYY-MM-DD format
            date = new Date(dateString);
          }
        } else {
          // Try parsing as is
          date = new Date(dateString);
        }

        return isNaN(date.getTime()) ? null : date;
      } catch {
        return null;
      }
    };

    const now = new Date();
    let totalMonths = 0;

    experienceDetails.forEach(exp => {
      const startDate = parseDate(exp.startDate);
      const endDate = exp.endDate ? parseDate(exp.endDate) : now;

      if (startDate && endDate) {
        const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 +
          (endDate.getMonth() - startDate.getMonth());
        totalMonths += Math.max(0, months);
      }
    });

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    return {
      years,
      months,
      formatted: `${years} ${years === 1 ? 'year' : 'years'}${months > 0 ? ` ${months} ${months === 1 ? 'month' : 'months'}` : ''}`
    };
  };

  return (
    <>
      <PageTitle>{t("User")}</PageTitle>

      {/* Loading State */}
      {loading && <Loading loading={loading} />}

      {/* Error State */}
      {error && (
        <div className="w-full bg-white rounded-md dark:bg-gray-800 p-8 text-center">
          <p className="text-red-500">{t("ErrorLoadingProfile", "Error loading profile. Please try again.")}</p>
        </div>
      )}

      {/* No Data Found */}
      {!error && !loading && !data && (
        <div className="w-full bg-white rounded-md dark:bg-gray-800 p-8 text-center">
          <span className="flex justify-center text-gray-500 text-6xl">
            <IoPersonCircle />
          </span>
          <h2 className="font-medium text-gray-600 mt-4">
            {t("ProfileNotFound", "Profile Not Found")}
          </h2>
        </div>
      )}
      

      {/* Main Content */}
      {data && !error && !loading && (
        <div className="w-full bg-white rounded-md dark:bg-gray-800 p-8 shadow-lg">
           <div>
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-gray-800 dark:text-gray-200">
                  <IoBriefcaseOutline />
                  {t("AppliedJobs", "Applied Jobs")}
                </h3>

                {appliedJobsLoading ? (
                  <TableLoading  row={12} col={6} width={190} height={20}/>
                ) : appliedJobsError ? (
                  <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-lg">
                    <p className="text-red-600 dark:text-red-400">
                      {t("ErrorLoadingJobs", "Error loading applied jobs")}
                    </p>
                  </div>
                ) : (
                  <>
                  <AnimatedContent>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
                      <StatCard 
                        icon={IoBriefcaseOutline} 
                        label={t("TotalApplications", "Total Applications")} 
                        value={appliedJobs?.totalJobs || 0}
                        bgColor="bg-blue-50"
                        textColor="text-blue-600" 
                      />
                      <StatCard 
                        icon={IoRibbonOutline} 
                        label={t("Hired", "Hired")} 
                        value={appliedJobs?.hiredInCount || 0}
                        bgColor="bg-green-50"
                        textColor="text-green-600" 
                      />
                      <StatCard 
                        icon={IoArrowUpOutline} 
                        label={t("Shortlisted", "Shortlisted")} 
                        value={appliedJobs?.shortlistedInCount || 0}
                        bgColor="bg-purple-50"
                        textColor="text-purple-600" 
                      />
                      <StatCard 
                        icon={IoCloseCircleOutline} 
                        label={t("Rejected", "Rejected")} 
                        value={appliedJobs?.rejectedInCount || 0}
                        bgColor="bg-red-50"
                        textColor="text-red-600" 
                      />
                      <StatCard 
                        icon={IoEyeOff} 
                        label={t("NoAction")} 
                        value={appliedJobs?.noActionCount || 0}
                        bgColor="bg-purple-50"
                        textColor="text-purple-600" 
                      />
                    </div>
                    </AnimatedContent>
                    
       
           

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

     </div>
      </form>
    </CardBody>
  </Card>
</AnimatedContent>


                      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-4 mb-6">
                      { serviceData?.length > 0 ? (
                        <TableContainer className="mb-6">
                              {/* Pagination */}
                        <Pagination
                          totalResults={appliedJobs?.totalJobs}
                          resultsPerPage={resultsPerPage}
                          onChange={handleChangePage}
                          label="Applied Jobs Pagination"
                        />
                        <Table>
                          <TableHeader>
                           <tr>
                              <TableCell className="text-center">Company ID</TableCell>
                              <TableCell className="text-center">Posted On</TableCell>
                              <TableCell className="text-center">Applied On</TableCell>
                              <TableCell className="text-center">Job Title</TableCell>
                              <TableCell className="text-center">Company Name</TableCell>
                              <TableCell className="text-center">Hiring Status</TableCell>
                              <TableCell className="text-center">Contact Status</TableCell>
                              <TableCell className="text-center">Actions</TableCell>
                          </tr>
                          </TableHeader>
                          {dataTable?.length > 0 && (
                          <UserAnalyticsTable jobs={dataTable}/>
                        )}
                        </Table>
                       </TableContainer>
                    ) : (
                      <div className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-lg text-center">
                        <IoBriefcaseOutline className="mx-auto text-4xl text-gray-400 mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">
                          {t("NoJobsApplied", "No jobs applied yet")}
                        </p>
                      </div>
                    )}
                   </div>                        
                  </>
                )}
              </div>



          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-center md:items-center gap-8 border-b dark:border-gray-700 pb-8">
            
            <div className="flex flex-col items-center gap-2">
              <div className="w-48 h-48 flex-shrink-0">
                {data?.profileImage ? (
                  <div
                    onClick={() => setShowImagePreview(true)}
                    className="cursor-pointer w-full h-full"
                  >
                    <img
                      src={data?.profileImage}
                      alt={data?.firstName || "User"}
                      className="w-full h-full object-cover rounded-full border-4 border-gray-200 shadow-md"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
                    <IoPersonCircle className="text-gray-400 text-6xl" />
                  </div>
                )}
              </div>
              {/* Unique ID */}
              {data?.uniqueId && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  ID: {data.uniqueId}
                </div>
              )}
            
            </div>

            {/* Image Preview Modal */}
            {showImagePreview && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
    <div className="relative max-w-4xl max-h-[90vh] mx-4">
      {/* Close Button */}
      <button
        onClick={() => setShowImagePreview(false)}
        className="absolute top-3 right-3 text-white hover:text-gray-300 text-3xl bg-gray-800 rounded-full w-10 h-10 flex items-center justify-center"
        style={{ zIndex: 1000 }}
      >
        ×
      </button>

      {/* Image */}
      <img
        src={data?.profileImage}
        alt={data?.firstName}
        className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-lg"
      />
    </div>
  </div>
)}


            {/* User Details */}
            <div className="text-center md:text-left flex-grow border-l dark:border-gray-700 pl-8">
            <div className="ml flex flex-col md:flex-row justify-between items-center md:items-center gap-8  pb-8">
                {/* Name Display Moved Here */}
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                {data?.firstName && data?.lastName ? `${data?.firstName} ${data?.lastName}` : "New User"}
              </h1>
              {/* View Resume Link Moved Here */}
              {data?.resume ? (
                <a
                  href={data?.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  View Resume
                </a>
              ) : (
                <span className="text-gray-600 dark:text-gray-400">No resume available</span>
              )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-600 dark:text-gray-400">
                
                {/* Personal Information */}
                <div className="bg-gray-100 dark:bg-gray-700/30 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">Contact Info</h3>
                  <div className="space-y-2">
                   <div className="flex items-center gap-2">
                      <IoCallOutline className="text-lg flex-shrink-0" />
                      <span>{data?.mobile || ""}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IoMailOutline className="text-lg flex-shrink-0" />
                      <span className="truncate">{data?.email || ""}</span>
                    </div>
                    {data?.currentCity&&data?.state&&(
                    <div className="flex items-center gap-2">
                      <IoLocationOutline className="text-lg flex-shrink-0" />
                      <span>{ data?.currentCity&&data?.state ? `${data?.currentCity}, ${data?.state}` : ""}</span>
                    </div>
                    )}
                    {data?.currentLocality&&(
                    <div className="flex items-center gap-2">
                      <IoHomeOutline className="text-lg flex-shrink-0" />
                      <span>{data?.currentLocality || ""}</span>
                    </div>
                    )}
                  </div>
                </div>

                {/* Education */}
                <div className="bg-gray-100 dark:bg-gray-700/30 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">Qualification</h3>
                  <div className="space-y-2">
                    {data?.education&&data?.education.length>0?(
                    <>
                    <div className="flex items-center gap-2">
                      <FaUserGraduate className="text-lg flex-shrink-0" />
                      <span className="truncate">
                        {data?.education[0]?.educationLevel || ""}
                      </span>
                    </div>
                    {data?.education[0]?.graduateDegree&&data?.education[0]?.passingYear&&(
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <IoSchoolOutline className="text-lg flex-shrink-0" />
                        <span className="truncate">
                          {data?.education[0]?.graduateDegree || ""}
                        </span>
                      </div>
                      <span className="text-gray-600 dark:text-gray-400 flex-shrink-0">
                        {data?.education[0]?.passingYear || ""}
                      </span>
                    </div>
                    )}
                    {data?.education[0]?.postgraduateDegree&&data?.education[0]?.postgraduatePassingYear&&(
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <IoSchoolOutline className="text-lg flex-shrink-0" />
                        <span className="truncate">
                          {data?.education[0]?.postgraduateDegree || ""}
                        </span>
                      </div>
                      <span className="text-gray-600 dark:text-gray-400 flex-shrink-0">
                        {data?.education[0]?.postgraduatePassingYear || ""}
                      </span>
                    </div>
                    )}
                    </>
                  ):(
                    <span className="text-gray-600 dark:text-gray-400">No education details available</span>
                  )}
                  </div>
                </div>


                {/* Company Details */}
                <div className="bg-gray-100 dark:bg-gray-700/30 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">Company Details</h3>
                  <div className="space-y-2">
                    {(() => {
                      // Helper function to parse and format dates
                      const formatDate = (dateString) => {
                        if (!dateString) return null;
                        
                        try {
                          let date;
                          
                          // Handle DD-MM-YYYY format
                          if (dateString.includes('-')) {
                            const parts = dateString.split('-');
                            if (parts[0].length === 2) {
                              // DD-MM-YYYY format
                              const [day, month, year] = parts;
                              date = new Date(year, month - 1, day);
                            } else {
                              // YYYY-MM-DD format
                              const [year, month, day] = parts;
                              date = new Date(year, month - 1, day);
                            }
                          } else {
                            date = new Date(dateString);
                          }

                          // Check if date is valid
                          if (isNaN(date.getTime())) return null;
                          
                          // Format: DD MMM YYYY (e.g., "27 Jan 2025")
                          const day = date.getDate().toString().padStart(2, '0');
                          const month = date.toLocaleString('en-US', { month: 'short' });
                          const year = date.getFullYear();
                          
                          return `${day} ${month} ${year}`;
                        } catch {
                          return null;
                        }
                      };

                      // Sort experience details by date and get the most recent one
                      const latestExperience = data?.experienceDetails
                        ?.sort((a, b) => {
                          // Consider empty endDate as current job (should be first)
                          if (!a.endDate && b.endDate) return -1;
                          if (a.endDate && !b.endDate) return 1;
                          if (!a.endDate && !b.endDate) {
                            // If both are current jobs, compare start dates
                            const dateA = new Date(a.startDate.split('-').reverse().join('-'));
                            const dateB = new Date(b.startDate.split('-').reverse().join('-'));
                            return dateB - dateA;
                          }
                          
                          const dateA = new Date(a.endDate.split('-').reverse().join('-'));
                          const dateB = new Date(b.endDate.split('-').reverse().join('-'));
                          // If dates are invalid, put them at the end
                          if (isNaN(dateA)) return 1;
                          if (isNaN(dateB)) return -1;
                          return dateB - dateA;
                        })?.[0];

                      return latestExperience ? (
                        <>
                          <div className="flex items-center gap-2">
                            <MdOutlineCorporateFare className="text-lg flex-shrink-0" />
                            <span className="truncate">
                              {latestExperience.companyName || ""}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <RiProfileLine className="text-lg flex-shrink-0" />
                            <span className="truncate">
                              {latestExperience.role || ""}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <IoCashOutline className="text-lg text-green-600 flex-shrink-0" />
                            <span>{latestExperience.salary || ""}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MdCalendarMonth className="text-lg flex-shrink-0" />
                            <span>
                              {formatDate(latestExperience.startDate)}
                              {" - "}
                              {!latestExperience.endDate || latestExperience.endDate === "" 
                                ? "Present"
                                : formatDate(latestExperience.endDate) || "Present"
                              }
                            </span>
                          </div>
                        </>
                      ) : (
                        <span className="text-gray-600 dark:text-gray-400">No company details available</span>
                      );
                    })()}
                  </div>
                </div>

                
                {/* Experience Summary */}
                  <div className="bg-gray-100 dark:bg-gray-700/30 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">Experience Details</h3>
                  <div className="space-y-2">
                    {data?.experience&&data?.experience.length>0?(
                    <>
                    <div className="flex items-center gap-2">
                      <IoBriefcaseOutline className="text-lg flex-shrink-0" />
                      <span>{data?.experience || ""}</span>
                    </div>
                    {data?.experienceInYears&&data?.experienceInMonths&&(
                    <div className="flex items-center gap-2">
                      <MdCalendarMonth className="text-lg flex-shrink-0" />
                      <span>{`${data?.experienceInYears} ${data?.experienceInMonths}` || ""}</span>
                    </div>
                    )}
                    </>
                  ):(
                    <span className="text-gray-600 dark:text-gray-400">No experience details available</span>
                  )}
                  </div>
                </div>

                {/* Preferred Cities */}
                <div className="bg-gray-100 dark:bg-gray-700/30 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">Preferred Locations</h3>
                  <div className="space-y-2">
                   {data?.preferredCities&&data?.preferredCities.length>0?(
                   <>
                   <div className="flex items-start gap-2">
                      <IoLocationOutline className="text-lg flex-shrink-0 mt-1" />
                      <span className="break-words">
                        {data?.preferredCities?.map((city) => city).join(", ") || ""}
                      </span>
                    </div>
                    </>
                  ):(
                    <span className="text-gray-600 dark:text-gray-400">No preferred locations available</span>
                  )}
                  </div>
                </div>
               {/* Preferred Roles */}
                <div className="bg-gray-100 dark:bg-gray-700/30 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">Preferred Roles</h3>
                  <div className="space-y-2">
                    {data?.preferredRoles&&data?.preferredRoles.length>0?(
                    <>
                    <div className="flex items-start gap-2">
                      <IoSettingsOutline className="text-lg flex-shrink-0 mt-1" />
                      <span className="break-words">
                        {data?.preferredRoles?.map((role) => role).join(", ") || ""}
                      </span>
                    </div>
                    </>
                  ):(
                    <span className="text-gray-600 dark:text-gray-400">No preferred roles available</span>
                  )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {/* Left Column */}
            <div className="md:col-span-1 space-y-8">
              {/* Personal Information Section */}
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-gray-800 dark:text-gray-200">
                  <IoPersonCircle />
                  {t("PersonalInformation")}
                </h3>
                <div className="space-y-3">
                  {/* Alternate Number */}
                  {data?.alternateMobile && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <IoCallOutline className="text-lg flex-shrink-0" />
                      <span>Alternate Number: {data.alternateMobile}</span>
                    </div>
                  )}

                  {/* WhatsApp */}
                  {data?.whatsappNo && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <IoLogoWhatsapp className="text-lg flex-shrink-0" />
                      <span>{data.whatsappNo}</span>
                    </div>
                  )}

                  {/* Father Name */}
                  {data?.fatherName && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <IoPersonOutline className="text-lg flex-shrink-0" />
                      <span>Father Name: {data.fatherName}</span>
                    </div>
                  )}

                  {/* DOB & Age */}
                  {(data?.dob || data?.age) && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <MdCalendarMonth className="text-lg flex-shrink-0" />
                      <span>
                        {data?.dob && `DOB: ${showDateFormat(data.dob)}`}
                        {data?.age && ` (${data.age} years)`}
                      </span>
                    </div>
                  )}

                  {/* Gender */}
                  {data?.gender && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <IoMaleFemaleOutline className="text-lg flex-shrink-0" />
                      <span>{data.gender}</span>
                    </div>
                  )}

                  {/* Marital Status */}
                  {data?.maritalStatus && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <IoHeartOutline className="text-lg flex-shrink-0" />
                      <span>{data.maritalStatus}</span>
                    </div>
                  )}

                  {/* Current Address */}
                  {data?.currentAddress && (
                    <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                      <IoHomeOutline className="text-lg flex-shrink-0 mt-1" />
                      <span className="break-words">{data.currentAddress}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Work Preferences */}
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-gray-800 dark:text-gray-200">
                  <IoBriefcaseOutline />
                  {t("WorkPreferences")}
                </h3>
                <div className="space-y-3">
                  {/* Job Type */}
                  {data?.jobType && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <IoBriefcaseOutline className="text-lg flex-shrink-0" />
                      <span>{data.jobType}</span>
                    </div>
                  )}

                  {/* Work Mode */}
                  {data?.workMode.length>0 && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <IoDesktopOutline className="text-lg flex-shrink-0" />
                      <span>{data?.workMode?.map((mode) => mode).join(", ") || ""}</span>
                    </div>
                  )}

                  {/* Work Shift */}
                  {data?.workShift.length>0 && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <IoTimeOutline className="text-lg flex-shrink-0" />
                      <span>{data?.workShift?.map((shift) => shift).join(", ") || ""}</span>
                    </div>
                  )}

                  {/* Notice Period */}
                  {data?.noticePeriod && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <IoAlarmOutline className="text-lg flex-shrink-0" />
                      <span>Notice Period: {data.noticePeriod}</span>
                    </div>
                  )}

                  {/* Willing to Relocate */}
                  {data?.willingToRelocate&&(
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <IoNavigateOutline className="text-lg flex-shrink-0" />
                    <span>Relocation: {data?.willingToRelocate||"Not Specified"}</span>
                  </div>
                  )}
                </div>
              </div>

              {/* Languages */}
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-gray-800 dark:text-gray-200">
                    <IoLanguageOutline />
                    {t("Languages")}
                  </h3>
                  {data?.languagesKnown&&data?.languagesKnown.length>0&&(
                  <div className="flex flex-wrap gap-2">
                    {data.languagesKnown.map((lang, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700/30 text-gray-600 dark:text-gray-400 rounded-full text-sm"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                  )}
                </div>

              {/* Social Links */}
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-gray-800 dark:text-gray-200">
                  <IoLinkOutline />
                  {t("Links")}
                </h3>
                <div className="space-y-3">
                  {/* Portfolio URL */}
                  {data?.portfolio && (
                    <a
                      href={data.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <IoGlobeOutline className="text-lg flex-shrink-0" />
                      <span>Portfolio</span>
                    </a>
                  )}

                  {/* LinkedIn URL */}
                  {data?.linkedInId && (
                    <a
                      href={data.linkedInId}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <IoLogoLinkedin className="text-lg flex-shrink-0" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Email Verification Status */}
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <IoMailOutline className="text-lg flex-shrink-0" />
                <span>
                  Email Status: {data?.isEmailVerified ? (
                    <span className="text-green-600 dark:text-green-400">Verified</span>
                  ) : (
                    <span className="text-yellow-600 dark:text-yellow-400">Not Verified</span>
                  )}
                </span>
              </div>

              {/* Professional Summary (moved from previous location) */}
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-gray-800 dark:text-gray-200">
                  <IoDocumentText />
                  {t("ProfessionalSummary")}
                </h3>
                <div className="relative">
                  <p
                    className={`text-gray-600 dark:text-gray-400 transition-all duration-300 ${
                      showFullAbout ? "" : "line-clamp-3 overflow-hidden"
                    }`}
                  >
                    {data?.about || "No professional summary available"}
                  </p>
                  {data?.about?.length > 150 && (
                    <button
                      onClick={() => setShowFullAbout(!showFullAbout)}
                      className="text-blue-600 dark:text-blue-400 mt-2 block font-medium"
                    >
                      {showFullAbout ? t("Show Less") : t("Show More")}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="md:col-span-2 space-y-8">
              {/* Experience Summary*/}
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-gray-800 dark:text-gray-200">
                  <IoBriefcaseOutline />
                  {t("ExperienceSummary")}
                </h3>
                <div className="space-y-6">
                  {/* Total Experience and Salary Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Experience Card */}
                    <div className="bg-gray-100 dark:bg-gray-700/30 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <IoBriefcaseOutline className="text-xl text-blue-600 dark:text-blue-400" />
                        <h4 className="font-medium text-gray-700 dark:text-gray-300">
                          {t("TotalExperience")}
                        </h4>
                      </div>
                      <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                        {data?.experienceDetails ? (
                          <>
                            {calculateTotalExperience(data.experienceDetails)?.formatted || 'No details available'}
                          </>
                        ) : "No experience details available"}
                      </p>
                    </div>

                    {/* Expected Salary Card */}
                    <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <IoCashOutline className="text-xl text-green-600 dark:text-green-400" />
                        <h4 className="font-medium text-gray-700 dark:text-gray-300">
                          {t("ExpectedSalary")}
                        </h4>
                      </div>
                      <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
                        {data.expectedSalary || "No details available"}
                      </p>
                    </div>
                  </div>

                  {/* Experience Details List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.experienceDetails?.length > 0 ? (
          data.experienceDetails.map((exp, index) => (
            <ExperienceCard key={index} exp={exp} />
          ))
        ) : (
          <div className="col-span-full">
            <p className="text-gray-600 dark:text-gray-400">
              {t("NoExperienceDetails", "No experience details available")}
            </p>
          </div>
        )}
      </div>
                </div>
              </div>



              {/* Education Details */}
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-6 text-gray-800 dark:text-gray-200">
                  <IoSchoolOutline />
                  {t("EducationDetails")}
                </h3>
                <div className="space-y-4">
                  {data?.education?.length > 0 ? (
                    data.education.map((edu, index) => (
                      <EducationCard key={index} edu={edu} />
                    ))
                  ) : (
                    <div className="p-4 bg-gray-100 dark:bg-gray-700/30 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-400">
                        {t("NoEducationDetails", "No education details available")}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Certifications - Moved from left column */}
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-gray-800 dark:text-gray-200">
                    <IoRibbonOutline />
                    {t("Certifications")}
                  </h3>
                  {data?.certifications && data.certifications.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.certifications.map((cert, index) => (
                      <div key={index} className="bg-gray-100 dark:bg-gray-700/30 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-800 dark:text-gray-200">{cert.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{cert.issuingOrganization}</p>
                        {cert.issueDate && (
                          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">{showDateFormat(cert.issueDate)}</p>
                        )}
                      </div>
                    ))}
                  </div>
                  ) : (
                    <div className="p-4 bg-gray-100 dark:bg-gray-700/30 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-400">
                        {t("NoCertifications", "No certifications available")}
                      </p>
                    </div>
                  )}
                </div>

              {/* Projects - Moved from left column */}
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-gray-800 dark:text-gray-200">
                    <IoCodeSlashOutline />
                    {t("Projects")}
                  </h3>
                  {data?.projects && data.projects.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.projects.map((project, index) => (
                      <div key={index} className="bg-gray-100 dark:bg-gray-700/30 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-800 dark:text-gray-200">{project.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{project.description}</p>
                        {project.technologies && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {project.technologies.map((tech, techIndex) => (
                              <span
                                key={techIndex}
                                className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 text-sm mt-2 inline-block hover:underline"
                          >
                            View Project
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                  ) : (
                    <div className="p-4 bg-gray-100 dark:bg-gray-700/30 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-400">
                        {t("NoProjects", "No projects available")}
                      </p>
                    </div>
                  )}
                </div>

             
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default User;
