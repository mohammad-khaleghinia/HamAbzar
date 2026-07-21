import Button from "../common/Button";
import FormField from "../common/FormField";

export default function ProfileCompletionStep({
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
  onSubmit,
  isSubmitting,
  errorMessage,
}) {
  const passwordsDoNotMatch = password2.length > 0 && password !== password2;
  const isFormValid =
    username.trim() &&
    password &&
    password2 &&
    firstName.trim() &&
    lastName.trim() &&
    !passwordsDoNotMatch;

  return (
    <div>
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-primary-50 text-2xl text-primary-600">
          <i className="fa-solid fa-user-plus" />
        </div>
        <div className="mb-2 text-2xl font-bold text-gray-900">تکمیل اطلاعات کاربری</div>
        <div className="text-base leading-relaxed text-gray-500">
          برای نهایی کردن ثبت‌نام، اطلاعات حساب کاربری خود را تکمیل کنید.
        </div>
      </div>

      <FormField
        label="نام کاربری"
        id="username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="مثال: ali_ahmadi"
        autoComplete="username"
        disabled={isSubmitting}
        required
      />

      <FormField
        label="رمز عبور"
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="رمز عبور خود را وارد کنید"
        autoComplete="new-password"
        disabled={isSubmitting}
        required
      />

      <FormField
        label="تکرار رمز عبور"
        id="password2"
        type="password"
        value={password2}
        onChange={(e) => setPassword2(e.target.value)}
        placeholder="رمز عبور را دوباره وارد کنید"
        autoComplete="new-password"
        disabled={isSubmitting}
        error={passwordsDoNotMatch ? "رمزهای عبور با هم مطابقت ندارند." : null}
        required
      />

      <div className="grid gap-0 sm:grid-cols-2 sm:gap-3">
        <FormField
          label="نام"
          id="firstName"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="نام"
          autoComplete="given-name"
          disabled={isSubmitting}
          required
        />

        <FormField
          label="نام خانوادگی"
          id="lastName"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="نام خانوادگی"
          autoComplete="family-name"
          disabled={isSubmitting}
          required
        />
      </div>

      {errorMessage && (
        <div className="mt-4 flex items-center justify-center gap-1 text-xs text-danger-600">
          <i className="fa-solid fa-circle-exclamation" />
          {errorMessage}
        </div>
      )}

      <Button
        size="lg"
        full
        className="mt-6"
        disabled={!isFormValid || isSubmitting}
        onClick={onSubmit}
      >
        {isSubmitting ? "در حال ثبت‌نام..." : "تکمیل ثبت‌نام"}
      </Button>
    </div>
  );
}
