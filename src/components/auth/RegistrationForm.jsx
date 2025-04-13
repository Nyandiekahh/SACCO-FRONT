import React, { useState } from 'react';

const RegistrationForm = ({ email, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    email: email || '',
    password: '',
    confirm_password: '',
    full_name: '',
    id_number: '',
    phone_number: '',
    whatsapp_number: '',
    mpesa_number: '',
    bank_name: '',
    bank_account_number: '',
    bank_account_name: ''
  });
  
  const [errors, setErrors] = useState({});
  const [useWhatsappAsMpesa, setUseWhatsappAsMpesa] = useState(false);
  const [useWhatsappAsPhone, setUseWhatsappAsPhone] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // If toggling WhatsApp/Mpesa or WhatsApp/Phone
    if (name === 'whatsapp_number' && useWhatsappAsMpesa) {
      setFormData(prev => ({ ...prev, mpesa_number: value }));
    }
    if (name === 'whatsapp_number' && useWhatsappAsPhone) {
      setFormData(prev => ({ ...prev, phone_number: value }));
    }
  };

  const handleToggleWhatsappAsMpesa = () => {
    setUseWhatsappAsMpesa(!useWhatsappAsMpesa);
    if (!useWhatsappAsMpesa) {
      // If turning on, set mpesa_number to whatsapp_number
      setFormData(prev => ({ ...prev, mpesa_number: formData.whatsapp_number }));
    }
  };

  const handleToggleWhatsappAsPhone = () => {
    setUseWhatsappAsPhone(!useWhatsappAsPhone);
    if (!useWhatsappAsPhone) {
      // If turning on, set phone_number to whatsapp_number
      setFormData(prev => ({ ...prev, phone_number: formData.whatsapp_number }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }
    
    // Full name validation
    if (!formData.full_name) {
      newErrors.full_name = 'Full name is required';
    }
    
    // ID Number validation
    if (!formData.id_number) {
      newErrors.id_number = 'ID number is required';
    } else if (!/^\d{8,10}$/.test(formData.id_number)) {
      newErrors.id_number = 'ID number must be between 8-10 digits';
    }
    
    // Phone number validation
    if (!formData.phone_number) {
      newErrors.phone_number = 'Phone number is required';
    } else if (!/^\+?\d{10,15}$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Invalid phone number format';
    }
    
    // WhatsApp number validation
    if (!formData.whatsapp_number) {
      newErrors.whatsapp_number = 'WhatsApp number is required';
    } else if (!/^\+?\d{10,15}$/.test(formData.whatsapp_number)) {
      newErrors.whatsapp_number = 'Invalid WhatsApp number format';
    }
    
    // M-Pesa number validation
    if (!formData.mpesa_number) {
      newErrors.mpesa_number = 'M-Pesa number is required';
    } else if (!/^\+?\d{10,15}$/.test(formData.mpesa_number)) {
      newErrors.mpesa_number = 'Invalid M-Pesa number format';
    }
    
    // Bank details validation
    if (!formData.bank_name) {
      newErrors.bank_name = 'Bank name is required';
    }
    
    if (!formData.bank_account_number) {
      newErrors.bank_account_number = 'Bank account number is required';
    }
    
    if (!formData.bank_account_name) {
      newErrors.bank_account_name = 'Bank account name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Complete Your Registration</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email - Disabled since it comes from the invite */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight bg-gray-100"
              id="email"
              name="email"
              type="email"
              value={formData.email}
              disabled
              readOnly
            />
          </div>
          
          {/* Full Name */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="full_name">
              Full Name
            </label>
            <input
              className={`shadow appearance-none border ${
                errors.full_name ? 'border-red-500' : 'border-gray-300'
              } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500`}
              id="full_name"
              name="full_name"
              type="text"
              placeholder="John Doe"
              value={formData.full_name}
              onChange={handleChange}
            />
            {errors.full_name && (
              <p className="text-red-500 text-xs italic mt-1">{errors.full_name}</p>
            )}
          </div>
          
          {/* ID Number */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="id_number">
              ID Number
            </label>
            <input
              className={`shadow appearance-none border ${
                errors.id_number ? 'border-red-500' : 'border-gray-300'
              } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500`}
              id="id_number"
              name="id_number"
              type="text"
              placeholder="National ID Number"
              value={formData.id_number}
              onChange={handleChange}
            />
            {errors.id_number && (
              <p className="text-red-500 text-xs italic mt-1">{errors.id_number}</p>
            )}
          </div>
          
          {/* Phone Number */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone_number">
              Phone Number
            </label>
            <input
              className={`shadow appearance-none border ${
                errors.phone_number ? 'border-red-500' : 'border-gray-300'
              } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500`}
              id="phone_number"
              name="phone_number"
              type="text"
              placeholder="+254XXXXXXXXX"
              value={formData.phone_number}
              onChange={handleChange}
              disabled={useWhatsappAsPhone}
            />
            {errors.phone_number && (
              <p className="text-red-500 text-xs italic mt-1">{errors.phone_number}</p>
            )}
          </div>
          
          {/* WhatsApp Number */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="whatsapp_number">
              WhatsApp Number
            </label>
            <input
              className={`shadow appearance-none border ${
                errors.whatsapp_number ? 'border-red-500' : 'border-gray-300'
              } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500`}
              id="whatsapp_number"
              name="whatsapp_number"
              type="text"
              placeholder="+254XXXXXXXXX"
              value={formData.whatsapp_number}
              onChange={handleChange}
            />
            {errors.whatsapp_number && (
              <p className="text-red-500 text-xs italic mt-1">{errors.whatsapp_number}</p>
            )}
            <div className="mt-2 flex items-center">
              <input
                id="useWhatsappAsPhone"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                checked={useWhatsappAsPhone}
                onChange={handleToggleWhatsappAsPhone}
              />
              <label htmlFor="useWhatsappAsPhone" className="ml-2 block text-sm text-gray-700">
                Same as Phone Number
              </label>
            </div>
          </div>
          
          {/* M-Pesa Number */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mpesa_number">
              M-Pesa Number
            </label>
            <input
              className={`shadow appearance-none border ${
                errors.mpesa_number ? 'border-red-500' : 'border-gray-300'
              } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500`}
              id="mpesa_number"
              name="mpesa_number"
              type="text"
              placeholder="+254XXXXXXXXX"
              value={formData.mpesa_number}
              onChange={handleChange}
              disabled={useWhatsappAsMpesa}
            />
            {errors.mpesa_number && (
              <p className="text-red-500 text-xs italic mt-1">{errors.mpesa_number}</p>
            )}
            <div className="mt-2 flex items-center">
              <input
                id="useWhatsappAsMpesa"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                checked={useWhatsappAsMpesa}
                onChange={handleToggleWhatsappAsMpesa}
              />
              <label htmlFor="useWhatsappAsMpesa" className="ml-2 block text-sm text-gray-700">
                Same as WhatsApp Number
              </label>
            </div>
          </div>
          
          {/* Bank Name */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bank_name">
              Bank Name
            </label>
            <input
              className={`shadow appearance-none border ${
                errors.bank_name ? 'border-red-500' : 'border-gray-300'
              } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500`}
              id="bank_name"
              name="bank_name"
              type="text"
              placeholder="Bank Name"
              value={formData.bank_name}
              onChange={handleChange}
            />
            {errors.bank_name && (
              <p className="text-red-500 text-xs italic mt-1">{errors.bank_name}</p>
            )}
          </div>
          
          {/* Bank Account Number */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bank_account_number">
              Bank Account Number
            </label>
            <input
              className={`shadow appearance-none border ${
                errors.bank_account_number ? 'border-red-500' : 'border-gray-300'
              } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500`}
              id="bank_account_number"
              name="bank_account_number"
              type="text"
              placeholder="Bank Account Number"
              value={formData.bank_account_number}
              onChange={handleChange}
            />
            {errors.bank_account_number && (
              <p className="text-red-500 text-xs italic mt-1">{errors.bank_account_number}</p>
            )}
          </div>
          
          {/* Bank Account Name */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bank_account_name">
              Bank Account Name
            </label>
            <input
              className={`shadow appearance-none border ${
                errors.bank_account_name ? 'border-red-500' : 'border-gray-300'
              } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500`}
              id="bank_account_name"
              name="bank_account_name"
              type="text"
              placeholder="Bank Account Name"
              value={formData.bank_account_name}
              onChange={handleChange}
            />
            {errors.bank_account_name && (
              <p className="text-red-500 text-xs italic mt-1">{errors.bank_account_name}</p>
            )}
          </div>
          
          {/* Password */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className={`shadow appearance-none border ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500`}
              id="password"
              name="password"
              type="password"
              placeholder="******************"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <p className="text-red-500 text-xs italic mt-1">{errors.password}</p>
            )}
          </div>
          
          {/* Confirm Password */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirm_password">
              Confirm Password
            </label>
            <input
              className={`shadow appearance-none border ${
                errors.confirm_password ? 'border-red-500' : 'border-gray-300'
              } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500`}
              id="confirm_password"
              name="confirm_password"
              type="password"
              placeholder="******************"
              value={formData.confirm_password}
              onChange={handleChange}
            />
            {errors.confirm_password && (
              <p className="text-red-500 text-xs italic mt-1">{errors.confirm_password}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-end mt-6">
          <button
            className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Complete Registration'}
          </button>
        </div>
      </form>
      
      <div className="text-center mb-4">
        <p className="text-sm text-gray-600">
          After registration, you'll need to upload your ID documents for verification
        </p>
      </div>
    </div>
  );
};

export default RegistrationForm;