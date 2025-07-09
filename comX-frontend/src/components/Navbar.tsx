import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import DarkLightToggleButton from "./Dark-Light-Toggle-Button";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { Avatar } from "./ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "./ui/button";
import { clearUser } from "@/state/userDetails/userDetails";
import { setTab } from "@/state/tab/tabSlice";

function getDesignation(s: string) {
  s;
  return "Software Engineer";
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const loginDetails = useSelector((state: RootState) => state.userDetails);

  const tab = useSelector((state: RootState) => state.tab);

  const menuItems = [
    { id: 1, name: "Home", link: "/" },
    { id: 2, name: "About", link: "/about" },
    { id: 3, name: "Services", link: "/services" },
    { id: 4, name: "Contact", link: "/contact" },
    { id: 5, name: "Dashboard", link: "/dashboard" },
  ];

  const menuVariants = {
    open: {
      transition: { staggerChildren: 0.07, delayChildren: 0.2 },
    },
    closed: {
      transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
  };

  const menuItemVariants = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, velocity: -100 },
      },
    },
    closed: {
      y: 50,
      opacity: 0,
      transition: {
        y: { stiffness: 1000 },
      },
    },
  };

  const dispatch = useDispatch();

  return (
    <nav className="bg-primary p-4 shadow-lg dark:bg-black dark:shadow-[#111]">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-white font-bold text-xl"
          >
            COM-X
          </motion.div>
          <div className="hidden md:flex space-x-6">
            {menuItems.map((item, index) => (
              <Link
                to={item.link}
                key={item.id}
                onClick={() => dispatch(setTab(item.name))}
              >
                <motion.div
                  className={`text-gray-300 hover:text-white transition-colors duration-300 relative group underline-offset-8 ${
                    tab === item.name && "underline"
                  }`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {item.name}
                  <motion.span
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-white origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </Link>
            ))}
          </div>
          <div className="hidden md:flex gap-8">
            <DarkLightToggleButton />
            {!loginDetails.user ? (
              <div className="flex gap-2">
                <Link to="/Login">
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors duration-300"
                  >
                    Login
                  </motion.button>
                </Link>
                <Link to="/SignUp">
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="bg-white text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors duration-300"
                  >
                    Sign Up
                  </motion.button>
                </Link>
              </div>
            ) : (
              <>
                <Link to={`/profile/${loginDetails.user.username}`}>
                  <div className="flex gap-2 justify-center items-center">
                    <Avatar>
                      <AvatarImage
                        src={
                          loginDetails.user.avatar
                            ? loginDetails.user.avatar
                            : "https://github.com/shadcn.png"
                        }
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="text-white flex flex-col justify-center items-center">
                      <p className="font-bold">{loginDetails.user.name}</p>
                      <p>{getDesignation(loginDetails.user.designation)}</p>
                    </div>
                  </div>
                </Link>
                <Button
                  variant="destructive"
                  className="mt-1"
                  onClick={() => dispatch(clearUser())}
                >
                  Logout
                </Button>
              </>
            )}
          </div>
          <div className="md:hidden">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </motion.button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {menuItems.map((item) => (
                <Link
                  to={item.link}
                  key={item.id}
                  onClick={() => dispatch(setTab(item.name))}
                >
                  <motion.div
                    className={`text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 underline-offset-8 ${
                      tab === item.name && "underline"
                    }`}
                    variants={menuItemVariants}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {item.name}
                  </motion.div>
                </Link>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-gray-700">
              <motion.button
                variants={menuItemVariants}
                whileHover={{ y: -2 }}
                whileTap={{ y: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors duration-300 mb-2"
              >
                Login
              </motion.button>
              <motion.button
                variants={menuItemVariants}
                whileHover={{ y: -2 }}
                whileTap={{ y: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="w-full bg-white text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors duration-300"
              >
                Sign Up
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
