import { cn } from "@/lib/utils"
import { Card, CardContent } from "./card";


export function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

export function CardSkeleton() {
  return (
    <Card className={`animate-pulse relative overflow-hidden bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm`}>
      <div className="flex px-6 pb-2">
        <div className="ml-3 h-6 w-30 rounded-md bg-gray-700" />
      </div>
      <CardContent className="flex items-center justify-center py-8">
        <div className="h-7 w-28 rounded-md bg-gray-700" />
      </CardContent>
    </Card>
  );
}

export function CoursePageContentSkeleton() {
  return (
    <div className="flex justify-center items-center w-full">
      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-5xl">
        {/* Left side: 2 card skeletons empilés */}
        <div className="flex flex-1 flex-col gap-6 min-h-[20vh]">
          <Card
            className={`animate-pulse relative overflow-hidden bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-8 shadow-sm w-full`}
            style={{ height: "20vh", minHeight: 0, maxWidth: "100%" }}
          >
            <div className="flex px-8 pb-2">
              <div className="ml-2 h-6 w-40 rounded-md bg-gray-700" />
            </div>

          </Card>
          <Card
            className={`animate-pulse relative overflow-hidden bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-8 shadow-sm w-full`}
            style={{ height: "40vh", minHeight: 0, maxWidth: "100%" }}
          >
            <div className="flex px-8 pb-2">
              <div className="ml-3 h-6 w-40 rounded-md bg-gray-700" />
            </div>
            <CardContent className="flex items-center justify-center py-10 flex-1">
              <div className="h-7 w-40 rounded-md bg-gray-700" />
            </CardContent>
          </Card>
        </div>
        {/* Right side: 1 card skeleton, prend toute la hauteur de la fenêtre */}
        <div className="flex-1 flex">
          <Card className={`animate-pulse relative overflow-hidden bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-8 shadow-sm w-full h-[50vh] max-w-full`}>
            <div className="flex px-8 pb-2">
              <div className="ml-3 h-6 w-40 rounded-md bg-gray-700" />
            </div>
            <CardContent className="flex items-center justify-center py-10 flex-1">
              <div className="h-7 w-100 rounded-md bg-gray-700" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

