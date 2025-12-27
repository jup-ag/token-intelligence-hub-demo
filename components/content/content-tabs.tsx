import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentCard } from "@/components/content/content-card";
import { TypographyP } from "@/components/ui/typography";
import { type TokenContent } from "@/types/jupiter";

interface ContentTabsProps {
  content: TokenContent[];
}

export function ContentTabs({ content }: ContentTabsProps) {
  // Group content by type
  const contentByType = content.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = [];
    }
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, TokenContent[]>);

  const tabs = [
    { value: "all", label: "All Content", content: content },
    { value: "summary", label: "Summary", content: contentByType.summary || [] },
    { value: "news", label: "News", content: contentByType.news || [] },
    { value: "tweet", label: "Social", content: contentByType.tweet || [] },
    { value: "text", label: "Community", content: contentByType.text || [] },
  ];

  if (content.length === 0) {
    return (
      <div className="text-center py-8">
        <TypographyP className="text-muted-foreground">
          No VRFD content available for this token yet
        </TypographyP>
      </div>
    );
  }

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="space-y-4">
          {tab.content.length === 0 ? (
            <div className="text-center py-8">
              <TypographyP className="text-muted-foreground">
                No {tab.label.toLowerCase()} content available
              </TypographyP>
            </div>
          ) : (
            tab.content.map((item) => <ContentCard key={item.id} content={item} />)
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}

