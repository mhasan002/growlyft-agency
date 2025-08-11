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
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { FormConfig, InsertFormConfig, insertFormConfigSchema } from "@shared/schema";
import { Plus, Settings, ExternalLink, Trash2, Edit, Mail } from "lucide-react";

export default function AdminFormsManager() {
  const { toast } = useToast();
  const [selectedForm, setSelectedForm] = useState<FormConfig | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: forms = [], isLoading } = useQuery<FormConfig[]>({
    queryKey: ["/api/admin/forms"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const createFormMutation = useMutation({
    mutationFn: async (formData: InsertFormConfig) => {
      const res = await apiRequest("POST", "/api/admin/forms", formData);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create form");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/forms"] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Form created",
        description: "Form configuration created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create form",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateFormMutation = useMutation({
    mutationFn: async ({ id, ...formData }: Partial<InsertFormConfig> & { id: string }) => {
      const res = await apiRequest("PUT", `/api/admin/forms/${id}`, formData);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update form");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/forms"] });
      setIsEditDialogOpen(false);
      setSelectedForm(null);
      toast({
        title: "Form updated",
        description: "Form configuration updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update form",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteFormMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/admin/forms/${id}`);
      if (!res.ok) {
        throw new Error("Failed to delete form");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/forms"] });
      toast({
        title: "Form deleted",
        description: "Form configuration deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete form",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createForm = useForm<InsertFormConfig>({
    resolver: zodResolver(insertFormConfigSchema),
    defaultValues: {
      formName: "",
      displayName: "",
      location: "",
      recipientEmails: [""],
      googleSheetUrl: "",
      isActive: true,
    },
  });

  const editForm = useForm<InsertFormConfig>({
    resolver: zodResolver(insertFormConfigSchema),
  });

  const onCreateSubmit = async (data: InsertFormConfig) => {
    const emails = data.recipientEmails.filter(email => email.trim() !== "");
    await createFormMutation.mutateAsync({ ...data, recipientEmails: emails });
  };

  const onEditSubmit = async (data: InsertFormConfig) => {
    if (!selectedForm) return;
    const emails = data.recipientEmails.filter(email => email.trim() !== "");
    await updateFormMutation.mutateAsync({ id: selectedForm.id, ...data, recipientEmails: emails });
  };

  const handleEdit = (form: FormConfig) => {
    setSelectedForm(form);
    editForm.reset({
      formName: form.formName,
      displayName: form.displayName,
      location: form.location,
      recipientEmails: form.recipientEmails,
      googleSheetUrl: form.googleSheetUrl || "",
      isActive: form.isActive,
    });
    setIsEditDialogOpen(true);
  };

  if (isLoading) {
    return <div>Loading forms...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Forms Management</h2>
          <p className="text-muted-foreground">
            Configure form settings, recipients, and integrations
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-form">
              <Plus className="h-4 w-4 mr-2" />
              Create Form
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Form</DialogTitle>
              <DialogDescription>
                Configure a new form with email recipients and settings
              </DialogDescription>
            </DialogHeader>
            <Form {...createForm}>
              <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
                <FormField
                  control={createForm.control}
                  name="formName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Form Name (Internal)</FormLabel>
                      <FormControl>
                        <Input placeholder="lets_talk" {...field} data-testid="input-form-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={createForm.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Let's Work Together" {...field} data-testid="input-display-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={createForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Page Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Home Page" {...field} data-testid="input-location" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium">Recipient Emails</label>
                  {createForm.watch("recipientEmails").map((_, index) => (
                    <FormField
                      key={index}
                      control={createForm.control}
                      name={`recipientEmails.${index}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex gap-2">
                              <Input
                                placeholder="admin@growlyft.com"
                                {...field}
                                data-testid={`input-email-${index}`}
                              />
                              {index > 0 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const emails = createForm.getValues("recipientEmails");
                                    emails.splice(index, 1);
                                    createForm.setValue("recipientEmails", emails);
                                  }}
                                  data-testid={`button-remove-email-${index}`}
                                >
                                  Remove
                                </Button>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const emails = createForm.getValues("recipientEmails");
                      createForm.setValue("recipientEmails", [...emails, ""]);
                    }}
                    data-testid="button-add-email"
                  >
                    Add Email
                  </Button>
                </div>

                <FormField
                  control={createForm.control}
                  name="googleSheetUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Google Sheet URL (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://docs.google.com/spreadsheets/..."
                          {...field}
                          data-testid="input-google-sheet"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={createForm.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Form will accept submissions when active
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="switch-active"
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
                    disabled={createFormMutation.isPending}
                    data-testid="button-save"
                  >
                    {createFormMutation.isPending ? "Creating..." : "Create Form"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {forms.map((form) => (
          <Card key={form.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{form.displayName}</CardTitle>
                <Badge variant={form.isActive ? "default" : "secondary"}>
                  {form.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <CardDescription>{form.location}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <span className="font-medium">Form ID:</span> {form.formName}
              </div>
              
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{form.recipientEmails.length} recipient(s)</span>
              </div>

              {form.googleSheetUrl && (
                <div className="flex items-center space-x-2">
                  <ExternalLink className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Google Sheets connected</span>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(form)}
                  data-testid={`button-edit-${form.id}`}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteFormMutation.mutate(form.id)}
                  disabled={deleteFormMutation.isPending}
                  data-testid={`button-delete-${form.id}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Form Configuration</DialogTitle>
            <DialogDescription>
              Update form settings and recipient configuration
            </DialogDescription>
          </DialogHeader>
          {selectedForm && (
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                {/* Similar form fields as create form but with edit form control */}
                <FormField
                  control={editForm.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="edit-input-display-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Page Location</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="edit-input-location" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium">Recipient Emails</label>
                  {editForm.watch("recipientEmails").map((_, index) => (
                    <FormField
                      key={index}
                      control={editForm.control}
                      name={`recipientEmails.${index}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex gap-2">
                              <Input
                                {...field}
                                data-testid={`edit-input-email-${index}`}
                              />
                              {index > 0 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const emails = editForm.getValues("recipientEmails");
                                    emails.splice(index, 1);
                                    editForm.setValue("recipientEmails", emails);
                                  }}
                                  data-testid={`edit-button-remove-email-${index}`}
                                >
                                  Remove
                                </Button>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const emails = editForm.getValues("recipientEmails");
                      editForm.setValue("recipientEmails", [...emails, ""]);
                    }}
                    data-testid="edit-button-add-email"
                  >
                    Add Email
                  </Button>
                </div>

                <FormField
                  control={editForm.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Form will accept submissions when active
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="edit-switch-active"
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
                    disabled={updateFormMutation.isPending}
                    data-testid="edit-button-save"
                  >
                    {updateFormMutation.isPending ? "Updating..." : "Update Form"}
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