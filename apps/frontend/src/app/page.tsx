import Link from "next/link";

export default function Home() {
  return (
    <div className="items-center my-[20vh]">
      <p className="text-xl font-bold hover:underline">claiss</p>
      <p>Web education</p>
      <Link href="./class" className="border rounded">
        Start
      </Link>
    </div>
  );
}
