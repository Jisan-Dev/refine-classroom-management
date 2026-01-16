import { CreateButton } from "@/components/refine-ui/buttons/create";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";

export default function SubjectsList() {
  return (
    <ListView>
      <Breadcrumb />

      <h1 className="page-title">Subjects</h1>

      <div>
        <CreateButton resource="subjects" />
      </div>
    </ListView>
  );
}
