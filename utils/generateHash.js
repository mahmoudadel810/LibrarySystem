import bcrypt from "bcryptjs";



//-----------------------To Hash a Password ------------------------------------------
export const hashFunction = ({
  payload = "",
  saltRounds = 8
}) =>
{
  const hashedPass = bcrypt.hashSync(payload, +saltRounds);
  return hashedPass;
};



//-----------------------To compare hashed passwored with Password -----------------------
export const compareFuncion = ({ payload = "", referenceData = "" }) =>
{
  const match = bcrypt.compareSync(payload, referenceData);
  return match;
};
