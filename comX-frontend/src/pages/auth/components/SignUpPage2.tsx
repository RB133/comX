import toast, { Toaster } from "react-hot-toast";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@radix-ui/react-label";
import { BottomGradient, LabelInputContainer } from "./SignUpExtraComponenets";

const backend_url = import.meta.env.VITE_BACKEND_URL;

export default function SignUpFormPage2({
  setCurrentPage,
  email,
}: {
  setCurrentPage: (value: unknown) => void;
  email: React.MutableRefObject<HTMLInputElement>;
}) {
  const OTP = useRef(document.createElement("input"));

  const navigate = useNavigate();

  const { mutateAsync: checkOTP, isPending } = useMutation({
    mutationFn: (OTPDetails: { email: string; otp: string }) => {
      return axios.post(`${backend_url}/auth/verify-email-otp`, OTPDetails);
    },
    onSuccess() {
      setCurrentPage(1);
      navigate("/", { replace: true });
      toast.success("Sign Up Successful");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const OTPDetails = {
      email: email.current.value,
      otp: OTP.current.value,
    };
    checkOTP(OTPDetails);
  };

  return (
    <div className="max-w-md sm:w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input border border-slate-300 bg-white dark:bg-black w-[80%] mt-36">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Welcome to E-Commerce
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        SignUp to E-Commerce if you can because we don&apos;t have a sign up
        flow yet
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-8">
          <Label htmlFor="OTP">OTP</Label>
          <InputOTP maxLength={6} ref={OTP}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
            </InputOTPGroup>
            {window.innerWidth > 400 && <InputOTPSeparator />}
            <InputOTPGroup>
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
            </InputOTPGroup>
            {window.innerWidth > 400 && <InputOTPSeparator />}
            <InputOTPGroup>
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </LabelInputContainer>

        <button className="mb-8" type="button" onClick={() => {}}>
          Resend OTP
        </button>

        <button
          className={`bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] mb-2 ${
            isPending &&
            "cursor-not-allowed from-zinc-700 dark:from-zinc-700 dark:to-zinc-700 to-neutral-400"
          }`}
          type="submit"
        >
          Submit &rarr;
          <BottomGradient />
        </button>

        <button
          className={`bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] ${
            isPending &&
            "cursor-not-allowed from-zinc-700 dark:from-zinc-700 dark:to-zinc-700 to-neutral-400"
          }`}
          type="button"
          onClick={() => {
            setCurrentPage(1);
          }}
        >
          &larr; Back 
          <BottomGradient />
        </button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
      </form>
      <Toaster />
    </div>
  );
}
