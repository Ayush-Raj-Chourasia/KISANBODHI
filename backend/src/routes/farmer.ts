import { Router, Request, Response } from 'express';

const router = Router();

// GET /api/farmer/profile
router.get('/profile', (req: Request, res: Response) => {
  const userId = req.userId;
  // TODO: Fetch farmer profile from database
  res.json({
    id: userId,
    name: 'Farmer Name',
    district: 'Kendrapara',
    language: 'odia',
    crops: ['Paddy', 'Sugarcane'],
    landArea: '2.5 hectares'
  });
});

// PUT /api/farmer/profile
router.put('/profile', (req: Request, res: Response) => {
  const userId = req.userId;
  const { name, district, crops, landArea } = req.body;
  // TODO: Update farmer profile in database
  res.json({ message: 'Profile updated successfully' });
});

// GET /api/farmer/alerts
router.get('/alerts', (req: Request, res: Response) => {
  const userId = req.userId;
  // TODO: Fetch personalized alerts based on farmer's location and crops
  res.json([
    {
      id: '1',
      type: 'WEATHER_WARNING',
      severity: 'HIGH',
      message: 'Heavy rainfall alert for your district',
      timestamp: new Date().toISOString()
    }
  ]);
});

// GET /api/farmer/schemes
router.get('/schemes', (req: Request, res: Response) => {
  // TODO: Return list of government schemes applicable to farmer
  res.json([
    {
      id: '1',
      name: 'PM-KISAN',
      description: 'Support to landholding farmer families',
      amount: '₹6,000 per year'
    },
    {
      id: '2',
      name: 'PMFBY',
      description: 'Pradhan Mantri Fasal Bima Yojana',
      amount: 'Variable'
    }
  ]);
});

export default router;
