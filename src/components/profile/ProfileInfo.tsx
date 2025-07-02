"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ApiErrorResponse, UserProfile } from "@/lib/types";
import {
  focusManager,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { changeUserPassword, updateUser } from "@/lib/api/user";
import { ImageUpload } from "./uploadImage";

interface ProfileInfoProps {
  user: UserProfile;
}

export default function ProfileInfo({ user }: ProfileInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);
  const [image, setImage] = useState<string>(user?.image || "");

  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      toast.success("Profile info updated sucessfully");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error) => {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorMessage = axiosError.response?.data?.message;
      toast.error(`Error while updating info: ${errorMessage}`);
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: changeUserPassword,
    onSuccess: () => {
      toast.success(
        "Password reset link sent sucessfully please check your inbox"
      );
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error) => {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorMessage = axiosError.response?.data?.message;
      console.log("errorMessage", errorMessage);
      toast.error(
        `Error while sending reset password link, please try again: ${errorMessage}`
      );
    },
  });

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

  const handleImagesChange = (newImages: string) => {
    console.log("image url", newImages);
    setImage(newImages);
  };

  const handlePasswordChange = (email: string) => {
    changePasswordMutation.mutate(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, address } = formData;

    const payload = { name, email, address, image };

    console.log("payload", payload);
    mutation.mutate(payload);

    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-muted p-6 rounded-lg">
        <h2 className="text-lg font-medium mb-2">Profile Image</h2>
        <div className="flex justify-between ">
          <div>
            <ImageUpload
              image={image}
              onChange={handleImagesChange}
              onRemove={() => setImage("")}
            />
          </div>
          <div>
            <Button onClick={handleSubmit}>Save</Button>
          </div>
        </div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Personal Information</h2>
          {!isEditing && (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          )}
        </div>

        {isEditing ? (
          <form className="space-y-4">
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

      <div className="bg-muted p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Default Address</h2>
          {!isEditing && (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              {user?.address?.street ||
              user?.address?.city ||
              user?.address?.zipCode
                ? "Edit"
                : "Add"}
            </Button>
          )}
        </div>

        {isEditing ? (
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address.street">Street Address</Label>
              <Input
                id="address.street"
                name="address.street"
                value={formData?.address?.street}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address.city">City</Label>
                <Input
                  id="address.city"
                  name="address.city"
                  value={formData?.address?.city}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address.state">State</Label>
                <Input
                  id="address.state"
                  name="address.state"
                  value={formData?.address?.state}
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
                  value={formData?.address?.zipCode}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address.country">Country</Label>
                <Input
                  id="address.country"
                  name="address.country"
                  value={formData?.address?.country}
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
            </div>
          </form>
        ) : (
          <div className="space-y-1">
            <p className="font-medium">{user.name}</p>
            <p>{user.address?.street}</p>
            <p>
              {user.address?.city}, {user.address?.state}{" "}
              {user.address?.zipCode}
            </p>
            <p>{user.address?.country}</p>
          </div>
        )}
      </div>

      <div className="bg-muted/30 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Password</h2>
          <Button
            variant="outline"
            onClick={() => handlePasswordChange(user.email)}
            disabled={changePasswordMutation.isPending}
            className="cursor-pointer"
          >
            Change Password
          </Button>
        </div>
        <p className="text-muted-foreground">••••••••••••</p>
      </div>
    </div>
  );
}
