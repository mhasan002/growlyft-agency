import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { InsertBlogPost, insertBlogPostSchema } from "@shared/schema";
import { ArrowLeft, Save, Eye, Upload, Link } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function AdminBlogCreate() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isPreview, setIsPreview] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<InsertBlogPost>({
    resolver: zodResolver(insertBlogPostSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      featuredImage: "",
      author: "",
      category: "",
      tags: [],
      readTime: "",
      isPublished: false,
    },
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const createPostMutation = useMutation({
    mutationFn: async (postData: InsertBlogPost) => {
      const res = await apiRequest("POST", "/api/admin/posts", postData);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create post");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/posts"] });
      toast({
        title: "Post created",
        description: "Blog post created successfully",
      });
      setLocation("/admin-dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create post",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Function to estimate reading time based on content
  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const textContent = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    const wordCount = textContent.trim().split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  const onSubmit = (data: InsertBlogPost) => {
    // Auto-generate read time if empty
    if (!data.readTime && data.content) {
      data.readTime = estimateReadTime(data.content);
    }
    createPostMutation.mutate(data);
  };

  const saveDraft = () => {
    const data = form.getValues();
    data.isPublished = false;
    // Auto-generate read time if empty
    if (!data.readTime && data.content) {
      data.readTime = estimateReadTime(data.content);
    }
    createPostMutation.mutate(data);
  };

  const publishPost = () => {
    const data = form.getValues();
    data.isPublished = true;
    // Auto-generate read time if empty
    if (!data.readTime && data.content) {
      data.readTime = estimateReadTime(data.content);
    }
    createPostMutation.mutate(data);
  };

  const categories = [
    "Social Media Management",
    "Content Marketing",
    "SEO",
    "Digital Marketing",
    "Brand Building",
    "Analytics & Insights",
    "Case Studies",
    "Industry Trends",
    "Tips & Tricks",
  ];

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link', 'image'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['clean']
    ],
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => setLocation("/admin-dashboard")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Blog Post</h1>
            <p className="text-muted-foreground">
              Write and publish a new blog post for your website
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsPreview(!isPreview)}
            >
              <Eye className="h-4 w-4 mr-2" />
              {isPreview ? "Edit" : "Preview"}
            </Button>
          </div>
        </div>
      </div>

      {isPreview ? (
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <h1>{form.watch("title") || "Untitled Post"}</h1>
              {form.watch("featuredImage") && (
                <img src={form.watch("featuredImage")} alt="Featured" className="w-full h-64 object-cover rounded-lg" />
              )}
              <p className="text-muted-foreground">{form.watch("excerpt")}</p>
              <div 
                dangerouslySetInnerHTML={{ __html: form.watch("content") || "No content yet..." }}
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Post Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter post title"
                            onChange={(e) => {
                              field.onChange(e);
                              const slug = generateSlug(e.target.value);
                              form.setValue("slug", slug);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="post-url-slug" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Author</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Author name" />
                        </FormControl>
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="readTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Read Time</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Auto-calculated if empty" />
                        </FormControl>
                        <FormMessage />
                        <div className="text-sm text-gray-500">
                          Leave empty to auto-calculate from content
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="featuredImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cover Photo <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Tabs defaultValue="url" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                              <TabsTrigger value="url" className="flex items-center gap-2">
                                <Link className="h-4 w-4" />
                                URL
                              </TabsTrigger>
                              <TabsTrigger value="upload" className="flex items-center gap-2">
                                <Upload className="h-4 w-4" />
                                Upload
                              </TabsTrigger>
                            </TabsList>
                            <TabsContent value="url" className="space-y-2">
                              <Input 
                                {...field} 
                                placeholder="https://..." 
                                value={uploadedImageUrl || field.value || ""}
                                onChange={(e) => {
                                  setUploadedImageUrl("");
                                  field.onChange(e.target.value);
                                }}
                              />
                            </TabsContent>
                            <TabsContent value="upload" className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => fileInputRef.current?.click()}
                                  className="flex items-center gap-2"
                                >
                                  <Upload className="h-4 w-4" />
                                  Choose Image
                                </Button>
                                <input
                                  ref={fileInputRef}
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      // Convert file to data URL
                                      const reader = new FileReader();
                                      reader.onload = (event) => {
                                        const dataUrl = event.target?.result as string;
                                        setUploadedImageUrl(dataUrl);
                                        field.onChange(dataUrl);
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                                {(uploadedImageUrl || field.value) && (
                                  <span className="text-sm text-green-600">
                                    ✓ Image selected
                                  </span>
                                )}
                              </div>
                              {uploadedImageUrl && (
                                <div className="mt-2">
                                  <img 
                                    src={uploadedImageUrl} 
                                    alt="Preview" 
                                    className="max-w-xs max-h-32 object-cover rounded border"
                                  />
                                </div>
                              )}
                            </TabsContent>
                          </Tabs>
                        </FormControl>
                        <FormMessage />
                        <div className="text-sm text-gray-500 space-y-1">
                          <p><strong>Recommended sizes:</strong></p>
                          <p>• Cover photo: 1200x630px (aspect ratio 1.91:1)</p>
                          <p>• Will be auto-resized to fit website design</p>
                          <p>• Use high-quality images for best results</p>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excerpt <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Brief description of the post (minimum 10 characters)"
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                      <div className="text-sm text-gray-500">
                        {field.value?.length || 0}/10 characters minimum
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content</CardTitle>
                <div className="text-sm text-gray-500 space-y-1">
                  <p><strong>Image guidelines for content:</strong></p>
                  <p>• In-content images: 800x400px recommended</p>
                  <p>• Images will be auto-resized to fit article width</p>
                  <p>• Use descriptive alt text for accessibility</p>
                </div>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Post Content</FormLabel>
                      <FormControl>
                        <div className="min-h-[400px]">
                          <ReactQuill
                            theme="snow"
                            value={field.value}
                            onChange={field.onChange}
                            modules={quillModules}
                            style={{ height: "350px" }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Publishing Options</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="isPublished"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Publish immediately
                        </FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Make this post visible to the public
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={saveDraft}
                disabled={createPostMutation.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                Save as Draft
              </Button>
              <Button
                type="button"
                onClick={publishPost}
                disabled={createPostMutation.isPending}
              >
                {createPostMutation.isPending ? "Publishing..." : "Publish Post"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}