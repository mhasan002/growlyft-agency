import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { BlogPost, InsertBlogPost, insertBlogPostSchema } from "@shared/schema";
import { Plus, Edit, Trash2, Eye, Calendar, User, Tag } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function AdminBlogManager() {
  const { toast } = useToast();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/admin/posts"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

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
      setIsCreateDialogOpen(false);
      toast({
        title: "Post created",
        description: "Blog post created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create post",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: async ({ id, ...postData }: Partial<InsertBlogPost> & { id: string }) => {
      const res = await apiRequest("PUT", `/api/admin/posts/${id}`, postData);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update post");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/posts"] });
      setIsEditDialogOpen(false);
      setSelectedPost(null);
      toast({
        title: "Post updated",
        description: "Blog post updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update post",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/admin/posts/${id}`);
      if (!res.ok) {
        throw new Error("Failed to delete post");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/posts"] });
      toast({
        title: "Post deleted",
        description: "Blog post deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete post",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createForm = useForm<InsertBlogPost>({
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

  const editForm = useForm<InsertBlogPost>({
    resolver: zodResolver(insertBlogPostSchema),
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const onCreateSubmit = async (data: InsertBlogPost) => {
    await createPostMutation.mutateAsync(data);
  };

  const onEditSubmit = async (data: InsertBlogPost) => {
    if (!selectedPost) return;
    await updatePostMutation.mutateAsync({ id: selectedPost.id, ...data });
  };

  const handleEdit = (post: BlogPost) => {
    setSelectedPost(post);
    editForm.reset({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featuredImage || "",
      author: post.author,
      category: post.category,
      tags: post.tags || [],
      readTime: post.readTime,
      isPublished: post.isPublished,
    });
    setIsEditDialogOpen(true);
  };

  const categories = [
    "Social Media Marketing",
    "Content Strategy",
    "Digital Marketing",
    "Brand Building",
    "Analytics & Insights",
    "Case Studies",
    "Industry Trends",
    "Tips & Tricks",
  ];

  if (isLoading) {
    return <div>Loading posts...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Blog Management</h2>
          <p className="text-muted-foreground">
            Create, edit, and manage blog posts
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-post">
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Blog Post</DialogTitle>
              <DialogDescription>
                Write a new blog post for the Growlyft website
              </DialogDescription>
            </DialogHeader>
            <Form {...createForm}>
              <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={createForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="How to Boost Your Social Media Engagement"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              if (!createForm.getValues("slug")) {
                                createForm.setValue("slug", generateSlug(e.target.value));
                              }
                            }}
                            data-testid="input-title"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={createForm.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL Slug</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="how-to-boost-social-media-engagement"
                            {...field}
                            data-testid="input-slug"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={createForm.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excerpt</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="A brief description of your blog post..."
                          className="min-h-[80px]"
                          {...field}
                          data-testid="textarea-excerpt"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={createForm.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write your blog post content here..."
                          className="min-h-[200px]"
                          {...field}
                          data-testid="textarea-content"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={createForm.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Author</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Doe"
                            {...field}
                            data-testid="input-author"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={createForm.control}
                    name="readTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Read Time</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="5 min read"
                            {...field}
                            data-testid="input-read-time"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={createForm.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-category">
                              <SelectValue placeholder="Select a category" />
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

                  <FormField
                    control={createForm.control}
                    name="featuredImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Featured Image URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/image.jpg"
                            {...field}
                            data-testid="input-featured-image"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={createForm.control}
                  name="isPublished"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Publish</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Make this post visible on the website
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="switch-published"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createPostMutation.isPending}
                    data-testid="button-save"
                  >
                    {createPostMutation.isPending ? "Creating..." : "Create Post"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-xl">{post.title}</CardTitle>
                    <Badge variant={post.isPublished ? "default" : "secondary"}>
                      {post.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <CardDescription className="text-base">{post.excerpt}</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(post)}
                    data-testid={`button-edit-${post.id}`}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deletePostMutation.mutate(post.id)}
                    disabled={deletePostMutation.isPending}
                    data-testid={`button-delete-${post.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Tag className="h-4 w-4" />
                  <span>{post.category}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
            <DialogDescription>
              Update the blog post content and settings
            </DialogDescription>
          </DialogHeader>
          {selectedPost && (
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="edit-input-title" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL Slug</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="edit-input-slug" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={editForm.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excerpt</FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-[80px]"
                          {...field}
                          data-testid="edit-textarea-excerpt"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-[200px]"
                          {...field}
                          data-testid="edit-textarea-content"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="isPublished"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Publish</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Make this post visible on the website
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="edit-switch-published"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                    data-testid="edit-button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={updatePostMutation.isPending}
                    data-testid="edit-button-save"
                  >
                    {updatePostMutation.isPending ? "Updating..." : "Update Post"}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}