import { DynamicForm } from "./DynamicForm";

export function ProgramApplicationForm({
  defaultProgram,
}: {
  defaultProgram?: string | undefined;
}) {
  return <DynamicForm form="programme" defaultProgramme={defaultProgram} />;
}
