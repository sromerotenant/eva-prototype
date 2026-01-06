/**
 * Change Request Flow Configuration
 * 
 * This file contains the structured logic for handling change requests
 * across different categories: Property, Financial, Status, Coding, and Other.
 */

export interface ChangeRequestSubOption {
  id: string;
  label: string;
  requiresAgreement: boolean;
  agreementText: string;
  isInfoOnly: boolean;
  infoText: string;
  requiredFields: string[];
}

export interface ChangeRequestCategory {
  id: string;
  label: string;
  subOptions: ChangeRequestSubOption[];
}

export const CHANGE_REQUEST_FLOW: ChangeRequestCategory[] = [
  {
    id: 'property',
    label: 'Property',
    subOptions: [
      {
        id: 'credit_score_update',
        label: 'Credit Score Update',
        requiresAgreement: false,
        agreementText: '',
        isInfoOnly: false,
        infoText: '',
        requiredFields: ['credit_score', 'application_id', 'reason']
      },
      {
        id: 'property_details_update',
        label: 'Property Details Update',
        requiresAgreement: false,
        agreementText: '',
        isInfoOnly: false,
        infoText: '',
        requiredFields: ['property_id', 'field_to_update', 'new_value', 'reason']
      },
      {
        id: 'address_change',
        label: 'Address Change',
        requiresAgreement: false,
        agreementText: '',
        isInfoOnly: false,
        infoText: '',
        requiredFields: ['property_id', 'new_address', 'verification_document']
      },
      {
        id: 'property_ownership_transfer',
        label: 'Property Ownership Transfer',
        requiresAgreement: true,
        agreementText: 'Transferring property ownership will affect all associated applications and tenant records. Please ensure all parties have been notified and necessary documentation is in order.',
        isInfoOnly: false,
        infoText: '',
        requiredFields: ['property_id', 'current_owner', 'new_owner', 'transfer_date', 'legal_document']
      }
    ]
  },
  {
    id: 'financial',
    label: 'Financial',
    subOptions: [
      {
        id: 'application_fees',
        label: 'Application Fees',
        requiresAgreement: false,
        agreementText: '',
        isInfoOnly: false,
        infoText: '',
        requiredFields: ['application_id', 'fee_amount', 'fee_type', 'payment_method']
      },
      {
        id: 'bundle_update',
        label: 'Bundle Update',
        requiresAgreement: true,
        agreementText: 'Updating a service bundle may result in increased costs. Please review the new pricing structure and confirm acceptance before proceeding.',
        isInfoOnly: false,
        infoText: '',
        requiredFields: ['property_id', 'current_bundle', 'new_bundle', 'effective_date']
      },
      {
        id: 'payment_plan_modification',
        label: 'Payment Plan Modification',
        requiresAgreement: true,
        agreementText: 'Modifying payment plans may affect your account balance and future billing cycles. Please review the new terms carefully.',
        isInfoOnly: false,
        infoText: '',
        requiredFields: ['account_id', 'current_plan', 'new_plan', 'modification_reason']
      },
      {
        id: 'refund_request',
        label: 'Refund Request',
        requiresAgreement: false,
        agreementText: '',
        isInfoOnly: true,
        infoText: 'Refund requests are processed within 5-10 business days. Please ensure all required documentation is submitted to expedite the process.',
        requiredFields: ['transaction_id', 'refund_amount', 'refund_reason', 'supporting_document']
      },
      {
        id: 'billing_address_update',
        label: 'Billing Address Update',
        requiresAgreement: false,
        agreementText: '',
        isInfoOnly: false,
        infoText: '',
        requiredFields: ['account_id', 'new_billing_address', 'verification']
      }
    ]
  },
  {
    id: 'status',
    label: 'Status',
    subOptions: [
      {
        id: 'activation',
        label: 'Activation',
        requiresAgreement: false,
        agreementText: '',
        isInfoOnly: false,
        infoText: '',
        requiredFields: ['property_id', 'activation_date', 'service_type']
      },
      {
        id: 'deactivation',
        label: 'Deactivation',
        requiresAgreement: true,
        agreementText: 'Deactivating a property will suspend all associated services and applications. This action may be reversible within 30 days.',
        isInfoOnly: false,
        infoText: '',
        requiredFields: ['property_id', 'deactivation_reason', 'new_mgmt_name', 'effective_date']
      },
      {
        id: 'status_change',
        label: 'Status Change',
        requiresAgreement: false,
        agreementText: '',
        isInfoOnly: false,
        infoText: '',
        requiredFields: ['application_id', 'current_status', 'new_status', 'change_reason']
      },
      {
        id: 'suspension',
        label: 'Suspension',
        requiresAgreement: true,
        agreementText: 'Suspending services will temporarily halt all operations. Services can be reactivated upon resolution of the suspension reason.',
        isInfoOnly: false,
        infoText: '',
        requiredFields: ['property_id', 'suspension_reason', 'expected_resolution_date']
      },
      {
        id: 'reactivation',
        label: 'Reactivation',
        requiresAgreement: false,
        agreementText: '',
        isInfoOnly: true,
        infoText: 'Reactivation may require verification of account status and payment of any outstanding balances.',
        requiredFields: ['property_id', 'reactivation_date', 'verification_document']
      }
    ]
  },
  {
    id: 'coding',
    label: 'Coding',
    subOptions: [
      {
        id: 'code_update',
        label: 'Code Update',
        requiresAgreement: false,
        agreementText: '',
        isInfoOnly: false,
        infoText: '',
        requiredFields: ['code_id', 'update_type', 'new_code_value']
      },
      {
        id: 'code_assignment',
        label: 'Code Assignment',
        requiresAgreement: false,
        agreementText: '',
        isInfoOnly: false,
        infoText: '',
        requiredFields: ['property_id', 'code_type', 'code_value']
      }
    ]
  },
  {
    id: 'other',
    label: 'Other',
    subOptions: [
      {
        id: 'general_request',
        label: 'General Request',
        requiresAgreement: false,
        agreementText: '',
        isInfoOnly: false,
        infoText: '',
        requiredFields: ['request_description', 'related_entity', 'priority']
      },
      {
        id: 'document_upload',
        label: 'Document Upload',
        requiresAgreement: false,
        agreementText: '',
        isInfoOnly: false,
        infoText: '',
        requiredFields: ['document_type', 'document_file', 'related_entity_id']
      }
    ]
  }
];

/**
 * Helper function to find a category by ID
 */
export const getCategoryById = (id: string): ChangeRequestCategory | undefined => {
  return CHANGE_REQUEST_FLOW.find(category => category.id === id);
};

/**
 * Helper function to find a subOption by category and subOption IDs
 */
export const getSubOptionById = (
  categoryId: string,
  subOptionId: string
): ChangeRequestSubOption | undefined => {
  const category = getCategoryById(categoryId);
  return category?.subOptions.find(subOption => subOption.id === subOptionId);
};

/**
 * Helper function to get all required fields for a subOption
 */
export const getRequiredFields = (
  categoryId: string,
  subOptionId: string
): string[] => {
  const subOption = getSubOptionById(categoryId, subOptionId);
  return subOption?.requiredFields || [];
};

