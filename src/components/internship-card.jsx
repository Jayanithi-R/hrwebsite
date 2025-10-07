import React from "react";
import { Briefcase, Users, ChevronRight } from "lucide-react";

// Placeholder image data
const PlaceHolderImages = [
  { id: "emp1", imageUrl: "https://via.placeholder.com/40", description: "A" },
  { id: "emp2", imageUrl: "https://via.placeholder.com/40", description: "B" },
  { id: "emp3", imageUrl: "https://via.placeholder.com/40", description: "C" },
];

// Custom small UI components
const Card = ({ children, className }) => (
  <div className={`border rounded-xl p-4 shadow-sm bg-white ${className || ""}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className }) => (
  <div className={`flex justify-between items-center border-b pb-2 mb-3 ${className || ""}`}>
    {children}
  </div>
);

const CardContent = ({ children, className }) => (
  <div className={`space-y-4 ${className || ""}`}>{children}</div>
);

const Button = ({ children, variant, size, className, ...props }) => {
  const styles = {
    base: "inline-flex items-center justify-center gap-1 font-medium transition rounded-md",
    outline: "border border-gray-300 bg-transparent hover:bg-gray-100",
    solid: "bg-blue-600 text-white hover:bg-blue-700",
    small: "px-3 py-1 text-sm",
    normal: "px-4 py-2 text-sm",
  };
  return (
    <button
      {...props}
      className={`${styles.base} ${variant === "outline" ? styles.outline : styles.solid} ${
        size === "sm" ? styles.small : styles.normal
      } ${className || ""}`}
    >
      {children}
    </button>
  );
};

const Avatar = ({ src, alt, fallback }) => (
  <div className="inline-block h-8 w-8 rounded-full overflow-hidden ring-2 ring-gray-200 bg-gray-100">
    {src ? (
      <img src={src} alt={alt} className="h-full w-full object-cover" />
    ) : (
      <div className="flex items-center justify-center h-full text-gray-500 text-xs">{fallback}</div>
    )}
  </div>
);

export default function InternshipCard() {
  const avatars = [
    PlaceHolderImages.find((img) => img.id === "emp1"),
    PlaceHolderImages.find((img) => img.id === "emp2"),
    PlaceHolderImages.find((img) => img.id === "emp3"),
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-gray-500" />
          <h2 className="text-base font-semibold">Internship</h2>
        </div>
        <Button variant="outline" size="sm" className="rounded-full">
          Details <ChevronRight className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent>
        <div>
          <p className="text-xs text-gray-500">Total Intern</p>
          <p className="text-2xl font-bold">8 Intern</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2 overflow-hidden">
              {avatars.map((avatar, i) => (
                <Avatar
                  key={i}
                  src={avatar?.imageUrl}
                  alt={avatar?.description}
                  fallback={avatar?.description?.[0]}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500">8 Attended</p>
          </div>

          <Button>View Progress</Button>
        </div>
      </CardContent>
    </Card>
  );
}
