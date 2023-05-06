// token
import jwt from "jsonwebtoken";

export const tokenFunction = ({
  payload = {} || "",
  signature = 'generation',
  expiresIn = 60 * 60,
  generate = true
}) =>
{
  // book: check for empty object
  if (typeof payload == "object")
  {
    if (Object.keys(payload).length)
    {
      if (generate && typeof payload == "object")
      {
        const token = jwt.sign(payload, signature, { expiresIn });
        return token;
      }
    }
    return false;
  }

  // to deocde the token
  if (typeof payload == "string")
  {
    if (payload == "")
    {
      return false;
    }
    if (generate == false && typeof payload == "string")
    {
      const decode = jwt.verify(payload, signature);
      return decode;
    }
  }
};
