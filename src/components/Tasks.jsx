import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"; // adjust path
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Calendar, CheckSquare, Plus } from "lucide-react";

export function Tasks({ tasks }) {
  const getTagColor = (tag) => {
    switch (tag.toLowerCase()) {
      case "pending":
        return "text-orange-800 bg-orange-100 border-transparent";
      case "recruitment":
        return "text-blue-800 bg-blue-100 border-transparent";
      case "important":
        return "text-red-800 bg-red-100 border-transparent";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-base font-semibold">Tasks</CardTitle>
        </div>
        <Button variant="ghost" size="sm" className="h-8 rounded-full">
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </CardHeader>

      <CardContent className="space-y-0 pt-4">
        {tasks.map((task, index) => (
          <div
            key={task.id}
            className={`flex items-start gap-3 py-4 ${
              index < tasks.length - 1 ? "border-b" : ""
            }`}
          >
            <div className="mt-1 flex h-4 w-4 items-center justify-center rounded-full border border-muted-foreground"></div>

            <div className="flex-1 space-y-2">
              <p className="font-medium text-sm">{task.title}</p>

              <div className="flex items-center justify-between mt-2">
                <div>
                  <Badge
                    variant="outline"
                    className={`font-semibold border-none text-xs rounded-md ${getTagColor(
                      task.tag
                    )}`}
                  >
                    {task.tag}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{task.date}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
