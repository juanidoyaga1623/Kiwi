import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary mb-4">
            <span className="text-primary-foreground font-bold text-xl">K</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Bienvenido a Kiwi</h1>
          <p className="text-muted-foreground mt-1">
            Invertí en acciones fraccionadas desde $1 USD
          </p>
        </div>
        <SignIn />
      </div>
    </div>
  );
}
