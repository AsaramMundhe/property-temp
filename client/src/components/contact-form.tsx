import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { Phone, MessageSquare } from "lucide-react";
import type { InsertLead } from "@shared/schema";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  message: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

interface ContactFormProps {
  propertyId?: number;
  propertyTitle?: string;
}

export default function ContactForm({ propertyId, propertyTitle }: ContactFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const leadData: InsertLead = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message || undefined,
        propertyId: propertyId || undefined,
        source: "website",
        status: "new",
      };
      return api.createLead(leadData);
    },
    onSuccess: () => {
      toast({
        title: "Inquiry Sent Successfully!",
        description: "We'll get back to you within 24 hours.",
      });
      form.reset();
      // Invalidate leads cache for admin
      queryClient.invalidateQueries({ queryKey: ["/api/admin/leads"] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Send Inquiry",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    mutation.mutate(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Show Interest</CardTitle>
        {propertyTitle && (
          <p className="text-sm text-gray-600">For: {propertyTitle}</p>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any specific requirements or questions?"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Sending..." : "Send Inquiry"}
            </Button>
          </form>
        </Form>

        <div className="mt-6 pt-4 border-t space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Call directly:</span>
            <a
              href="tel:+911234567890"
              className="text-blue-600 font-semibold hover:text-blue-700"
            >
              +91 12345 67890
            </a>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">WhatsApp:</span>
            <a
              href="https://wa.me/911234567890"
              className="text-green-600 font-semibold hover:text-green-700 flex items-center"
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Chat Now
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
