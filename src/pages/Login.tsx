import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSuccess = (credentialResponse: any) => {
    toast({
      title: "Successfully logged in",
      description: "Welcome back!",
    });
    navigate("/dashboard");
  };

  const handleError = () => {
    toast({
      variant: "destructive",
      title: "Failed to login",
      description: "Please try again",
    });
  };

  return (
    <div className="min-h-screen bg-custom-bg p-4 sm:p-8 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-sm w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            useOneTap
          />
        </div>
      </div>
    </div>
  );
};

export default Login;