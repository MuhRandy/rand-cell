import { cn } from "./utils/util";

export default function App() {
  return (
    <h1
      className={cn(
        "flex justify-center items-center",
        "text-5xl font-bold underline",
        "min-h-screen min-w-[100dvw]"
      )}
    >
      Coming Soon
    </h1>
  );
}
