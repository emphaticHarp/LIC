import { NextRequest, NextResponse } from 'next/server'

interface LucyMessage {
  role: 'user' | 'assistant'
  content: string
}

interface LucyAction {
  type: 'navigate' | 'fetch' | 'update' | 'message' | 'action'
  target?: string
  data?: any
  message?: string
}

// Lucy's knowledge base and command patterns
const lucyKnowledge = {
  sections: {
    dashboard: '/dashboard',
    policies: '/policies',
    claims: '/claims',
    customers: '/customers',
    payments: '/payments',
    reports: '/reports',
    agents: '/agents',
    commission: '/commission',
    documents: '/documents',
    settings: '/settings',
    'agent-management': '/agent-management',
    analysis: '/analysis',
    integrations: '/integrations',
    help: '/help',
  },
  capabilities: [
    'Navigate to different sections',
    'View policies and claims',
    'Manage customers',
    'Process payments',
    'Generate reports',
    'Manage agents',
    'Track commissions',
    'Handle documents',
    'Configure settings',
  ],
}

// Parse user intent and generate response
function parseLucyIntent(userMessage: string): { response: string; action?: LucyAction } {
  const message = userMessage.toLowerCase().trim()

  // Navigation intents
  if (message.includes('dashboard') || message.includes('home')) {
    return {
      response: "I'll take you to the dashboard. You can see all your key metrics and recent activities there.",
      action: { type: 'navigate', target: '/dashboard' },
    }
  }

  if (message.includes('policies')) {
    return {
      response: "Let me navigate to the policies section where you can view and manage all insurance policies.",
      action: { type: 'navigate', target: '/policies' },
    }
  }

  if (message.includes('claims')) {
    return {
      response: "I'll take you to the claims section. You can view, process, and track all claims here.",
      action: { type: 'navigate', target: '/claims' },
    }
  }

  if (message.includes('customers')) {
    return {
      response: "Opening the customers section. You can manage all customer information and communications here.",
      action: { type: 'navigate', target: '/customers' },
    }
  }

  if (message.includes('payments')) {
    return {
      response: "Let me take you to the payments section where you can process and track all transactions.",
      action: { type: 'navigate', target: '/payments' },
    }
  }

  if (message.includes('reports')) {
    return {
      response: "I'll navigate to the reports section. You can generate and view various business reports here.",
      action: { type: 'navigate', target: '/reports' },
    }
  }

  if (message.includes('agents')) {
    return {
      response: "Opening the agents section. You can manage agent information and performance here.",
      action: { type: 'navigate', target: '/agents' },
    }
  }

  if (message.includes('commission')) {
    return {
      response: "Let me take you to the commission section to track and manage agent commissions.",
      action: { type: 'navigate', target: '/commission' },
    }
  }

  if (message.includes('documents')) {
    return {
      response: "I'll navigate to the documents section where you can manage all your files and documents.",
      action: { type: 'navigate', target: '/documents' },
    }
  }

  if (message.includes('settings')) {
    return {
      response: "Opening the settings section. You can configure your preferences and system settings here.",
      action: { type: 'navigate', target: '/settings' },
    }
  }

  if (message.includes('documents')) {
    return {
      response: "Let me take you to the documents section where you can upload, view, and download your documents.",
      action: { type: 'navigate', target: '/documents' },
    }
  }

  // Help intents
  if (message.includes('help') || message.includes('what can you do') || message.includes('capabilities')) {
    return {
      response: `I'm Lucy, your AI assistant! I can help you with:\n\n${lucyKnowledge.capabilities.join('\n')}\n\nJust ask me to navigate to any section or tell me what you need help with!`,
    }
  }

  // General greeting
  if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    return {
      response: "Hi there! I'm Lucy, your AI assistant. I can help you navigate the LIC system and manage your tasks. What would you like to do?",
    }
  }

  // Default response
  return {
    response: `I understand you're asking about "${userMessage}". I can help you navigate to different sections like policies, claims, customers, payments, reports, and more. What would you like to do?`,
  }
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid request format' }, { status: 400 })
    }

    // Get the last user message
    const lastMessage = messages[messages.length - 1]
    if (!lastMessage || lastMessage.role !== 'user') {
      return NextResponse.json({ error: 'No user message found' }, { status: 400 })
    }

    // Parse intent and generate response
    const { response, action } = parseLucyIntent(lastMessage.content)

    // Return response with optional action
    return NextResponse.json({
      role: 'assistant',
      content: response,
      action: action || null,
    })
  } catch (error) {
    console.error('Lucy Chat Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', content: 'Sorry, I encountered an error. Please try again.' },
      { status: 500 }
    )
  }
}
