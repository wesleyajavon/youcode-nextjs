"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Typography } from '@/components/ui/typography';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type Course = {
  id: string;
  name: string;
  image?: string;
  presentation?: string;
  users?: any[];
  [key: string]: any;
};

type CoursesTableGenericProps = {
  courses: Course[];
  columns?: { key: string; label: string; render?: (course: Course) => React.ReactNode }[];
  title?: string;
  description?: string;
  renderActions?: (course: Course) => React.ReactNode;
};

export function CoursesTableGeneric({
  courses,
  columns = [
    { key: "name", label: "Name" },
    { key: "presentation", label: "Presentation" },
  ],
  title = "Courses",
  description = "",
  renderActions,
}: CoursesTableGenericProps) {
  const pathname = usePathname();
  const basePath = pathname && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname || "";

  return (
    <Card>
      <CardContent>
        <Typography variant="h2" className="mb-6">{title}</Typography>
        {description && (
          <Typography variant="small" className="mb-6">{description}</Typography>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              {columns.map((col) => (
                <TableHead key={col.key}>{col.label}</TableHead>
              ))}
              {renderActions && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>
                  <Avatar className="rounded h-5 w-5">
                    <AvatarFallback>{course.name[0]}</AvatarFallback>
                    {course.image && (
                      <AvatarImage src={course.image} alt={course.name} />
                    )}
                  </Avatar>
                </TableCell>
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    {col.key === "name" ? (
                      <Link
                        href={`${basePath}/${course.id}`}
                        className="text-primary underline underline-offset-2 hover:text-primary/80 transition"
                      >
                        {col.render ? col.render(course) : course[col.key]}
                      </Link>
                    ) : (
                      col.render ? col.render(course) : course[col.key]
                    )}
                  </TableCell>
                ))}
                {renderActions && (
                  <TableCell>{renderActions(course)}</TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}