"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useAnalytics } from "./analytics-context";
import { number, percent } from "./analytics-data";
export function TopPages() {
  const { pages, current } = useAnalytics();
  return (
    <Card className="h-full gap-2">
      <CardHeader>
        <CardTitle className="font-normal">Page performance</CardTitle>
        <CardDescription>All {number(current.pageviews)} pageviews, by destination</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <Table className="[&_td:first-child]:pl-4 [&_td:last-child]:pr-4 [&_th:first-child]:pl-4 [&_th:last-child]:pr-4">
          <TableHeader>
            <TableRow>
              <TableHead>Page</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="text-right">Avg time</TableHead>
              <TableHead className="text-right">Share</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.map((page, i) => (
              <TableRow key={page.name} className="noreva-row" style={{ animationDelay: `${650 + i * 65}ms` }}>
                <TableCell className="max-w-28 truncate py-3.5 font-medium" title={page.name}>
                  {page.name}
                </TableCell>
                <TableCell className="text-right tabular-nums">{number(page.value)}</TableCell>
                <TableCell className="text-muted-foreground text-right tabular-nums">
                  {Math.floor(page.time / 60)}m {page.time % 60}s
                </TableCell>
                <TableCell className="text-muted-foreground text-right tabular-nums">
                  {percent((page.value / current.pageviews) * 100)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
