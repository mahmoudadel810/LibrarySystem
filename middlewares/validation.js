// core function of validation

export const validation = (schema) =>
{
  return (req, res, next) =>
  {
    let validationErrorsArr = [];
    const requestKeys = ["body", "params", "query", "headers", "file", "files"];
    for (const key of requestKeys)
    {
      if (schema[key])
      {
        const validationResult = schema[key].validate(req[key], {
          abortEarly: false
        });
        // res.json({ message: "Validation Result", validationResult });
        if (validationResult?.error?.details)
        {
          validationErrorsArr.push(validationResult.error.details);
        }
      }
    }

    if (validationErrorsArr.length)
    {
      return res.json({
        Validation_Error: "Validation errors",
        Errors: validationErrorsArr
      });
    }
    return next();
  };
};
