// Role-based authorization middleware

// Check if user has required role(s)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied. Required role(s): ${roles.join(', ')}. Your role: ${req.user.role}` 
      });
    }

    next();
  };
};

// Check if user owns the resource or is superadmin
const authorizeOwnerOrAdmin = (Model, paramName = 'id', ownerField = 'createdBy') => {
  return async (req, res, next) => {
    try {
      // Superadmin can access anything
      if (req.user.role === 'superadmin') {
        return next();
      }

      const resourceId = req.params[paramName];
      const resource = await Model.findById(resourceId);

      if (!resource) {
        return res.status(404).json({ message: 'Resource not found' });
      }

      // Check if user owns the resource
      if (resource[ownerField].toString() !== req.user._id.toString()) {
        return res.status(403).json({ 
          message: 'Access denied. You can only modify your own resources.' 
        });
      }

      req.resource = resource; // Attach resource to request
      next();
    } catch (error) {
      return res.status(500).json({ message: 'Authorization error', error: error.message });
    }
  };
};

module.exports = { authorize, authorizeOwnerOrAdmin };
