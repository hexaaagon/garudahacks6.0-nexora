import Link from "next/link";

export default function Card(props: {
  orderId: string;
  name: string;
  location: string;
  date: string;
  detail: string;
}) {
  return (
    <Link href="./reseller/{orderId}">
      <section className="inline-block shadow-md border rounded-md p-4 max-w-64">
        <p className="text-lg underline mb-2">{props.orderId}</p>
        <p className="text-2xl font-bold mb-2">{props.name}</p>
        <p className="text-gray mb-1">
          {props.location} - {props.date}
        </p>
        <p className="font-justify">{props.detail}</p>
      </section>
    </Link>
  );
}
