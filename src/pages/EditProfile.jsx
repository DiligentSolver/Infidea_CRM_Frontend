import { useTranslation } from "react-i18next";
import { useState, useEffect, useContext } from "react";
import { MdPerson, MdNumbers, MdWork, MdPhone, MdEmail, MdDateRange, MdHome, MdLocationOn, MdAccountBalance } from "react-icons/md";
import { FaCamera, FaSave, FaEdit } from "react-icons/fa";
import Cookies from "js-cookie";
//internal import
import EmployeeServices from "@/services/EmployeeServices";
import AnimatedContent from "@/components/common/AnimatedContent";
import { notifyError, notifySuccess } from "@/utils/toast";
import { formatLongDate } from "@/utils/dateFormatter";
import { uploadImage, deleteImage } from "@/services/CloudinaryService";
import { AdminContext } from "@/context/AdminContext";


const EditProfile = () => {
  const { t } = useTranslation();
  const { state, dispatch } = useContext(AdminContext);
  const { adminInfo } = state;

  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    image: "",
    imagePublicId: "",
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
          
          // Extract public ID from image URL if available
          let imagePublicId = "";
          if (employeeData.profileImage) {
            try {
              const url = new URL(employeeData.profileImage);
              const pathParts = url.pathname.split('/');
              const uploadIndex = pathParts.findIndex(part => part === 'upload');
              
              if (uploadIndex !== -1 && uploadIndex < pathParts.length - 2) {
                let startIndex = uploadIndex + 1;
                if (pathParts[startIndex].startsWith('v') && /^v\d+$/.test(pathParts[startIndex])) {
                  startIndex++;
                }
                imagePublicId = pathParts.slice(startIndex).join('/').split('.')[0];
              }
            } catch (error) {
              console.error("Error extracting public ID from profile image URL:", error);
            }
          }
          
          setProfile({
            image: employeeData.profileImage || "",
            imagePublicId: imagePublicId,
            name: employeeData.name?.en || "",
            empCode: employeeData.employeeCode || "",
            designation: employeeData.designation || employeeData.role || "",
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
        
        // Delete existing image if we have its public ID
        if (profile.imagePublicId) {
          try {
            await deleteImage(profile.imagePublicId);
            console.log("Previous profile image deleted successfully");
          } catch (deleteError) {
            console.error("Error deleting previous profile image:", deleteError);
            // Continue with upload even if delete fails
          }
        } else if (profile.image && profile.image.startsWith('http')) {
          // Fallback: Try to extract public ID from URL if not stored
          try {
            const url = new URL(profile.image);
            const pathParts = url.pathname.split('/');
            const uploadIndex = pathParts.findIndex(part => part === 'upload');
            
            if (uploadIndex !== -1 && uploadIndex < pathParts.length - 2) {
              let startIndex = uploadIndex + 1;
              if (pathParts[startIndex].startsWith('v') && /^v\d+$/.test(pathParts[startIndex])) {
                startIndex++;
              }
              
              const publicId = pathParts.slice(startIndex).join('/').split('.')[0];
              
              console.log("Extracted public ID:", publicId);
              
              if (publicId) {
                await deleteImage(publicId);
                console.log("Previous profile image deleted successfully");
              }
            } else {
              console.warn("Could not extract public ID from URL:", profile.image);
            }
          } catch (deleteError) {
            console.error("Error deleting previous profile image:", deleteError);
            // Continue with upload even if delete fails
          }
        }
        
        // Upload to Cloudinary
        const result = await uploadImage(file, 'profile-images', `employee-${profile.empCode || Date.now()}`);
        
        if (result && result.url) {
          // Update profile with the Cloudinary URL and store the public ID
          setProfile({ 
            ...profile, 
            image: result.url,
            imagePublicId: result.publicId 
          });
          
          // Update profile image immediately on API without waiting for save button
          try {
            const updated = await EmployeeServices.updateEmployeeProfileImage(result.url);
            notifySuccess(updated.message);
            
            // Update adminInfo Cookie with the new profile image
            if (adminInfo) {
              const updatedAdminInfo = { 
                ...adminInfo,
                user: { 
                  ...adminInfo.user,
                  profileImage: result.url 
                }
              };
              
              // Update the adminInfo context
              dispatch({ type: "USER_LOGIN", payload: updatedAdminInfo });
              
              // Update the cookie
              Cookies.set("adminInfo", JSON.stringify(updatedAdminInfo), {
                expires: 1, // 1 day expiry
                sameSite: "None",
                secure: true,
              });
            }
          } catch (updateError) {
            console.error("Error updating profile image on API:", updateError);
            notifyError(updateError?.response?.data?.message || "Failed to update profile image");
          }
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

      // Validate required fields
      if (!profile.email || !profile.contact) {
        notifyError("Email and Contact Number are required fields");
        setLoading(false);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(profile.email)) {
        notifyError("Please enter a valid email address");
        setLoading(false);
        return;
      }

      // Validate contact number format
      const contactRegex = /^[0-9]{10}$/;
      if (!contactRegex.test(profile.contact)) {
        notifyError("Please enter a valid 10-digit contact number");
        setLoading(false);
        return;
      }
      
      // Validate account number match if it's being set for the first time
      if (!profile.accountNumber && profile.reAccountNumber !== profile.accountNumber) {
        notifyError("Account numbers do not match");
        setLoading(false);
        return;
      }

      // Get the current employee data to compare what has changed
      const currentEmployee = await EmployeeServices.getEmployeeProfile();
      const existingData = currentEmployee.employee;

      // Build profile data based on what's changed or new
      const profileData = {
        // Address is always included as it's always editable
        address: profile.address,
        
        // Email and contact are always included as they're required
        email: profile.email,
        mobile: profile.contact,
        
        // Include image updates
        ...(profile.image && profile.image.startsWith('http') && { profileImage: profile.image }),
        ...(profile.imagePublicId && { imagePublicId: profile.imagePublicId }),

        // For other fields, only include if they're empty in existing data
        ...(!existingData.name?.en && profile.name && { name: { en: profile.name } }),
        ...(!existingData.designation && profile.designation && { designation: profile.designation }),
        ...(!existingData.dateOfBirth && profile.dob && { dateOfBirth: profile.dob }),

        // Emergency contact details
        ...(!existingData.emergencyContact?.name && profile.emergencyContactName && {
          emergencyContact: {
            ...(existingData.emergencyContact || {}),
            name: profile.emergencyContactName,
            ...(profile.emergencyContactNumber && { number: profile.emergencyContactNumber }),
            ...(profile.relation && { relation: profile.relation })
          }
        }),

        // Bank details
        ...(!existingData.bankDetails?.bankName && {
          bankDetails: {
            ...(existingData.bankDetails || {}),
            ...(profile.bankName && { bankName: profile.bankName }),
            ...(profile.branchName && { branch: profile.branchName }),
            ...(profile.ifsc && { ifsc: profile.ifsc }),
            ...(profile.accountNumber && { accountNumber: profile.accountNumber }),
            ...(profile.beneficiaryAddress && { beneficiaryAddress: profile.beneficiaryAddress })
          }
        })
      };

      // Call the update API
      const updated = await EmployeeServices.updateEmployeeProfile(profileData);
      notifySuccess(updated.message);
      setEditMode(false);
      
      // Update the profile state with the response
      if (updated.employee) {
        // Get public ID from response or try to extract it from the image URL if not provided
        let imagePublicId = updated.employee.imagePublicId || "";
        if (!imagePublicId && updated.employee.profileImage) {
          try {
            const url = new URL(updated.employee.profileImage);
            const pathParts = url.pathname.split('/');
            const uploadIndex = pathParts.findIndex(part => part === 'upload');
            
            if (uploadIndex !== -1 && uploadIndex < pathParts.length - 2) {
              let startIndex = uploadIndex + 1;
              if (pathParts[startIndex].startsWith('v') && /^v\d+$/.test(pathParts[startIndex])) {
                startIndex++;
              }
              imagePublicId = pathParts.slice(startIndex).join('/').split('.')[0];
            }
          } catch (error) {
            console.error("Error extracting public ID from profile image URL:", error);
          }
        }
        
        setProfile(prevProfile => ({
          ...prevProfile,
          image: updated.employee.profileImage || prevProfile.image,
          imagePublicId: imagePublicId,
          name: updated.employee.name?.en || prevProfile.name,
          designation: updated.employee.designation || prevProfile.designation,
          contact: updated.employee.mobile || prevProfile.contact,
          dob: updated.employee.dateOfBirth || prevProfile.dob,
          address: updated.employee.address || prevProfile.address,
          emergencyContactName: updated.employee.emergencyContact?.name || prevProfile.emergencyContactName,
          emergencyContactNumber: updated.employee.emergencyContact?.number || prevProfile.emergencyContactNumber,
          relation: updated.employee.emergencyContact?.relation || prevProfile.relation,
          bankName: updated.employee.bankDetails?.bankName || prevProfile.bankName,
          branchName: updated.employee.bankDetails?.branch || prevProfile.branchName,
          ifsc: updated.employee.bankDetails?.ifsc || prevProfile.ifsc,
          accountNumber: updated.employee.bankDetails?.accountNumber || prevProfile.accountNumber,
          reAccountNumber: updated.employee.bankDetails?.accountNumber || prevProfile.reAccountNumber,
          beneficiaryAddress: updated.employee.bankDetails?.beneficiaryAddress || prevProfile.beneficiaryAddress,
        }));
        
        // Update profile image in adminInfo cookie if it has changed
        if (adminInfo && updated.employee.profileImage) {
          const updatedAdminInfo = { 
            ...adminInfo,
            user: { 
              ...adminInfo.user,
              profileImage: updated.employee.profileImage 
            }
          };
          
          // Update the adminInfo context
          dispatch({ type: "USER_LOGIN", payload: updatedAdminInfo });
          
          // Update the cookie
          Cookies.set("adminInfo", JSON.stringify(updatedAdminInfo), {
            expires: 1, // 1 day expiry
            sameSite: "None",
            secure: true,
          });
        }
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
      getDisabled: (value) => !!value
    },
    { 
      label: "Employee Code", 
      key: "empCode", 
      icon: <MdNumbers />, 
      maxLength: 10,
      disabled: true // Always disabled as it's system generated
    },
    { 
      label: "Designation", 
      key: "designation", 
      icon: <MdWork />, 
      maxLength: 50,
      getDisabled: (value) => !!value
    },
    { 
      label: "Contact Number", 
      key: "contact", 
      icon: <MdPhone />, 
      type: "tel",
      pattern: "[0-9]{10}",
      maxLength: 10,
      required: true,
      disabled: false // Always editable as it's compulsory
    },
    { 
      label: "Email ID", 
      key: "email", 
      icon: <MdEmail />, 
      type: "email",
      maxLength: 50,
      required: true,
      disabled: false // Always editable as it's compulsory
    },
    { 
      label: "Joining Date", 
      key: "joiningDate", 
      type: "date", 
      icon: <MdDateRange />,
      formatDisplay: true,
      disabled: true // Always disabled as it's system generated
    }
  ];

  const personalFields = [
    { 
      label: "Date of Birth", 
      key: "dob", 
      type: "date", 
      icon: <MdDateRange />,
      formatDisplay: true,
      getDisabled: (value) => !!value
    },
    {
      label: "Address",
      key: "address",
      icon: <MdHome />,
      maxLength: 100,
      disabled: false // Always editable
    },
    { 
      label: "Emergency Contact Name", 
      key: "emergencyContactName", 
      icon: <MdPerson />, 
      maxLength: 50,
      getDisabled: (value) => !!value
    },
    { 
      label: "Emergency Contact Number", 
      key: "emergencyContactNumber", 
      icon: <MdPhone />, 
      type: "tel",
      pattern: "[0-9]{10}",
      maxLength: 10,
      getDisabled: (value) => !!value
    },
    { 
      label: "Relation", 
      key: "relation", 
      icon: <MdPerson />, 
      maxLength: 30,
      getDisabled: (value) => !!value
    }
  ];

  const bankFields = [
    { 
      label: "Bank Name", 
      key: "bankName", 
      icon: <MdAccountBalance />, 
      maxLength: 50,
      getDisabled: (value) => !!value
    },
    { 
      label: "Branch", 
      key: "branchName", 
      icon: <MdAccountBalance />, 
      maxLength: 50,
      getDisabled: (value) => !!value
    },
    { 
      label: "IFSC", 
      key: "ifsc", 
      icon: <MdNumbers />, 
      maxLength: 11,
      getDisabled: (value) => !!value
    },
    { 
      label: "Account Number", 
      key: "accountNumber", 
      icon: <MdNumbers />, 
      maxLength: 18,
      getDisabled: (value) => !!value
    },
    { 
      label: "Re-Enter Account Number", 
      key: "reAccountNumber", 
      icon: <MdNumbers />, 
      maxLength: 18,
      getDisabled: (value) => !!profile.accountNumber
    },
    { 
      label: "Beneficiary Address", 
      key: "beneficiaryAddress", 
      icon: <MdLocationOn />, 
      maxLength: 100,
      getDisabled: (value) => !!value
    }
  ];

  // Render a section of fields
  const renderFields = (fields) => {
    return fields.map(({ label, key, type, icon, maxLength, pattern, disabled, getDisabled, required, formatDisplay }) => {
      // Determine if field should be disabled
      const isDisabled = disabled || (getDisabled && getDisabled(profile[key]));
      
      return (
        <div key={key} className="mb-3">
          <label className="flex items-center gap-1.5 text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            <span className="text-base">{icon}</span>
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
          {editMode ? (
            <input
              type={type || "text"}
              value={profile[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              placeholder={`${label}${required ? ' (Required)' : ''}`}
              maxLength={maxLength}
              pattern={pattern}
              required={required}
              disabled={isDisabled}
              className={`w-full px-2.5 py-1.5 text-sm rounded border ${!profile[key] && required ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:border-[#1a5d96] dark:focus:border-[#e2692c] focus:ring-1 focus:ring-[#1a5d96] dark:focus:ring-[#e2692c] ${isDisabled ? 'opacity-70 cursor-not-allowed' : ''}`}
            />
          ) : (
            <div className="w-full px-2.5 py-1.5 text-sm rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white flex items-center truncate overflow-hidden">
              {formatDisplay ? getDisplayDate(profile[key]) : profile[key]}
            </div>
          )}
        </div>
      );
    });
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
                    className="w-full h-full object-contain bg-gray-100"
                  />
                )}
                {editMode && (
                  <>
                    <label
                      htmlFor="imageUpload"
                      className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer ${loading ? 'opacity-70' : 'opacity-100'} transition-opacity duration-300`}
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
