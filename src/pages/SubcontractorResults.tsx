import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, CheckCircle, MapPin, Calendar, DollarSign, Building, TrendingUp, Target, Users } from "lucide-react";
import { useEffect, useState } from "react";

// Interface for matching project data from backend
interface MatchedProject {
  project_name: string;
  location: string;
  budget_range: string;
  deadline: string;
  trades: string[];
  priority: number;
  trade_match_score: number;
  matched_trade: string;
  similarity_score: number;
  confidence_level: string;
  related_trades_count: number;
  matching_trades: string[];
  description_match_score: number;
  description_similarity: number;
}

const SubcontractorResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [matchingTrades, setMatchingTrades] = useState<MatchedProject[]>([]);
  const [userInfo, setUserInfo] = useState<{name: string; trade: string; location: string} | null>(null);

  useEffect(() => {
    const state = location.state as { matchingTrades: MatchedProject[]; userInfo: {name: string; trade: string; location: string} };
    
    if (state && state.matchingTrades) {
      setMatchingTrades(state.matchingTrades);
      setUserInfo(state.userInfo);
    } else {
      navigate("/subcontractor");
    }
  }, [location.state, navigate]);

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "Exact Match":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "Very High":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "High":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "Medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "Low":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 80) return "bg-green-500/10 text-green-600 border-green-500/20";
    if (priority >= 60) return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    if (priority >= 40) return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    return "bg-orange-500/10 text-orange-500 border-orange-500/20";
  };

  if (matchingTrades.length === 0) {
    return (
      <div className="min-h-screen bg-background p-4 text-foreground">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/subcontractor")}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">No Matches Found</h1>
              <p className="text-foreground mt-1">Please try again with different criteria</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="container mx-auto max-w-6xl">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/subcontractor")}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
              Matching Complete
            </h1>
            <p className="text-sm text-muted-foreground">
              We found <strong>{matchingTrades.length}</strong> high-quality trade opportunities that match your{" "}<strong>{userInfo?.trade}</strong> specialization in <strong>{userInfo?.location}</strong>
            </p>
          </div>
        </div>

        <div className="mb-8">
          <Card className="card-shadow border-green-500/20 bg-green-500/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Ranked by compatibility with your profile and experience
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    Projects are scored based on trade match, location proximity, and description similarity
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{matchingTrades.length}</div>
                  <div className="text-sm text-muted-foreground">Matches Found</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6">
          {matchingTrades.map((trade, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2 flex items-center gap-2 text-foreground">
                      <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded">
                        #{index + 1}
                      </span>
                      {trade.project_name}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge 
                        variant="outline" 
                        className={getPriorityColor(trade.priority)}
                      >
                        Priority Score: {trade.priority}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={getConfidenceColor(trade.confidence_level)}
                      >
                        {trade.confidence_level}
                      </Badge>
                      {trade.matching_trades && trade.matching_trades.length > 0 && (
                        <Badge variant="secondary">
                          <Users className="h-3 w-3 mr-1" />
                          {trade.matching_trades.length} related trades
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-blue-600">
                      {Math.round(trade.similarity_score * 100)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Trade Match</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Primary Trade</div>
                      <div className="text-muted-foreground">{trade.matched_trade}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Location</div>
                      <div className="text-muted-foreground">{trade.location}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Budget Range</div>
                      <div className="text-muted-foreground">{trade.budget_range}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Deadline</div>
                      <div className="text-muted-foreground">{trade.deadline}</div>
                    </div>
                  </div>
                </div>

                {trade.trades && trade.trades.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm font-medium text-muted-foreground mb-2">All Required Trades:</div>
                    <div className="flex flex-wrap gap-1">
                      {trade.trades.map((t, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      Trade Score: {trade.trade_match_score}
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      Description Score: {trade.description_match_score}
                    </div>
                  </div>
                  <Button size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button 
            onClick={() => navigate("/subcontractor")}
            variant="outline"
            size="lg"
          >
            Search Again
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubcontractorResults;
