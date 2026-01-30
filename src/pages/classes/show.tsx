import { ShowView, ShowViewHeader } from "@/components/refine-ui/views/show-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { bannerPhoto } from "@/lib/cloudinary";
import { ClassDetails } from "@/types";
import { AdvancedImage } from "@cloudinary/react";
import { useShow } from "@refinedev/core";
import { useParams } from "react-router";

export default function ClassesShow() {
  const { id } = useParams<{ id: string }>();
  const classId = id ?? "";

  const { query } = useShow<ClassDetails>({});

  const classDetails = query?.data?.data;
  const { isError, isLoading } = query;

  if (isLoading || isError || !classDetails) {
    return (
      <ShowView className="class-view class-show">
        <ShowViewHeader resource="classes" title="Class Details" />
        <p className="state-message">
          {isLoading
            ? "Loading class details..."
            : isError
              ? "Failed to load class details."
              : "Class details not found."}
        </p>
      </ShowView>
    );
  }

  const teacherName = classDetails?.teacher?.name || "Unknown";
  const teacherInitials = teacherName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const placeholderUrl = `https://placehold.co/600x400?text=${encodeURIComponent(teacherInitials || "NA")}`;

  const {
    name,
    description,
    status,
    capacity,
    bannerUrl,
    bannerCldPubId,
    subject,
    teacher,
    department,
  } = classDetails;

  return (
    <ShowView className="class-view class-show space-y-6">
      <ShowViewHeader resource="classes" title="Class Details" />

      <div className="banner">
        {bannerUrl ? (
          bannerUrl.includes("res.cloudinary.com") && bannerCldPubId ? (
            <AdvancedImage
              className="h-68"
              alt="Class Banner"
              cldImg={bannerPhoto(bannerCldPubId ?? "", name)}
            />
          ) : (
            <img src={bannerUrl} alt={name} loading="lazy" />
          )
        ) : (
          <div className="placeholder" />
        )}
      </div>

      <Card className="details-card">
        {/* Class Details */}
        <div>
          <div className="details-header">
            <div>
              <h1>{name}</h1>
              <p>{description}</p>
            </div>

            <div>
              <Badge variant="outline">{capacity} spots</Badge>
              <Badge variant={status === "active" ? "default" : "secondary"} data-status={status}>
                {status.toUpperCase()}
              </Badge>
            </div>
          </div>

          <div className="details-grid">
            <div className="instructor">
              <p>👨‍🏫 Instructor</p>
              <div>
                <img src={teacher?.image ?? placeholderUrl} alt={teacherName} />

                <div>
                  <p>{teacherName}</p>
                  <p>{teacher?.email}</p>
                </div>
              </div>
            </div>

            <div className="department">
              <p>🏛️ Department</p>

              <div>
                <p>{department?.name}</p>
                <p>{department?.description}</p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Subject Card */}
        <div className="subject">
          <p>📚 Subject</p>

          <div>
            <Badge variant="outline">
              Code: <span>{subject?.code}</span>
            </Badge>
            <p>{subject?.name}</p>
            <p>{subject?.description}</p>
          </div>
        </div>

        <Separator />

        {/* Join Class Section */}
        <div className="join">
          <h2>🎓 Join Class</h2>

          <ol>
            <li>Ask your teacher for the invite code.</li>
            <li>Click on &quot;Join Class&quot; button.</li>
            <li>Paste the code and click &quot;Join&quot;</li>
          </ol>
        </div>

        <Button size="lg" className="w-full">
          Join Class
        </Button>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Enrolled Students</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Students enrolled in this class will be displayed here in table.</p>
          {/* <DataTable table={studentsTable} paginationVariant="simple" /> */}
        </CardContent>
      </Card>
    </ShowView>
  );
}
