import BrandPanel from "../components/auth/BrandPanel";
import OtpStep from "../components/auth/OtpStep";
import PhoneStep from "../components/auth/PhoneStep";
import ProfileCompletionStep from "../components/auth/ProfileCompletionStep";
import SuccessStep from "../components/auth/SuccessStep";
import { useAuthFlow } from "../hooks/useAuthFlow";

export default function AuthPage() {
  const {
    step,
    phone,
    setPhone,
    otpDigits,
    setOtpDigits,
    secondsLeft,
    isSubmitting,
    errorMessage,
    username,
    setUsername,
    password,
    setPassword,
    password2,
    setPassword2,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    submitPhone,
    submitOtp,
    resendOtp,
    goBackToPhone,
    submitProfileCompletion,
  } = useAuthFlow();

  return (
    <main className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="mx-auto flex min-h-[calc(100vh-32px)] max-w-6xl overflow-hidden rounded-2xl bg-white shadow-sm lg:min-h-[calc(100vh-48px)]">
        <BrandPanel />

        <section className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-sm">
            {step === "phone" && (
              <PhoneStep
                phone={phone}
                onPhoneChange={setPhone}
                onSubmit={submitPhone}
                isSubmitting={isSubmitting}
                errorMessage={errorMessage}
              />
            )}

            {step === "otp" && (
              <OtpStep
                phone={phone}
                otpDigits={otpDigits}
                onOtpChange={setOtpDigits}
                onSubmit={submitOtp}
                onBack={goBackToPhone}
                onResend={resendOtp}
                secondsLeft={secondsLeft}
                isSubmitting={isSubmitting}
                errorMessage={errorMessage}
              />
            )}

            {step === "profileCompletion" && (
              <ProfileCompletionStep
                username={username}
                setUsername={setUsername}
                password={password}
                setPassword={setPassword}
                password2={password2}
                setPassword2={setPassword2}
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                onSubmit={submitProfileCompletion}
                isSubmitting={isSubmitting}
                errorMessage={errorMessage}
              />
            )}

            {step === "success" && <SuccessStep />}
          </div>
        </section>
      </div>
    </main>
  );
}
