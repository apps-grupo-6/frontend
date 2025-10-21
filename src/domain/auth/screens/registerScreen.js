import { SafeAreaContext } from "react-native";
import { AuthLayout } from "@/domain/auth/components/layout";
import { RegisterForm } from "@/domain/auth/components/registerForm";
import { useRegister } from "@/domain/auth/hooks/useRegister";

export default function RegisterScreen({ navigation }) {
  const { form, setField, submitRegister, loading, errorMsg, successMsg } = useRegister();
  return (
    <SafeAreaContext style={{ flex: 1 }}>
      <AuthLayout>
        <RegisterForm
          form={form}
          setField={setField}
          onSubmit={submitRegister}
          onGoLogin={() => navigation?.goBack?.() || navigation?.navigate?.("Login")}
          loading={loading}
          errorMsg={errorMsg}
          successMsg={successMsg}
        />
      </AuthLayout>
    </SafeAreaContext>
  );
}
