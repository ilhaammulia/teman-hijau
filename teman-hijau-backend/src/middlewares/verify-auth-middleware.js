import jsonwebtoken from "jsonwebtoken";

export const verifyAuth = async (token, secret) => {
  return new Promise((resolve, reject) => {
    jsonwebtoken.verify(token, secret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

export const verifyAuthMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res
      .status(401)
      .send({
        errors: "Anda tidak memiliki akses.",
      })
      .end();
    return;
  }
  try {
    const token = authorization.split(" ")[1];
    const decoded = await verifyAuth(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded.user;
    next();
    return;
  } catch (error) {
    if (error.message == "jwt expired") {
      try {
        const refreshToken = req.cookies.refresh_token;
        const decoded = await verifyAuth(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET
        );
        req.user = decoded.user;
        next();
        return;
      } catch (error) {
        res
          .status(401)
          .json({
            errors: "Anda tidak memiliki akses.",
          })
          .end();
      }
    } else {
      res
        .status(401)
        .json({
          errors: "Anda tidak memiliki akses.",
        })
        .end();
    }
  }
};
