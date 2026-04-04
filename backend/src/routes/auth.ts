import { Router, Request, Response } from 'express';
import * as authController from '../controllers/auth.js';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', (req: Request, res: Response) => {
  // Will add auth middleware here
  res.json({ user: 'TODO' });
});

export default router;
