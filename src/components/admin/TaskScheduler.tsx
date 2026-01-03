import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Trash2, 
  Loader2,
  Clock,
  Mail,
  CheckCircle,
  Bell,
  Edit2
} from "lucide-react";

interface ScheduledTask {
  id: string;
  title: string;
  description: string | null;
  task_type: string;
  scheduled_at: string;
  email_recipients: string[] | null;
  email_subject: string | null;
  email_body: string | null;
  reminder_before_minutes: number;
  reminder_sent: boolean;
  is_completed: boolean;
  created_at: string;
}

const TaskScheduler = () => {
  const [tasks, setTasks] = useState<ScheduledTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [editingTask, setEditingTask] = useState<ScheduledTask | null>(null);
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [taskType, setTaskType] = useState("reminder");
  const [scheduledTime, setScheduledTime] = useState("");
  const [emailRecipients, setEmailRecipients] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [reminderMinutes, setReminderMinutes] = useState("30");
  
  const { toast } = useToast();

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("scheduled_tasks")
        .select("*")
        .order("scheduled_at", { ascending: true });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setTaskType("reminder");
    setScheduledTime("");
    setEmailRecipients("");
    setEmailSubject("");
    setEmailBody("");
    setReminderMinutes("30");
    setEditingTask(null);
  };

  const openEditDialog = (task: ScheduledTask) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description || "");
    setTaskType(task.task_type);
    setScheduledTime(new Date(task.scheduled_at).toTimeString().slice(0, 5));
    setSelectedDate(new Date(task.scheduled_at));
    setEmailRecipients(task.email_recipients?.join(", ") || "");
    setEmailSubject(task.email_subject || "");
    setEmailBody(task.email_body || "");
    setReminderMinutes(String(task.reminder_before_minutes || 30));
    setIsDialogOpen(true);
  };

  const saveTask = async () => {
    if (!title || !selectedDate || !scheduledTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const scheduledAt = new Date(selectedDate);
      const [hours, minutes] = scheduledTime.split(":");
      scheduledAt.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const recipients = emailRecipients
        .split(",")
        .map(e => e.trim())
        .filter(e => e);

      const taskData = {
        title,
        description: description || null,
        task_type: taskType,
        scheduled_at: scheduledAt.toISOString(),
        email_recipients: recipients.length > 0 ? recipients : null,
        email_subject: emailSubject || null,
        email_body: emailBody || null,
        reminder_before_minutes: parseInt(reminderMinutes),
        created_by: user?.id,
      };

      if (editingTask) {
        const { error } = await supabase
          .from("scheduled_tasks")
          .update(taskData)
          .eq("id", editingTask.id);

        if (error) throw error;
        toast({ title: "Task Updated", description: "Task has been updated successfully." });
      } else {
        const { error } = await supabase
          .from("scheduled_tasks")
          .insert(taskData);

        if (error) throw error;
        toast({ title: "Task Created", description: "Task has been scheduled successfully." });
      }

      resetForm();
      setIsDialogOpen(false);
      fetchTasks();
    } catch (error) {
      console.error("Error saving task:", error);
      toast({
        title: "Error",
        description: "Failed to save task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from("scheduled_tasks")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setTasks(tasks.filter(t => t.id !== id));
      toast({ title: "Task Deleted", description: "Task has been removed." });
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({
        title: "Error",
        description: "Failed to delete task.",
        variant: "destructive",
      });
    }
  };

  const toggleComplete = async (task: ScheduledTask) => {
    try {
      const { error } = await supabase
        .from("scheduled_tasks")
        .update({ is_completed: !task.is_completed })
        .eq("id", task.id);

      if (error) throw error;

      setTasks(tasks.map(t => 
        t.id === task.id ? { ...t, is_completed: !t.is_completed } : t
      ));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.scheduled_at);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];
  const upcomingTasks = tasks.filter(t => !t.is_completed && new Date(t.scheduled_at) > new Date()).slice(0, 5);

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Calendar */}
      <Card className="lg:col-span-2 border-border/50 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary" />
                Task Scheduler
              </CardTitle>
              <CardDescription>Schedule tasks and email reminders</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Task
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingTask ? "Edit Task" : "Create New Task"}</DialogTitle>
                  <DialogDescription>
                    Schedule a task or email reminder
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Title *</Label>
                    <Input
                      placeholder="Task title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Task description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Task Type</Label>
                      <Select value={taskType} onValueChange={setTaskType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="reminder">Reminder</SelectItem>
                          <SelectItem value="meeting">Meeting</SelectItem>
                          <SelectItem value="deadline">Deadline</SelectItem>
                          <SelectItem value="follow-up">Follow-up</SelectItem>
                          <SelectItem value="email">Send Email</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Time *</Label>
                      <Input
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Reminder Before</Label>
                    <Select value={reminderMinutes} onValueChange={setReminderMinutes}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="1440">1 day</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {(taskType === "email" || taskType === "meeting") && (
                    <>
                      <div className="space-y-2">
                        <Label>Email Recipients (comma separated)</Label>
                        <Input
                          placeholder="email1@example.com, email2@example.com"
                          value={emailRecipients}
                          onChange={(e) => setEmailRecipients(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Email Subject</Label>
                        <Input
                          placeholder="Email subject"
                          value={emailSubject}
                          onChange={(e) => setEmailSubject(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Email Body</Label>
                        <Textarea
                          placeholder="Email content"
                          value={emailBody}
                          onChange={(e) => setEmailBody(e.target.value)}
                          rows={4}
                        />
                      </div>
                    </>
                  )}

                  <Button
                    className="w-full"
                    onClick={saveTask}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {editingTask ? "Update Task" : "Create Task"}
                      </>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={{
                hasTasks: tasks.map(t => new Date(t.scheduled_at)),
              }}
              modifiersStyles={{
                hasTasks: { 
                  backgroundColor: "hsl(var(--primary) / 0.1)",
                  fontWeight: "bold"
                },
              }}
            />

            <div className="flex-1">
              <h3 className="font-semibold mb-4">
                Tasks for {selectedDate?.toLocaleDateString("en-IN", { 
                  weekday: "long",
                  day: "numeric",
                  month: "long"
                })}
              </h3>
              
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : selectedDateTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-2 opacity-20" />
                  <p>No tasks scheduled</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDateTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-3 rounded-lg border ${
                        task.is_completed 
                          ? "bg-muted/30 border-muted" 
                          : "bg-card border-border/50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => toggleComplete(task)}
                            className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              task.is_completed 
                                ? "bg-green-500 border-green-500" 
                                : "border-muted-foreground"
                            }`}
                          >
                            {task.is_completed && (
                              <CheckCircle className="w-3 h-3 text-white" />
                            )}
                          </button>
                          <div>
                            <p className={`font-medium ${task.is_completed ? "line-through text-muted-foreground" : ""}`}>
                              {task.title}
                            </p>
                            {task.description && (
                              <p className="text-sm text-muted-foreground">{task.description}</p>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                <Clock className="w-3 h-3 mr-1" />
                                {new Date(task.scheduled_at).toLocaleTimeString("en-IN", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </Badge>
                              {task.email_recipients && task.email_recipients.length > 0 && (
                                <Badge variant="outline" className="text-xs">
                                  <Mail className="w-3 h-3 mr-1" />
                                  {task.email_recipients.length} recipients
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(task)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTask(task.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Tasks */}
      <Card className="border-border/50 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-secondary/30 to-secondary/10">
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Upcoming
          </CardTitle>
          <CardDescription>Next scheduled tasks</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {upcomingTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p>No upcoming tasks</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 rounded-lg border border-border/50 hover:bg-muted/30 cursor-pointer"
                  onClick={() => {
                    setSelectedDate(new Date(task.scheduled_at));
                  }}
                >
                  <p className="font-medium text-sm">{task.title}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    {formatDateTime(task.scheduled_at)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskScheduler;
