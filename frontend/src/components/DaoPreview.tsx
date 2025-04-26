import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Users, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DaoPreviewProps {
  id: string;
  name: string;
  description: string;
  members: number;
  posts: number;
  category: string;
}

const DaoPreview: React.FC<DaoPreviewProps> = ({
  id,
  name,
  description,
  members,
  posts,
  category
}) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 rounded-full bg-thread-gradient flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold">{name}</h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {members} members
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <FileText className="h-3.5 w-3.5" />
                {posts} posts
              </span>
            </div>
          </div>
          <Badge className="ml-auto">{category}</Badge>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full justify-between"
          asChild
        >
          <Link to={`/dao/${id}`}>
            <span>View DAO</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default DaoPreview;
