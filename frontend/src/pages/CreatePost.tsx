import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/context/WalletContext';
import { Loading } from '@/components/ui/loading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Image, Send } from 'lucide-react';

const postSchema = z.object({
  content: z.string().min(10, 'Content must be at least 10 characters').max(1000, 'Content must be at most 1000 characters'),
  image: z.string().url('Image must be a valid URL').optional(),
  daoId: z.string().optional(),
});

type PostFormData = z.infer<typeof postSchema>;

const CreatePost: React.FC = () => {
  const { publicKey, connected } = useWallet();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
  });

  const createPostMutation = useMutation({
    mutationFn: (data: PostFormData) => api.createPost({
      dao_id: data.daoId || '',
      author_address: publicKey!,
      content: data.content,
      image: data.image,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      reset();
      toast({
        title: 'Success',
        description: 'Post created successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create post',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: PostFormData) => {
    if (!connected) {
      toast({
        title: 'Error',
        description: 'Please connect your wallet first',
        variant: 'destructive',
      });
      return;
    }
    createPostMutation.mutate(data);
  };

  if (isSubmitting) {
    return <Loading text="Creating post..." />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a New Post</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Textarea
              {...register('content')}
              placeholder="What's on your mind?"
              className={errors.content ? 'border-destructive' : ''}
              rows={6}
            />
            {errors.content && (
              <p className="mt-1 text-sm text-destructive">{errors.content.message}</p>
            )}
          </div>

          <div>
            <Input
              {...register('image')}
              placeholder="Image URL (optional)"
              className={errors.image ? 'border-destructive' : ''}
            />
            {errors.image && (
              <p className="mt-1 text-sm text-destructive">{errors.image.message}</p>
            )}
          </div>

          <div>
            <Input
              {...register('daoId')}
              placeholder="DAO ID (optional)"
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => reset()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Send className="mr-2 h-4 w-4" />
              Post
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePost; 