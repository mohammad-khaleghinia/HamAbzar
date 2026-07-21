import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthFlow } from "../hooks/useAuthFlow";
import BrandPanel from "../components/auth/BrandPanel";
import PhoneStep from "../components/auth/PhoneStep";
import OtpStep from "../components/auth/OtpStep";
import SuccessStep from "../components/auth/SuccessStep";
import { getUserProfile } from "../services/api";

const isProfileComplete = (profile) => {
  return Boolean(
    profile?.first_name?.trim() &&
      profile?.last_name?.trim() &&
      profile?.national_code?.trim()
  );
};

const AuthPage = () => {
  const navigate = useNavigate();
  const { step, verifyPhone, verifyOtp } = useAuthFlow();

  const redirectAfterLogin = async () => {
    try {
      const profile = await getUserProfile();

      if (isProfileComplete(profile)) {
        navigate("/", { replace: true });
      } else {
        navigate("/complete-profile", { replace: true });
      }
    } catch (error) {
      navigate("/complete-profile", { replace: true });
    }
  };

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("access_token");

    if (isAuthenticated) {
      redirectAfterLogin();
    }
  }, []);

  useEffect(() => {
    if (step === "success") {
      redirectAfterLogin();
    }
  }, [step]);

  let CurrentStepComponent;

  switch (step) {
    case "phone":
      CurrentStepComponent = <PhoneStep onSubmit={verifyPhone} />;
      break;
    case "otp":
      CurrentStepComponent = <OtpStep onSubmit={verifyOtp} />;
      break;
    case "success":
      CurrentStepComponent = <SuccessStep />;
      break;
    default:
      CurrentStepComponent = <PhoneStep onSubmit={verifyPhone} />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <BrandPanel />
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-md">
          {CurrentStepComponent}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
