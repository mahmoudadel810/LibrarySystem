import Joi from "joi";


export const addBook = {
    body: Joi.object().required().keys({

        name: Joi.string().required().alphanum().messages({
            "string.base": "your name must be string",
            "any.required": "please enter your name"
        }),
        title: Joi.string().required()
            .messages({
                "string.email": "please enter a valid format"
            }),
        author: Joi.string().required(),

        addedBy: Joi.string(),
    })
};