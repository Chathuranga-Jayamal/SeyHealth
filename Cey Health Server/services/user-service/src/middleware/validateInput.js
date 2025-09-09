// Check all required fields are present
export function validateInput(requiredFields = []) {
  return (req, res, next) => {
    const missingFields = [];

    for (const field of requiredFields) {
      if (
        !req.body.hasOwnProperty(field) ||
        req.body[field] === "undefined" ||
        req.body[field] === null ||
        req.body[field] === ""
      ) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    next(); //all fields are present
  };
}

export default validateInput;
