import { useState, useEffect } from 'react';
import { CHANGE_REQUEST_FLOW, type ChangeRequestCategory, type ChangeRequestSubOption } from '../data/changeRequestLogic';

type ViewState = 'category' | 'details';

interface ChangeRequestWidgetProps {
  onComplete?: (data: {
    categoryId: string;
    subOptionId: string;
    formData: Record<string, string>;
  }) => void;
}

// Helper function to get field label and placeholder
const getFieldConfig = (fieldId: string): { label: string; placeholder: string; type: string } => {
  const fieldMap: Record<string, { label: string; placeholder: string; type: string }> = {
    credit_score: { label: 'Credit Score', placeholder: 'Enter credit score (e.g., 750)', type: 'number' },
    application_id: { label: 'Application ID', placeholder: 'Enter application ID', type: 'text' },
    reason: { label: 'Reason', placeholder: 'Enter reason for change', type: 'text' },
    property_id: { label: 'Property ID', placeholder: 'Enter property ID', type: 'text' },
    field_to_update: { label: 'Field to Update', placeholder: 'Enter field name', type: 'text' },
    new_value: { label: 'New Value', placeholder: 'Enter new value', type: 'text' },
    new_address: { label: 'New Address', placeholder: 'Enter new address', type: 'text' },
    verification_document: { label: 'Verification Document', placeholder: 'Upload document', type: 'file' },
    current_owner: { label: 'Current Owner', placeholder: 'Enter current owner name', type: 'text' },
    new_owner: { label: 'New Owner', placeholder: 'Enter new owner name', type: 'text' },
    transfer_date: { label: 'Transfer Date', placeholder: 'MM/DD/YYYY', type: 'date' },
    legal_document: { label: 'Legal Document', placeholder: 'Upload legal document', type: 'file' },
    fee_amount: { label: 'Fee Amount', placeholder: '$0.00', type: 'number' },
    fee_type: { label: 'Fee Type', placeholder: 'Enter fee type', type: 'text' },
    payment_method: { label: 'Payment Method', placeholder: 'Enter payment method', type: 'text' },
    current_bundle: { label: 'Current Bundle', placeholder: 'Enter current bundle name', type: 'text' },
    new_bundle: { label: 'New Bundle', placeholder: 'Enter new bundle name', type: 'text' },
    effective_date: { label: 'Effective Date', placeholder: 'MM/DD/YYYY', type: 'date' },
    account_id: { label: 'Account ID', placeholder: 'Enter account ID', type: 'text' },
    current_plan: { label: 'Current Plan', placeholder: 'Enter current plan', type: 'text' },
    new_plan: { label: 'New Plan', placeholder: 'Enter new plan', type: 'text' },
    modification_reason: { label: 'Modification Reason', placeholder: 'Enter reason for modification', type: 'text' },
    transaction_id: { label: 'Transaction ID', placeholder: 'Enter transaction ID', type: 'text' },
    refund_amount: { label: 'Refund Amount', placeholder: '$0.00', type: 'number' },
    refund_reason: { label: 'Refund Reason', placeholder: 'Enter refund reason', type: 'text' },
    supporting_document: { label: 'Supporting Document', placeholder: 'Upload document', type: 'file' },
    new_billing_address: { label: 'New Billing Address', placeholder: 'Enter new billing address', type: 'text' },
    verification: { label: 'Verification', placeholder: 'Enter verification code', type: 'text' },
    activation_date: { label: 'Activation Date', placeholder: 'MM/DD/YYYY', type: 'date' },
    service_type: { label: 'Service Type', placeholder: 'Enter service type', type: 'text' },
    deactivation_reason: { label: 'Deactivation Reason', placeholder: 'Enter deactivation reason', type: 'text' },
    new_mgmt_name: { label: 'New Management Name', placeholder: 'Enter new management company name', type: 'text' },
    current_status: { label: 'Current Status', placeholder: 'Enter current status', type: 'text' },
    new_status: { label: 'New Status', placeholder: 'Enter new status', type: 'text' },
    change_reason: { label: 'Change Reason', placeholder: 'Enter reason for status change', type: 'text' },
    suspension_reason: { label: 'Suspension Reason', placeholder: 'Enter suspension reason', type: 'text' },
    expected_resolution_date: { label: 'Expected Resolution Date', placeholder: 'MM/DD/YYYY', type: 'date' },
    reactivation_date: { label: 'Reactivation Date', placeholder: 'MM/DD/YYYY', type: 'date' },
    code_id: { label: 'Code ID', placeholder: 'Enter code ID', type: 'text' },
    update_type: { label: 'Update Type', placeholder: 'Enter update type', type: 'text' },
    new_code_value: { label: 'New Code Value', placeholder: 'Enter new code value', type: 'text' },
    code_type: { label: 'Code Type', placeholder: 'Enter code type', type: 'text' },
    code_value: { label: 'Code Value', placeholder: 'Enter code value', type: 'text' },
    request_description: { label: 'Request Description', placeholder: 'Enter request description', type: 'text' },
    related_entity: { label: 'Related Entity', placeholder: 'Enter related entity', type: 'text' },
    priority: { label: 'Priority', placeholder: 'Enter priority level', type: 'text' },
    document_type: { label: 'Document Type', placeholder: 'Enter document type', type: 'text' },
    document_file: { label: 'Document File', placeholder: 'Upload file', type: 'file' },
    related_entity_id: { label: 'Related Entity ID', placeholder: 'Enter related entity ID', type: 'text' },
  };

  if (fieldMap[fieldId]) {
    return fieldMap[fieldId];
  }

  // Default fallback
  const label = fieldId
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  return { label, placeholder: `Enter ${label.toLowerCase()}`, type: 'text' };
};

export default function ChangeRequestWidget({ onComplete }: ChangeRequestWidgetProps) {
  const [viewState, setViewState] = useState<ViewState>('category');
  const [selectedCategory, setSelectedCategory] = useState<ChangeRequestCategory | null>(null);
  const [selectedSubOption, setSelectedSubOption] = useState<ChangeRequestSubOption | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingCategory, setProcessingCategory] = useState<string | null>(null);

  // Handle category selection with processing state
  const handleCategorySelection = (category: ChangeRequestCategory, subOption: ChangeRequestSubOption) => {
    setSelectedCategory(category);
    setSelectedSubOption(subOption);
    setIsProcessing(true);
    setProcessingCategory(category.label);
    
    setTimeout(() => {
      setIsProcessing(false);
      setViewState('details');
    }, 800);
  };

  // Processing/Loading State
  if (isProcessing && processingCategory) {
    return (
      <div className="bg-white border-l-4 border-[#009cdb] border-[2px] border-r border-t border-b border-[#e3e3e3] border-solid rounded-eva-l shadow-[16px_23px_38.4px_-1px_rgba(0,0,0,0.08)] p-6 w-full max-w-[400px] backdrop-blur-[12.1px]" style={{ borderImage: 'none' }}>
        <div className="flex gap-3 items-center">
          <div className="relative shrink-0 w-8 h-8">
            <div className="absolute inset-0 border-2 border-[#009cdb] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-eva-body-sm-bold text-[#4e445a]">Processing request</p>
            <p className="text-eva-body-sm text-[#7a6b8c]">
              Analyzing your request for {processingCategory}...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Category View: Show all categories with sub-options in sections (matching Figma design)
  if (viewState === 'category') {
    return (
      <div className="bg-white border-l-4 border-[#009cdb] border-[2px] border-r border-t border-b border-[#e3e3e3] border-solid rounded-eva-l shadow-[16px_23px_38.4px_-1px_rgba(0,0,0,0.08)] p-6 w-full max-w-[400px] backdrop-blur-[12.1px]" style={{ borderImage: 'none' }}>
        <div className="flex flex-col gap-5">
          <p className="text-eva-body text-[#4f4559] leading-[1.4]">
            How can I help you with a Change Request today?
          </p>
          
          <div className="flex flex-col gap-5 max-h-[400px] overflow-y-auto pr-2">
            {CHANGE_REQUEST_FLOW.map((category) => (
              <div key={category.id} className="flex flex-col gap-4">
                {/* Category Header */}
                <div className="flex items-center gap-2.5">
                  <p className="text-eva-body-sm-bold text-[#a399b0] uppercase tracking-[-0.16px]">
                    {category.label}
                  </p>
                  <div className="flex-1 h-px bg-[#e3e3e3]"></div>
                </div>
                
                {/* Sub-Options as Radio Buttons */}
                <div className="flex flex-col gap-3">
                  {category.subOptions.map((subOption) => (
                    <label
                      key={subOption.id}
                      className="flex items-center gap-3 cursor-pointer hover:bg-[#f7f7f7] p-2 rounded-eva-s -ml-2"
                    >
                      <input
                        type="radio"
                        name="categorySubOption"
                        value={`${category.id}-${subOption.id}`}
                        checked={selectedCategory?.id === category.id && selectedSubOption?.id === subOption.id}
                        onChange={() => {
                          setSelectedCategory(category);
                          setSelectedSubOption(subOption);
                        }}
                        className="w-4 h-4 text-[#4e445a] border-[#635773] focus:ring-[#635773]"
                      />
                      <span className="text-eva-body text-[#4e445a] flex-1">{subOption.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              if (selectedCategory && selectedSubOption) {
                handleCategorySelection(selectedCategory, selectedSubOption);
              }
            }}
            disabled={!selectedCategory || !selectedSubOption}
            className="bg-[#009cdb] text-white px-4 py-3 rounded-eva-s font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            Confirm Selection
          </button>
        </div>
      </div>
    );
  }


  // Details View: Show the form with required fields
  if (viewState === 'details' && selectedSubOption && selectedCategory) {
    const isFormValid = () => {
      // Check if all required fields are filled
      const allFieldsFilled = selectedSubOption.requiredFields.every(
        (field) => formData[field] && formData[field].trim() !== ''
      );
      
      // If requires agreement, check if it's accepted
      if (selectedSubOption.requiresAgreement) {
        return allFieldsFilled && agreementAccepted;
      }
      
      return allFieldsFilled;
    };

    const handleFieldChange = (fieldId: string, value: string) => {
      setFormData((prev) => ({
        ...prev,
        [fieldId]: value,
      }));
    };

    const handleSubmit = async () => {
      if (isFormValid() && onComplete && !isSubmitting) {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        onComplete({
          categoryId: selectedCategory.id,
          subOptionId: selectedSubOption.id,
          formData,
        });
        setIsSubmitting(false);
      }
    };

    // Check if "Transfer to other mgmt" - show new management fields for deactivation
    // The new_mgmt_name field is already in requiredFields for deactivation, but we can show additional fields conditionally
    const showNewMgmtFields = selectedSubOption.id === 'deactivation' && 
      (formData.deactivation_reason?.toLowerCase().includes('transfer') || 
       formData.deactivation_reason?.toLowerCase().includes('management'));

    return (
      <div className="bg-white border-l-4 border-[#009cdb] border-[2px] border-r border-t border-b border-[#e3e3e3] border-solid rounded-eva-l shadow-[16px_23px_38.4px_-1px_rgba(0,0,0,0.08)] p-6 w-full max-w-[400px] backdrop-blur-[12.1px]" style={{ borderImage: 'none' }}>
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setViewState('category');
                setFormData({});
                setAgreementAccepted(false);
                setSelectedSubOption(null);
                setSelectedCategory(null);
              }}
              className="text-eva-body-sm text-[#4f4559] hover:opacity-80"
            >
              ← Back
            </button>
            <h3 className="text-eva-body-sm-bold text-[#4f4559]">
              {selectedSubOption.label}
            </h3>
          </div>

          {/* Dynamic header based on state */}
          {selectedSubOption.requiresAgreement && !agreementAccepted ? (
            <p className="text-eva-body text-[#4f4559] leading-[1.4]">
              Action Required: Please confirm you agree to the terms below to proceed with this {selectedSubOption.label}.
            </p>
          ) : (
            <p className="text-eva-body text-[#4f4559] leading-[1.4]">
              Understood. Which specific {selectedCategory.label} update do you need?
            </p>
          )}

          {/* Agreement Warning Box */}
          {selectedSubOption.requiresAgreement && selectedSubOption.agreementText && (
            <div className="bg-[#fff3cd] border border-[#ffc107] rounded-eva-s p-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="agreement"
                  checked={agreementAccepted}
                  onChange={(e) => setAgreementAccepted(e.target.checked)}
                  className="mt-1 w-4 h-4 text-[#4e445a] border-[#635773] rounded focus:ring-[#635773]"
                />
                <label htmlFor="agreement" className="flex-1 cursor-pointer">
                  <p className="text-eva-body-sm text-[#856404] leading-[1.4]">
                    {selectedSubOption.agreementText}
                  </p>
                  <p className="text-eva-body-sm-bold text-[#856404] mt-2">
                    I agree to the terms
                  </p>
                </label>
              </div>
            </div>
          )}

          {/* Info Box */}
          {selectedSubOption.isInfoOnly && selectedSubOption.infoText && (
            <div className="bg-[#d1ecf1] border border-[#009cdb] rounded-eva-s p-4">
              <p className="text-eva-body-sm text-[#004085] leading-[1.4]">
                {selectedSubOption.infoText}
              </p>
            </div>
          )}

          {/* Required Fields Form */}
          {selectedSubOption.requiredFields.length > 0 && (
            <div className="flex flex-col gap-4">
              {selectedSubOption.requiredFields.map((fieldId) => {
                // Skip new_mgmt_name if it's for deactivation and transfer hasn't been mentioned yet
                if (fieldId === 'new_mgmt_name' && selectedSubOption.id === 'deactivation' && !showNewMgmtFields) {
                  return null;
                }
                
                const fieldConfig = getFieldConfig(fieldId);
                const shouldAnimate = fieldId === 'new_mgmt_name' && showNewMgmtFields;
                
                return (
                  <div 
                    key={fieldId} 
                    className={`flex flex-col gap-2 ${shouldAnimate ? 'animate-fadeIn' : ''}`}
                  >
                    <label className="text-eva-body-sm-bold text-[#4f4559]">
                      {fieldConfig.label}
                    </label>
                    <input
                      type={fieldConfig.type}
                      value={formData[fieldId] || ''}
                      onChange={(e) => {
                        handleFieldChange(fieldId, e.target.value);
                        // Trigger re-render to show conditional fields
                        if (fieldId === 'deactivation_reason') {
                          // Force update to check for transfer keyword
                        }
                      }}
                      placeholder={fieldConfig.placeholder}
                      className="border border-[#e3e3e3] rounded-eva-s px-4 py-2 text-eva-body-sm text-[#4e445a] focus:outline-none focus:ring-2 focus:ring-[#009cdb] focus:border-transparent"
                    />
                  </div>
                );
              })}
              
              {/* Conditional: Additional Transfer Fields (fade-in animation) */}
              {showNewMgmtFields && !selectedSubOption.requiredFields.includes('transfer_date') && (
                <div className="flex flex-col gap-2 animate-fadeIn">
                  <label className="text-eva-body-sm-bold text-[#4f4559]">
                    Transfer Date
                  </label>
                  <input
                    type="date"
                    value={formData.transfer_date || ''}
                    onChange={(e) => handleFieldChange('transfer_date', e.target.value)}
                    placeholder="MM/DD/YYYY"
                    className="border border-[#e3e3e3] rounded-eva-s px-4 py-2 text-eva-body-sm text-[#4e445a] focus:outline-none focus:ring-2 focus:ring-[#009cdb] focus:border-transparent"
                  />
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!isFormValid() || isSubmitting}
            className="bg-[#009cdb] text-white px-4 py-3 rounded-eva-s font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Submitting...</span>
              </>
            ) : (
              'Submit Request'
            )}
          </button>
        </div>
      </div>
    );
  }

  return null;
}

