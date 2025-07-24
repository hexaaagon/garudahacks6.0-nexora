import Link from "next/link";

export default function Home() {
  return (
    <div className="text-center center w-[100vw] my-[30vh] border">
      <p className="text-4xl font-bold no-underline transition delay-1000 hover:underline">
        Claiss
      </p>
      <p>Educating everyone with AI</p>
      <Link href="./class" className="border-2 rounded-md p-1 mt-3">
        Start
      </Link>
    </div>
  );
}
