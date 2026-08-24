import * as React from "react"

import { cn } from "@/lib/utils"

const Table = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(({ className, ...props }, ref) => (
  <div ref={ref as React.Ref<HTMLDivElement>} className="relative w-full overflow-auto">
    <table
      ref={ref as React.Ref<HTMLTableElement>}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props} />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.ComponentPropsWithoutRef<"thead">>(({ className, ...props }, ref) => (
  <thead ref={ref as React.Ref<HTMLTableSectionElement>} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<HTMLTableSectionElement, React.ComponentPropsWithoutRef<"tbody">>(({ className, ...props }, ref) => (
  <tbody
    ref={ref as React.Ref<HTMLTableSectionElement>}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props} />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.ComponentPropsWithoutRef<"tfoot">>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref as React.Ref<HTMLTableSectionElement>}
    className={cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className)}
    {...props} />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<HTMLTableRowElement, React.ComponentPropsWithoutRef<"tr">>(({ className, ...props }, ref) => (
  <tr
    ref={ref as React.Ref<HTMLTableRowElement>}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props} />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<HTMLTableHeaderCellElement, React.ComponentPropsWithoutRef<"th">>(({ className, ...props }, ref) => (
  <th
    ref={ref as React.Ref<HTMLTableHeaderCellElement>}
    className={cn(
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props} />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<HTMLTableCellElement, React.ComponentPropsWithoutRef<"td">>(({ className, ...props }, ref) => (
  <td
    ref={ref as React.Ref<HTMLTableCellElement> }
    className={cn(
      "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props} />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.ComponentPropsWithoutRef<"caption">>(({ className, ...props }, ref) => (
  <caption
    ref={ref as React.Ref<HTMLTableCaptionElement>}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props} />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
