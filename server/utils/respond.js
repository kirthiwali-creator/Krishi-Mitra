exports.fail = (res, status, code, message, field) => {
  const body = { code, message };
  if (field) body.field = field;
  return res.status(status).json(body);
};
