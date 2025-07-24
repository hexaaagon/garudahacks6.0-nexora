import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CardClass({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="max-w-64 shadow-md rounded-md transition duration-300 hover:scale-103">
      <CardHeader>
        <div className="font-bold text-2xl border-b">
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
