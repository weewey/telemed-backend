export const Errors = {
  QUEUE_CREATION_NO_CLOSED_STATUS: {
    message: "Queue status cannot be CLOSED during creation.",
    code: "QDOC-001",
  },
  CLINIC_NOT_FOUND: {
    message: "Clinic not found.",
    code: "QDOC-002",
  },
  UNABLE_TO_CREATE_QUEUE: {
    message: "Unable to create queue.",
    code: "QDOC-003",
  },
  UNABLE_TO_CREATE_QUEUE_AS_ACTIVE_QUEUE_EXISTS: {
    message: "Unable to create queue as active queue exists",
    code: "QDOC-004",
  },
  QUEUE_NOT_FOUND: {
    message: "Queue not found.",
    code: "QDOC-005",
  },
  FIELD_ALREADY_EXISTS: {
    message: "Field already exists.",
    code: "QDOC-006",
  },
  ENTITY_NOT_FOUND: {
    message: "Entity not found.",
    code: "QDOC-007",
  },
  UNABLE_TO_CREATE_DOCTOR: {
    message: "Unable to create doctor",
    code: "QDOC-008",
  },
  UNABLE_TO_CREATE_TICKET_AS_ID_NOT_FOUND: {
    message: "Unable to create ticket as patient id / queue id / clinic id not found",
    code: "QDOC-009",
  },
  UNABLE_TO_CREATE_TICKET_AS_DISPLAY_NUM_IS_NULL: {
    message: "Unable to create ticket as displayNumber is null",
    code: "QDOC-010",
  },
  UNABLE_TO_CREATE_TICKET: {
    message: "Unable to create ticket",
    code: "QDOC-011",
  },
  VALIDATION_ERROR: {
    code: "QDOC-012",
  },
  UNABLE_TO_CREATE_QUEUE_AS_QUEUE_IS_INACTIVE: {
    message: "Unable to create queue as queue is inactive",
    code: "QDOC-013",
  },
};
