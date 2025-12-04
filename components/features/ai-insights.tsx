"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  Users, 
  DollarSign,
  Activity,
  Shield,
  Lightbulb
} from "lucide-react";

interface AIInsight {
  id: string;
  type: 'prediction' | 'recommendation' | 'alert' | 'opportunity';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  action?: string;
  data?: any;
  timestamp: string;
}

interface PredictionResult {
  probability?: number;
  riskScore?: number;
  fraudProbability?: number;
  confidence: number;
  recommendation: string;
  factors: any;
}

export function AIInsights() {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [renewalPredictions, setRenewalPredictions] = useState<PredictionResult[]>([]);
  const [churnPredictions, setChurnPredictions] = useState<PredictionResult[]>([]);
  const [fraudDetections, setFraudDetections] = useState<PredictionResult[]>([]);
  const [upsellRecommendations, setUpsellRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAIInsights();
    fetchPredictions();
    // Refresh insights every 5 minutes
    const interval = setInterval(() => {
      fetchAIInsights();
      fetchPredictions();
    }, 300000);
    return () => clearInterval(interval);
  }, []);

  const fetchAIInsights = async () => {
    try {
      const response = await fetch('/api/ai?type=insights');
      const data = await response.json();
      if (data.success) {
        setInsights(data.insights || []);
      }
    } catch (error) {
      console.error('Error fetching AI insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPredictions = async () => {
    try {
      // Fetch renewal predictions
      const renewalResponse = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'renewal',
          data: { sampleCustomers: 10 }
        })
      });
      
      // Fetch churn predictions
      const churnResponse = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'churn',
          data: { sampleCustomers: 10 }
        })
      });

      // Fetch fraud detection
      const fraudResponse = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'fraud',
          data: { sampleClaims: 5 }
        })
      });

      // Fetch upsell recommendations
      const upsellResponse = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'upsell',
          data: { sampleCustomers: 10 }
        })
      });

      const results = await Promise.allSettled([
        renewalResponse.json(),
        churnResponse.json(),
        fraudResponse.json(),
        upsellResponse.json()
      ]);

      if (results[0].status === 'fulfilled' && results[0].value.success) {
        setRenewalPredictions([results[0].value.prediction]);
      }
      if (results[1].status === 'fulfilled' && results[1].value.success) {
        setChurnPredictions([results[1].value.prediction]);
      }
      if (results[2].status === 'fulfilled' && results[2].value.success) {
        setFraudDetections([results[2].value.prediction]);
      }
      if (results[3].status === 'fulfilled' && results[3].value.success) {
        setUpsellRecommendations([results[3].value.prediction]);
      }
    } catch (error) {
      console.error('Error fetching predictions:', error);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'prediction': return <Brain className="w-4 h-4" />;
      case 'recommendation': return <Lightbulb className="w-4 h-4" />;
      case 'alert': return <AlertTriangle className="w-4 h-4" />;
      case 'opportunity': return <Target className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"></div>
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-gray-200 animate-pulse rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI-Powered Insights
          </CardTitle>
          <CardDescription>
            Machine learning predictions and recommendations for your business
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">
                {renewalPredictions.length > 0 && renewalPredictions[0].probability ? 
                  Math.round(renewalPredictions[0].probability * 100) : 0}%
              </div>
              <div className="text-sm text-gray-600">Renewal Rate</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {churnPredictions.length > 0 && churnPredictions[0].riskScore ? 
                  Math.round((1 - churnPredictions[0].riskScore) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-600">Retention</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">
                {fraudDetections.length > 0 && fraudDetections[0].fraudProbability ? 
                  Math.round((1 - fraudDetections[0].fraudProbability) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-600">Low Risk</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <DollarSign className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">
                {upsellRecommendations.length > 0 ? 
                  upsellRecommendations[0].recommendations?.length || 0 : 0}
              </div>
              <div className="text-sm text-gray-600">Opportunities</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Renewal Predictions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Policy Renewal Predictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renewalPredictions.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Renewal Probability</span>
                  <span className={`text-sm font-bold ${getConfidenceColor(renewalPredictions[0]?.confidence || 0)}`}>
                    {renewalPredictions[0]?.probability ? Math.round(renewalPredictions[0].probability * 100) : 0}%
                  </span>
                </div>
                <Progress value={renewalPredictions[0]?.probability ? renewalPredictions[0].probability * 100 : 0} className="h-2" />
                <div className="text-sm text-gray-600">
                  <div className="font-medium mb-1">Recommendation:</div>
                  <div>{renewalPredictions[0].recommendation}</div>
                </div>
                <div className="text-xs text-gray-500">
                  Confidence: {Math.round(renewalPredictions[0].confidence * 100)}%
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No renewal predictions available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Churn Risk Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Churn Risk Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            {churnPredictions.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Churn Risk</span>
                  <span className={`text-sm font-bold ${getConfidenceColor(churnPredictions[0]?.confidence || 0)}`}>
                    {churnPredictions[0]?.riskScore ? Math.round(churnPredictions[0].riskScore * 100) : 0}%
                  </span>
                </div>
                <Progress value={churnPredictions[0]?.riskScore ? churnPredictions[0].riskScore * 100 : 0} className="h-2" />
                <div className="text-sm text-gray-600">
                  <div className="font-medium mb-1">Recommendation:</div>
                  <div>{churnPredictions[0].recommendation}</div>
                </div>
                <div className="text-xs text-gray-500">
                  Confidence: {Math.round(churnPredictions[0].confidence * 100)}%
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No churn predictions available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Fraud Detection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Fraud Detection
            </CardTitle>
          </CardHeader>
          <CardContent>
            {fraudDetections.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Fraud Probability</span>
                  <span className={`text-sm font-bold ${getConfidenceColor(fraudDetections[0]?.confidence || 0)}`}>
                    {fraudDetections[0]?.fraudProbability ? Math.round(fraudDetections[0].fraudProbability * 100) : 0}%
                  </span>
                </div>
                <Progress value={fraudDetections[0]?.fraudProbability ? fraudDetections[0].fraudProbability * 100 : 0} className="h-2" />
                <div className="text-sm text-gray-600">
                  <div className="font-medium mb-1">Recommendation:</div>
                  <div>{fraudDetections[0].recommendation}</div>
                </div>
                <div className="text-xs text-gray-500">
                  Confidence: {Math.round(fraudDetections[0].confidence * 100)}%
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No fraud detections available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upsell Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Upsell Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upsellRecommendations.length > 0 && upsellRecommendations[0].recommendations?.length > 0 ? (
              <div className="space-y-3">
                {upsellRecommendations[0].recommendations.map((rec: any, index: number) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{rec.product}</span>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(rec.confidence * 100)}% match
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600 mb-1">{rec.reason}</div>
                    <div className="text-xs font-medium text-green-600">
                      Est. Premium: ₹{rec.estimatedPremium.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No upsell opportunities available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI Insights List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Recent AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.length > 0 ? (
              insights.map((insight) => (
                <Alert key={insight.id} className="border-l-4 border-l-blue-500">
                  <div className="flex items-start gap-2">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{insight.title}</span>
                        <Badge className={`text-xs ${getImpactColor(insight.impact)}`}>
                          {insight.impact}
                        </Badge>
                      </div>
                      <AlertDescription className="text-xs">
                        {insight.description}
                      </AlertDescription>
                      {insight.action && (
                        <Button variant="outline" size="sm" className="mt-2 text-xs">
                          {insight.action}
                        </Button>
                      )}
                    </div>
                  </div>
                </Alert>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                No AI insights available at the moment
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
