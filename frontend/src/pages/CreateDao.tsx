"use client"

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  PlusCircle, Image, Upload, Sparkles, ArrowRight, 
  Check, X, ArrowLeft, HelpCircle, Globe
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// Define form schema
const daoFormSchema = z.object({
  name: z.string().min(3, { message: "DAO name must be at least 3 characters" }).max(50),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }).max(500),
  category: z.string().min(1, { message: "Please select a category" }),
  isPublic: z.boolean().default(true),
  avatar: z.string().optional(),
  tokenName: z.string().min(1, { message: "Token name is required" }).max(20),
  tokenSymbol: z.string().min(1, { message: "Token symbol is required" }).max(6),
  initialSupply: z.string().min(1, { message: "Initial supply is required" }),
  requireApproval: z.boolean().default(false),
  contentModeration: z.boolean().default(false),
  tokenGating: z.boolean().default(false)
});

type DaoFormValues = z.infer<typeof daoFormSchema>;

const CreateDao: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [previewImage, setPreviewImage] = useState<string>('');
  
  // Initialize form
  const form = useForm<DaoFormValues>({
    resolver: zodResolver(daoFormSchema),
    defaultValues: {
      name: '',
      description: '',
      category: 'social',
      isPublic: true,
      tokenName: '',
      tokenSymbol: '',
      initialSupply: '10000',
      requireApproval: false,
      contentModeration: false,
      tokenGating: false
    }
  });
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewImage(event.target.result as string);
          form.setValue('avatar', event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const nextStep = () => {
    if (step === 1 && (!form.getValues('name') || !form.getValues('description') || !form.getValues('category'))) {
      toast({
        title: "Incomplete information",
        description: "Please fill in all the required fields before proceeding.",
        variant: "destructive"
      });
      return;
    }
    
    if (step === 2 && (!form.getValues('tokenName') || !form.getValues('tokenSymbol') || !form.getValues('initialSupply'))) {
      toast({
        title: "Incomplete information",
        description: "Please fill in all the token information fields before proceeding.",
        variant: "destructive"
      });
      return;
    }
    
    setStep(step + 1);
  };
  
  const prevStep = () => {
    setStep(step - 1);
  };
  
  function onSubmit(data: DaoFormValues) {
    console.log(data);
    
    // This would connect to your backend to create the DAO
    toast({
      title: "DAO Created Successfully!",
      description: `${data.name} has been created. You can now start inviting members.`,
      variant: "default"
    });
    
    // Navigate to the new DAO page (in a real app, you'd navigate to the actual DAO page)
    setTimeout(() => {
      navigate('/dao/new');
    }, 1500);
  }
  
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>DAO Name</FormLabel>
                      <FormControl>
                        <Input placeholder="MyAwesomeDAO" {...field} />
                      </FormControl>
                      <FormDescription>
                        Choose a unique name for your DAO
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <select 
                          className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                          {...field}
                        >
                          <option value="social">Social</option>
                          <option value="defi">DeFi</option>
                          <option value="nft">NFT</option>
                          <option value="gaming">Gaming</option>
                          <option value="development">Development</option>
                          <option value="creator">Creator</option>
                          <option value="community">Community</option>
                        </select>
                      </FormControl>
                      <FormDescription>
                        Select the most relevant category for your DAO
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the purpose and goals of your DAO..." 
                          className="min-h-24 resize-none"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Briefly explain what your DAO is about
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex flex-col space-y-4">
                <FormLabel>DAO Avatar</FormLabel>
                <div className="flex flex-col items-center justify-center bg-muted/40 border-2 border-dashed border-muted-foreground/20 rounded-md p-6 h-36">
                  {previewImage ? (
                    <div className="relative">
                      <img 
                        src={previewImage} 
                        alt="Avatar preview" 
                        className="h-24 w-24 rounded-full object-cover"
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-0 right-0 rounded-full bg-background border h-6 w-6 p-1"
                        onClick={() => setPreviewImage('')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center gap-2 cursor-pointer">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Upload Avatar</span>
                      <Input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleAvatarChange}
                      />
                    </label>
                  )}
                </div>
                
                <FormField
                  control={form.control}
                  name="isPublic"
                  render={({ field }) => (
                    <FormItem className="flex items-start gap-2 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox 
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div>
                        <FormLabel className="text-base">Public DAO</FormLabel>
                        <FormDescription>
                          Allow anyone to view and join your DAO. If disabled, members can only join by invitation.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="tokenName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Token Name</FormLabel>
                      <FormControl>
                        <Input placeholder="My DAO Token" {...field} />
                      </FormControl>
                      <FormDescription>
                        The full name of your DAO's token
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tokenSymbol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Token Symbol</FormLabel>
                      <FormControl>
                        <Input placeholder="MDT" {...field} />
                      </FormControl>
                      <FormDescription>
                        Short symbol for your token (max 6 characters)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="initialSupply"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initial Supply</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormDescription>
                        The total number of tokens to mint initially
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-medium">Token Information</h3>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Every DAO has its own token that represents membership and voting power. You can customize your token settings here.
                  </p>
                  <div className="space-y-2 bg-muted/40 p-3 rounded-md text-sm">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Used for governance voting</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Represents membership in the DAO</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Can be transferred to other members</span>
                    </div>
                  </div>
                </div>
                
                <FormField
                  control={form.control}
                  name="tokenGating"
                  render={({ field }) => (
                    <FormItem className="flex items-start gap-2 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox 
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div>
                        <FormLabel className="text-base">Token Gating</FormLabel>
                        <FormDescription>
                          Require members to hold a minimum amount of tokens to access certain features
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Governance Settings</h3>
                
                <FormField
                  control={form.control}
                  name="requireApproval"
                  render={({ field }) => (
                    <FormItem className="flex items-start gap-2 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox 
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div>
                        <FormLabel className="text-base">Membership Approval</FormLabel>
                        <FormDescription>
                          Require new members to be approved before joining
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="contentModeration"
                  render={({ field }) => (
                    <FormItem className="flex items-start gap-2 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox 
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div>
                        <FormLabel className="text-base">Content Moderation</FormLabel>
                        <FormDescription>
                          Enable moderation for posts and comments in your DAO
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <div className="rounded-md border p-4">
                  <h3 className="font-medium mb-2">Default Voting Rules</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Voting Period:</span>
                      <span>7 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quorum:</span>
                      <span>10% of total tokens</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Voting System:</span>
                      <span>Token-weighted</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Proposal Creation:</span>
                      <span>Any member</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    These settings can be modified later in the DAO settings
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Preview</h3>
                
                <Card className="overflow-hidden">
                  <div className="h-24 bg-thread-gradient relative"></div>
                  <div className="h-16 w-16 rounded-full absolute top-16 left-6 bg-background p-1">
                    <div className="h-full w-full rounded-full bg-thread-gradient flex items-center justify-center">
                      {previewImage ? (
                        <img 
                          src={previewImage} 
                          alt="DAO avatar" 
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <Sparkles className="h-8 w-8 text-white" />
                      )}
                    </div>
                  </div>
                  
                  <CardContent className="pt-12">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-semibold">{form.getValues('name') || 'Your DAO Name'}</h3>
                      <Badge>{form.getValues('category') || 'Category'}</Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Globe className="h-3.5 w-3.5" />
                        <span>{form.getValues('isPublic') ? 'Public' : 'Private'} DAO</span>
                      </div>
                      <span>•</span>
                      <span>0 members</span>
                    </div>
                    
                    <p className="text-sm mb-4 line-clamp-2">
                      {form.getValues('description') || 'Your DAO description will appear here...'}
                    </p>
                    
                    <div className="flex gap-2">
                      <Badge variant="outline" className="gap-1 bg-primary/10 text-primary text-xs">
                        <Sparkles className="h-3 w-3" />
                        <span>New DAO</span>
                      </Badge>
                      
                      <Badge variant="outline" className="gap-1 bg-secondary/10 text-secondary text-xs">
                        <span>{form.getValues('tokenSymbol') || 'TOKEN'}</span>
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="rounded-md border p-4">
                  <h3 className="font-medium mb-2">Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">DAO Name:</span>
                      <span>{form.getValues('name') || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category:</span>
                      <span className="capitalize">{form.getValues('category') || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Token:</span>
                      <span>{form.getValues('tokenName') || 'Not set'} ({form.getValues('tokenSymbol') || 'N/A'})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Initial Supply:</span>
                      <span>{form.getValues('initialSupply') || '0'} tokens</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Visibility:</span>
                      <span>{form.getValues('isPublic') ? 'Public' : 'Private'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activePage="my-daos" />
      
      <main className="flex-1 border-l border-muted/30">
        <div className="container max-w-6xl py-6">
          <div className="flex items-center mb-8">
            <Button variant="ghost" size="icon" asChild className="mr-3">
              <Link to="/my-daos">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold mb-1">Create a DAO</h1>
              <p className="text-muted-foreground">Set up your decentralized autonomous organization</p>
            </div>
          </div>
          
          <div className="mb-8">
            <div className="flex justify-between relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-muted -translate-y-1/2 z-0"></div>
              
              {[1, 2, 3].map((stepNumber) => (
                <div 
                  key={stepNumber} 
                  className={`flex items-center justify-center h-10 w-10 rounded-full z-10 ${
                    step === stepNumber 
                      ? 'bg-thread-gradient text-white'
                      : step > stepNumber 
                        ? 'bg-primary text-white' 
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step > stepNumber ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    stepNumber
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex justify-between mt-2">
              <div className="text-sm font-medium">Basic Information</div>
              <div className="text-sm font-medium">Token Setup</div>
              <div className="text-sm font-medium">Governance & Review</div>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>{
                step === 1 ? 'Basic Information' : 
                step === 2 ? 'Token Setup' : 
                'Governance & Review'
              }</CardTitle>
            </CardHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent>
                  {renderStepContent()}
                </CardContent>
                
                <CardFooter className="flex justify-between">
                  {step > 1 ? (
                    <Button variant="outline" onClick={prevStep}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                  ) : (
                    <Button variant="outline" asChild>
                      <Link to="/my-daos">Cancel</Link>
                    </Button>
                  )}
                  
                  {step < 3 ? (
                    <Button onClick={nextStep} className="bg-thread-gradient hover:opacity-90">
                      Continue
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button type="submit" className="bg-thread-gradient hover:opacity-90">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create DAO
                    </Button>
                  )}
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CreateDao;