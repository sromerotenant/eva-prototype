import { useState } from 'react';
import { MdChevronLeft } from 'react-icons/md';
import { CHANGE_REQUEST_FLOW, type ChangeRequestCategory, type ChangeRequestSubOption } from '../data/changeRequestLogic';
import { MOCK_USER, validateProperty, type Property } from '../data/propertyData';

type ViewState = 'property' | 'category' | 'details';

interface ChangeRequestWidgetProps {
  onComplete?: (data: {
    propertyIds: string[];
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

// Helper function to check if a field is property-related
const isPropertyField = (fieldId: string): boolean => {
  const propertyFields = ['property_id', 'property_name', 'property_code'];
  return propertyFields.includes(fieldId.toLowerCase());
};

// Helper function to get selected property names
const getSelectedPropertyNames = (propertyIds: string[]): Property[] => {
  return propertyIds
    .map(id => MOCK_USER.properties.find(p => p.id === id))
    .filter((p): p is Property => p !== undefined);
};

// Helper function to filter out property fields when properties are already selected
const filterPropertyFields = (fields: string[], selectedProperties: string[]): string[] => {
  if (selectedProperties.length > 0) {
    return fields.filter(field => !isPropertyField(field));
  }
  return fields;
};

// Helper function to get header title based on view state
const getHeaderTitle = (viewState: ViewState, selectedSubOption: ChangeRequestSubOption | null): string => {
  switch (viewState) {
    case 'property':
      return 'Select Property';
    case 'category':
      return 'Select Change Type';
    case 'details':
      return selectedSubOption?.label || 'Change Details';
    default:
      return 'Change Request';
  }
};

// Helper function to determine if back button should be shown
const shouldShowBackButton = (viewState: ViewState): boolean => {
  return viewState !== 'property';
};

// Helper function to handle back navigation
const getBackNavigation = (
  viewState: ViewState,
  setViewState: (state: ViewState) => void,
  setSelectedCategory: (category: ChangeRequestCategory | null) => void,
  setSelectedSubOption: (subOption: ChangeRequestSubOption | null) => void,
  setFormData: (data: Record<string, string>) => void,
  setAgreementAccepted: (accepted: boolean) => void
) => {
  switch (viewState) {
    case 'category':
      setViewState('property');
      setSelectedCategory(null);
      setSelectedSubOption(null);
      break;
    case 'details':
      setViewState('category');
      setFormData({});
      setAgreementAccepted(false);
      setSelectedSubOption(null);
      setSelectedCategory(null);
      break;
  }
};

export default function ChangeRequestWidget({ onComplete }: ChangeRequestWidgetProps) {
  const [viewState, setViewState] = useState<ViewState>('property');
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [propertyConfirmation, setPropertyConfirmation] = useState<'yes' | 'no' | null>(null);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualPropertyInput, setManualPropertyInput] = useState('');
  const [propertyValidationState, setPropertyValidationState] = useState<{
    isValid: boolean;
    matches: Property[];
    requiresCode: boolean;
  } | null>(null);
  const [showSupportHandoff, setShowSupportHandoff] = useState(false);
  
  const [selectedCategory, setSelectedCategory] = useState<ChangeRequestCategory | null>(null);
  const [selectedSubOption, setSelectedSubOption] = useState<ChangeRequestSubOption | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingCategory, setProcessingCategory] = useState<string | null>(null);

  // Property selection handlers
  const handlePropertyConfirmation = (confirmed: boolean) => {
    if (confirmed && MOCK_USER.properties.length === 1) {
      // Single property - auto-select and proceed
      setSelectedProperties([MOCK_USER.properties[0].id]);
      setViewState('category');
    } else {
      // User said no - show manual input
      setPropertyConfirmation('no');
      setShowManualInput(true);
    }
  };

  const handlePropertyCheckboxChange = (propertyId: string, checked: boolean) => {
    if (checked) {
      setSelectedProperties((prev) => [...prev, propertyId]);
    } else {
      setSelectedProperties((prev) => prev.filter((id) => id !== propertyId));
    }
  };

  const handleManualPropertySubmit = () => {
    if (!manualPropertyInput.trim()) return;
    
    const validation = validateProperty(manualPropertyInput);
    setPropertyValidationState(validation);
    
    if (validation.isValid && validation.matches.length === 1) {
      // Valid single match - add to selection
      setSelectedProperties((prev) => {
        const newSelection = [...prev];
        if (!newSelection.includes(validation.matches[0].id)) {
          newSelection.push(validation.matches[0].id);
        }
        return newSelection;
      });
      setManualPropertyInput('');
      setShowManualInput(false);
      setPropertyValidationState(null);
    } else if (validation.requiresCode) {
      // Multiple matches - requires code
      setPropertyValidationState(validation);
    } else if (!validation.isValid) {
      // No matches - show support handoff
      setShowSupportHandoff(true);
    }
  };

  const handlePropertyCodeSubmit = (code: string) => {
    const validation = validateProperty(code);
    if (validation.isValid && validation.matches.length === 1) {
      setSelectedProperties((prev) => {
        const newSelection = [...prev];
        if (!newSelection.includes(validation.matches[0].id)) {
          newSelection.push(validation.matches[0].id);
        }
        return newSelection;
      });
      setManualPropertyInput('');
      setShowManualInput(false);
      setPropertyValidationState(null);
    }
  };

  const handleProceedToCategory = () => {
    if (selectedProperties.length > 0) {
      setViewState('category');
    }
  };

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

  // Property Selection View
  if (viewState === 'property') {
    const isSingleProperty = MOCK_USER.properties.length === 1;
    const hasSelectedProperties = selectedProperties.length > 0;

    return (
      <div className="bg-white border-[2px] border-[#e3e3e3] border-solid rounded-eva-l shadow-[16px_23px_38.4px_-1px_rgba(0,0,0,0.08)] w-full max-w-[400px] backdrop-blur-[12.1px] flex flex-col h-full max-h-[600px] overflow-hidden" style={{ borderImage: 'none' }}>
        {/* Header */}
        <div className="flex items-center justify-center px-6 py-4 border-b border-[#e3e3e3] relative flex-shrink-0">
          <h2 className="text-base font-semibold text-[#4f4559] text-center flex-1">
            {getHeaderTitle(viewState, selectedSubOption)}
          </h2>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-thin scrollbar-thumb-[#e3e3e3] scrollbar-track-transparent">
          <div className="flex flex-col gap-4">
          {/* Single Property Flow */}
          {isSingleProperty && propertyConfirmation === null && (
            <>
              <p className="text-sm text-[#4f4559] leading-relaxed">
                I see you are requesting a change for <span className="font-semibold">{MOCK_USER.properties[0].name}</span>. Is that correct?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handlePropertyConfirmation(true)}
                  className="flex-1 bg-[#009cdb] text-white px-4 py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Yes
                </button>
                <button
                  onClick={() => handlePropertyConfirmation(false)}
                  className="flex-1 bg-[#f0f0f0] text-[#4f4559] px-4 py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity border border-[#e3e3e3]"
                >
                  No
                </button>
              </div>
            </>
          )}

          {/* Multiple Properties Flow */}
          {!isSingleProperty && (
            <>
              <p className="text-sm text-[#4f4559] leading-relaxed">
                Which property (or properties) does this request apply to?
              </p>
              
              <div className="flex flex-col gap-0 max-h-[250px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#e3e3e3] scrollbar-track-transparent">
                {MOCK_USER.properties.map((property) => (
                  <label
                    key={property.id}
                    className="flex items-center gap-3 cursor-pointer hover:bg-[#f7f7f7] p-2 rounded-lg -ml-2"
                  >
                    <input
                      type="checkbox"
                      checked={selectedProperties.includes(property.id)}
                      onChange={(e) => handlePropertyCheckboxChange(property.id, e.target.checked)}
                      className="w-4 h-4 text-[#4e445a] border-[#635773] rounded focus:ring-[#635773]"
                    />
                    <span className="text-sm text-[#4e445a]">{property.name}</span>
                  </label>
                ))}
              </div>

              {/* Manual Input Toggle */}
              {!showManualInput ? (
                <button
                  onClick={() => setShowManualInput(true)}
                  className="text-sm text-[#009cdb] hover:underline text-left"
                >
                  Don't see your property? Enter Name or Code
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={manualPropertyInput}
                    onChange={(e) => {
                      setManualPropertyInput(e.target.value);
                      setPropertyValidationState(null);
                      setShowSupportHandoff(false);
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleManualPropertySubmit();
                      }
                    }}
                    placeholder="Enter property name or code"
                    className="border border-[#e3e3e3] rounded-lg px-4 py-2.5 text-sm text-[#4e445a] focus:outline-none focus:ring-2 focus:ring-[#009cdb] focus:border-transparent"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleManualPropertySubmit}
                      className="bg-[#009cdb] text-white px-4 py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                      Search
                    </button>
                    <button
                      onClick={() => {
                        setShowManualInput(false);
                        setManualPropertyInput('');
                        setPropertyValidationState(null);
                        setShowSupportHandoff(false);
                      }}
                      className="bg-[#f0f0f0] text-[#4f4559] px-4 py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity border border-[#e3e3e3]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Multiple Matches - Requires Code */}
              {propertyValidationState?.requiresCode && (
                <div className="bg-[#fff3cd] border border-[#ffc107] rounded-lg p-4">
                  <p className="text-sm text-[#856404] leading-relaxed mb-3">
                    I found multiple matches. Please enter the unique Property Code:
                  </p>
                  <div className="flex flex-col gap-2">
                    {propertyValidationState.matches.map((match) => (
                      <div key={match.id} className="text-sm text-[#856404]">
                        • {match.name} ({match.code})
                      </div>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={manualPropertyInput}
                    onChange={(e) => setManualPropertyInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handlePropertyCodeSubmit(manualPropertyInput);
                      }
                    }}
                    placeholder="Enter property code (e.g., SPK-001)"
                    className="mt-3 border border-[#856404] rounded-lg px-4 py-2.5 text-sm text-[#4e445a] focus:outline-none focus:ring-2 focus:ring-[#ffc107] focus:border-transparent"
                  />
                  <button
                    onClick={() => handlePropertyCodeSubmit(manualPropertyInput)}
                    className="mt-2 bg-[#856404] text-white px-4 py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    Submit Code
                  </button>
                </div>
              )}

              {/* Support Handoff */}
              {showSupportHandoff && (
                <div className="bg-[#d1ecf1] border border-[#009cdb] rounded-lg p-4">
                  <p className="text-sm text-[#004085] leading-relaxed mb-3">
                    I couldn't find that property in your portfolio. Would you like to Contact Support to request access?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        // In a real app, this would open support contact
                        alert('Support contact functionality would be implemented here');
                      }}
                      className="bg-[#009cdb] text-white px-4 py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                      Contact Support
                    </button>
                    <button
                      onClick={() => {
                        setShowSupportHandoff(false);
                        setManualPropertyInput('');
                        setPropertyValidationState(null);
                      }}
                      className="bg-[#f0f0f0] text-[#4f4559] px-4 py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity border border-[#e3e3e3]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Proceed Button */}
              {hasSelectedProperties && !showManualInput && !propertyValidationState?.requiresCode && !showSupportHandoff && (
                <button
                  onClick={handleProceedToCategory}
                  className="bg-[#009cdb] text-white px-4 py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Continue
                </button>
              )}
            </>
          )}

          {/* Manual Input Flow for Single Property (when user says No) */}
          {isSingleProperty && propertyConfirmation === 'no' && (
            <>
              {!showManualInput ? (
                <button
                  onClick={() => setShowManualInput(true)}
                  className="text-sm text-[#009cdb] hover:underline text-left"
                >
                  Don't see your property? Enter Name or Code
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={manualPropertyInput}
                    onChange={(e) => {
                      setManualPropertyInput(e.target.value);
                      setPropertyValidationState(null);
                      setShowSupportHandoff(false);
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleManualPropertySubmit();
                      }
                    }}
                    placeholder="Enter property name or code"
                    className="border border-[#e3e3e3] rounded-lg px-4 py-2.5 text-sm text-[#4e445a] focus:outline-none focus:ring-2 focus:ring-[#009cdb] focus:border-transparent"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleManualPropertySubmit}
                      className="bg-[#009cdb] text-white px-4 py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                      Search
                    </button>
                    <button
                      onClick={() => {
                        setShowManualInput(false);
                        setManualPropertyInput('');
                        setPropertyValidationState(null);
                        setShowSupportHandoff(false);
                      }}
                      className="bg-[#f0f0f0] text-[#4f4559] px-4 py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity border border-[#e3e3e3]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Multiple Matches - Requires Code (for single property flow) */}
              {propertyValidationState?.requiresCode && (
                <div className="bg-[#fff3cd] border border-[#ffc107] rounded-lg p-4">
                  <p className="text-sm text-[#856404] leading-relaxed mb-3">
                    I found multiple matches. Please enter the unique Property Code:
                  </p>
                  <div className="flex flex-col gap-2">
                    {propertyValidationState.matches.map((match) => (
                      <div key={match.id} className="text-sm text-[#856404]">
                        • {match.name} ({match.code})
                      </div>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={manualPropertyInput}
                    onChange={(e) => setManualPropertyInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handlePropertyCodeSubmit(manualPropertyInput);
                      }
                    }}
                    placeholder="Enter property code (e.g., SPK-001)"
                    className="mt-3 border border-[#856404] rounded-lg px-4 py-2.5 text-sm text-[#4e445a] focus:outline-none focus:ring-2 focus:ring-[#ffc107] focus:border-transparent"
                  />
                  <button
                    onClick={() => handlePropertyCodeSubmit(manualPropertyInput)}
                    className="mt-2 bg-[#856404] text-white px-4 py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    Submit Code
                  </button>
                </div>
              )}

              {/* Support Handoff (for single property flow) */}
              {showSupportHandoff && (
                <div className="bg-[#d1ecf1] border border-[#009cdb] rounded-lg p-4">
                  <p className="text-sm text-[#004085] leading-relaxed mb-3">
                    I couldn't find that property in your portfolio. Would you like to Contact Support to request access?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        alert('Support contact functionality would be implemented here');
                      }}
                      className="bg-[#009cdb] text-white px-4 py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                      Contact Support
                    </button>
                    <button
                      onClick={() => {
                        setShowSupportHandoff(false);
                        setManualPropertyInput('');
                        setPropertyValidationState(null);
                      }}
                      className="bg-[#f0f0f0] text-[#4f4559] px-4 py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity border border-[#e3e3e3]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Proceed Button (for single property manual input) */}
              {hasSelectedProperties && !showManualInput && !propertyValidationState?.requiresCode && !showSupportHandoff && (
                <button
                  onClick={handleProceedToCategory}
                  className="bg-[#009cdb] text-white px-4 py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Continue
                </button>
              )}
            </>
          )}
          </div>
        </div>
      </div>
    );
  }

  // Processing/Loading State
  if (isProcessing && processingCategory) {
    return (
      <div className="bg-white border-[2px] border-[#e3e3e3] border-solid rounded-eva-l shadow-[16px_23px_38.4px_-1px_rgba(0,0,0,0.08)] w-full max-w-[400px] backdrop-blur-[12.1px] flex flex-col h-full max-h-[600px] overflow-hidden" style={{ borderImage: 'none' }}>
        {/* Header */}
        <div className="flex items-center justify-center px-6 py-4 border-b border-[#e3e3e3] relative flex-shrink-0">
          <h2 className="text-base font-semibold text-[#4f4559] text-center flex-1">
            Processing
          </h2>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex items-center justify-center">
          <div className="flex gap-3 items-center">
            <div className="relative shrink-0 w-8 h-8">
              <div className="absolute inset-0 border-2 border-[#009cdb] border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-[#4e445a]">Processing request</p>
              <p className="text-sm text-[#7a6b8c]">
                Analyzing your request for {processingCategory}...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Category View: Show all categories with sub-options in sections (matching Figma design)
  if (viewState === 'category') {
    return (
      <div className="bg-white border-[2px] border-[#e3e3e3] border-solid rounded-eva-l shadow-[16px_23px_38.4px_-1px_rgba(0,0,0,0.08)] w-full max-w-[400px] backdrop-blur-[12.1px] flex flex-col h-full max-h-[600px] overflow-hidden" style={{ borderImage: 'none' }}>
        {/* Header */}
        <div className="flex items-center justify-center px-6 py-4 border-b border-[#e3e3e3] relative flex-shrink-0">
          {shouldShowBackButton(viewState) && (
            <button
              onClick={() => getBackNavigation(viewState, setViewState, setSelectedCategory, setSelectedSubOption, setFormData, setAgreementAccepted)}
              className="absolute left-6 p-1 hover:bg-[#f7f7f7] rounded-lg transition-colors"
              aria-label="Go back"
            >
              <MdChevronLeft className="w-6 h-6 text-[#4f4559]" />
            </button>
          )}
          <h2 className="text-base font-semibold text-[#4f4559] text-center flex-1">
            {getHeaderTitle(viewState, selectedSubOption)}
          </h2>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-thin scrollbar-thumb-[#e3e3e3] scrollbar-track-transparent">
          <div className="flex flex-col gap-4 pr-2">
            {CHANGE_REQUEST_FLOW.map((category) => (
              <div key={category.id} className="flex flex-col gap-4">
                {/* Category Header */}
                <div className="flex items-center gap-2.5">
                  <p className="text-sm font-semibold text-[#a399b0] uppercase tracking-[-0.16px]">
                    {category.label}
                  </p>
                  <div className="flex-1 h-px bg-[#e3e3e3]"></div>
                </div>
                
                {/* Sub-Options as Radio Buttons */}
                <div className="flex flex-col gap-2">
                  {category.subOptions.map((subOption) => (
                    <label
                      key={subOption.id}
                      className="flex items-center gap-3 cursor-pointer hover:bg-[#f7f7f7] p-2 rounded-lg -ml-2"
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
                      <span className="text-sm text-[#4e445a] flex-1">{subOption.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer with Confirmation Button - Always Visible */}
        <div className="px-6 py-4 border-t border-[#e3e3e3] flex-shrink-0 bg-white">
          <button
            onClick={() => {
              if (selectedCategory && selectedSubOption) {
                handleCategorySelection(selectedCategory, selectedSubOption);
              }
            }}
            disabled={!selectedCategory || !selectedSubOption}
            className="w-full bg-[#009cdb] text-white px-4 py-3 rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            Confirm Selection
          </button>
        </div>
      </div>
    );
  }


  // Details View: Show the form with required fields
  if (viewState === 'details' && selectedSubOption && selectedCategory) {
    // Filter out property fields if properties are already selected
    const filteredRequiredFields = filterPropertyFields(
      selectedSubOption.requiredFields,
      selectedProperties
    );
    
    // Get selected property names for display
    const selectedPropertyNames = getSelectedPropertyNames(selectedProperties);
    
    const isFormValid = () => {
      // Check if all filtered required fields are filled
      const allFieldsFilled = filteredRequiredFields.every(
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
          propertyIds: selectedProperties,
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
      <div className="bg-white border-[2px] border-[#e3e3e3] border-solid rounded-eva-l shadow-[16px_23px_38.4px_-1px_rgba(0,0,0,0.08)] w-full max-w-[400px] backdrop-blur-[12.1px] flex flex-col h-full max-h-[600px] overflow-hidden" style={{ borderImage: 'none' }}>
        {/* Header */}
        <div className="flex items-center justify-center px-6 py-4 border-b border-[#e3e3e3] relative flex-shrink-0">
          {shouldShowBackButton(viewState) && (
            <button
              onClick={() => getBackNavigation(viewState, setViewState, setSelectedCategory, setSelectedSubOption, setFormData, setAgreementAccepted)}
              className="absolute left-6 p-1 hover:bg-[#f7f7f7] rounded-lg transition-colors"
              aria-label="Go back"
            >
              <MdChevronLeft className="w-6 h-6 text-[#4f4559]" />
            </button>
          )}
          <h2 className="text-base font-semibold text-[#4f4559] text-center flex-1">
            {getHeaderTitle(viewState, selectedSubOption)}
          </h2>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-thin scrollbar-thumb-[#e3e3e3] scrollbar-track-transparent">
          <div className="flex flex-col gap-4">

          {/* Property Summary - Show selected properties */}
          {selectedProperties.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-[#4f4559] mb-2">
                Applying to:
              </p>
              <div className="flex flex-col gap-1">
                {selectedPropertyNames.map((property) => (
                  <p key={property.id} className="text-sm text-[#4f4559]">
                    {property.name} ({property.code})
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Dynamic header based on state */}
          {selectedSubOption.requiresAgreement && !agreementAccepted ? (
            <p className="text-sm text-[#4f4559] leading-relaxed">
              Action Required: Please confirm you agree to the terms below to proceed with this {selectedSubOption.label}.
            </p>
          ) : (
            <p className="text-sm text-[#4f4559] leading-relaxed">
              Understood. Which specific {selectedCategory.label} update do you need?
            </p>
          )}

          {/* Agreement Warning Box */}
          {selectedSubOption.requiresAgreement && selectedSubOption.agreementText && (
            <div className="bg-[#fff3cd] border border-[#ffc107] rounded-lg p-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="agreement"
                  checked={agreementAccepted}
                  onChange={(e) => setAgreementAccepted(e.target.checked)}
                  className="mt-1 w-4 h-4 text-[#4e445a] border-[#635773] rounded focus:ring-[#635773]"
                />
                <label htmlFor="agreement" className="flex-1 cursor-pointer">
                  <p className="text-sm text-[#856404] leading-relaxed">
                    {selectedSubOption.agreementText}
                  </p>
                  <p className="text-sm font-semibold text-[#856404] mt-2">
                    I agree to the terms
                  </p>
                </label>
              </div>
            </div>
          )}

          {/* Info Box */}
          {selectedSubOption.isInfoOnly && selectedSubOption.infoText && (
            <div className="bg-[#d1ecf1] border border-[#009cdb] rounded-lg p-4">
              <p className="text-sm text-[#004085] leading-relaxed">
                {selectedSubOption.infoText}
              </p>
            </div>
          )}

          {/* Show read-only property info if property fields were filtered out */}
          {selectedProperties.length > 0 && selectedSubOption.requiredFields.some(field => isPropertyField(field)) && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#4f4559]">
                Property
              </label>
              <div className="flex flex-col gap-1">
                {selectedPropertyNames.map((property) => (
                  <p key={property.id} className="text-sm text-[#4f4559]">
                    {property.name} ({property.code})
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Required Fields Form */}
          {filteredRequiredFields.length > 0 && (
            <div className="flex flex-col gap-4">
              {filteredRequiredFields.map((fieldId) => {
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
                    <label className="text-sm font-semibold text-[#4f4559]">
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
                      className="border border-[#e3e3e3] rounded-lg px-4 py-2.5 text-sm text-[#4e445a] focus:outline-none focus:ring-2 focus:ring-[#009cdb] focus:border-transparent"
                    />
                  </div>
                );
              })}
              
              {/* Conditional: Additional Transfer Fields (fade-in animation) */}
              {showNewMgmtFields && !selectedSubOption.requiredFields.includes('transfer_date') && (
                <div className="flex flex-col gap-2 animate-fadeIn">
                  <label className="text-sm font-semibold text-[#4f4559]">
                    Transfer Date
                  </label>
                  <input
                    type="date"
                    value={formData.transfer_date || ''}
                    onChange={(e) => handleFieldChange('transfer_date', e.target.value)}
                    placeholder="MM/DD/YYYY"
                    className="border border-[#e3e3e3] rounded-lg px-4 py-2.5 text-sm text-[#4e445a] focus:outline-none focus:ring-2 focus:ring-[#009cdb] focus:border-transparent"
                  />
                </div>
              )}
            </div>
          )}
          </div>
        </div>

        {/* Footer with Submit Button - Always Visible */}
        <div className="px-6 py-4 border-t border-[#e3e3e3] flex-shrink-0 bg-white">
          <button
            onClick={handleSubmit}
            disabled={!isFormValid() || isSubmitting}
            className="w-full bg-[#009cdb] text-white px-4 py-3 rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
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

