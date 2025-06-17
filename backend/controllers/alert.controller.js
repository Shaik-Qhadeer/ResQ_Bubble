import Alert from '../models/alert.model.js';
import Agency from '../models/agency.model.js';

export const getAgencyAlerts = async (req, res) => {
  try {
    const { agencyId } = req.params;
    
    const alerts = await Alert.find({
      'recipients.agency': agencyId,
      status: 'active'
    })
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: alerts
    });
  } catch (error) {
    console.error('Error fetching agency alerts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch alerts',
      error: error.message
    });
  }
};

export const getSentAlerts = async (req, res) => {
  try {
    const { agencyId } = req.params;
    
    // Check if user belongs to the agency
    if (req.user.agency.toString() !== agencyId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view alerts for this agency' });
    }
    
    const alerts = await Alert.find({ createdBy: agencyId })
      .populate('recipients.agency', 'name')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: alerts
    });
  } catch (error) {
    console.error('Error fetching sent alerts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sent alerts',
      error: error.message
    });
  }
};

export const createAlert = async (req, res) => {
  try {
    const {
      title,
      message,
      severity,
      coordinates,
      radius,
      expiresAt,
      recipients
    } = req.body;
    
    const agencyId = req.user.agency._id;
    
    // Validate coordinates
    if (!Array.isArray(coordinates) || coordinates.length !== 2) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates format. Must be [longitude, latitude]'
      });
    }

    const [longitude, latitude] = coordinates;
    if (typeof longitude !== 'number' || typeof latitude !== 'number' ||
        longitude < -180 || longitude > 180 ||
        latitude < -90 || latitude > 90) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates. Longitude must be between -180 and 180, latitude between -90 and 90'
      });
    }

    // Validate radius
    if (typeof radius !== 'number' || radius <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid radius. Must be a positive number'
      });
    }

    // Create the alert
    const alert = new Alert({
      title,
      message,
      severity,
      coordinates: [longitude, latitude],
      radius,
      expiresAt: new Date(expiresAt),
      createdBy: agencyId,
      status: 'active',
      recipients
    });
    
    await alert.save();
    
    try {
      // Find nearby agencies based on coordinates and radius
      const nearbyAgencies = await Agency.find({
        _id: { $ne: agencyId },
        'location.coordinates': {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude]
            },
            $maxDistance: radius * 1000 // Convert km to meters
          }
        }
      });
      
      // Add the alert to each nearby agency's alerts
      if (nearbyAgencies.length > 0) {
        await Agency.updateMany(
          { _id: { $in: nearbyAgencies.map(agency => agency._id) } },
          { $push: { alerts: alert._id } }
        );
      }
    } catch (geoError) {
      console.error('Error finding nearby agencies:', geoError);
      // Don't fail the alert creation if geospatial query fails
    }
    
    res.status(201).json({
      success: true,
      data: alert,
      message: 'Alert created successfully'
    });
  } catch (error) {
    console.error('Error creating alert:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create alert',
      error: error.message
    });
  }
};

export const markAlertAsRead = async (req, res) => {
  try {
    const { alertId } = req.params;
    const agencyId = req.user.agency._id;
    
    const alert = await Alert.findById(alertId);
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }
    
    // Add agency to readBy if not already present
    if (!alert.readBy.includes(agencyId)) {
      alert.readBy.push(agencyId);
      await alert.save();
    }
    
    res.status(200).json({
      success: true,
      message: 'Alert marked as read'
    });
  } catch (error) {
    console.error('Error marking alert as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark alert as read',
      error: error.message
    });
  }
};

export const deactivateAlert = async (req, res) => {
  try {
    const { alertId } = req.params;
    const agencyId = req.user.agency._id;
    
    const alert = await Alert.findById(alertId);
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }
    
    // Check if the agency created the alert
    if (alert.createdBy.toString() !== agencyId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to deactivate this alert'
      });
    }
    
    alert.status = 'inactive';
    await alert.save();
    
    res.status(200).json({
      success: true,
      message: 'Alert deactivated successfully'
    });
  } catch (error) {
    console.error('Error deactivating alert:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to deactivate alert',
      error: error.message
    });
  }
};

export const getUnreadAlertCount = async (req, res) => {
  try {
    const { agencyId } = req.params;
    const count = await Alert.countDocuments({
      'recipients.agency': agencyId,
      status: 'active',
      readBy: { $ne: agencyId }
    });
    
    res.status(200).json({
      success: true,
      count
    });
  } catch (error) {
    console.error('Error getting unread alert count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get unread alert count',
      error: error.message
    });
  }
};