export const errorHandler = (err, req, res, next) => {
  console.error('API Error:', err);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;

