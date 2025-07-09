import React, { useRef, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { UserData, UserDataSchema } from "@/types/UserProfile";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { ItemPicker } from "@/components/Item-Picker";
import { designation } from "@/lib/destignation";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { BottomGradient, LabelInputContainer } from "./SignUpExtraComponenets";

const backend_url = import.meta.env.VITE_BACKEND_URL;

export default function SignUpFormPage1({
  setCurrentPage,
  email,
}: {
  setCurrentPage: (value: number) => void;
  email: React.MutableRefObject<HTMLInputElement>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserData>({
    defaultValues: { designation: "Student" },
    resolver: zodResolver(UserDataSchema),
  });

  const [post, setPost] = useState("");
  const profilePic = useRef<HTMLInputElement>(null);

  const { mutateAsync: submitForm, isPending } = useMutation({
    mutationFn: async (userData: UserData) => {
      if (profilePic.current?.files?.[0]) {
        userData.file = profilePic.current.files[0];
      }

      return await axios.post(`${backend_url}/auth/register`, userData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      setCurrentPage(2);
    },
    onError: (error) => {
      console.error(error);
      toast.error("An error occurred while submitting the form.");
    },
  });

  const onSubmit: SubmitHandler<UserData> = async (data) => {
    try {
      toast.success("Form Submitted");
      email.current.value = data.email;
      await submitForm(data);
    } catch (e) {
      console.error(e);
      toast.error("An issue occurred during form submission.");
    }
  };

  return (
    <div className="max-w-md sm:w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input border border-slate-300 bg-white dark:bg-black w-[80%] translate-y-12">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Welcome to E-Commerce
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        SignUp to E-Commerce if you can because we don&apos;t have a sign up
        flow yet
      </p>

      <form className="my-8" onSubmit={handleSubmit(onSubmit)}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="Rishit Bansal"
            type="text"
            {...register("name", { required: true })}
          />
          {errors.name && (
            <span className="text-xs text-red-500 font-bold">
              {errors.name.message}
            </span>
          )}
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            placeholder="Rishit-133"
            type="text"
            {...register("username", { required: true })}
          />
          {errors.name && (
            <span className="text-xs text-red-500 font-bold">
              {errors.name.message}
            </span>
          )}
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            placeholder="rishitbansal133@gmail.com"
            type="email"
            {...register("email", { required: true })}
          />
          {errors.email && (
            <span className="text-xs text-red-500 font-bold">
              {errors.email.message}
            </span>
          )}
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="coverImage">Cover Image</Label>
          <Input
            id="coverImage"
            placeholder=""
            type="file"
            ref={profilePic}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            {...register("password", { required: true })}
          />
          {errors.password && (
            <span className="text-xs text-red-500 font-bold">
              {errors.password.message}
            </span>
          )}
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Confirm Password</Label>
          <Input
            id="ConfirmPassword"
            placeholder="••••••••"
            type="password"
            {...register("confirmPassword", { required: true })}
          />
          {errors.confirmPassword && (
            <span className="text-xs text-red-500 font-bold">
              {errors.confirmPassword.message}
            </span>
          )}
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Designation</Label>
          <ItemPicker itemList={designation} 
          value={post} setValue={setPost}
           />
        </LabelInputContainer>

        {isPending ? (
          <Button
            disabled
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] flex justify-center items-center"
          >
            <ReloadIcon className="mr-2 animate-spin w-4 h-4 flex justify-center items-center" />
            Please wait
          </Button>
        ) : (
          <button
            className={`bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]`}
            type="submit"
          >
            Next &rarr;
            <BottomGradient />
          </button>
        )}
      </form>
      <Toaster />
    </div>
  );
}
