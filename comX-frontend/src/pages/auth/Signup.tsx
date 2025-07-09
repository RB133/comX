import { Background } from "@/components/Background";
import { useEffect, useRef } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import SignUpFormPage1 from "./components/SignUpPage1";
import SignUpFormPage2 from "./components/SignUpPage2";

export default function SignUp() {
  const {
    value: currentPage,
    setItem: setCurrentPage,
    getItem: getCurrentPage,
  } = useLocalStorage("page",1);

  useEffect(() => {
    setCurrentPage(getCurrentPage());
    if (currentPage === undefined) setCurrentPage(1);
  });

  const email = useRef(document.createElement("input"));

  return (
    <Background>
      {currentPage === 1 && (
        <SignUpFormPage1 setCurrentPage={setCurrentPage} email={email} />
      )}
      {currentPage === 2 && (
        <SignUpFormPage2 setCurrentPage={setCurrentPage} email={email} />
      )}
    </Background>
  );
}
