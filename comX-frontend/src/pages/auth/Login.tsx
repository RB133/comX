import { Background } from "@/components/Background";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "@/state/userDetails/userDetails";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";

const backend_url = import.meta.env.VITE_BACKEND_URL;

export default function LoginPage() {
  return (
    <Background>
      <LoginInForm />
    </Background>
  );
}

function LoginInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { mutateAsync: submitForm, isPending } = useMutation({
    mutationFn: async (loginData: {
      emailOrUsername: string;
      password: string;
    }) => {
      const response = await axios.post(
        `${backend_url}/auth/login`,
        loginData,
        {
          withCredentials: true,
        }
      );
      return response.data;
    },
    onSuccess(data) {
      dispatch(
        setUser({
          name: data.data.name,
          isLoggedIn: true,
          email: data.data.email,
          designation: data.data.designation,
          username: data.data.username,
          id: data.data.id,
          avatar: data.data.avatar,
        })
      );
      toast.success("Logged in successfully!");
      navigate("/dashboard", { replace: true });
    },
    onError(error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Login failed. Please try again.";
        toast.error(errorMessage);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      submitForm({ emailOrUsername: email, password });
    } catch (error) {
      console.log(error);
      toast.error("An error occurred. Please try again.");
    }
  };
  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input border border-slate-300 bg-white dark:bg-black mt-32">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Welcome Back to ComX
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Login to ComX if you can because we don&apos;t have a login flow yet
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Username/Email Address</Label>
          <Input
            id="loginDetails"
            placeholder="iit2023249@iiita.ac.in"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4 text-sm font-bold">
          <Link to="/forgot-password">Forgot Password ?</Link>
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

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

        <div className="flex flex-col space-y-4">
          <button
            className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="submit"
          >
            <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              GitHub
            </span>
            <BottomGradient />
          </button>
          <button
            className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="submit"
          >
            <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              Google
            </span>
            <BottomGradient />
          </button>
        </div>
      </form>
      <Toaster />
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
