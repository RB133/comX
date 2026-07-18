import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { CheckCircle, Mail, Phone, MapPin } from "lucide-react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import {
  BottomGradient,
  LabelInputContainer,
} from "@/pages/auth/components/SignUpExtraComponents";

type ContactFormValues = {
  name: string;
  email: string;
  message: string;
};

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    defaultValues: { name: "", email: "", message: "" },
  });

  const onSubmit = async () => {
    // No backend endpoint exists for contact messages yet; this simulates
    // the round-trip so the form's success state can still be demoed.
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSubmitted(true);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-72px)] bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input border border-slate-300 bg-white">
          <h2 className="font-bold text-xl text-neutral-800">Get in Touch</h2>
          <p className="text-neutral-600 text-sm max-w-sm mt-2">
            Questions, feedback, or just want to say hi? Send us a message.
          </p>

          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit(onSubmit)}
                className="my-8"
              >
                <LabelInputContainer className="mb-4">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    {...register("name", { required: "Name is required" })}
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
                    type="email"
                    placeholder="you@example.com"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <span className="text-xs text-red-500 font-bold">
                      {errors.email.message}
                    </span>
                  )}
                </LabelInputContainer>

                <LabelInputContainer className="mb-4">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="How can we help?"
                    rows={4}
                    {...register("message", {
                      required: "Message is required",
                    })}
                  />
                  {errors.message && (
                    <span className="text-xs text-red-500 font-bold">
                      {errors.message.message}
                    </span>
                  )}
                </LabelInputContainer>

                {isSubmitting ? (
                  <button
                    disabled
                    className="bg-gradient-to-br relative group/btn from-black to-neutral-600 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] flex justify-center items-center"
                  >
                    <ReloadIcon className="mr-2 animate-spin w-4 h-4" />
                    Sending...
                  </button>
                ) : (
                  <button
                    className="bg-gradient-to-br relative group/btn from-black to-neutral-600 block w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]"
                    type="submit"
                  >
                    Send Message &rarr;
                    <BottomGradient />
                  </button>
                )}
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center py-8"
              >
                <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-800">
                  Thank you!
                </h3>
                <p className="text-neutral-600 text-sm mt-1">
                  Your message has been sent. We'll get back to you soon.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-gradient-to-r from-transparent via-neutral-300 to-transparent my-8 h-[1px] w-full" />

          <div className="space-y-3 text-sm text-neutral-600">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>contact@example.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>(123) 456-7890</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>123 Web Dev Lane, Internet City, 12345</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
