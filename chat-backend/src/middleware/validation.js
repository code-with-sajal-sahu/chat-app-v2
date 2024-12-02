import Joi from 'joi';

export const validateRegistration = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string()
      .required()
      .trim()
      .messages({
        'string.empty': 'Name is required',
        'any.required': 'Name is required'
      }),
    username: Joi.string()
      .required()
      .min(3)
      .max(30)
      .pattern(/^[a-zA-Z0-9._]+$/)
      .messages({
        'string.empty': 'Username is required',
        'any.required': 'Username is required',
        'string.min': 'Username must be at least 3 characters',
        'string.max': 'Username cannot exceed 30 characters',
        'string.pattern.base': 'Username can only contain letters, numbers, periods and underscores'
      }),

    email: Joi.string()
      .required()
      .email()
      .trim()
      .lowercase()
      .messages({
        'string.email': 'Please enter a valid email',
        'string.empty': 'Email is required',
        'any.required': 'Email is required'
      }),

    password: Joi.string()
      .required()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/)
      .messages({
        'string.min': 'Password must be at least 8 characters',
        'string.empty': 'Password is required',
        'any.required': 'Password is required',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
      }),

    mobileNumber: Joi.string()
      .required()
      .pattern(/^[0-9]{10}$/)
      .messages({
        'string.pattern.base': 'Mobile number must be 10 digits',
        'string.empty': 'Mobile number is required',
        'any.required': 'Mobile number is required'
      })
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path[0],
      message: detail.message
    }));

    return res.status(400).send({
      status: 400,
      errors
    });
  }

  next();
};
