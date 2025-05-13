import React, { useState, useEffect } from 'react';
import {IoDesktopOutline,IoSchoolOutline,IoCashOutline, IoStarOutline, IoBusinessOutline, IoLocationOutline, IoDocumentTextOutline, IoCodeSlashOutline, IoTimeOutline, IoPersonOutline, IoChatboxOutline, IoAlarmOutline, IoHomeOutline } from 'react-icons/io5';
import { MdDepartureBoard, MdWorkHistory } from 'react-icons/md';
import { BsCalendarWeek } from 'react-icons/bs';
import { FaUserTie } from 'react-icons/fa';
import MultiSelectDropdownField from '@/components/DropdownButton/DropdownButton';
import EmployeeServices from '@/services/EmployeeServices';
import useAsync from '@/hooks/useAsync';
import { notifyError, notifySuccess } from '@/utils/toast';
import { useHistory } from 'react-router-dom';

  
  // Dropdown Field Component with direct error prop
  const DropdownField = ({ label, options, value, onChange, formatOption, required = false, error }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {required ? <RequiredLabel text={label} /> : label}
      </label>
      <select
        value={value}   
        onChange={onChange}
        className={`w-full rounded-md border ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 px-3 py-2 text-gray-700 dark:text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
        required={required}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {formatOption ? formatOption(option) : option}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
  
 
  
  const RadioField = ({ label, options, value, onChange }) => (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="flex flex-wrap gap-4">
        {options.map((option) => (
          <label key={option} className="relative flex items-center group">
            <input
              type="radio"
              value={option}
              checked={value === option}
              onChange={(e) => onChange(e.target.value)}
              className="peer sr-only"
            />
            <div className="px-4 py-2 rounded-full border-2 border-gray-200 dark:border-gray-600 
                          peer-checked:border-blue-500 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/30
                          cursor-pointer transition-all duration-200 
                          group-hover:border-blue-400 dark:group-hover:border-blue-500">
              <span className={`text-sm ${value === option ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
                {option}
              </span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );

  // Required field label component with red asterisk
  const RequiredLabel = ({ text }) => (
    <span>
      {text} <span className="text-red-500">*</span>
    </span>
  );

  const PostJob = () => {
    const history = useHistory();

      // Add state for companies
      const [companies, setCompanies] = useState([]);
      const [selectedCompany, setSelectedCompany] = useState("");

    // Fetch companies on component mount
    useEffect(() => {
      EmployeeServices.getCompanies()
          .then(data => {
              setCompanies(data.companies);
          })
          .catch(error => {
              console.error("Error fetching companies:", error);
              notifyError("Failed to load companies");
          });
  }, []);
  

    const [jobForm, setJobForm] = useState({
      companyName: "",
      title: "",
      description: "",
      industry: "",
      department: "",
      workmode: "",
      location: "",
      locality: "",
      shift: "",
      workingDays: "",
      employment: "",
      qualification: "",
      specificDegree: "",
      joining: "",
      skills: [],
      experience: "",
      interview: "",
      process: "",
      experienceMinYears: "",
      experienceMaxYears: "",
      minSalary: "",
      maxSalary: "",
      salaryType: "",
      companyLogo: companies.companyLogo || "",
      companyBanner: companies.companyBanner || "",
      isFeatured: false,
      employeeSize: "",
    });

    const skillOptions = [

        // Administration & Office
        "MS Excel (Advanced)",
        "MS Word & PowerPoint",
        "Email Drafting",
        "Office Coordination",
        "File Management",
        "Typing (English/Hindi)",
        "Calendar Management",
        "Meeting Scheduling",
      
        // Customer Service & BPO
        "Voice Process (Inbound/Outbound)",
        "Non-Voice Process",
        "Customer Query Handling",
        "CRM Software",
        "English Communication",
        "Hindi Communication",
        "Complaint Resolution",
        "Regional Language Fluency",
      
        // Accounts & Finance
        "Tally ERP",
        "GST Filing",
        "Bookkeeping",
        "Bank Reconciliation",
        "Income Tax Filing",
        "Billing & Invoicing",
        "Financial Analysis",
      
        // Sales & Marketing
        "Field Sales",
        "Lead Generation",
        "Cold Calling",
        "Negotiation Skills",
        "Retail Sales",
        "Client Pitching",
        "Branding",
        "WhatsApp Selling",
        "Digital Marketing",
        "SEO/SEM Marketing",
      
        // IT & Software
        "Java",
        "Core Java",
        "Python",
        "JavaScript",
        "TypeScript",
        "ReactJS",
        "Angular",
        "Node.js",
        ".NET",
        "Spring Boot",
        "HTML/CSS",
        "Redux",
        "Kubernetes",
        "GCP",
        "Terraform",
        "Kafka",
        "Microservices",
        "CI/CD",
        "API Integration",
        "Git & GitHub",
        "Data Modeling",
      
        // Technician & Blue-Collar
        "Electrician Work",
        "Plumbing",
        "Carpenter Work",
        "AC Repair",
        "Fridge Repair",
        "RO Installation",
        "Welding",
        "Machine Operations",
        "Lathe Operator",
        "CCTV Installation",
      
        // Delivery & Logistics
        "Route Knowledge",
        "GPS Navigation",
        "Parcel Scanning",
        "Delivery App Usage",
        "Order Fulfillment",
        "Packaging",
        "Driving License",
      
        // Facility & Housekeeping
        "Deep Cleaning",
        "Mopping & Dusting",
        "Waste Segregation",
        "Floor Scrubbing",
        "Guest Area Setup",
      
        // Healthcare & Wellness
        "First Aid",
        "Patient Care",
        "Nursing Assistance",
        "Physiotherapy Support",
        "Fitness Coaching",
        "Diet Planning",
        "Yoga Instructor",
      
        // Hospitality & Food
        "Table Service",
        "Guest Interaction",
        "POS Billing",
        "Room Service",
        "Kitchen Helper",
      
        // Retail & Store
        "POS Handling",
        "Product Display",
        "Stock Refill",
        "Barcode Scanning",
        "Inventory Checking",
      
        // Creative & Media
        "Graphic Design",
        "Photoshop",
        "Canva",
        "Illustrator",
        "UI/UX Design",
        "Figma",
        "Video Editing",
        "Motion Graphics",
        "Reels Editing",
        "Photography",
        "Social Media Posting",
      
        // Construction & Labour
        "Civil Supervision",
        "Masonry",
        "Tile Laying",
        "Painting",
        "Scaffolding",
        "Steel Fixing",
      
        // Education & Training
        "Subject Teaching",
        "Curriculum Planning",
        "Student Counselling",
        "Online Tools (Zoom/Meet)",
      
        // Travel & Tourism
        "Tour Planning",
        "Hotel Booking",
        "Customer Assistance",
        "Travel Coordination",
        "Local Guide Knowledge",
      
        // Security Services
        "CCTV Monitoring",
        "Gate Security",
        "Fire Safety",
        "Night Duty",
      
        // Soft Skills
        "Time Management",
        "Leadership",
        "Problem Solving",
        "Critical Thinking",
        "Adaptability",
        "Quick Learner",
        "Teamwork",
        "Decision Making",
        "Conflict Resolution",
        "Self-Motivation",
        "Planning",
        "Creativity",
        "Relationship Management",
        "Interpersonal Communication",
        "Work Under Pressure",
      
        // General/Entry-Level
        "Microsoft Office",
        "Email Management",
        "Data Entry",
        "Basic English",
        "Social Media Handling"
      ];
      
    
    // Basic API calls that are always needed
    const { data:locations, loading:loadingLocations, error:errorLocations } = useAsync(() => EmployeeServices.getLocations());
    const { data:industries, loading:loadingIndustries, error:errorIndustries } = useAsync(() => EmployeeServices.getIndustries());
    const { data:departments, loading:loadingDepartments, error:errorDepartments } = useAsync(() => EmployeeServices.getDepartments());
    
    const handlePostJob = (body) => {
      try {
        console.log("Posting job with body:", body);
        
        // Find the selected company to get its ID
        const selectedCompany = companies.find(company => company.companyName === body.companyName);
        if (!selectedCompany) {
          throw new Error("Selected company not found");
        }

        EmployeeServices.postJob(selectedCompany._id, body)
          .then(response => {
            notifySuccess(response.message || "Job posted successfully!");
            history.push('/jobs');
          })
          .catch(error => {
            console.error("Error posting job:", error);
            notifyError(error.message || "Failed to post job");
          });
      } catch (error) {
        console.error("Exception in handlePostJob:", error);
        notifyError(error.message || "An unexpected error occurred");
      }
    };
    
    // Conditional API calls for degree data
    const [graduateDegrees, setGraduateDegrees] = useState([]);
    const [postGraduateDegrees, setPostGraduateDegrees] = useState([]);
    const [errorGraduateDegrees, setErrorGraduateDegrees] = useState(null);
    const [errorPostGraduateDegrees, setErrorPostGraduateDegrees] = useState(null);

    // Add state for localities
    const [localities, setLocalities] = useState([]);
    const [errorLocalities, setErrorLocalities] = useState(null);

    // Add form validation state
    const [errors, setErrors] = useState({});
    const [charCount, setCharCount] = useState(0);
    const MIN_DESCRIPTION_CHARS = 50;
    const MAX_DESCRIPTION_CHARS = 2000;

    // Add state for preview modal
    const [showPreview, setShowPreview] = useState(false);

  

    // Load degree data only when needed
    useEffect(() => {
      if (jobForm.qualification === "Graduate" && graduateDegrees.length === 0) {
      EmployeeServices.getGraduateDegrees()
  .then(data => {
    setGraduateDegrees(["Any Graduate Can Apply", ...data]);
  })
          .catch(error => {
            setErrorGraduateDegrees(error);
          });
      } else if (jobForm.qualification === "Post Graduate" && postGraduateDegrees.length === 0) {
        EmployeeServices.getPostGraduateDegrees()
          .then(data => {
            setPostGraduateDegrees(["Any Post Graduate Can Apply", ...data]);
          })
          .catch(error => {
            setErrorPostGraduateDegrees(error);
          });
      }
    }, [jobForm.qualification, graduateDegrees.length, postGraduateDegrees.length]);

    // Load locality data only when Indore is selected
    useEffect(() => {
      if (jobForm.location === "Indore" && localities.length === 0) {
        EmployeeServices.getLocalities()
          .then(data => {
            setLocalities(data);
          })
          .catch(error => {
            setErrorLocalities(error);
          });
      }
    }, [jobForm.location, localities.length]);


    // Handle basic API errors
    useEffect(() => {
      if (errorLocations) {
        notifyError(errorLocations);
      }
      if (errorIndustries) {
        notifyError(errorIndustries);
      }
      if (errorDepartments) {
        notifyError(errorDepartments);
      }
      if (errorLocalities) {
        notifyError(errorLocalities);
      }
      if (errorGraduateDegrees) {
        notifyError(errorGraduateDegrees);
      }
      if (errorPostGraduateDegrees) {
        notifyError(errorPostGraduateDegrees);
      }
    }, [errorLocations, errorIndustries, errorDepartments, errorLocalities, errorGraduateDegrees, errorPostGraduateDegrees]);

    // Add this function near the beginning of your component
    const clearErrorForField = (fieldName) => {
      if (errors[fieldName]) {
        setErrors(prevErrors => {
          const newErrors = { ...prevErrors };
          delete newErrors[fieldName];
          return newErrors;
        });
      }
    };

    // Update handleFormChange to set companyLogo and companyBanner
    const handleFormChange = (fieldName, value) => {
        setJobForm(prev => {
            const updatedForm = { ...prev, [fieldName]: value };

            // Check if the selected company matches and update logo and banner
            if (fieldName === 'companyName') {
                const selected = companies.find(company => company.companyName === value);
                if (selected) {
                    updatedForm.companyLogo = selected.companyLogo || "";
                    updatedForm.companyBanner = selected.companyBanner || "";
                } else {
                    updatedForm.companyLogo = ""; // Reset if no match
                    updatedForm.companyBanner = ""; // Reset if no match
                }
            }

            return updatedForm;
        });
        clearErrorForField(fieldName);
    };

    // Handle location change to reset locality when location changes
    const handleLocationChange = (e) => {
      const newLocation = e.target.value;
      setJobForm({ 
        ...jobForm, 
        location: newLocation,
        locality: "" // Reset locality when location changes
      });
      clearErrorForField('location');
      // Also clear locality error since we're resetting it
      clearErrorForField('locality');
    };

    // Enhanced formatter for salary display with salary type consideration
    const formatSalaryWithType = (amount, type) => {
      let formattedAmount = "";
      
      if (amount >= 100000) {
        const lacs = amount / 100000;
        if (lacs % 1 === 0) {
          formattedAmount = `₹${lacs} Lac${lacs > 1 ? 's' : ''}`;
        } else {
          formattedAmount = `₹${lacs.toFixed(1)} Lac${lacs > 1 ? 's' : ''}`;
        }
      } else if (amount >= 1000) {
        formattedAmount = `₹${(amount / 1000).toFixed(0)}k`;
      } else {
        formattedAmount = `₹${amount}`;
      }
      
      return formattedAmount;
    };

    
    // Function to validate the form
    const validateForm = () => {
      const newErrors = {};
      
      // Check required fields
      if (!jobForm.companyName) newErrors.companyName = "Company name is required";
      if (!jobForm.title) newErrors.title = "Job title is required";
      if (!jobForm.description) newErrors.description = "Job description is required";
      if (jobForm.description && jobForm.description.length < MIN_DESCRIPTION_CHARS) 
        newErrors.description = `Description must be at least ${MIN_DESCRIPTION_CHARS} characters`;
      if (!jobForm.industry) newErrors.industry = "Industry is required";
      if (!jobForm.department) newErrors.department = "Department is required";
      if (!jobForm.workmode) newErrors.workmode = "Work mode is required";
      if (!jobForm.location) newErrors.location = "Location is required";
      if (jobForm.location === "Indore" && !jobForm.locality) newErrors.locality = "Locality is required";
      if (!jobForm.shift) newErrors.shift = "Shift is required";
      if (!jobForm.workingDays) newErrors.workingDays = "Working days are required";
      if (!jobForm.employment) newErrors.employment = "Employment type is required";
      if (!jobForm.qualification) newErrors.qualification = "Qualification is required";
      if (!jobForm.joining) newErrors.joining = "Joining time is required";
      if (jobForm.skills.length === 0) newErrors.skills = "At least one skill is required";
      if (!jobForm.experience) newErrors.experience = "Experience level is required";
      if (!jobForm.interview) newErrors.interview = "Interview process is required";
      if (!jobForm.process) newErrors.process = "Process type is required";
      
      // Only require specificDegree if qualification is Graduate or Post Graduate
      if ((jobForm.qualification === "Graduate" || jobForm.qualification === "Post Graduate") && !jobForm.specificDegree) {
        newErrors.specificDegree = "Specific degree is required";
      }
      
      if (!jobForm.minSalary) newErrors.minSalary = "Minimum salary is required";
      if (!jobForm.maxSalary) newErrors.maxSalary = "Maximum salary is required";
      if (!jobForm.salaryType) newErrors.salaryType = "Salary type is required";
      if (!jobForm.experienceMinYears && jobForm.experienceMinYears !== 0) newErrors.experienceMinYears = "Experience minimum years is required";
      if (!jobForm.experienceMaxYears) newErrors.experienceMaxYears = "Experience maximum years is required";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    // Handle description change with character count
    const handleDescriptionChange = (e) => {
      const text = e.target.value;
      if (text.length <= MAX_DESCRIPTION_CHARS) {
        setJobForm({ ...jobForm, description: text });
        setCharCount(text.length);
        clearErrorForField('description');
      }
    };

    // Handle preview button click
    const handlePreviewJob = () => {
      const isValid = validateForm();
      
      if (isValid) {
        setShowPreview(true);
      } else {
        // Show error notification for empty fields
        notifyError("Please fill in all required fields");
        
        // Debugging: Check the errors object
        console.log("Errors:", errors);
        
        // Scroll to the first error field
        const firstErrorField = Object.keys(errors)[0];
        console.log("First error field:", firstErrorField); // Debugging
        
        const errorElement = document.getElementById(firstErrorField);
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          console.warn(`No element found for ID: ${firstErrorField}`); // Debugging
        }
      }
    };
    
    // Handle final submission
    const handleSubmitFinal = () => {
      // Format salary range using the same function used for display
      const formattedMinSalary = formatSalaryWithType(jobForm.minSalary);
      const formattedMaxSalary = formatSalaryWithType(jobForm.maxSalary);
      const formattedSalaryRange = `${formattedMinSalary} - ${formattedMaxSalary} ${jobForm.salaryType}`;

      const jobData = {
        location: jobForm.location,
        locality: jobForm.locality || "",
        shift: jobForm.shift,
        qualification: jobForm.qualification,
        joining: jobForm.joining,
        experienceRange: `${jobForm.experienceMinYears}-${jobForm.experienceMaxYears} years`,
        title: jobForm.title,
        workmode: jobForm.workmode,
        description: jobForm.description,
        salary: formattedSalaryRange, 
        isFeatured: jobForm.isFeatured,
        companyName: jobForm.companyName,
        industry: jobForm.industry,
        department: jobForm.department,
        skills: jobForm.skills,
        experience: jobForm.experience === "Both" ? "Fresher/Experienced" : jobForm.experience,
        interview: jobForm.interview,
        process: jobForm.process,
        employment: jobForm.employment,
        workingDays: jobForm.workingDays,
        employeesSize: jobForm.employeeSize,
        experienceMinYears: jobForm.experienceMinYears,
        experienceMaxYears: jobForm.experienceMaxYears, 
        minSalary: jobForm.minSalary,
        maxSalary: jobForm.maxSalary,
        salaryType: jobForm.salaryType,
        specificDegree: jobForm.specificDegree,
        companyLogo: jobForm.companyLogo,
        companyBanner: jobForm.companyBanner,
      };

      console.log("Job Data:", JSON.stringify(jobData));
      // Send the data object directly without stringifying
      handlePostJob(jobData);
    
      // Close modal
      setShowPreview(false);
    };
    
    // Format salary for preview
    const formatSalary = () => {
      const minFormatted = formatSalaryWithType(jobForm.minSalary);
      const maxFormatted = formatSalaryWithType(jobForm.maxSalary);
      return `${minFormatted} - ${maxFormatted} ${jobForm.salaryType}`;
    };
    
    // Job Detail Item component (borrowed from Job.jsx)
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
    
    // Job Preview Modal
    const JobPreviewModal = () => {
      if (!showPreview) return null;
      
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-full overflow-y-auto">
            {/* Modal Header */}
            <div className="border-b dark:border-gray-700 p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Job Preview
                </h2>
                <button 
                  onClick={() => setShowPreview(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Please review your job posting details before confirming
              </p>
            </div>
            
            {/* Job Content */}
            <div className="p-6">
              {/* Company Banner */}
              {jobForm.companyBanner && (
                <div className="w-full bg-gray-100 dark:bg-white mb-4">
                  <img 
                    src={jobForm.companyBanner} 
                    alt={`${jobForm.companyName} banner`} 
                    className="w-full max-w-full h-auto object-contain mx-auto"
                  />
                </div>
              )}

               {/* Job Title and Featured Badge */}
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex-1">
                    {jobForm.title}
                  </h1>
                  {jobForm.isFeatured && (
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center px-2.5 py-0.5 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-400 text-xs font-medium rounded-full">
                        <IoStarOutline className="w-3.5 h-3.5 mr-1" /> Featured
                      </span>
                    </div>
                  )}
                </div>

              {/* Job Header */}
              <div className="border-b dark:border-gray-700 pb-6 mb-6">
                {/* Company Logo and Name */}
                <div className="flex items-center gap-2 mb-4">
                  {jobForm.companyLogo && (
                    <img 
                      src={jobForm.companyLogo} 
                      alt={`${jobForm.companyName} logo`} 
                      className="h-10 w-10 object-contain rounded-md bg-white border border-gray-200 dark:border-gray-700"
                    />
                  )}
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {jobForm.companyName}
                  </span>
                  <IoLocationOutline className="text-blue-600 dark:text-blue-400 ml-2" />
                  <span className="text-sm text-gray-800 dark:text-gray-200">{jobForm.location}</span>
                  {jobForm.location === "Indore" && (
                    <>
                      <IoHomeOutline className="text-sm text-black dark:text-white ml-2" />
                      <span className="text-sm text-gray-800 dark:text-gray-200">{jobForm.locality}</span>
                    </>
                  )}
                </div>

               

                
  
                  
               
                
                {/* Job highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-4">
                  <JobDetailItem 
                    icon={<IoCashOutline className="text-xl text-green-600 dark:text-green-400" />} 
                    label="Salary"
                    value={formatSalary()}
                  />
                  <JobDetailItem 
                    icon={<IoDesktopOutline className="text-xl" />} 
                    label="Work Mode"
                    value={jobForm.workmode}
                  />
                  <JobDetailItem 
                    icon={<MdWorkHistory className="text-xl" />} 
                    label="Experience Level"
                    value={jobForm.experience}
                  />
                  <JobDetailItem 
                    icon={<MdWorkHistory className="text-xl" />} 
                    label="Experience"
                    value={`${jobForm.experienceMinYears} - ${jobForm.experienceMaxYears} years`}
                  />
                  <JobDetailItem 
                    icon={<IoSchoolOutline className="text-xl" />} 
                    label="Qualification"
                    value={jobForm.qualification}
                  />
                  <JobDetailItem 
                    icon={<IoSchoolOutline className="text-xl" />} 
                    label="Specific Degree"
                    value={jobForm.specificDegree}
                  />
                </div>
              </div>

              {/* Main Content - 2 Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Job Description */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Job Description */}
                  <div className="prose dark:prose-invert prose-blue max-w-none">
                    <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-gray-800 dark:text-gray-200">
                      <IoDocumentTextOutline />
                      Job Description
                    </h3>
                    <p className="whitespace-pre-line break-words text-gray-700 dark:text-gray-300 overflow-x-hidden">
                      {jobForm.description}
                    </p>
                  </div>
                </div>
            

             {/* Right Column - Job Details */}
             <div className="space-y-6">
                  {/* Job Details Card */}
                  <div className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-lg">
                    <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">
                      Job Details
                    </h3>
                    
                    <div className="space-y-4">
                      <JobDetailItem 
                        icon={<MdDepartureBoard className="text-lg" />} 
                        label="Department"
                        value={jobForm.department}
                      />
                      
                      <JobDetailItem 
                        icon={<IoTimeOutline className="text-lg" />} 
                        label="Work Shift"
                        value={jobForm.shift}
                      />
                      
                      <JobDetailItem 
                        icon={<BsCalendarWeek className="text-lg" />} 
                        label="Working Days"
                        value={jobForm.workingDays}
                      />
                      
                      <JobDetailItem 
                        icon={<IoPersonOutline className="text-lg" />} 
                        label="Employment Type"
                        value={jobForm.employment}
                      />
                      
                      <JobDetailItem 
                        icon={<IoChatboxOutline className="text-lg" />} 
                        label="Interview Process"
                        value={jobForm.interview}
                      />

                      <JobDetailItem 
                        icon={<IoChatboxOutline className="text-lg" />} 
                        label="Process Type"
                        value={jobForm.process}
                      />
                      
                      <JobDetailItem 
                        icon={<IoAlarmOutline className="text-lg" />} 
                        label="Joining"
                        value={jobForm.joining}
                      />
                      
                      <JobDetailItem 
                        icon={<FaUserTie className="text-lg" />} 
                        label="Company Size"
                        value={jobForm.employeeSize}
                      />
                    </div>
                  </div>
                </div>
                </div>
              </div>
              
            
            {/* Modal Footer */}
            <div className="border-t dark:border-gray-700 p-6 flex gap-4 justify-end">
              <button
                onClick={() => setShowPreview(false)}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Edit Job Details
              </button>
              
              <button
                onClick={handleSubmitFinal}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Confirm & Post Job
              </button>
            </div>
          </div>
        </div>
      );
    };

    const renderPostJobSection = () => (
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Post a New Job
        </h2>

        <div className="space-y-6">
          {/* Featured Job Toggle */}
          <div className="flex items-center space-x-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={jobForm.isFeatured}
                onChange={(e) => setJobForm({ ...jobForm, isFeatured: e.target.checked })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                Featured Job
              </span>
            </label>
            <IoStarOutline className="text-yellow-500 text-xl" />
          </div>

          {/* Company Selection Dropdown */}
          <div>
           
            <DropdownField
              label="Company Name"
              options={companies.map(company => company.companyName)}
              value={jobForm.companyName}
              onChange={(e) => {
                const value = e.target.value;
                handleFormChange('companyName', value); // Update companyName and logo/banner
              }}
              required={true}
              error={errors.companyName}
            />
          </div>

          {/* Image Previews */}
          {jobForm.companyName && (
            <div className="mt-4 flex space-x-6">
              <div className="flex flex-col justify-center bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Logo</h3>
                {jobForm.companyLogo ? (
                  <img src={jobForm.companyLogo} alt="Company Logo" className="w-24 h-24 min-w-[100px] object-contain border bg-white border-gray-300 dark:border-gray-500 rounded-md" />
                ) : (
                  <div className="w-full h-24 border border-dashed border-gray-400 dark:border-gray-600 rounded-md flex items-center justify-center text-gray-500 dark:text-gray-400">No Logo</div>
                )}
              </div>
              <div className="flex flex-col justify-center bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Banner</h3>
                {jobForm.companyBanner ? (
                  <img src={jobForm.companyBanner} alt="Company Banner" className="w-full h-24 max-w-[400px] object-contain border border-gray-300 dark:border-gray-500 rounded-md dark:bg-white" />
                ) : (
                  <div className="w-full h-16 border border-dashed border-gray-400 dark:border-gray-600 rounded-md flex items-center justify-center text-gray-500 dark:text-gray-400">No Banner</div>
                )}
              </div>
            </div>
          )}

          
<RadioField
              label="Process Type"
              options={["Voice", "Chat"]}
              value={jobForm.process}
              onChange={(value) => {
                setJobForm({ ...jobForm, process: value });
                clearErrorForField('process');
              }}
            />

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Basic Information</h3>
            
            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <RequiredLabel text="Job Title" />
              </label>
              <input
                id="title"
                type="text"
                value={jobForm.title}
                onChange={(e) => {
                  setJobForm({ ...jobForm, title: e.target.value });
                  clearErrorForField('title');
                }}
                className={`w-full rounded-md border ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 px-3 py-2 text-gray-700 dark:text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                placeholder="Enter job title"
              />
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">{errors.title}</p>
              )}
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <RequiredLabel text="Job Description" />
              </label>
              <textarea
                id="description"
                value={jobForm.description}
                onChange={handleDescriptionChange}
                rows={4}
                className={`w-full rounded-md border ${errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 px-3 py-2 text-gray-700 dark:text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                placeholder="Enter detailed job description"
              />
              {errors.description ? (
                <p className="text-sm text-red-500 mt-1">{errors.description}</p>
              ) : (
                <p className="text-sm text-gray-500 mt-1">
                  {charCount}/{MAX_DESCRIPTION_CHARS} characters (minimum {MIN_DESCRIPTION_CHARS})
                </p>
              )}
            </div>
          </div>

          {/* Salary Range */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Salary Range</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DropdownField
                label="Minimum Salary"
                options={[
                  "1000", "2000", "3000", "4000", "5000", "6000", "7000", "8000", "9000", "10000",
                  "11000", "12000", "13000", "14000", "15000", "16000", "17000", "18000", "19000", "20000",
                  "21000", "22000", "23000", "24000", "25000", "26000", "27000", "28000", "29000", "30000",
                  "31000", "32000", "33000", "34000", "35000", "36000", "37000", "38000", "39000", "40000",
                  "41000", "42000", "43000", "44000", "45000", "46000", "47000", "48000", "49000", "50000",
                  "51000", "52000", "53000", "54000", "55000", "56000", "57000", "58000", "59000", "60000",
                  "61000", "62000", "63000", "64000", "65000", "66000", "67000", "68000", "69000", "70000",
                  "71000", "72000", "73000", "74000", "75000", "76000", "77000", "78000", "79000", "80000",
                  "81000", "82000", "83000", "84000", "85000", "86000", "87000", "88000", "89000", "90000",
                  "91000", "92000", "93000", "94000", "95000", "96000", "97000", "98000", "99000", "100000",
                  "110000", "120000", "130000", "140000", "150000", "175000", "200000", "225000", "250000",
                  "275000", "300000", "325000", "350000", "375000", "400000", "425000", "450000", "475000",
                  "500000", "550000", "600000", "650000", "700000", "750000", "800000", "850000", "900000",
                  "950000", "1000000"
                ]}
                value={jobForm.minSalary.toString()}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setJobForm({ 
                    ...jobForm, 
                    minSalary: value,
                    maxSalary: jobForm.maxSalary < value ? value : jobForm.maxSalary
                  });
                  clearErrorForField('minSalary');
                }}
                formatOption={(value) => formatSalaryWithType(parseInt(value))}
                required={true}
                error={errors.minSalary}
              />
              <DropdownField
                label="Maximum Salary"
                options={[
                  "1000", "2000", "3000", "4000", "5000", "6000", "7000", "8000", "9000", "10000",
                  "11000", "12000", "13000", "14000", "15000", "16000", "17000", "18000", "19000", "20000",
                  "21000", "22000", "23000", "24000", "25000", "26000", "27000", "28000", "29000", "30000",
                  "31000", "32000", "33000", "34000", "35000", "36000", "37000", "38000", "39000", "40000",
                  "41000", "42000", "43000", "44000", "45000", "46000", "47000", "48000", "49000", "50000",
                  "51000", "52000", "53000", "54000", "55000", "56000", "57000", "58000", "59000", "60000",
                  "61000", "62000", "63000", "64000", "65000", "66000", "67000", "68000", "69000", "70000",
                  "71000", "72000", "73000", "74000", "75000", "76000", "77000", "78000", "79000", "80000",
                  "81000", "82000", "83000", "84000", "85000", "86000", "87000", "88000", "89000", "90000",
                  "91000", "92000", "93000", "94000", "95000", "96000", "97000", "98000", "99000", "100000",
                  "110000", "120000", "130000", "140000", "150000", "175000", "200000", "225000", "250000",
                  "275000", "300000", "325000", "350000", "375000", "400000", "425000", "450000", "475000",
                  "500000", "550000", "600000", "650000", "700000", "750000", "800000", "850000", "900000",
                  "950000", "1000000"
                ]}
                value={jobForm.maxSalary.toString()}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setJobForm({ 
                    ...jobForm, 
                    maxSalary: value 
                  });
                  clearErrorForField('maxSalary');
                }}
                formatOption={(value) => formatSalaryWithType(parseInt(value))}
                required={true}
                error={errors.maxSalary}
              />
              <DropdownField
                label="Salary Type"
                options={["Per Month", "Per Annum", "CTC Per Month", "CTC Per Annum"]}
                value={jobForm.salaryType}
                onChange={(e) => {
                  setJobForm({ ...jobForm, salaryType: e.target.value });
                  clearErrorForField('salaryType');
                }}
                required={true}
                error={errors.salaryType}
              />
            </div>
          </div>

          {/* Display combined salary info */}
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Current Salary Range: {formatSalaryWithType(jobForm.minSalary)} - {formatSalaryWithType(jobForm.maxSalary)} {jobForm.salaryType}
          </div>

          {/* Experience */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Experience Required</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DropdownField
                label="Minimum Experience"
                options={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20, 25].map(year => 
                  `${year} ${year === 1 ? 'Year' : 'Years'}`
                )}
                value={`${jobForm.experienceMinYears} ${jobForm.experienceMinYears === 1 ? 'Year' : 'Years'}`}
                onChange={(e) => {
                  const years = parseInt(e.target.value.split(' ')[0]);
                  setJobForm({ 
                    ...jobForm, 
                    experienceMinYears: years,
                    // Ensure max years is not less than min years
                    experienceMaxYears: jobForm.experienceMaxYears < years ? years : jobForm.experienceMaxYears
                  });
                  clearErrorForField('experienceMinYears');
                }}
                required={true}
                error={errors.experienceMinYears}
              />
              <DropdownField
                label="Maximum Experience"
                options={[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20, 25, 30, 35, 40].map(year => 
                  `${year} ${year === 1 ? 'Year' : 'Years'}`
                )}
                value={`${jobForm.experienceMaxYears} ${jobForm.experienceMaxYears === 1 ? 'Year' : 'Years'}`}
                onChange={(e) => {
                  const years = parseInt(e.target.value.split(' ')[0]);
                  setJobForm({ 
                    ...jobForm, 
                    experienceMaxYears: years 
                  });
                  clearErrorForField('experienceMaxYears');
                }}
                required={true}
                error={errors.experienceMaxYears}
              />
            </div>
          </div>

          {/* Company Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Company Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DropdownField
                label="Employee Size"
                options={[
                  "1-10 employees",
                  "11-50 employees",
                  "51-200 employees",
                  "201-500 employees",
                  "501-1000 employees",
                  "1001-5000 employees",
                  "5001+ employees"
                ]}
                value={jobForm.employeeSize}
                onChange={(e) => {
                  setJobForm({ ...jobForm, employeeSize: e.target.value });
                  clearErrorForField('employeeSize');
                }}
                error={errors.employeeSize}
              />
            </div>
          </div>

          {/* Skills Input using MultiSelect */}
          <div className="space-y-4">
            <MultiSelectDropdownField
              options={skillOptions}
              value={jobForm.skills}
              onChange={(selectedSkills) => {
                setJobForm({ ...jobForm, skills: selectedSkills });
                clearErrorForField('skills');
              }}
              label="Select Skills"
              error={errors.skills}
              required={true}
            />
          </div>

          {/* Job Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DropdownField
              label="Industry"
              options={industries}
              value={jobForm.industry}
              onChange={(e) => handleFormChange('industry', e.target.value)}
              required={true}
              error={errors.industry}
            />

            <DropdownField
              label="Department"
              options={departments}
              value={jobForm.department}
              onChange={(e) => handleFormChange('department', e.target.value)}
              required={true}
              error={errors.department}
            />

            <DropdownField
              label="Work Mode"
              options={["Remote", "Hybrid", "On-Site"]}
              value={jobForm.workmode}
              onChange={(e) => {
                setJobForm({ ...jobForm, workmode: e.target.value });
                clearErrorForField('workmode');
              }}
              required={true}
              error={errors.workmode}
            />

            <DropdownField
              label="Location"
              options={locations}
              value={jobForm.location}
              onChange={handleLocationChange}
              required={true}
              error={errors.location}
            />

            {/* Render the locality dropdown if Indore is selected */}
            {jobForm.location === "Indore" && (
              <DropdownField
                label="Locality"
                options={localities || []}
                value={jobForm.locality}
                onChange={(e) => {
                  setJobForm({ ...jobForm, locality: e.target.value });
                  clearErrorForField('locality');
                }}
                required={true}
                error={errors.locality}
              />
            )}

            <DropdownField
              label="Shift"
              options={["Day Shift", "Night Shift", "Rotational Shift"]}
              value={jobForm.shift}
              onChange={(e) => {
                setJobForm({ ...jobForm, shift: e.target.value });
                clearErrorForField('shift');
              }}
              required={true}
              error={errors.shift}
            />

            <DropdownField
              label="Working Days"
              options={[ "5 Days", "5.5 Days","6 Days"]}
              value={jobForm.workingDays}
              onChange={(e) => {
                setJobForm({ ...jobForm, workingDays: e.target.value });
                clearErrorForField('workingDays');
              }}
              required={true}
              error={errors.workingDays}
            />

            <DropdownField
              label="Employment Type"
              options={["Full-Time", "Part-Time", "Freelance", "Internship"]}
              value={jobForm.employment}
              onChange={(e) => {
                setJobForm({ ...jobForm, employment: e.target.value });
                clearErrorForField('employment');
              }}
              required={true}
              error={errors.employment}
            />

            <DropdownField
              label="Qualification"
              options={["Graduate", "12th Pass and above", "Post Graduate", "Diploma", "Any one can apply"]}
              value={jobForm.qualification}
              onChange={(e) => {
                setJobForm({ 
                  ...jobForm, 
                  qualification: e.target.value,
                  specificDegree: ""
                });
                clearErrorForField('qualification');
              }}
              required={true}
              error={errors.qualification}
            />

            {/* Render the specific degree dropdown if needed */}
            {renderSpecificDegreeDropdown()}

            <DropdownField
              label="Joining"
              options={["Immediate", "1 Month", "2 Months", "3 Months"]}
              value={jobForm.joining}
              onChange={(e) => {
                setJobForm({ ...jobForm, joining: e.target.value });
                clearErrorForField('joining');
              }}
              required={true}
              error={errors.joining}
            />
          </div>

          {/* Radio Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RadioField
              label="Experience Level"
              options={["Fresher", "Experienced","Both"]}
              value={jobForm.experience}
              onChange={(value) => {
                setJobForm({ ...jobForm, experience: value });
                clearErrorForField('experience');
              }}
            />

            <RadioField
              label="Interview Process"
              options={["Online", "In-Person"]}
              value={jobForm.interview}
              onChange={(value) => {
                setJobForm({ ...jobForm, interview: value });
                clearErrorForField('interview');
              }}
            />

          </div>

          

          {/* Submit Button - Updated to trigger preview */}
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200" 
              onClick={handlePreviewJob}
            >
              Preview & Post Job
            </button>
          </div>

          {/* Job Preview Modal */}
          <JobPreviewModal />
        </div>
      </div>
    );

    // Add this function to render the specific degree dropdown based on qualification selection
    const renderSpecificDegreeDropdown = () => {
      if (jobForm.qualification === "Graduate") {
        return (
          <DropdownField
            label="Graduate Degree"
            options={graduateDegrees || []}
            value={jobForm.specificDegree}
            onChange={(e) => {
              setJobForm({ ...jobForm, specificDegree: e.target.value });
              clearErrorForField('specificDegree');
            }}
            required={true}
            error={errors.specificDegree}
          />
        );
      } else if (jobForm.qualification === "Post Graduate") {
        return (
          <DropdownField
            label="Post Graduate Degree"
            options={postGraduateDegrees || []}
            value={jobForm.specificDegree}
            onChange={(e) => {
              setJobForm({ ...jobForm, specificDegree: e.target.value });
              clearErrorForField('specificDegree');
            }}
            required={true}
            error={errors.specificDegree}
          />
        );
      }
      return null;
    };

    return renderPostJobSection();
  };

  export default PostJob;