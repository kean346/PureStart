import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
export function SupportCard() {
  return (
    <Card size="sm" className="group-data-[collapsible=icon]:hidden">
      <CardHeader>
        <CardTitle className="text-sm">A little care. A lot of shine.</CardTitle>
        <CardDescription>
          Winglo Cleaning Services
          <br />
          Demo Data · Simulation Only · <span className="text-foreground">Local browser storage</span>
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
