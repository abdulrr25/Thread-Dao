import express from 'express';
import { supabase } from '../lib/supabase';
const router = express.Router();
// Get activities for a user
router.get('/', async (req, res) => {
    try {
        const { user } = req.query;
        if (!user) {
            return res.status(400).json({ error: 'User address is required' });
        }
        const { data, error } = await supabase
            .from('activities')
            .select('*')
            .eq('user_address', user)
            .order('created_at', { ascending: false })
            .limit(50);
        if (error)
            throw error;
        res.json({ data });
    }
    catch (error) {
        console.error('Error fetching activities:', error);
        res.status(500).json({ error: 'Failed to fetch activities' });
    }
});
// Create a new activity
router.post('/', async (req, res) => {
    try {
        const { type, dao_address, dao_title, user_address, data } = req.body;
        const { data: activity, error } = await supabase
            .from('activities')
            .insert({
            type,
            dao_address,
            dao_title,
            user_address,
            data,
        })
            .select()
            .single();
        if (error)
            throw error;
        res.json(activity);
    }
    catch (error) {
        console.error('Error creating activity:', error);
        res.status(500).json({ error: 'Failed to create activity' });
    }
});
export default router;
