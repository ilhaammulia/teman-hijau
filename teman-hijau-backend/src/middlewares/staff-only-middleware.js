export const staffOnlyMiddleware = async (req, res, next) => {
  const user = req.user;
  if (!user.role.is_staff) {
    res
      .status(403)
      .json({
        errors: "Anda tidak izin untuk mengakses ini.",
      })
      .end();
  } else {
    next();
  }
};

export const adminOnlyMiddleware = async (req, res, next) => {
  const user = req.user;
  const ADMIN_ROLE = "admin";

  if (user.role.id != ADMIN_ROLE) {
    res
      .status(403)
      .json({
        errors: "Anda tidak izin untuk mengakses ini.",
      })
      .end();
  } else {
    next();
  }
};
