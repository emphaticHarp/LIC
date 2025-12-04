import { NextRequest, NextResponse } from "next/server";

interface PredictionRequest {
  type: 'renewal' | 'churn' | 'fraud' | 'upsell';
  data: any;
}

interface AnalyticsRequest {
  type: 'customer' | 'policy' | 'claims' | 'revenue';
  timeframe: 'daily' | 'weekly' | 'monthly' | 'yearly';
  filters?: any;
}

export async function POST(request: NextRequest) {
  try {
    const body: PredictionRequest = await request.json();
    
    switch (body.type) {
      case 'renewal':
        return NextResponse.json({
          success: true,
          prediction: await predictPolicyRenewal(body.data)
        });
        
      case 'churn':
        return NextResponse.json({
          success: true,
          prediction: await predictCustomerChurn(body.data)
        });
        
      case 'fraud':
        return NextResponse.json({
          success: true,
          prediction: await detectFraud(body.data)
        });
        
      case 'upsell':
        return NextResponse.json({
          success: true,
          prediction: await recommendUpsell(body.data)
        });
        
      default:
        return NextResponse.json(
          { success: false, error: "Invalid prediction type" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("AI API error:", error);
    return NextResponse.json(
      { success: false, error: "AI service unavailable" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type') as AnalyticsRequest['type'];
  const timeframe = searchParams.get('timeframe') as AnalyticsRequest['timeframe'];
  
  try {
    switch (type) {
      case 'customer':
        return NextResponse.json({
          success: true,
          data: await getCustomerAnalytics(timeframe)
        });
        
      case 'policy':
        return NextResponse.json({
          success: true,
          data: await getPolicyAnalytics(timeframe)
        });
        
      case 'claims':
        return NextResponse.json({
          success: true,
          data: await getClaimsAnalytics(timeframe)
        });
        
      case 'revenue':
        return NextResponse.json({
          success: true,
          data: await getRevenueAnalytics(timeframe)
        });
        
      default:
        return NextResponse.json(
          { success: false, error: "Invalid analytics type" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { success: false, error: "Analytics service unavailable" },
      { status: 500 }
    );
  }
}

// AI/ML Prediction Functions
async function predictPolicyRenewal(customerData: any) {
  // Simulated ML prediction - in production, use actual ML model
  const baseScore = Math.random();
  const factors = {
    premiumHistory: customerData.premiumHistory || 0.3,
    claimHistory: customerData.claimHistory || 0.2,
    customerAge: customerData.age ? Math.min(customerData.age / 100, 1) : 0.5,
    policyDuration: customerData.policyDuration ? Math.min(customerData.policyDuration / 10, 1) : 0.5
  };
  
  const renewalScore = baseScore * 0.4 + 
    factors.premiumHistory * 0.3 + 
    (1 - factors.claimHistory) * 0.2 + 
    factors.policyDuration * 0.1;
  
  return {
    probability: Math.max(0, Math.min(1, renewalScore)),
    confidence: 0.85,
    factors: factors,
    recommendation: renewalScore > 0.7 ? 'High likelihood of renewal' : 'Consider retention strategy'
  };
}

async function predictCustomerChurn(customerData: any) {
  const riskFactors = {
    missedPayments: customerData.missedPayments || 0,
    complaints: customerData.complaints || 0,
    policyLapses: customerData.policyLapses || 0,
    interactionFrequency: customerData.interactions || 5
  };
  
  const churnRisk = (riskFactors.missedPayments * 0.4) + 
    (riskFactors.complaints * 0.3) + 
    (riskFactors.policyLapses * 0.2) + 
    (1 / riskFactors.interactionFrequency * 0.1);
  
  return {
    riskScore: Math.max(0, Math.min(1, churnRisk)),
    confidence: 0.82,
    riskFactors: riskFactors,
    recommendation: churnRisk > 0.6 ? 'High churn risk - intervention needed' : 'Low risk - maintain current strategy'
  };
}

async function detectFraud(claimData: any) {
  const fraudIndicators = {
    claimAmount: claimData.amount > 500000 ? 0.3 : 0.1,
    timeSincePolicy: claimData.timeSincePolicy < 30 ? 0.4 : 0.1,
    previousClaims: claimData.previousClaims > 3 ? 0.3 : 0.1,
    documentIssues: claimData.documentIssues || 0
  };
  
  const fraudScore = Object.values(fraudIndicators).reduce((a, b) => a + b, 0);
  
  return {
    fraudProbability: Math.max(0, Math.min(1, fraudScore)),
    confidence: 0.78,
    indicators: fraudIndicators,
    recommendation: fraudScore > 0.5 ? 'Manual review required' : 'Standard processing'
  };
}

async function recommendUpsell(customerData: any) {
  const customerProfile = {
    age: customerData.age || 35,
    income: customerData.income || 500000,
    existingPolicies: customerData.policies || [],
    familySize: customerData.familySize || 1
  };
  
  const recommendations = [];
  
  if (customerProfile.age < 40 && customerProfile.familySize > 1) {
    recommendations.push({
      product: 'Term Life Plus',
      reason: 'Young family with dependents',
      confidence: 0.85,
      estimatedPremium: 15000
    });
  }
  
  if (customerProfile.income > 1000000) {
    recommendations.push({
      product: 'Wealth Builder',
      reason: 'High income - investment opportunity',
      confidence: 0.75,
      estimatedPremium: 50000
    });
  }
  
  return {
    recommendations: recommendations,
    customerProfile: customerProfile,
    nextBestAction: recommendations.length > 0 ? 'Contact customer for consultation' : 'Focus on retention'
  };
}

// Advanced Analytics Functions
async function getCustomerAnalytics(timeframe: string) {
  // Simulated analytics data
  const baseCustomers = 1000;
  const growthRate = timeframe === 'daily' ? 0.01 : timeframe === 'weekly' ? 0.05 : timeframe === 'monthly' ? 0.15 : 0.5;
  
  return {
    totalCustomers: baseCustomers * (1 + growthRate),
    newCustomers: Math.floor(baseCustomers * growthRate),
    activeCustomers: Math.floor(baseCustomers * 0.85),
    churnRate: 0.05,
    satisfactionScore: 4.2,
    segmentation: {
      byAge: { '18-30': 20, '31-45': 35, '46-60': 30, '60+': 15 },
      byIncome: { 'Low': 25, 'Medium': 50, 'High': 25 },
      byPolicyType: { 'Term': 40, 'Whole': 35, 'Endowment': 25 }
    }
  };
}

async function getPolicyAnalytics(timeframe: string) {
  return {
    totalPolicies: 2500,
    newPolicies: 150,
    activePolicies: 2100,
    expiredPolicies: 50,
    lapsedPolicies: 200,
    renewalRate: 0.84,
    averagePremium: 25000,
    premiumDistribution: {
      '0-10k': 30,
      '10k-25k': 40,
      '25k-50k': 20,
      '50k+': 10
    },
    policyTypes: {
      'Term Life': 40,
      'Whole Life': 25,
      'Endowment': 20,
      'ULIP': 15
    }
  };
}

async function getClaimsAnalytics(timeframe: string) {
  return {
    totalClaims: 120,
    approvedClaims: 85,
    pendingClaims: 25,
    rejectedClaims: 10,
    averageProcessingTime: 7, // days
    averageClaimAmount: 250000,
    claimTypes: {
      'Death': 40,
      'Maturity': 30,
      'Surrender': 20,
      'Critical Illness': 10
    },
    fraudDetectionRate: 0.02
  };
}

async function getRevenueAnalytics(timeframe: string) {
  return {
    totalRevenue: 52500000,
    premiumRevenue: 45000000,
    investmentIncome: 7500000,
    operatingExpenses: 21000000,
    netProfit: 31500000,
    profitMargin: 0.60,
    revenueGrowth: 0.15,
    revenueStreams: {
      'Premiums': 85,
      'Investments': 10,
      'Fees': 5
    }
  };
}
