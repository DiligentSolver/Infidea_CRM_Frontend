import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { MdPerson, MdNumbers, MdWork, MdPhone, MdEmail, MdDateRange, MdHome, MdLocationOn, MdAccountBalance } from "react-icons/md";
import { FaCamera, FaSave, FaEdit } from "react-icons/fa";
//internal import
import EmployeeServices from "@/services/EmployeeServices";
import AnimatedContent from "@/components/common/AnimatedContent";
import { notifyError, notifySuccess } from "@/utils/toast";
import { formatLongDate } from "@/utils/dateFormatter";
import { uploadImage } from "@/services/CloudinaryService";


const EditProfile = () => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    image: "",
    name: "",
    empCode: "",
    designation: "",
    contact: "",
    email: "",
    joiningDate: "",
    dob: "",
    address: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    relation: "",
    bankName: "",
    branchName: "",
    ifsc: "",
    accountNumber: "",
    reAccountNumber: "",
    beneficiaryAddress: "",
  });
  


  // Fetch employee profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await EmployeeServices.getEmployeeProfile();
        console.log("API Response:", response.employee);
        
        if (response) {
          // Directly use the response object that contains employee data
          const employeeData = response.employee;
          
          setProfile({
            image: employeeData.profileImage || "",
            name: employeeData.name?.en || "",
            empCode: employeeData.employeeCode || "",
            designation: employeeData.role || employeeData.designation || "",
            contact: employeeData.mobile || "",
            email: employeeData.email || "",
            joiningDate: employeeData.createdAt || "",
            dob: employeeData.dateOfBirth || "",
            address: employeeData.address || "",
            emergencyContactName: employeeData.emergencyContact?.name || "",
            emergencyContactNumber: employeeData.emergencyContact?.number || "",
            relation: employeeData.emergencyContact?.relation || "",
            bankName: employeeData.bankDetails?.bankName || "",
            branchName: employeeData.bankDetails?.branch || "",
            ifsc: employeeData.bankDetails?.ifsc || "",
            accountNumber: employeeData.bankDetails?.accountNumber || "",
            reAccountNumber: employeeData.bankDetails?.accountNumber || "",
            beneficiaryAddress: employeeData.bankDetails?.beneficiaryAddress || "",
          });
        }
      } catch (error) {
        notifyError(error?.message || "Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  // Helper function to format dates for display
  const getDisplayDate = (isoDate) => {
    return isoDate ? formatLongDate(isoDate) : "";
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setLoading(true);
        // Show file preview immediately for a better UX
        const reader = new FileReader();
        reader.onloadend = () => {
          // This will only update the local preview, not save to backend
          setProfile({ ...profile, image: reader.result });
        };
        reader.readAsDataURL(file);
        
        // Upload to Cloudinary
        const result = await uploadImage(file, 'profile-images', `employee-${profile.empCode || Date.now()}`);
        
        if (result && result.url) {
          // Update profile with the Cloudinary URL
          setProfile({ ...profile, image: result.url });
          // We'll include this URL when saving the profile
          notifySuccess("Profile image uploaded successfully!");
        }
      } catch (error) {
        notifyError(error?.message || "Failed to upload image");
        console.error("Error uploading image:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Validate account number match
      if (profile.accountNumber !== profile.reAccountNumber) {
        notifyError("Account numbers do not match");
        setLoading(false);
        return;
      }
      
      const profileData = {
        name: { en: profile.name },
        designation: profile.designation,
        mobile: profile.contact,
        email: profile.email,
        dateOfBirth: profile.dob,
        address: profile.address,
        emergencyContact: {
          name: profile.emergencyContactName,
          number: profile.emergencyContactNumber,
          relation: profile.relation
        },
        bankDetails: {
          bankName: profile.bankName,
          branch: profile.branchName,
          ifsc: profile.ifsc,
          accountNumber: profile.accountNumber,
          beneficiaryAddress: profile.beneficiaryAddress
        },
        // Include profileImage if it has been updated
        ...(profile.image && profile.image.startsWith('http') && { profileImage: profile.image }),
      };

      // Call the update API with the profile ID
      const updated = await EmployeeServices.updateEmployeeProfile(profileData);
      notifySuccess(updated.message);
      setEditMode(false);
      
      // Transform the returned employee data to match the profile state format
      if (updated.employee) {
        setProfile({
          image: updated.employee.profileImage || "",
          name: updated.employee.name?.en,
          empCode: updated.employee.employeeCode,
          designation: updated.employee.designation,
          contact: updated.employee.mobile,
          email: updated.employee.email,
          joiningDate: updated.employee.createdAt,
          dob: updated.employee.dateOfBirth,
          address: updated.employee.address,
          emergencyContactName: updated.employee.emergencyContact?.name,
          emergencyContactNumber: updated.employee.emergencyContact?.number,
          relation: updated.employee.emergencyContact?.relation,
          bankName: updated.employee.bankDetails?.bankName,
          branchName: updated.employee.bankDetails?.branch,
          ifsc: updated.employee.bankDetails?.ifsc,
          accountNumber: updated.employee.bankDetails?.accountNumber,
          reAccountNumber: updated.employee.bankDetails?.accountNumber,
          beneficiaryAddress: updated.employee.bankDetails?.beneficiaryAddress,
        });
      }
    } catch (error) {
      notifyError(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Define fields by section with medium heights
  const employeeFields = [
    { 
      label: "Employee Name", 
      key: "name", 
      icon: <MdPerson />, 
      maxLength: 50,
    },
    { 
      label: "Employee Code", 
      key: "empCode", 
      icon: <MdNumbers />, 
      maxLength: 10,
      disabled:true,
    },
    { 
      label: "Designation", 
      key: "designation", 
      icon: <MdWork />, 
      maxLength: 50,
    },
    { 
      label: "Contact Number", 
      key: "contact", 
      icon: <MdPhone />, 
      type: "tel",
      pattern: "[0-9]{10}",
      maxLength: 10,
    },
    { 
      label: "Email ID", 
      key: "email", 
      icon: <MdEmail />, 
      type: "email",
      maxLength: 50,
      disabled: true
    },
    { 
      label: "Joining Date", 
      key: "joiningDate", 
      type: "date", 
      icon: <MdDateRange />,
      formatDisplay: true,
      disabled:true
    }
  ];

  const personalFields = [
    { 
      label: "Date of Birth", 
      key: "dob", 
      type: "date", 
      icon: <MdDateRange />,
      formatDisplay: true
    },
    {
      label: "Address",
      key: "address",
      icon: <MdHome />,
      maxLength: 100,
    },
    { 
      label: "Emergency Contact Name", 
      key: "emergencyContactName", 
      icon: <MdPerson />, 
      maxLength: 50,
    },
    { 
      label: "Emergency Contact No.", 
      key: "emergencyContactNumber", 
      icon: <MdPhone />, 
      type: "tel",
      pattern: "[0-9]{10}",
      maxLength: 10,
    },
    { 
      label: "Relation", 
      key: "relation", 
      icon: <MdPerson />, 
      maxLength: 30,
    }
  ];

  const bankFields = [
    { 
      label: "Bank Name", 
      key: "bankName", 
      icon: <MdAccountBalance />, 
      maxLength: 50,
    },
    { 
      label: "Branch", 
      key: "branchName", 
      icon: <MdAccountBalance />, 
      maxLength: 50,
    },
    { 
      label: "IFSC", 
      key: "ifsc", 
      icon: <MdNumbers />, 
      maxLength: 11,
    },
    { 
      label: "Account Number", 
      key: "accountNumber", 
      icon: <MdNumbers />, 
      maxLength: 18,
    },
    { 
      label: "Re-Enter Account Number", 
      key: "reAccountNumber", 
      icon: <MdNumbers />, 
      maxLength: 18,
    },
    { 
      label: "Beneficiary Address", 
      key: "beneficiaryAddress", 
      icon: <MdLocationOn />, 
      maxLength: 100,
    }
  ];

  // Render a section of fields
  const renderFields = (fields) => {
    return fields.map(({ label, key, type, icon, maxLength, pattern, disabled, formatDisplay }) => (
      <div key={key} className="mb-3">
        <label className="flex items-center gap-1.5 text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          <span className="text-base">{icon}</span>
          {label}
        </label>
        {editMode ? (
          <input
            type={type || "text"}
            value={profile[key]}
            onChange={(e) => handleChange(key, e.target.value)}
            placeholder={label}
            maxLength={maxLength}
            pattern={pattern}
            disabled={disabled}
            className={`w-full px-2.5 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:border-[#1a5d96] dark:focus:border-[#e2692c] focus:ring-1 focus:ring-[#1a5d96] dark:focus:ring-[#e2692c] ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
          />
        ) : (
          <div className="w-full px-2.5 py-1.5 text-sm rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white flex items-center truncate overflow-hidden">
            {formatDisplay ? getDisplayDate(profile[key]) : profile[key]}
          </div>
        )}
      </div>
    ));
  };

  return (
    <AnimatedContent>
      <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white">
        <div className="h-full flex flex-col">
          {/* User Information Header */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-3 flex justify-between items-center mt-5">
            <div className="flex items-center gap-3">
              {/* Profile Image */}
              <div className="relative w-14 h-14 rounded-full overflow-hidden group flex-shrink-0 shadow-md">
                {loading && profile.image?.startsWith('data:') ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                    <div className="w-10 h-10 border-4 border-gray-300 border-t-[#1a5d96] dark:border-t-[#e2692c] rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <img
                    src={
                      profile.image && 
                      (profile.image.startsWith('http') || profile.image.startsWith('data:'))
                        ? profile.image
                        : "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                )}
                {editMode && (
                  <>
                    <label
                      htmlFor="imageUpload"
                      className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer ${loading ? 'opacity-70' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-300`}
                    >
                      {loading ? (
                        <span className="text-white text-xs">Uploading...</span>
                      ) : (
                        <FaCamera className="text-white text-base" />
                      )}
                    </label>
                    <input
                      type="file"
                      id="imageUpload"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={loading}
                    />
                  </>
                )}
              </div>
              <div>
                <h2 className="text-base font-bold text-[#1a5d96] dark:text-[#e2692c] tracking-tight">
                  {profile.name ? profile.name : "Name not available"}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-semibold">Employee Code:</span> {profile.empCode  ? profile.empCode:"not available"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {profile.designation ? profile.designation : "Designation not available"}
                </p>
              </div>
            </div>
            
            <div>
              <button
                onClick={() => editMode ? handleSave() : setEditMode(true)}
                disabled={loading}
                className={`px-3 py-1.5 bg-[#1a5d96] hover:bg-[#154a7a] dark:bg-[#e2692c] dark:hover:bg-[#d15a20] text-white rounded text-sm shadow-md flex items-center gap-1.5 transition-all duration-300 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <span>Processing...</span>
                ) : editMode ? (
                  <>
                    <FaSave size={14} /> Save
                  </>
                ) : (
                  <>
                    <FaEdit size={14} /> Edit
                  </>
                )}
              </button>
            </div>
          </div>
  
          {/* Content with sections */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 p-2 mt-4">
            {/* Employee Details Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md max-h-[calc(100vh-4.5rem)]">
              <div className="px-3 py-1.5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <h3 className="text-sm font-semibold text-[#1a5d96] dark:text-[#e2692c]">Employee Details</h3>
              </div>
              <div className="p-3 overflow-y-auto max-h-[calc(100vh-6.5rem)]">
                {renderFields(employeeFields)}
              </div>
            </div>
  
            {/* Personal Details Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md max-h-[calc(100vh-4.5rem)]">
              <div className="px-3 py-1.5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <h3 className="text-sm font-semibold text-[#1a5d96] dark:text-[#e2692c]">Personal Details</h3>
              </div>
              <div className="p-3 overflow-y-auto max-h-[calc(100vh-6.5rem)]">
                {renderFields(personalFields)}
              </div>
            </div>
  
            {/* Bank Details Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md max-h-[calc(100vh-4.5rem)]">
              <div className="px-3 py-1.5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <h3 className="text-sm font-semibold text-[#1a5d96] dark:text-[#e2692c]">Bank Details</h3>
              </div>
              <div className="p-3 overflow-y-auto max-h-[calc(100vh-6.5rem)]">
                {renderFields(bankFields)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedContent>
  );
};

export default EditProfile;
