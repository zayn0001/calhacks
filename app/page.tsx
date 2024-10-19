import Image from "next/image";
import Link from "next/link";
import { BackgroundLines } from "@/components/ui/background-lines";
export default function Home() {
  return (
    <div>
      <BackgroundLines className="h-screen">
        <h1>Home!!!</h1>
      </BackgroundLines>
    </div>
  );
}
