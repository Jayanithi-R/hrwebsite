import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"; // adjust path
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ChevronRight, Users2 } from "lucide-react";

export function AttendanceReport({ attendance }) {
  const getBadgeClasses = (status) => {
    switch (status) {
      case "Absent":
        return "bg-gray-200 text-gray-800";
      case "Sick":
        return "bg-orange-200 text-orange-800";
      case "WFH":
        return "bg-blue-200 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Users2 className="h-5 w-5 text-gray-500" />
          <CardTitle className="text-base font-semibold">Attendance Report</CardTitle>
        </div>
        <a href="/attendance">
          <Button variant="link" size="sm" className="h-8 rounded-full">
            See All
            <ChevronRight className="h-4 w-4" />
          </Button>
        </a>
      </CardHeader>

      <CardContent className="space-y-2 pt-4">
        {/* Absent Section */}
        <div>
          <p className="text-xs text-gray-500 mb-2 pb-2 border-b">Absent</p>
          <div className="pt-2">
            {attendance.absent.map((employee) => (
              <div key={employee.id} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={employee.avatar} alt={employee.name} />
                    <AvatarFallback>
                      {employee.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{employee.name}</p>
                    <p className="text-xs text-gray-500">{employee.role}</p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={`font-semibold border-none text-xs rounded-md ${getBadgeClasses(
                    employee.status
                  )}`}
                >
                  {employee.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Present Section */}
        <div>
          <p className="text-xs text-gray-500 mt-4 mb-2 pb-2 border-b">Present</p>
          <div className="pt-2">
            {attendance.present.map((employee) => (
              <div key={employee.id} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={employee.avatar} alt={employee.name} />
                    <AvatarFallback>
                      {employee.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{employee.name}</p>
                    <p className="text-xs text-gray-500">{employee.role}</p>
                  </div>
                </div>
                <Badge className="text-green-600 bg-green-100 font-mono text-sm">
                  {employee.time}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
