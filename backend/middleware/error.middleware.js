export const asyncHandler = (fn) => (req, res, next) => {
	Promise.resolve(fn(req, res, next)).catch(next);
};

export const errorHandler = (err, req, res, next) => {
	console.error("API Error: ", err.stack || err.message || err);

	const statusCode = err.statusCode || res.statusCode === 200 ? 500 : res.statusCode;

	res.status(statusCode).json({
		error: err.message || "Internal Server Error",
		...(process.env.NODE_ENV === "development" && { stack: err.stack }),
	});
};
