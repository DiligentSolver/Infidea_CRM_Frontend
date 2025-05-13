import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  IoMailOutline,
  IoCalendarOutline,
  IoSchoolOutline,
  IoCashOutline,
  IoPersonOutline,
  IoDesktopOutline,
  IoTimeOutline,
  IoAlarmOutline,
  IoCodeSlashOutline,
  IoGlobeOutline,
  IoLogoLinkedin,
  IoBusinessOutline,
  IoEyeOutline,
  IoShareSocialOutline,
  IoChatboxOutline,
  IoChevronDownOutline,
  IoChevronUpOutline,
  IoLocationOutline,
  IoBriefcaseOutline,
  IoDocumentTextOutline,
  IoStarOutline,
  IoHomeOutline,
} from "react-icons/io5";

import {  MdWorkHistory, MdDepartureBoard } from "react-icons/md";
import { FaBuilding, FaUserTie } from "react-icons/fa";
import { BsCalendarWeek } from "react-icons/bs";
import DownloadDataModal from "@/components/modal/DownloadDataModal";

// Internal imports
import useAsync from "@/hooks/useAsync";
import EmployeeServices from "@/services/EmployeeServices";
import PageTitle from "@/components/Typography/PageTitle";
import Loading from "@/components/preloader/Loading";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import DeleteModal from "@/components/modal/DeleteModal";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import { notifySuccess, notifyError } from "@/utils/toast";
import useJobSubmit from "@/hooks/useJobSubmit";

// Job Detail Component
const JobDetailItem = ({ icon, label, value, className = "" }) => {
    if (!value) return null;
    
    return (
      <div className={`flex items-start gap-3 ${className}`}>
        <div className="mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0">
          {icon}
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {label}
          </h4>
          <div className="text-gray-800 dark:text-gray-200">
            {value}
          </div>
        </div>
      </div>
    );
  };
  
  // Skills Pill Component
  const SkillPill = ({ skill, onRemove }) => (
    <span className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
      {skill}
      {onRemove && (
        <button
          onClick={() => onRemove(skill)}
          className="text-red-500 ml-2"
        >
          Remove
        </button>
      )}
    </span>
  );

  
  const Job = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const [showFullDescription, setShowFullDescription] = useState(false);
    const { showDateFormat } = useUtilsFunction();
    const { handleModalOpen, handleUpdate } = useToggleDrawer();
    const [selectedApplicants, setSelectedApplicants] = useState([]);
    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  
    const { data, loading, error } = useAsync(() =>
      EmployeeServices.getJobById(id)
    );

    // Main JobDrawer Component
    const {
      register,
      handleSubmit,
      onSubmit,
      errors: formErrors,
      isSubmitting,
    setValue,
    watchedValues,
    setError,
    clearErrors,
  } = useJobSubmit(id);

  
    
    const getPostingTimeAgo = (createdAt) => {
      if (!createdAt) return "";
      
      const now = new Date();
      const posted = new Date(createdAt);
      const diffInDays = Math.floor((now - posted) / (1000 * 60 * 60 * 24));
      
      if (diffInDays === 0) return "Posted today";
      if (diffInDays === 1) return "Posted yesterday";
      if (diffInDays < 7) return `Posted ${diffInDays} days ago`;
      if (diffInDays < 30) return `Posted ${Math.floor(diffInDays / 7)} weeks ago`;
      return `Posted ${Math.floor(diffInDays / 30)} months ago`;
    };
  
    const formatSalary = (salary) => {
      if (!salary) return "Not disclosed";
      return salary;
    };

     // All available columns
  const availableColumns = [
    { key: 'jobId', label: 'Job ID' },
    { key: 'jobPostedOn', label: 'Posted On' },
    { key: 'jobAppliedOn', label: 'Applied On' },
    { key: 'jobTitle', label: 'Job Title' },
    { key: 'companyName', label: 'Company Name' },
    { key: 'jobLocation', label: 'Location' },
    { key: 'jobLocality', label: 'Locality' },
    { key: 'jobSalary', label: 'Salary' },
    { key: 'jobExperience', label: 'Experience Level' },
    { key: 'jobExperienceRange', label: 'Experience' },
    { key: 'jobQualification', label: 'Qualification' },
    { key: 'jobSpecificDegree', label: 'Specific Degree' },
    { key: 'jobJoining', label: 'Joining' },
    { key: 'jobInterview', label: 'Interview Mode' },
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
  ];
  
   // Handle download request from the modal
   const handleDownloadRequest = async (selectedColumnKeys) => {
    try {
      const response = await EmployeeServices.generateTempRoute();
      const baseUrl = `${import.meta.env.VITE_APP_API_BASE_URL}/admin${response.tempRoute}?type=applicants`;
      
      let url = baseUrl;
      
      // Add selected columns to the URL if not all columns are selected
      if (selectedColumnKeys.length > 0 && selectedColumnKeys.length < availableColumns.length) {
        url += `&columns=${selectedColumnKeys.join(',')}`;
      }
      
      // Add selected users if downloading only selected
        url += `&jobId=${id}`;
      
      window.open(url, '_blank');
      setIsDownloadModalOpen(false);
      notifySuccess("Job Applicants download initiated successfully");
    } catch (error) {
      notifyError("Something went wrong");
    }
  };
  
    return (
    <div className="container mx-auto px-4 py-8">
      <PageTitle>{t("Job Details")}</PageTitle>

      {/* Use the reusable download modal component */}
      <DownloadDataModal 
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        title="Download Job Applicats Data"
        availableColumns={availableColumns} 
        selectedItems={selectedApplicants}
        onClearSelection={() => setSelectedApplicants([])}
        onDownload={handleDownloadRequest}
        showSelectedItemsUI={false}
        entityName="Job Applicants"
      />
      

      {/* Loading State */}
      {loading && <Loading loading={loading} />}

      {/* Error State */}
      {error && (
        <div className="w-full bg-white rounded-lg dark:bg-gray-800 p-8 shadow-md text-center">
          <p className="text-red-500">{t("ErrorLoadingJob", "Error loading job details. Please try again.")}</p>
        </div>
      )}

      {/* No Data Found */}
      {!error && !loading && !data && (
        <div className="w-full bg-white rounded-lg dark:bg-gray-800 p-8 shadow-md text-center">
          <span className="flex justify-center text-gray-500 text-6xl">
            <IoBriefcaseOutline />
          </span>
          <h2 className="font-medium text-gray-600 dark:text-gray-400 mt-4">
            {t("JobNotFound", "Job not found")}
          </h2>
        </div>
      )}

      {/* Main Content */}
      {data && !error && !loading && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Company Banner - Moved to the top */}
          {data.companyBanner && (
          <div className="w-full bg-gray-100 dark:bg-white mb-4">
            <img 
              src={data.companyBanner} 
              alt={`${data.companyName} banner`} 
              className="w-full max-w-full h-auto object-contain mx-auto"
            />
          </div>
          )}

          {/* Job Header */}
          <div className="border-b dark:border-gray-700">
            <div className="p-6 lg:p-8">
              {/* Job Title and Status Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  {data.title}
                </h1>
                <div className="flex gap-2">
                  {data.isFeatured && (
                    <span className="inline-flex items-center px-3 py-1 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-400 text-sm font-medium rounded-full">
                      <IoStarOutline className="mr-1" /> Featured
                    </span>
                  )}
                  {data.isActive === true && (
                    <span className="inline-flex items-center px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-400 text-sm font-medium rounded-full">
                      Active
                    </span>
                  )}
                  {data.status === "Inactive" && (
                    <span className="inline-flex items-center px-3 py-1 bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-400 text-sm font-medium rounded-full">
                      Inactive
                    </span>
                  )}
                </div>
              </div>

              {/* Company and Location */}
              <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 mb-6">
                {/* Add Company Logo */}
                {data.companyLogo && (
                  <div className="flex-shrink-0 mb-2 md:mb-0">
                    <img 
                      src={data.companyLogo} 
                      alt={`${data.companyName} logo`} 
                      className="h-12 w-12 object-contain rounded-md border bg-white border-gray-200 dark:border-gray-700"
                    />
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <IoBusinessOutline className="text-xl text-blue-600 dark:text-blue-400" />
                  <span className="font-medium">{data.companyName}</span>
                </div>
                {data.location && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <IoLocationOutline className="text-xl" />
                    <span>{data.location}</span>
                  </div>
                )}
                {data.location==="Indore" && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <IoHomeOutline className="text-xl" />
                    <span>{data.locality}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <IoEyeOutline className="text-xl" />
                  <span>{data.views || 0} views</span>
                </div>
              </div>
              
              {/* Job highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-4">
                <JobDetailItem 
                  icon={<IoCashOutline className="text-xl text-green-600 dark:text-green-400" />} 
                  label="Salary"
                  value={formatSalary(data.salary)}
                />
                
                <JobDetailItem 
                  icon={<IoDesktopOutline className="text-xl" />} 
                  label="Work Mode"
                  value={data.workmode}
                />
                
                <JobDetailItem 
                  icon={<MdWorkHistory className="text-xl" />} 
                  label="Experience Level"
                  value={data.experience}
                />

<JobDetailItem 
                  icon={<MdWorkHistory className="text-xl" />} 
                  label="Experience"
                  value={data.experienceRange}
                />
                
                <JobDetailItem 
                  icon={<IoSchoolOutline className="text-xl" />} 
                  label="Qualification"
                  value={data.qualification}
                />

                <JobDetailItem 
                  icon={<IoSchoolOutline className="text-xl" />} 
                  label="Specific Degree"
                  value={data.specificDegree}
                />
                
             
              </div>

              {/* Quick Actions Buttons */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors duration-200">
                  <IoPersonOutline className="mr-2" />
                  View Applications ({data.applicants?.length || 0})
                </button>
                
                <button onClick={() => setIsDownloadModalOpen(true)} className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-sm transition-colors duration-200">
                  <IoDocumentTextOutline className="mr-2" />
                  Download Applicants
                </button>
                
                <button className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md shadow-sm transition-colors duration-200">
                  <IoMailOutline className="mr-2" />
                  Email Applicants
                </button>
                
                <button 
                  onClick={() => {
                    setValue('isFeatured', !data.isFeatured);
                    handleSubmit(onSubmit)();
                  }} 
                  className="inline-flex items-center px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-md shadow-sm transition-colors duration-200"
                >
                  <IoStarOutline className="mr-2" />
                  {data.isFeatured ? 'Remove Featured' : 'Toggle Featured'}
                </button>
                
                <button 
                  onClick={() => {
                    setValue('isActive', !data.isActive);
                    handleSubmit(onSubmit)();
                  }}
                  className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-md shadow-sm transition-colors duration-200"
                >
                  <IoTimeOutline className="mr-2" />
                  {data.isActive ? 'Deactivate Job' : 'Activate Job'}
                </button>
                
                <button 
                  onClick={handleModalOpen} 
                  className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md shadow-sm transition-colors duration-200"
                >
                  Delete Job
                </button>
              </div>

              {/* Posted date */}
              <div className="mt-6 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <IoCalendarOutline />
                <span>{getPostingTimeAgo(data.createdAt)} · {showDateFormat(data.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Job Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 lg:p-8">
            {/* Left Column - Job Description */}
            <div className="lg:col-span-2 space-y-8">
              {/* Job Description */}
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-gray-800 dark:text-gray-200">
                  <IoDocumentTextOutline />
                  {t("Job Description")}
                </h3>
                <div className="prose dark:prose-invert prose-blue max-w-none">
                  <div className={`${!showFullDescription && 'max-h-64 overflow-hidden relative'}`}>
                    <p className="whitespace-pre-line break-words text-gray-700 dark:text-gray-300 overflow-x-hidden">
                      {data.description || "No description available"}
                    </p>
                    
                    {!showFullDescription && data.description && data.description.length > 300 && (
                      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white dark:from-gray-800 to-transparent"></div>
                    )}
                  </div>
                  
                  {data.description && data.description.length > 300 && (
                    <button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="mt-4 flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium hover:underline"
                    >
                      {showFullDescription ? (
                        <>
                          Show Less <IoChevronUpOutline />
                        </>
                      ) : (
                        <>
                          Show More <IoChevronDownOutline />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
              
              {/* Required Skills */}
              {data.skills && data.skills.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-gray-800 dark:text-gray-200">
                    <IoCodeSlashOutline />
                    {t("Required Skills")}
                  </h3>
                  
                  <div className="flex flex-wrap gap-2">
                    {data.skills.map((skill, index) => (
                      <SkillPill key={index} skill={skill} />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Company Overview (placeholder, would come from company details) */}
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-gray-800 dark:text-gray-200">
                  <IoBusinessOutline />
                  {t("About", "About")} {data.companyName}
                </h3>
                
                <div className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-lg">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <JobDetailItem 
                      icon={<FaBuilding className="text-lg" />} 
                      label="Industry"
                      value={data.industry}
                    />
                    
                    <JobDetailItem 
                      icon={<FaUserTie className="text-lg" />} 
                      label="Size"
                      value={data.employeesSize}
                    />
                  </div>
                </div>
              </div>

              {/* Applications Overview */}
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-gray-800 dark:text-gray-200">
                  <IoPersonOutline />
                  {t("Applications Overview")}
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {data.applicants?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Applications</div>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {data.shortlisted?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Shortlisted</div>
                  </div>
                  
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      {data.hiredCandidates?.hiredNumber || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Hired</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Job Details */}
            <div className="space-y-8">
              {/* Job Details Card */}
              <div className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">
                  {t("Job Details")}
                </h3>
                
                <div className="space-y-4">
                  <JobDetailItem 
                    icon={<MdDepartureBoard className="text-lg" />} 
                    label="Department"
                    value={data.department}
                  />
                  
                  <JobDetailItem 
                    icon={<IoTimeOutline className="text-lg" />} 
                    label="Work Shift"
                    value={data.shift}
                  />
                  
                  <JobDetailItem 
                    icon={<BsCalendarWeek className="text-lg" />} 
                    label="Working Days"
                    value={data.workingDays}
                  />
                  
                  <JobDetailItem 
                    icon={<IoPersonOutline className="text-lg" />} 
                    label="Employment Type"
                    value={data.employment}
                  />
                  
                  <JobDetailItem 
                    icon={<IoChatboxOutline className="text-lg" />} 
                    label="Interview Process"
                    value={data.interview}
                  />
                  
                  <JobDetailItem 
                    icon={<IoChatboxOutline className="text-lg" />} 
                    label="Process Type"
                    value={data.process}
                  />
                  
                  <JobDetailItem 
                    icon={<IoAlarmOutline className="text-lg" />} 
                    label="Joining Process"
                    value={data.joining}
                  />
                </div>
              </div>
              
              {/* Application Statistics */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">
                  {t("Application Statistics")}
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Job ID</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{data.jobUniqueId}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Posted On</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{showDateFormat(data.createdAt)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Views</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{data.views || 0}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Pending Review</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {data.applicants?.filter(app => app.status === "Pending").length || 0}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Rejected</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {data.rejectedCandidates?.length || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <DeleteModal 
        id={id} 
        title={data?.title} 
        handleUpdate={handleUpdate}
        handleModalOpen={handleModalOpen}
      />
    </div>
  );
};

export default Job;
