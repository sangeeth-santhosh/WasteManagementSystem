import Zone from '../models/Zone.js';

export const createZone = async (req, res) => {
  try {
    const { name, description, places } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Zone name is required' });
    }

    const zone = await Zone.create({
      name,
      description: description || '',
      places: places || [],
    });

    return res.status(201).json({ success: true, data: zone });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Zone name already exists' });
    }
    console.error('createZone error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create zone' });
  }
};

export const getAllZones = async (req, res) => {
  try {
    const zones = await Zone.find({ isActive: true }).sort({ name: 1 });
    return res.json({ success: true, data: zones });
  } catch (error) {
    console.error('getAllZones error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch zones' });
  }
};

export const getZoneById = async (req, res) => {
  try {
    const zone = await Zone.findById(req.params.id);
    if (!zone) {
      return res.status(404).json({ success: false, message: 'Zone not found' });
    }
    return res.json({ success: true, data: zone });
  } catch (error) {
    console.error('getZoneById error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch zone' });
  }
};

export const updateZone = async (req, res) => {
  try {
    const { name, description, places } = req.body;
    const zone = await Zone.findById(req.params.id);

    if (!zone) {
      return res.status(404).json({ success: false, message: 'Zone not found' });
    }

    if (name) zone.name = name;
    if (description !== undefined) zone.description = description;
    if (places !== undefined) zone.places = places;

    await zone.save();

    return res.json({ success: true, data: zone });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Zone name already exists' });
    }
    console.error('updateZone error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update zone' });
  }
};

export const deleteZone = async (req, res) => {
  try {
    const zone = await Zone.findById(req.params.id);
    if (!zone) {
      return res.status(404).json({ success: false, message: 'Zone not found' });
    }

    zone.isActive = false;
    await zone.save();

    return res.json({ success: true, message: 'Zone deleted successfully' });
  } catch (error) {
    console.error('deleteZone error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete zone' });
  }
};




