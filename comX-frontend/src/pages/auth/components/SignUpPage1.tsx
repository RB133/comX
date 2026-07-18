import { useRef, useState } from "react";
import { api } from "@/lib/api-client";
import toast, { Toaster } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { UserData, UserDataSchema } from "@/types/UserProfile";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { ItemPicker } from "@/components/Item-Picker";
import { designation } from "@/lib/designation";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";
import { BottomGradient, LabelInputContainer } from "./SignUpExtraComponents";

const defaultDesignation = "Student";

export default function SignUpFormPage1() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserData>({
    defaultValues: { designation: defaultDesignation },
    resolver: zodResolver(UserDataSchema),
  });

  const [post, setPost] = useState(
    designation
      .find((item) => item.value === defaultDesignation)
      ?.id.toString() ?? "",
  );
  const profilePic = useRef<HTMLInputElement>(null);

  const { mutateAsync: submitForm, isPending } = useMutation({
    mutationFn: async (userData: UserData) => {
      if (profilePic.current?.files?.[0]) {
        userData.file = profilePic.current.files[0];
      }

      return await api.post(`/auth/register`, userData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      navigate("/", { replace: true });
      toast.success("Sign Up Successful");
    },
    onError: (error) => {
      console.error(error);
      toast.error("An error occurred while submitting the form.");
    },
  });

  const onSubmit: SubmitHandler<UserData> = async (data) => {
    const selectedDesignation =
      designation.find((item) => item.id.toString() === post)?.value ??
      defaultDesignation;
    data.designation = selectedDesignation;
    // Errors are already surfaced by the mutation's onError toast.
    await submitForm(data).catch(() => {});
  };

  return (
    <div className="max-w-md sm:w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input border border-slate-300 bg-white w-[80%] translate-y-12">
      <h2 className="font-bold text-xl text-neutral-800">
        Create your ComX account
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2">
        Join your team, collaborate on projects, and stay connected in one
        place.
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
            placeholder="rishitbansal"
            type="text"
            {...register("username", { required: true })}
          />
          {errors.username && (
            <span className="text-xs text-red-500 font-bold">
              {errors.username.message}
            </span>
          )}
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            placeholder="rishitbansal231@gmail.com"
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
          <Label htmlFor="coverImage">Profile Picture</Label>
          <Input id="coverImage" type="file" ref={profilePic} />
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
          <ItemPicker itemList={designation} value={post} setValue={setPost} />
        </LabelInputContainer>

        {isPending ? (
          <Button
            disabled
            className="bg-gradient-to-br relative group/btn from-black to-neutral-600 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] flex justify-center items-center"
          >
            <ReloadIcon className="mr-2 animate-spin w-4 h-4 flex justify-center items-center" />
            Please wait
          </Button>
        ) : (
          <button
            className={`bg-gradient-to-br relative group/btn from-black to-neutral-600 block w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]`}
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
