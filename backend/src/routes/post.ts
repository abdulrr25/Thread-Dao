import express from 'express';
import { supabase, solanaConnection } from '../index';
import { createPostSchema } from '../schemas/post';
import { validateRequest } from '../middleware/validate';
import { uploadToIPFS } from '../services/ipfs';
import { createDAO } from '../services/dao';

const router = express.Router();

// Create a new post/DAO
router.post('/', validateRequest(createPostSchema), async (req, res) => {
  try {
    const { content, media, title, walletAddress } = req.body;

    // Upload media to IPFS if provided
    let mediaUrl = null;
    if (media) {
      mediaUrl = await uploadToIPFS(media);
    }

    // Create DAO smart contract
    const daoAddress = await createDAO({
      title,
      creator: walletAddress,
      initialMembers: [walletAddress],
    });

    // Store post metadata in Supabase
    const { data, error } = await supabase
      .from('posts')
      .insert({
        content,
        media_url: mediaUrl,
        title,
        creator_wallet: walletAddress,
        dao_address: daoAddress,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data: {
        ...data,
        daoAddress,
      },
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create post',
    });
  }
});

// Get all posts
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch posts',
    });
  }
});

// Get a specific post
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch post',
    });
  }
});

export default router;