import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getQueryFn } from "@/lib/queryClient";
import { BarChart3, TrendingUp, Users, Mail, FileText, Clock } from "lucide-react";

interface AnalyticsData {
  totalSubmissions: number;
  recentSubmissions: any[];
  submissionsByForm: Record<string, number>;
}

export default function AdminAnalytics() {
  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ["/api/admin/analytics/submissions"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  if (isLoading) {
    return <div>Loading analytics...</div>;
  }

  // Mock data for demonstration (since we haven't implemented the actual analytics endpoint yet)
  const mockData = {
    totalSubmissions: 147,
    totalBlogPosts: 23,
    activeForms: 6,
    averageResponseTime: "2.3 hours",
    submissionTrend: "+15%",
    topPerformingForm: "Contact Form",
    recentActivity: [
      { type: "Form Submission", form: "Contact Form", time: "2 minutes ago" },
      { type: "Blog Post", action: "Published", title: "Social Media Trends 2024", time: "1 hour ago" },
      { type: "Form Submission", form: "Discovery Call", time: "3 hours ago" },
      { type: "Form Config", action: "Updated", form: "Newsletter Signup", time: "5 hours ago" },
      { type: "Blog Post", action: "Draft Created", title: "Content Strategy Guide", time: "1 day ago" },
    ],
    formPerformance: [
      { name: "Contact Form", submissions: 67, conversionRate: "8.2%" },
      { name: "Discovery Call Form", submissions: 34, conversionRate: "12.1%" },
      { name: "Talk Growth Form", submissions: 28, conversionRate: "6.7%" },
      { name: "Newsletter Signup", submissions: 18, conversionRate: "15.3%" },
    ]
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics & Insights</h2>
        <p className="text-muted-foreground">
          Monitor form submissions, blog performance, and user engagement
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.totalSubmissions}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{mockData.submissionTrend}</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.totalBlogPosts}</div>
            <p className="text-xs text-muted-foreground">
              Published articles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Forms</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.activeForms}</div>
            <p className="text-xs text-muted-foreground">
              Currently accepting submissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.averageResponseTime}</div>
            <p className="text-xs text-muted-foreground">
              Team response time
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Form Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Form Performance</CardTitle>
            <CardDescription>
              Submission counts and conversion rates by form
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockData.formPerformance.map((form) => (
              <div key={form.name} className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{form.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {form.submissions} submissions
                  </p>
                </div>
                <Badge variant="outline" className="text-green-600">
                  {form.conversionRate}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest actions and submissions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockData.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      {activity.type}
                      {activity.action && ` - ${activity.action}`}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {activity.time}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {activity.form || activity.title}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Trends and Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Insights & Recommendations</span>
          </CardTitle>
          <CardDescription>
            Data-driven insights to improve performance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-green-50 p-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2" />
              <div>
                <p className="text-sm font-medium text-green-800">
                  Form Performance Insight
                </p>
                <p className="text-sm text-green-700">
                  Your Newsletter Signup form has the highest conversion rate at 15.3%. 
                  Consider applying similar design patterns to other forms.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Blog Engagement
                </p>
                <p className="text-sm text-blue-700">
                  Posts in the "Tips & Tricks" category receive 40% more engagement. 
                  Consider creating more content in this category.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-orange-50 p-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-600 rounded-full mt-2" />
              <div>
                <p className="text-sm font-medium text-orange-800">
                  Response Time
                </p>
                <p className="text-sm text-orange-700">
                  Your average response time of 2.3 hours is excellent. 
                  Maintaining this speed helps improve customer satisfaction.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}