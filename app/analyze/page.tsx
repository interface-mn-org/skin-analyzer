import { YoucamCameraKit } from "@/components/analysis/youcam-camera-kit";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AnalyzePage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-6xl px-6 py-14">
        <div className="mb-8 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            YouCam Camera Kit
          </p>
          <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
            Арьсны шинжилгээнд зориулсан зураг авалт
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            AI арьсны шинжилгээнд зориулж өндөр чанартай зураг авахын тулд
            чиглүүлсэн зураг авалтыг эхлүүлнэ үү.
          </p>
        </div>
        <YoucamCameraKit />
      </div>
    </div>
  );
}
