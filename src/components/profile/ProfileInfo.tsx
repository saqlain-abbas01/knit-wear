"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface User {
  name: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

interface ProfileInfoProps {
  user: User;
  updateUserInfo: (info: Partial<User>) => void;
}

export default function ProfileInfo({
  user,
  updateUserInfo,
}: ProfileInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...(formData[parent as keyof typeof formData] as Record<
            string,
            unknown
          >),
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserInfo(formData);
    setIsEditing(false);
    toast.success("Profile updated successfully");
  };

  return (
    <div className="space-y-6">
      <div className="bg-muted/30 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Personal Information</h2>
          {!isEditing && (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setFormData(user);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email Address</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-muted/30 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Default Address</h2>
          {!isEditing && (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address.street">Street Address</Label>
              <Input
                id="address.street"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address.city">City</Label>
                <Input
                  id="address.city"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address.state">State</Label>
                <Input
                  id="address.state"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address.zipCode">Zip Code</Label>
                <Input
                  id="address.zipCode"
                  name="address.zipCode"
                  value={formData.address.zipCode}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address.country">Country</Label>
                <Input
                  id="address.country"
                  name="address.country"
                  value={formData.address.country}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setFormData(user);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        ) : (
          <div className="space-y-1">
            <p className="font-medium">{user.name}</p>
            <p>{user.address.street}</p>
            <p>
              {user.address.city}, {user.address.state} {user.address.zipCode}
            </p>
            <p>{user.address.country}</p>
          </div>
        )}
      </div>

      <div className="bg-muted/30 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Password</h2>
          <Button variant="outline">Change Password</Button>
        </div>
        <p className="text-muted-foreground">••••••••••••</p>
      </div>
    </div>
  );
}
