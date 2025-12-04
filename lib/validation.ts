export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation (Indian format)
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

// Aadhaar validation (12 digits)
export const validateAadhaar = (aadhaar: string): boolean => {
  const aadhaarRegex = /^\d{4}[\s-]?\d{4}[\s-]?\d{4}$/;
  return aadhaarRegex.test(aadhaar);
};

// PAN validation
export const validatePAN = (pan: string): boolean => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan.toUpperCase());
};

// Pincode validation (6 digits)
export const validatePincode = (pincode: string): boolean => {
  const pincodeRegex = /^\d{6}$/;
  return pincodeRegex.test(pincode);
};

// Age validation
export const validateAge = (dob: string, minAge: number = 18, maxAge: number = 100): boolean => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age >= minAge && age <= maxAge;
};

// Height validation (in cm)
export const validateHeight = (height: string): boolean => {
  const heightNum = parseFloat(height);
  return heightNum >= 100 && heightNum <= 250;
};

// Weight validation (in kg)
export const validateWeight = (weight: string): boolean => {
  const weightNum = parseFloat(weight);
  return weightNum >= 30 && weightNum <= 200;
};

// Income validation
export const validateIncome = (income: string): boolean => {
  const incomeNum = parseInt(income.replace(/\D/g, ''));
  return incomeNum > 0 && incomeNum <= 100000000;
};

// Policy form validation
export const validatePolicyForm = (formData: any): ValidationResult => {
  const errors: ValidationError[] = [];

  // Applicant details
  if (!formData.applicantName?.trim()) {
    errors.push({ field: 'applicantName', message: 'Name is required' });
  }

  if (!formData.applicantEmail?.trim()) {
    errors.push({ field: 'applicantEmail', message: 'Email is required' });
  } else if (!validateEmail(formData.applicantEmail)) {
    errors.push({ field: 'applicantEmail', message: 'Invalid email format' });
  }

  if (!formData.applicantPhone?.trim()) {
    errors.push({ field: 'applicantPhone', message: 'Phone is required' });
  } else if (!validatePhone(formData.applicantPhone)) {
    errors.push({ field: 'applicantPhone', message: 'Invalid phone number' });
  }

  if (!formData.applicantAadhaar?.trim()) {
    errors.push({ field: 'applicantAadhaar', message: 'Aadhaar is required' });
  } else if (!validateAadhaar(formData.applicantAadhaar)) {
    errors.push({ field: 'applicantAadhaar', message: 'Invalid Aadhaar format' });
  }

  if (!formData.applicantPAN?.trim()) {
    errors.push({ field: 'applicantPAN', message: 'PAN is required' });
  } else if (!validatePAN(formData.applicantPAN)) {
    errors.push({ field: 'applicantPAN', message: 'Invalid PAN format' });
  }

  if (!formData.applicantDOB) {
    errors.push({ field: 'applicantDOB', message: 'Date of birth is required' });
  } else if (!validateAge(formData.applicantDOB, 18, 100)) {
    errors.push({ field: 'applicantDOB', message: 'Age must be between 18 and 100' });
  }

  if (!formData.applicantGender) {
    errors.push({ field: 'applicantGender', message: 'Gender is required' });
  }

  if (!formData.applicantAddress?.trim()) {
    errors.push({ field: 'applicantAddress', message: 'Address is required' });
  }

  if (!formData.applicantState) {
    errors.push({ field: 'applicantState', message: 'State is required' });
  }

  if (!formData.applicantCity) {
    errors.push({ field: 'applicantCity', message: 'City is required' });
  }

  if (!formData.applicantPincode?.trim()) {
    errors.push({ field: 'applicantPincode', message: 'Pincode is required' });
  } else if (!validatePincode(formData.applicantPincode)) {
    errors.push({ field: 'applicantPincode', message: 'Invalid pincode format' });
  }

  if (formData.applicantAnnualIncome && !validateIncome(formData.applicantAnnualIncome)) {
    errors.push({ field: 'applicantAnnualIncome', message: 'Invalid income amount' });
  }

  if (formData.height && !validateHeight(formData.height)) {
    errors.push({ field: 'height', message: 'Height must be between 100-250 cm' });
  }

  if (formData.weight && !validateWeight(formData.weight)) {
    errors.push({ field: 'weight', message: 'Weight must be between 30-200 kg' });
  }

  // Policy details
  if (!formData.policyType) {
    errors.push({ field: 'policyType', message: 'Policy type is required' });
  }

  if (!formData.policyTerm) {
    errors.push({ field: 'policyTerm', message: 'Policy term is required' });
  }

  if (!formData.sumAssured?.trim()) {
    errors.push({ field: 'sumAssured', message: 'Sum assured is required' });
  }

  // Nominee details
  if (!formData.nomineeName?.trim()) {
    errors.push({ field: 'nomineeName', message: 'Nominee name is required' });
  }

  if (!formData.nomineeRelation) {
    errors.push({ field: 'nomineeRelation', message: 'Nominee relation is required' });
  }

  if (!formData.nomineePhone?.trim()) {
    errors.push({ field: 'nomineePhone', message: 'Nominee phone is required' });
  } else if (!validatePhone(formData.nomineePhone)) {
    errors.push({ field: 'nomineePhone', message: 'Invalid nominee phone number' });
  }

  if (!formData.termsAccepted) {
    errors.push({ field: 'termsAccepted', message: 'You must accept terms and conditions' });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Customer form validation
export const validateCustomerForm = (formData: any): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!formData.fullName?.trim()) {
    errors.push({ field: 'fullName', message: 'Full name is required' });
  }

  if (!formData.mobileNumber?.trim()) {
    errors.push({ field: 'mobileNumber', message: 'Mobile number is required' });
  } else if (!validatePhone(formData.mobileNumber)) {
    errors.push({ field: 'mobileNumber', message: 'Invalid mobile number' });
  }

  if (!formData.email?.trim()) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!validateEmail(formData.email)) {
    errors.push({ field: 'email', message: 'Invalid email format' });
  }

  if (!formData.address?.trim()) {
    errors.push({ field: 'address', message: 'Address is required' });
  }

  if (formData.aadhaar && !validateAadhaar(formData.aadhaar)) {
    errors.push({ field: 'aadhaar', message: 'Invalid Aadhaar format' });
  }

  if (formData.pan && !validatePAN(formData.pan)) {
    errors.push({ field: 'pan', message: 'Invalid PAN format' });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Claim form validation
export const validateClaimForm = (formData: any): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!formData.claimId?.trim()) {
    errors.push({ field: 'claimId', message: 'Claim ID is required' });
  }

  if (!formData.policyId?.trim()) {
    errors.push({ field: 'policyId', message: 'Policy ID is required' });
  }

  if (!formData.claimantName?.trim()) {
    errors.push({ field: 'claimantName', message: 'Claimant name is required' });
  }

  if (!formData.claimType) {
    errors.push({ field: 'claimType', message: 'Claim type is required' });
  }

  if (!formData.amount?.trim()) {
    errors.push({ field: 'amount', message: 'Claim amount is required' });
  }

  if (!formData.description?.trim()) {
    errors.push({ field: 'description', message: 'Description is required' });
  }

  if (!formData.dateOfIncident) {
    errors.push({ field: 'dateOfIncident', message: 'Date of incident is required' });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
