import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ADD_NEW_USER, UPDATE_USER } from "@/graphql/mutations"; // We'll define these next
import { CreateUserSchema, UpdateUserSchema } from "@/lib/userSchema";
import { useMutation } from "@apollo/client/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const today = new Date().toISOString().split("T")[0];

export function EditUserDetailsForm({ user, onClose, refetchUsers }) {
  const isEditing = !!user;
  const schema = isEditing ? UpdateUserSchema : CreateUserSchema;

  const [mutateUser, { loading: mutationLoading, error: mutationError }] =
    useMutation(isEditing ? UPDATE_USER : ADD_NEW_USER);

  const defaultResolver = {
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name || "",
      username: user?.username || "",
      gender: user?.gender || "male",
      role: user?.role || "EMPLOYEE",
      dateOfBirth: user?.dateOfBirth
        ? new Date(user.dateOfBirth).toISOString().split("T")[0]
        : today,
      className: user?.className || "",
      subjects: user?.subjects || [],
    },
  };

  const form = useForm(
    isEditing
      ? defaultResolver
      : {
          ...defaultResolver,
          defaultValues: { ...defaultResolver.defaultValues, password: "" },
        }
  );

  const onSubmit = async (values) => {
    try {
      const input = Object.fromEntries(
        Object.entries(values).filter(([_, v]) => v !== "" && v !== undefined)
      );

      const variables = isEditing
        ? { userId: user._id, userData: input }
        : { userData: input };

      await mutateUser({ variables });

      refetchUsers();
      onClose();
    } catch (error) {
      console.error("Mutation failed:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input type="date" max={today} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="EMPLOYEE">Employee</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {isEditing ? "New Password (Optional)" : "Password"}
                </FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-lg font-semibold mb-3">
            Academic Details (Optional)
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="className"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class/Department Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subjects"
              render={({ field }) => {
                const [subjectInput, setSubjectInput] = useState(
                  field.value?.join(", ") || ""
                );

                useEffect(() => {
                  setSubjectInput(field.value?.join(", ") || "");
                }, [field.value]);

                const handleBlur = () => {
                  const arrayValue = subjectInput
                    .split(",")
                    .map((s) => s.trim())
                    .filter((s) => s);

                  field.onChange(arrayValue);
                };
                return (
                  <FormItem>
                    <FormLabel>Subjects</FormLabel>
                    <FormControl>
                      <Input
                        value={subjectInput}
                        onChange={(e) => setSubjectInput(e.target.value)}
                        onBlur={handleBlur}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full mt-6"
          disabled={mutationLoading}
        >
          {mutationLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />{" "}
              {isEditing ? "Save Changes" : "Create User"}
            </>
          )}
        </Button>
        {mutationError && (
          <p className="text-red-500 text-sm mt-2">{mutationError.message}</p>
        )}
      </form>
    </Form>
  );
}
