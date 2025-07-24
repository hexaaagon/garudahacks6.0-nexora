import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Home() {
  return (
    <div className="text-center center w-[100vw] my-[35vh]">
      {/* <p className="text-4xl font-bold no-underline hover:underline">Claiss</p>
      <p className="mb-3">Educating everyone with AI</p>
      <Link href="./class" className="border-2 rounded-md px-1.5 py-1">
        Start
      </Link> */}
      <div className="flex flex-col justify-center gap-3 w-[100vw] scale-120">
        <div className="mr-3">
          <input type="checkbox" id="question" className="scale-150" />
          <label htmlFor="Question" className="align-midle">
            test
          </label>
        </div>
        <div className="mr-3">
          <input type="checkbox" id="question" className="scale-150" />
          <label htmlFor="Question" className="align-midle">
            test
          </label>
        </div>
        <div className="mr-3">
          <input type="checkbox" id="question" className="scale-150" />
          <label htmlFor="Question" className="align-midle">
            test
          </label>
        </div>
      </div>
    </div>
  );
}
