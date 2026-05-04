import type {
  CompleteTaskInput,
  CompleteTaskResult,
  CreateProjectInput,
  CreateProjectResult,
  CreateTaskInput,
  CreateTaskResult,
  CreateUserInput,
  CreateUserResult,
  DeleteTaskInput,
  DeleteTaskResult,
  DownloadTaskExportInput,
  DownloadTaskExportResult,
  ExportTasksInput,
  ExportTasksResult,
  GetProjectInput,
  GetProjectResult,
  GetTaskExportJobInput,
  GetTaskExportJobResult,
  GetTaskInput,
  GetTaskResult,
  GetUserInput,
  GetUserResult,
  ListProjectsInput,
  ListProjectsResult,
  ListTasksInput,
  ListTasksResult,
  ListUsersInput,
  ListUsersResult,
  LookupOption,
  MarkExportJobCompletedInput,
  MarkExportJobCompletedResult,
  UpdateProjectInput,
  UpdateProjectResult,
  UpdateTaskInput,
  UpdateTaskResult,
  UpdateUserInput,
  UpdateUserResult,
} from "./types";

export interface TodoRepository {
  createTask(input: CreateTaskInput): Promise<CreateTaskResult>;
  getTask(input: GetTaskInput): Promise<GetTaskResult>;
  updateTask(input: UpdateTaskInput): Promise<UpdateTaskResult>;
  completeTask(input: CompleteTaskInput): Promise<CompleteTaskResult>;
  listTasks(input: ListTasksInput): Promise<ListTasksResult>;
  deleteTask(input: DeleteTaskInput): Promise<DeleteTaskResult>;
  exportTasks(input: ExportTasksInput): Promise<ExportTasksResult>;
  getTaskExportJob(input: GetTaskExportJobInput): Promise<GetTaskExportJobResult>;
  downloadTaskExport(input: DownloadTaskExportInput): Promise<DownloadTaskExportResult>;
  listProjects(input: ListProjectsInput): Promise<ListProjectsResult>;
  getProject(input: GetProjectInput): Promise<GetProjectResult>;
  createProject(input: CreateProjectInput): Promise<CreateProjectResult>;
  updateProject(input: UpdateProjectInput): Promise<UpdateProjectResult>;
  listUsers(input: ListUsersInput): Promise<ListUsersResult>;
  getUser(input: GetUserInput): Promise<GetUserResult>;
  createUser(input: CreateUserInput): Promise<CreateUserResult>;
  updateUser(input: UpdateUserInput): Promise<UpdateUserResult>;
  listProjectOptions(): Promise<LookupOption[]>;
  listUserOptions(): Promise<LookupOption[]>;
  downloadTaskExport(input: DownloadTaskExportInput): Promise<DownloadTaskExportResult>;
  markExportJobCompleted(input: MarkExportJobCompletedInput): Promise<MarkExportJobCompletedResult>;
}
