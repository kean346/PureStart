import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
export function SupportCard() {
  return (
    <Card size="sm" className="group-data-[collapsible=icon]:hidden">
      <CardHeader>
        <CardTitle className="text-sm">Clarity starts here.</CardTitle>
        <CardDescription>
          Analytics & Intelligence
          <br />
          Fictional concept · Built by <span className="text-foreground">paceIT</span>
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
