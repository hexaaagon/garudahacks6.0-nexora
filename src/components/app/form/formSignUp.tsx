import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function FormSignUp() {
  return (
    <Card className="w-full max-w-sm shadow-md">
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="me@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-left">
                <Label htmlFor="Role">Role</Label>
              </div>
              <select
                name="Role"
                id="Role"
                className="border rounded-md p-2 ring-0 outline-none focus:outline-none"
              >
                <option value="1">Option</option>
                <option value="2">Teacher</option>
                <option value="3">Student</option>
              </select>
            </div>
            <div className="grid gap-2">
              <div className="flex items-left">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input id="password" type="password" required />
            </div>
            <div>
              <div className="flex items-left">
                <Label htmlFor="password">Confirm Password</Label>
              </div>
              <Input id="password" type="password" required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full">
          Sign up
        </Button>
        <Button variant="outline" className="w-full">
          Sign up with Google
        </Button>
      </CardFooter>
    </Card>
  );
}
