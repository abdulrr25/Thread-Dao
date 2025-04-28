import express from 'express';
import { supabase } from '../index';
const router = express.Router();
// Get all posts
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });
        if (error)
            throw error;
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});
// Get post by ID
router.get('/:id', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('id', req.params.id)
            .single();
        if (error)
            throw error;
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch post' });
    }
});
// Create post
router.post('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('posts')
            .insert([req.body])
            .select()
            .single();
        if (error)
            throw error;
        res.status(201).json(data);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create post' });
    }
});
// Update post
router.put('/:id', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('posts')
            .update(req.body)
            .eq('id', req.params.id)
            .select()
            .single();
        if (error)
            throw error;
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update post' });
    }
});
// Delete post
router.delete('/:id', async (req, res) => {
    try {
        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', req.params.id);
        if (error)
            throw error;
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete post' });
    }
});
export default router;
