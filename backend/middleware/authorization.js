


const ErrorResponse = require('../utils/errorResponse');

/**
 * Access Control Protocol: Role-Based Authorization
 * Verifies identity standing and administrative elevation matches required protocol levels.
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ErrorResponse('Identity Standing Failure: Entity not authenticated within the session.', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse(`Access Denied: Insufficient administrative elevation. Required standing: ${roles.join(', ')}.`, 403));
    }

    next();
  };
};

/**
 * Registry Integrity Guard: Resource Sovereignty Protocol
 * Verifies if the authenticated entity maintains sovereignty over the targeted registry asset.
 */
const authorizeOwnerOrAdmin = (Model, paramName = 'id', ownerField = 'createdBy') => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[paramName];
      const foundResource = await Model.findById(resourceId);

      if (!foundResource) {
        return next(new ErrorResponse('Registry Failure: Targeted resource identifier not found.', 404));
      }

      req.resource = foundResource;

      /**
       * Administrative Override: Global Governance maintains universal sovereignty
       */
      if (req.user.role === 'superadmin') {
        return next();
      }

      const ownerId = foundResource[ownerField] && foundResource[ownerField]._id 
        ? foundResource[ownerField]._id.toString() 
        : foundResource[ownerField]?.toString();

      /**
       * Sovereignty Check: Verify entity relationship with the targeted asset
       */
      if (ownerId !== req.user._id.toString()) {
        return next(new ErrorResponse('Sovereignty Violation: Identity lacks modification privileges for the targeted registry record.', 403));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = { authorize, authorizeOwnerOrAdmin };


