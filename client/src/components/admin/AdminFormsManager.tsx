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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { FormConfig, InsertFormConfig, insertFormConfigSchema } from "@shared/schema";
import { Plus, Settings, ExternalLink, Trash2, Edit, Mail, Save } from "lucide-react";
import { z } from "zod";

const updateFormSchema = z.object({
  recipientEmails: z.string().email("Please enter a valid email address"),
  googleSheetUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  location: z.string().min(1, "Location is required"),
});

export default function AdminFormsManager() {
  const { toast } = useToast();
  const [editingForm, setEditingForm] = useState<string | null>(null);

  const { data: forms = [], isLoading } = useQuery<FormConfig[]>({
    queryKey: ["/api/admin/forms"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const updateFormMutation = useMutation({
    mutationFn: async ({ id, recipientEmails, googleSheetUrl, location }: { 
      id: string; 
      recipientEmails: string; 
      googleSheetUrl: string; 
      location: string;
    }) => {
      const emailArray = recipientEmails.split(',').map(email => email.trim()).filter(email => email);
      const res = await apiRequest("PUT", `/api/admin/forms/${id}`, {
        recipientEmails: emailArray,
        googleSheetUrl: googleSheetUrl || null,
        location,
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update form");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/forms"] });
      setEditingForm(null);
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

  const FormRow = ({ form }: { form: FormConfig }) => {
    const [recipientEmails, setRecipientEmails] = useState(form.recipientEmails.join(', '));
    const [googleSheetUrl, setGoogleSheetUrl] = useState(form.googleSheetUrl || '');
    const [location, setLocation] = useState(form.location);
    const isEditing = editingForm === form.id;

    const handleSave = async () => {
      try {
        await updateFormMutation.mutateAsync({
          id: form.id,
          recipientEmails,
          googleSheetUrl,
          location,
        });
      } catch (error) {
        // Error handled by mutation
      }
    };

    const handleCancel = () => {
      setRecipientEmails(form.recipientEmails.join(', '));
      setGoogleSheetUrl(form.googleSheetUrl || '');
      setLocation(form.location);
      setEditingForm(null);
    };

    return (
      <TableRow key={form.id}>
        <TableCell className="font-medium">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span>{form.displayName}</span>
              <Badge variant={form.isActive ? "default" : "secondary"}>
                {form.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            {form.buttonName && (
              <div className="text-sm text-muted-foreground">
                Button: "{form.buttonName}"
              </div>
            )}
          </div>
        </TableCell>
        <TableCell>
          {isEditing ? (
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select page location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Homepage">Homepage</SelectItem>
                <SelectItem value="Services Page">Services Page</SelectItem>
                <SelectItem value="Contact Page">Contact Page</SelectItem>
                <SelectItem value="About Page">About Page</SelectItem>
                <SelectItem value="Footer">Footer</SelectItem>
                <SelectItem value="Homepage Footer">Homepage Footer</SelectItem>
                <SelectItem value="Footer and Contact Page">Footer and Contact Page</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <span>{location}</span>
          )}
        </TableCell>
        <TableCell>
          {isEditing ? (
            <Input
              value={recipientEmails}
              onChange={(e) => setRecipientEmails(e.target.value)}
              placeholder="admin@growlyft.com, support@growlyft.com"
              className="w-full"
            />
          ) : (
            <span className="text-sm">{form.recipientEmails.join(', ')}</span>
          )}
        </TableCell>
        <TableCell>
          {isEditing ? (
            <Input
              value={googleSheetUrl}
              onChange={(e) => setGoogleSheetUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/..."
              className="w-full"
            />
          ) : (
            <div className="flex items-center space-x-2">
              {form.googleSheetUrl ? (
                <a
                  href={form.googleSheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                >
                  <span className="text-sm truncate max-w-[200px]">View Sheet</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <span className="text-muted-foreground text-sm">No sheet linked</span>
              )}
            </div>
          )}
        </TableCell>
        <TableCell>
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                onClick={handleSave}
                disabled={updateFormMutation.isPending}
                data-testid={`button-save-form-${form.id}`}
              >
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                disabled={updateFormMutation.isPending}
                data-testid={`button-cancel-form-${form.id}`}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEditingForm(form.id)}
              data-testid={`button-edit-form-${form.id}`}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
        </TableCell>
      </TableRow>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading forms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Forms Management</h2>
          <p className="text-muted-foreground">
            Configure form settings, recipients, and Google Sheet integrations for website forms
          </p>
        </div>
      </div>

      {forms.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Forms Found</CardTitle>
            <CardDescription>
              No forms are currently configured. Forms will appear here once they are created.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Website Forms</CardTitle>
            <CardDescription>
              Manage form configurations grouped by page location. Click Edit to modify recipient emails and Google Sheet links.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Form Name & Button</TableHead>
                  <TableHead>Page Location</TableHead>
                  <TableHead>Recipient Email(s)</TableHead>
                  <TableHead>Google Sheet Link</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {forms.map((form) => (
                  <FormRow key={form.id} form={form} />
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Form Submission Flow</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">1</span>
              </div>
              <div>
                <p className="font-medium">User submits form on website</p>
                <p className="text-sm text-muted-foreground">Form data is captured and validated</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">2</span>
              </div>
              <div>
                <p className="font-medium">Email notification sent</p>
                <p className="text-sm text-muted-foreground">All specified recipient emails receive the form data</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">3</span>
              </div>
              <div>
                <p className="font-medium">Data stored in Google Sheet</p>
                <p className="text-sm text-muted-foreground">Form submission is automatically added to the linked Google Sheet (if configured)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}