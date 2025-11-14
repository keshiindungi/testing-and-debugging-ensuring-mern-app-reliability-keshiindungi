import Joi from 'joi';

const bugSchema = Joi.object({
  title: Joi.string().min(1).max(100).required().messages({
    'string.empty': 'Title is required',
    'string.max': 'Title cannot exceed 100 characters',
    'any.required': 'Title is required'
  }),
  description: Joi.string().min(1).required().messages({
    'string.empty': 'Description is required',
    'any.required': 'Description is required'
  }),
  status: Joi.string().valid('open', 'in-progress', 'resolved', 'closed').messages({
    'any.only': 'Status must be one of: open, in-progress, resolved, closed'
  }),
  priority: Joi.string().valid('low', 'medium', 'high', 'critical').messages({
    'any.only': 'Priority must be one of: low, medium, high, critical'
  }),
  reporter: Joi.string().min(1).required().messages({
    'string.empty': 'Reporter name is required',
    'any.required': 'Reporter name is required'
  }),
  assignee: Joi.string().allow(''),
  stepsToReproduce: Joi.array().items(Joi.string()),
  environment: Joi.object({
    os: Joi.string(),
    browser: Joi.string(),
    version: Joi.string()
  })
});

const validateBug = (data, isUpdate = false) => {
  const schema = isUpdate 
    ? bugSchema.fork(['title', 'description', 'reporter'], (field) => field.optional())
    : bugSchema;
  
  return schema.validate(data, { 
    abortEarly: false,
    errors: {
      wrap: {
        label: false
      }
    }
  });
};

export { validateBug };