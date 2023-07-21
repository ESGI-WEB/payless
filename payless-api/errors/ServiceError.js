class ServiceError extends Error {
  constructor(errors) {
    super("Service error");
    this.name = "ServiceError";
    this.errors = errors;
  }
}

module.exports = ServiceError;
