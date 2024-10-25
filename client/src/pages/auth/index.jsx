import victory from "../../assets/victory.svg";
import chatapp from "../../assets/chatapp.webp"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";

const Auth = () => {
  const navigate = useNavigate();
  const { setUserInfo } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const validateSignup = ()=>{
    if (!email.length) {
      toast.error("Email should not be empty !!!")
      return false;
    }
    if (!password.length) {
      toast.error("Password should not be empty !!!")
      return false;
    }
    if (password != confirmPassword) {
      toast.error("Password & Confirm password should be same")
      return false;
    }
    else{
      return true;
    }
  }
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
  const validateLogin = ()=>{
    if (!email.length) {
      toast.error("Email should not be empty !!!")
      return false;
    }
    if (!password.length) {
      toast.error("Password should not be empty !!!")
      return false;
    }
    else{
      return true;
    }
  }

  let handleLogin = async () => {
    if (validateLogin) {
      try {
        const response = await apiClient.post(LOGIN_ROUTE, { email, password },{withCredentials: true});
        if (!response.data.user) {
          toast.error("Email or password is incorrect !!!")
        }
        if (response.data.user.id) {
          setUserInfo(response.data.user)
          if (response.data.profileSetup) {
            navigate("/chat")
          } else {
            navigate("/profile")
          }
        }
      } catch (error) {
        console.log({error})
        setEmail("");
        setPassword("");
        toast.error("Email or password is incorrect !!!")
      }
    }
  };

  let handleSignup = async () => {
    if (validateSignup() && isValidEmail(email)) {
      try {
        const response = await apiClient.post(SIGNUP_ROUTE, { email, password },{withCredentials: true});
        if (response.status === 201) {
          setUserInfo(response.data.user)
          navigate("/profile")
        }
      } catch (error) {
        toast.error("Error! Please try again, Already have an account please Login")
      }
    }else{
      toast.error("Use a valid Email & strong password")
    }
  };

  return (
    <div className="w-[100vw] h-[100vh] bg-slate-300 flex justify-center items-center ">
      <div className="w-[80vw] h-[80vh] border-2 border-white bg-white shadow-lg text-opacity-90 md:w-[90vw] lg:w-[70vw] rounded-3xl grid xl:grid-cols-2">
        <div className="flex justify-center items-center gap-10 flex-col">
          <div className="flex flex-col items-center justify-center">
            <div className="flex justify-center items-center">
              <h1 className="text-5xl font-bold md:text-6xl">WELCOME</h1>
              <img src={victory} alt="emoji" className="h-[100px]" />
            </div>
            <p className="font-medium text-center">
              Fill the details to get started with the chat app
            </p>
          </div>
          <div className="flex justify-center items-center w-full">
            <Tabs className="w-3/4" defaultValue="signup">
              <TabsList className="bg-transparent w-full rounded-none">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:border-b-purple-500 data-[state=active]:font-bold  p-3 transition-all duration-300"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:border-b-purple-500 data-[state=active]:font-bold  p-3 transition-all duration-300"
                >
                  Create Account{" "}
                </TabsTrigger>
              </TabsList>
              <TabsContent
                className="pt-4 flex flex-col gap-2 items-center"
                value="login"
              >
                <Input
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button className="w-[40%]" onClick={handleLogin}>
                  Login
                </Button>
              </TabsContent>
              <TabsContent className="flex flex-col gap-2 items-center" value="signup">
                <Input
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button className="w-[40%]" onClick={handleSignup}>
                  Create
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
          <div className="hidden xl:flex justify-center items-center">
            <img src={chatapp} alt="" className="h-[450px]"/>
          </div>
      </div>
    </div>
  );
};

export default Auth;
