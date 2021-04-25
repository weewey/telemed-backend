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

};
