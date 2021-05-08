export const Errors = {
  QUEUE_CREATION_NO_CLOSED_STATUS: {
    message: `Queue status cannot be CLOSED during creation.`,
    code: "QDOC-001",
  },
  CLINIC_NOT_FOUND: {
    message: `Clinic not found.`,
    code: "QDOC-002",
  },
  UNABLE_TO_CREATE_QUEUE: {
    message: `Unable to create queue.`,
    code: "QDOC-003",
  },
  UNABLE_TO_CREATE_QUEUE_AS_ACTIVE_QUEUE_EXISTS: {
    message: `Unable to create queue as active queue exists`,
    code: "QDOC-004",
  },
  QUEUE_NOT_FOUND: {
    message: `Queue not found.`,
    code: "QDOC-005",
  },
  UNABLE_TO_CREATE_PATIENT_AS_FIELD_EXISTS: {
    message: `Unable to create patient as email / auth id / mobile number already exists.`,
    code: "QDOC-006",
  },
  UNABLE_TO_CREATE_DOCTOR_VALIDATION_OR_UNIQUENESS_ERROR: {
    message: `Unable to create doctor due to validation / unique constraint errors`,
    code: "QDOC-007",
  },
  UNABLE_TO_CREATE_DOCTOR: {
    message: `Unable to create doctor`,
    code: "QDOC-008",
  }
};
