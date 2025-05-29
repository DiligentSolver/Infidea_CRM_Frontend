// Options data file for centralized management of all dropdown options

// Status options with color classes
export const statusOptions = [
  {
    value: "",
    label: "Select Status",
    colorClass: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  },
  {
    value: "Reject - HR Round",
    label: "Reject - HR Round",
    colorClass: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  },
  {
    value: "Reject - Ops Round",
    label: "Reject - Ops Round",
    colorClass: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  },
  {
    value: "Reject - Client Round",
    label: "Reject - Client Round",
    colorClass: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  },
  {
    value: "Reject - Assessment Round",
    label: "Reject - Assessment Round",
    colorClass: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  },
  {
    value: "Duplicate",
    label: "Duplicate",
    colorClass: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  },
  {
    value: "Joined Somewhere Else",
    label: "Joined Somewhere Else",
    colorClass:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  },
  {
    value: "Joined & Left",
    label: "Joined & Left",
    colorClass:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  },
  {
    value: "Joined & Duplicated",
    label: "Joined & Duplicated",
    colorClass:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  },
  {
    value: "Negative Rehire",
    label: "Negative Rehire",
    colorClass: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  },
  {
    value: "Not Interested",
    label: "Not Interested",
    colorClass:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  },
  {
    value: "Offer Drop",
    label: "Offer Drop",
    colorClass: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  },
  {
    value: "Feedback Pending From Client",
    label: "Feedback Pending From Client",
    colorClass:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  },
  {
    value: "Interview Pending - Client Round",
    label: "Interview Pending - Client Round",
    colorClass:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  },
  {
    value: "Interview Pending - HR Round",
    label: "Interview Pending - HR Round",
    colorClass:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  },
  {
    value: "Interview Pending - Ops Round",
    label: "Interview Pending - Ops Round",
    colorClass:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  },
  {
    value: "Joined",
    label: "Joined",
    colorClass:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  },
  {
    value: "Selected",
    label: "Selected",
    colorClass:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  },
  {
    value: "Scheduled",
    label: "Scheduled",
    colorClass: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  },
  {
    value: "Completed",
    label: "Completed",
    colorClass:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  },
  {
    value: "On Hold",
    label: "On Hold",
    colorClass:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  },
  {
    value: "Cancelled",
    label: "Cancelled",
    colorClass: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  },
  {
    value: "Others",
    label: "Others",
    colorClass: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  },
  // Custom statuses
  {
    value: "Call Back Requested",
    label: "Call Back Requested",
    colorClass:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  },
  {
    value: "Client Call",
    label: "Client Call",
    colorClass:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  },
  {
    value: "Inhouse Hr In Touch",
    label: "Inhouse Hr In Touch",
    colorClass: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  },
  {
    value: "Lineup",
    label: "Lineup",
    colorClass:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  },
  {
    value: "Not Aligned Anywhere",
    label: "Not Aligned Anywhere",
    colorClass: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  },
  {
    value: "Not Looking for Job",
    label: "Not Looking for Job",
    colorClass:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  },
  {
    value: "Not Picking Call",
    label: "Not Picking Call",
    colorClass: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  },
  {
    value: "Not Reachable",
    label: "Not Reachable",
    colorClass: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  },
  {
    value: "Walkin at Infidea",
    label: "Walkin at Infidea",
    colorClass:
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
  },
];

// Helper function to get status color class
export const getStatusColorClass = (status) => {
  const found = statusOptions.find((option) => option.value === status);
  return found
    ? found.colorClass
    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
};

// Company options
export const companyOptions = [
  { value: "", label: "" },
  { value: "Teleperformance", label: "Teleperformance" },
  { value: "Taskus", label: "TaskUs" },
  { value: "ICICI Lombard", label: "ICICI Lombard" },
  { value: "Qconnect", label: "Qconnect" },
  { value: "Altruist", label: "Altruist" },
  { value: "Annova", label: "Annova" },
  { value: "Others", label: "Others" },
];

// Process options
export const processOptions = [
  { value: "", label: "" },
  { value: "Airtel Black", label: "Airtel Black" },
  { value: "Airtel Broadband", label: "Airtel Broadband" },
  { value: "IPru", label: "IPru" },
  { value: "Induslnd Bank", label: "Induslnd Bank" },
  { value: "Customer Support", label: "Customer Support" },
  { value: "E-Channel Sales", label: "E-Channel Sales" },
  { value: "Sales", label: "Sales" },
  { value: "Delivroo", label: "Delivroo" },
  { value: "Doordash", label: "Doordash" },
  { value: "Frontier", label: "Frontier" },
  { value: "Tinder", label: "Tinder" },
  { value: "Vivint", label: "Vivint" },
  { value: "Myntra Chat", label: "Myntra Chat" },
  { value: "Myntra Email", label: "Myntra Email" },
  { value: "Myntra Voice", label: "Myntra Voice" },
  { value: "Noon.Com", label: "Noon.Com" },
  { value: "Swiggy Chat", label: "Swiggy Chat" },
  { value: "Swiggy Email", label: "Swiggy Email" },
  { value: "Swiggy Voice", label: "Swiggy Voice" },
  { value: "Asus", label: "Asus" },
  { value: "Byram", label: "Byram" },
  { value: "Dexcom", label: "Dexcom" },
  { value: "Flipkart Chat", label: "Flipkart Chat" },
  { value: "Flipkart L2", label: "Flipkart L2" },
  { value: "Flipkart Seller Support", label: "Flipkart Seller Support" },
  { value: "Flipkart Voice", label: "Flipkart Voice" },
  { value: "Instacart Chat", label: "Instacart Chat" },
  { value: "Instacart Email", label: "Instacart Email" },
  { value: "Instacart Voice", label: "Instacart Voice" },
  { value: "Mastercard B2B", label: "Mastercard B2B" },
  { value: "Mastercard B2C", label: "Mastercard B2C" },
  { value: "P&G", label: "P&G" },
  { value: "Presto", label: "Presto" },
  { value: "Temu", label: "Temu" },
  { value: "Western Union Chat", label: "Western Union Chat" },
  { value: "Western Union Email", label: "Western Union Email" },
  { value: "Western Union Voice", label: "Western Union Voice" },
  { value: "Xaomi", label: "Xaomi" },
  { value: "CRT", label: "CRT" },
  { value: "Others", label: "Others" },
];

// Company to Process mapping
export const companyProcessMap = {
  Altruist: ["Airtel Black", "Airtel Broadband", "IPru", "Induslnd Bank"],
  "ICICI Lombard": ["Customer Support", "Sales", "E-Channel Sales"],
  Taskus: ["Delivroo", "Doordash", "Frontier", "Tinder", "Vivint"],
  Qconnect: [
    "Myntra Chat",
    "Myntra Email",
    "Myntra Voice",
    "Noon.Com",
    "Swiggy Chat",
    "Swiggy Email",
    "Swiggy Voice",
  ],
  Teleperformance: [
    "Asus",
    "Byram",
    "Dexcom",
    "Flipkart Chat",
    "Flipkart L2",
    "Flipkart Seller Support",
    "Flipkart Voice",
    "Instacart Chat",
    "Instacart Email",
    "Instacart Voice",
    "Mastercard B2B",
    "Mastercard B2C",
    "P&G",
    "Presto",
    "Temu",
    "Western Union Chat",
    "Western Union Email",
    "Western Union Voice",
    "Xaomi",
  ],
  Annova: ["Others"],
  Others: ["Others"],
};

// Company location mapping for WhatsApp sharing
export const companyLocations = {
  // Add actual location URLs when available - these are just placeholders
  Teleperformance: "https://maps.app.goo.gl/example1",
  Taskus: "https://maps.app.goo.gl/example2",
  "ICICI Lombard": "https://maps.app.goo.gl/example3",
  Qconnect: "https://maps.app.goo.gl/example4",
  Altruist: "https://maps.app.goo.gl/example5",
  Annova: "https://maps.app.goo.gl/example6",
  // Default location for Infidea office - use this if company doesn't have a location
  default: "https://maps.app.goo.gl/your_office_location",
};

// Function to get processes by company
export const getProcessesByCompany = (company) => {
  if (!company) return [{ value: "", label: "" }];

  const processes = companyProcessMap[company] || [];
  return [
    { value: "", label: "" },
    ...processOptions.filter(
      (option) =>
        option.value !== "" &&
        (processes.includes(option.value) || company === "")
    ),
  ];
};

// Function to get location URL for a company
export const getCompanyLocation = (company) => {
  return companyLocations[company] || companyLocations.default;
};

// Pagination options
export const resultsPerPageOptions = [
  { value: 10, label: "10" },
  { value: 20, label: "20" },
  { value: 40, label: "40" },
  { value: 60, label: "60" },
  { value: 80, label: "80" },
  { value: 160, label: "160" },
];

// Date range type options
export const dateRangeTypeOptions = [
  { value: "day", label: "Daily" },
  { value: "month", label: "Monthly" },
  { value: "year", label: "Yearly" },
];

// Leave status options
export const leaveStatusOptions = [
  { value: "", label: "" },
  { value: "Approved", label: "Approved" },
  { value: "Rejected", label: "Rejected" },
  { value: "Pending", label: "Pending" },
];

// Define joining type options (specific to this page)
export const joiningTypeOptions = [
  { value: "", label: "" },
  { value: "Domestic", label: "Domestic" },
  { value: "International", label: "International" },
  { value: "Mid-Lateral", label: "Mid-Lateral" },
];

// Call Status options for filters
export const callStatusOptions = [
  { value: "", label: "" },
  { value: "Call Back Requested", label: "Call Back Requested" },
  { value: "Pipeline", label: "Pipeline" },
  { value: "Shared with Inhouse HR", label: "Shared with Inhouse HR" },
  { value: "Inhouse HR In Touch", label: "Inhouse HR In Touch" },
  { value: "Lineup", label: "Lineup" },
  { value: "Not Aligned Anywhere", label: "Not Aligned Anywhere" },
  { value: "Not Looking for Job", label: "Not Looking for Job" },
  { value: "Not Picking Call", label: "Not Picking Call" },
  { value: "Not Reachable", label: "Not Reachable" },
  { value: "Walkin at Infidea", label: "Walkin at Infidea" },
];

// Generate call duration options
export const callDurationOptions = Array.from({ length: 30 }, (_, i) => ({
  value: `${i + 1}`,
  label: `${i + 1} ${i === 0 ? "Minute" : "Minutes"}`,
}));
callDurationOptions.unshift({ value: "", label: "" });

// Passing Year options for filters
export const passingYearOptions = [
  { value: "", label: "" },
  ...Array.from({ length: 31 }, (_, i) => ({
    value: String(2000 + i),
    label: String(2000 + i),
  })).reverse(),
];

// Experience options for filters
export const experienceOptions = [
  { value: "", label: "" },
  { value: "Fresher", label: "Fresher" },
  { value: "Experienced", label: "Experienced" },
];

// Gender options for filters
export const genderOptions = [
  { value: "", label: "" },
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Others", label: "Others" },
];

// Communication options for filters
export const communicationOptions = [
  { value: "", label: "" },
  { value: "Hindi", label: "Hindi" },
  { value: "Below Average", label: "Below Average" },
  { value: "Average", label: "Average" },
  { value: "Above Average", label: "Above Average" },
  { value: "Good", label: "Good" },
  { value: "Excellent", label: "Excellent" },
];

// Shift Preference options for filters
export const shiftPreferenceOptions = [
  { value: "", label: "" },
  { value: "Day Shift", label: "Day Shift" },
  { value: "Night Shift", label: "Night Shift" },
  { value: "Any Shift", label: "Any Shift Works" },
];

// Work Mode options for filters
export const workModeOptions = [
  { value: "", label: "" },
  { value: "Office", label: "Office" },
  { value: "Work From Home", label: "Work From Home" },
  { value: "Hybrid", label: "Hybrid" },
  { value: "Any Mode", label: "Any Mode" },
];

// Notice Period options for filters
export const noticePeriodOptions = [
  { value: "", label: "" },
  { value: "Immediate", label: "Immediate Joiner" },
  { value: "7 Days", label: "7 Days" },
  { value: "15 Days", label: "15 Days" },
  { value: "30 Days", label: "30 Days" },
  { value: "45 Days", label: "45 Days" },
  { value: "60 Days", label: "60 Days" },
  { value: "90 Days", label: "90 Days" },
  { value: "More than 90 Days", label: "More than 90 Days" },
];

// Relocation options for filters
export const relocationOptions = [
  { value: "", label: "" },
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
];

// Source options for filters
export const sourceOptions = [
  { value: "", label: "" },
  { value: "Candidate Reference", label: "Candidate Reference" },
  { value: "Incoming Call", label: "Incoming Call" },
  { value: "Indeed", label: "Indeed" },
  { value: "Instagram", label: "Instagram" },
  { value: "Internal Database", label: "Internal Database" },
  { value: "Internshala", label: "Internshala" },
  { value: "Linkedin", label: "LinkedIn" },
  { value: "Missed Call", label: "Missed Call" },
  { value: "Naukri", label: "Naukri.com" },
  { value: "Other", label: "Other" },
  { value: "Personal Reference", label: "Personal Reference" },
  { value: "Walkin", label: "Walkin" },
  { value: "Whatsapp", label: "WhatsApp" },
];

// Generate dynamic year options
export const getYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const yearOptions = [{ value: "", label: "Select Year" }];
  for (let year = 2020; year <= currentYear + 2; year++) {
    yearOptions.push({ value: year.toString(), label: year.toString() });
  }
  return yearOptions;
};

// Generate date options (1-31)
export const dateOptions = (() => {
  const options = [{ value: "", label: "Select Date" }];
  for (let date = 1; date <= 31; date++) {
    const dateValue = date < 10 ? `0${date}` : `${date}`;
    options.push({ value: dateValue, label: dateValue });
  }
  return options;
})();

// Month options
export const monthOptions = [
  { value: "", label: "" },
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

// Sort options
export const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "name_asc", label: "Name (A-Z)" },
  { value: "name_desc", label: "Name (Z-A)" },
];

// Joining status options
export const joiningStatusOptions = [
  {
    value: "",
    label: "Select Status",
    colorClass: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  },
  {
    value: "Joining Details Not Received",
    label: "Joining Details Not Received",
    colorClass: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  },
  {
    value: "Joining Details Received",
    label: "Joining Details Received",
    colorClass:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  },
  {
    value: "Pending",
    label: "Pending",
    colorClass:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  },
];

// Activities status options
export const activitiesStatusOptions = [
  { value: "", label: "All Activity" },
  { value: "ondesk", label: "On Desk" },
  { value: "lunchbreak", label: "Lunch Break" },
  { value: "interviewsession", label: "Interview Session" },
  { value: "teammeeting", label: "Team Meeting" },
  { value: "clientmeeting", label: "Client Meeting" },
  { value: "officecelebration", label: "Office Celebration" },
  { value: "logout", label: "Logout" },
];
