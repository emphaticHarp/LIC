import { NextRequest, NextResponse } from 'next/server';

// Using public India location API
const INDIA_API_BASE = 'https://api.countrystatecity.in/v1/countries/IN';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type'); // 'states', 'cities', 'pincodes'
  const stateId = searchParams.get('stateId');
  const cityId = searchParams.get('cityId');

  try {
    if (type === 'states') {
      // Fetch all states
      const response = await fetch(`${INDIA_API_BASE}/states`, {
        headers: {
          'X-CSCAPI-KEY': 'NHhveTBLMjFjdkw0dDQ='
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch states');
      const states = await response.json();
      
      return NextResponse.json({
        success: true,
        data: states.map((state: any) => ({
          id: state.id,
          name: state.name
        }))
      });
    }

    if (type === 'cities' && stateId) {
      // Fetch cities for a state
      const response = await fetch(`${INDIA_API_BASE}/states/${stateId}/cities`, {
        headers: {
          'X-CSCAPI-KEY': 'NHhveTBLMjFjdkw0dDQ='
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch cities');
      const cities = await response.json();
      
      return NextResponse.json({
        success: true,
        data: cities.map((city: any) => ({
          id: city.id,
          name: city.name
        }))
      });
    }

    if (type === 'pincodes' && cityId) {
      // For pincodes, we'll use a different API or return mock data
      // Since pincode API is limited, we'll return a message to use a postal code service
      return NextResponse.json({
        success: true,
        data: [],
        message: 'Pincode data requires integration with postal code service'
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid request parameters' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Location API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch location data' },
      { status: 500 }
    );
  }
}
