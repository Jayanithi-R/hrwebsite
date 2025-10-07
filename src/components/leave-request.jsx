import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"; // adjust path
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"; // adjust path
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar"; // adjust path
import { Badge } from "./ui/badge"; // adjust path
import { Button } from "./ui/button"; // adjust path
import { Input } from "./ui/input"; // adjust path
import { MoreHorizontal, Search, Users2, ChevronRight } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"; // adjust path

export function LeaveRequests({ leaveRequests }) {
  const getStatusClasses = (status) => {
    switch (status) {
      case "Pending":
        return "bg-orange-100 text-orange-600 border-orange-200";
      case "Approved":
        return "bg-green-100 text-green-600 border-green-200";
      case "Rejected":
        return "bg-red-100 text-red-600 border-red-200";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusDotClasses = (status) => {
    switch (status) {
      case "Pending":
        return "bg-orange-500";
      case "Approved":
        return "bg-green-500";
      case "Rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between pb-2 gap-2">
        <div className="flex items-center gap-2">
          <Users2 className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-base font-semibold">Leave Requests</CardTitle>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-9 h-8 rounded-md bg-secondary sm:w-40"
            />
          </div>
          <Button variant="link" size="sm" className="h-8 rounded-full">
            See All
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Employee</TableHead>
                <TableHead className="text-xs hidden lg:table-cell">Leave Type</TableHead>
                <TableHead className="text-xs hidden md:table-cell">Date</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {leaveRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="py-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={request.employee.avatar} alt={request.employee.name} />
                        <AvatarFallback>
                          {request.employee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{request.employee.name}</p>
                        <p className="text-xs text-muted-foreground">{request.employee.role}</p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="py-2 hidden lg:table-cell">
                    <p className="text-sm font-medium">{request.leaveType}</p>
                  </TableCell>

                  <TableCell className="py-2 hidden md:table-cell">
                    <p className="text-sm text-muted-foreground">{request.dateRange}</p>
                  </TableCell>

                  <TableCell className="py-2">
                    <Badge
                      variant="outline"
                      className={`capitalize flex items-center gap-1.5 font-semibold py-1 px-2.5 rounded-full text-xs ${getStatusClasses(
                        request.status
                      )}`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${getStatusDotClasses(request.status)}`}
                      ></span>
                      {request.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right py-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Approve</DropdownMenuItem>
                        <DropdownMenuItem>Reject</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
