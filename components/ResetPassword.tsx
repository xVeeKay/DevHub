"use client";

import React, { useState } from 'react';
import { SpinnerCustom } from '@/components/ui/spinner'
import { toast } from "sonner"

export const ResetPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData,setFormData]=useState({
    newPassword:"",
    confirmPassword:"",
    currentPassword:""
  })
  const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
    setFormData({
      ...formData,
      [e.target.name]:e.target.value,
    })
  }
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if(formData.newPassword!==formData.confirmPassword){
      setFormData({
        newPassword:"",
        confirmPassword:"",
        currentPassword:""
      })
      toast.error("New Password and confirm password do not match!")
      setIsSubmitting(false)
      return
    }
    try {
      const res=await fetch("/api/user/change-password",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify(formData)
      })
      const data=await res.json()
      if(!res.ok){
        toast.error(data.message)
        return
      }
      toast.success("Password updated successfully")
      setFormData({
        newPassword:"",
        confirmPassword:"",
        currentPassword:""
      })
    } catch (error) {
      toast.error("Something went wrong. Please try again")
    } finally{
      setIsSubmitting(false)
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
      {/* Card Body - Left Aligned */}
      <div className="p-6 md:p-8">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-foreground">
            Change Password
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Update your password to keep your DevHub account secure.
          </p>
        </div>

        <form
          id="password-form"
          onSubmit={handleSubmit}
          className="space-y-4 max-w-md"
        >
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Current Password
            </label>
            <input
              type="password"
              required
              name='currentPassword'
              value={formData.currentPassword}
              onChange={handleChange}
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-border transition-all"
              placeholder="Enter current password"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              New Password
            </label>
            <input
              type="password"
              required
              name='newPassword'
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-border transition-all"
              placeholder="Create new password"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Confirm Password
            </label>
            <input
              type="password"
              required
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-border transition-all"
              placeholder="Create new password"
            />
          </div>
        </form>
      </div>

      {/* Card Footer - Distinct background for the action area */}
      <div className="px-6 py-4 bg-muted/20 border-t border-border flex items-center justify-between">
        <p className="text-xs text-muted-foreground hidden sm:block">
          Ensure your password is at least 8 characters long.
        </p>
        <button
          form="password-form"
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto flex items-center justify-center bg-primary text-white hover:bg-red-700 px-5 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <SpinnerCustom /> Updating...
            </span>
          ) : (
            'Update Password'
          )}
        </button>
      </div>
    </div>
  )
};