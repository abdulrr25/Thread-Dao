import supabase from '../services/supabaseService';
export const createPost = async (req, res) => {
    const { author, content, mediaUrl, topic } = req.body;
    const { data, error } = await supabase
        .from('posts')
        .insert([{ author, content, mediaUrl, topic }]);
    if (error)
        return res.status(500).json({ error });
    res.json(data);
};
export const getAllPosts = async (_, res) => {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
    if (error)
        return res.status(500).json({ error });
    res.json(data);
};
