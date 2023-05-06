import Joi from "joi";


//---------------------------------signUpValidator----------------------------------

export const signUpValidator = {
  body: Joi.object().required().keys({

    name: Joi.string().required().alphanum().messages({
      "string.base": "your name must be string",
      "any.required": "please enter your name"
    }),
    email: Joi.string()
      .email({
        maxDomainSegments: 2, // allowd dots in my email .. ex dola.com.net
        tlds: { allow: ["com"] }
      })
      .required()
      .messages({
        "string.email": "please enter a valid format"
      }),
    password: Joi.string().required().max(10).min(5).messages({
      "string.max": "password must contain 10 characters as maximum",
      "string.min": "password must contain at least 5 charachters"
    }),
    cpass: Joi.string().required().valid(Joi.ref("password")).messages({
      "any.only": "confirmation password must match password .. Try again"
    }),
    phone: Joi.number()
  })
};
//---------------------loginValidator-------------------–––--––--–––––––––––––––––––
export const loginValidator = {
  body: Joi.object()
    .required()
    .keys({
      email: Joi.string()
        .email({
          maxDomainSegments: 3,
          tlds: { allow: ["com", "net"] }
        })
        .required()
        .messages({
          "string.email": "please enter a valid format eg .. [ .Com , .net ]"
        }),
      password: Joi.string().required().max(10).min(5).messages({
        "string.max": "password must contain 10 characters as maximum",
        "string.min": "password must contain at least 5 charachters"
      })
    })
};
//--------------------------------------updatePassword-------------------------------------------------
export const updatePassword = {


  body: Joi.object().keys({
    oldpassword: Joi.string().required().alphanum().messages({
      "object.unknown": "Old password Is wrong"

    }),

    newpassword: Joi.string().required().alphanum().messages({
      "string.base": "your Passowrd must be string",
      "any.required": "please enter your Passowrd"
    }),
    confirmnew: Joi.string().required().alphanum().valid(Joi.ref("newpassword")).messages({
      "any.only": "Must Match New pass "
    }),
  })
};









//--------------------------resetPassword---------------------------------------------------------------

export const verifyReset = {


  body: Joi.object().keys({
    code: Joi.string().required().messages({
      "object.unknown": "Code Sent to your Gmail Does Not Match"

    }),

    newPassword: Joi.string().required().alphanum().messages({
      "string.base": "your Passowrd must be string",
      "any.required": "please enter your Passowrd"
    }),
    confirmNewPassword: Joi.string().required().valid(Joi.ref("newPassword")).messages({
      "any.only": "Must Match New password "
    }),
  })
};