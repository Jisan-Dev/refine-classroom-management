import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { CreateView } from "@/components/refine-ui/views/create-view";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Separator } from "@/components/ui/separator";
import UploadWidget from "@/components/upload-widget";
import { classSchema } from "@/lib/schema";
import { UploadWidgetValue } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBack } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { Loader2 } from "lucide-react";
import { Controller } from "react-hook-form";
import * as z from "zod";

const teachers = [
  { id: 1, name: "John Smith" },
  { id: 2, name: "Sarah Johnson" },
  { id: 3, name: "Michael Brown" },
  { id: 4, name: "Emily Davis" },
  { id: 5, name: "David Wilson" },
];

const subjects = [
  { id: 1, name: "Biology", code: "BIO" },
  { id: 2, name: "Chemistry", code: "CHM" },
  { id: 3, name: "Physics", code: "PHY" },
  { id: 4, name: "Mathematics", code: "MTH" },
  { id: 5, name: "English Literature", code: "ENG" },
];

export default function Create() {
  const back = useBack();

  const form = useForm({
    resolver: zodResolver(classSchema),
    refineCoreProps: {
      resource: "classes",
      action: "create",
    },
  });

  const {
    control,
    formState: { isSubmitting, errors },
    handleSubmit,
    watch,
  } = form;

  const onSubmit = async (data: z.infer<typeof classSchema>) => {
    try {
      console.log(data);
    } catch (error) {
      console.log("Error creating new classes", error);
    }
  };

  const bannerPublicId = watch("bannerCldPubId");

  const setBannerImage = (file: any, field: any) => {
    if (file) {
      field?.onChange(file.url);
      form.setValue("bannerCldPubId", file.publicId, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } else {
      field?.onChange("");
      form.setValue("bannerCldPubId", "", {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  return (
    <CreateView className="class-view">
      <Breadcrumb />

      <h1 className="page-title">Create a Class</h1>
      <div className="intro-row">
        <p>Provide the required information below to add a class.</p>
        <Button onClick={back}>Go Back</Button>
      </div>

      <Separator />

      <div className="my-4 flex items-center">
        <Card className="class-form-card">
          <CardHeader className="relative z-10">
            <CardTitle className="text-2xl pb-0 font-bold text-gradient-orange">
              Fill out the form
            </CardTitle>
          </CardHeader>

          <Separator />

          <CardContent className="mt-7">
            <Form {...form}>
              <form id="form-rhf-demo" onSubmit={handleSubmit(onSubmit)}>
                <FieldGroup>
                  <Controller
                    name="bannerUrl"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="bannerUrl">
                          Banner Image <span className="text-orange-600">*</span>
                        </FieldLabel>

                        <UploadWidget
                          value={
                            field.value
                              ? { url: field.value, publicId: bannerPublicId ?? "" }
                              : null
                          }
                          onChange={(file: UploadWidgetValue | null) => setBannerImage(file, field)}
                        />
                        {errors.bannerCldPubId && !errors.bannerUrl && (
                          <p className="text-destructive text-sm">
                            {errors.bannerCldPubId.message?.toString()}
                          </p>
                        )}
                        {/* {fieldState.invalid && <FieldError errors={[fieldState.error]} />} */}
                      </Field>
                    )}
                  />

                  <Controller
                    name="name"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="name">
                          Class Name <span className="text-orange-600">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          id="name"
                          aria-invalid={fieldState.invalid}
                          placeholder="Introduction to Biology - Section A"
                          autoComplete="off"
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Controller
                      name="subjectId"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="subject">
                            Subject <span className="text-orange-600">*</span>
                          </FieldLabel>
                          <Select
                            {...field}
                            aria-invalid={fieldState.invalid}
                            onValueChange={(value) => field.onChange(Number(value))}
                            value={field.value?.toString() || ""}
                          >
                            <SelectTrigger id="subject" className="w-full">
                              <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>

                            <SelectContent>
                              {subjects.map((subject) => (
                                <SelectItem key={subject.id} value={subject.id.toString()}>
                                  {subject.name} <code>({subject.code})</code>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />

                    <Controller
                      name="teacherId"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="teacherId">
                            Teacher <span className="text-orange-600">*</span>
                          </FieldLabel>
                          <Select
                            {...field}
                            aria-invalid={fieldState.invalid}
                            onValueChange={field.onChange}
                            value={field.value?.toString() || ""}
                          >
                            <SelectTrigger id="teacherId" className="w-full">
                              <SelectValue placeholder="Select a teacher" />
                            </SelectTrigger>

                            <SelectContent>
                              {teachers.map((teacher) => (
                                <SelectItem key={teacher.id} value={teacher.id.toString()}>
                                  {teacher.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Controller
                      name="capacity"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="capacity">
                            Capacity <span className="text-orange-600">*</span>
                          </FieldLabel>
                          <Input
                            {...field}
                            type="number"
                            min={1}
                            placeholder="30"
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value ? Number(value) : undefined);
                            }}
                            value={(field.value as number | undefined) ?? ""}
                            name={field.name}
                            ref={field.ref}
                            onBlur={field.onBlur}
                            id="capacity"
                          />

                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />

                    <Controller
                      name="status"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="status">
                            Status <span className="text-orange-600">*</span>
                          </FieldLabel>

                          <Select
                            {...field}
                            aria-invalid={fieldState.invalid}
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger id="status" className="w-full">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>

                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>

                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                  </div>

                  <Controller
                    name="description"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="description">
                          Description <span className="text-orange-600">*</span>
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupTextarea
                            {...field}
                            id="description"
                            placeholder="Brief description about the class."
                            rows={6}
                            className="min-h-24 resize-none"
                            aria-invalid={fieldState.invalid}
                            maxLength={1000}
                          />
                          <InputGroupAddon align="block-end">
                            <InputGroupText className="tabular-nums">
                              {field?.value?.length}/1000 characters
                            </InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                        <FieldDescription>
                          Includes a brief description about the class and its purpose.
                        </FieldDescription>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Separator />

                  <Button type="submit" size="lg" className="w-full">
                    {isSubmitting ? (
                      <div className="flex gap-1">
                        <span>Creating Class...</span>
                        <Loader2 className="inline-block ml-2 animate-spin" />
                      </div>
                    ) : (
                      "Create Class"
                    )}
                  </Button>
                </FieldGroup>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </CreateView>
  );
}
