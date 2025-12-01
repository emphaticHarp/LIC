import { createSlice, createAsyncThunk, PayloadAction, AnyAction, Draft } from '@reduxjs/toolkit';

interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  aadhaar: string;
  pan: string;
  role: 'Agent' | 'Manager' | 'Branch Head' | 'Staff';
  branch: string;
  department: string;
  joiningDate: string;
  status: 'Active' | 'Inactive' | 'Suspended' | 'Terminated';
  avatar?: string;
  performance: {
    policiesSold: number;
    totalPremium: number;
    commissionEarned: number;
    targetAchievement: number;
    rank: string;
  };
  salary: {
    basic: number;
    hra: number;
    da: number;
    incentives: number;
    deductions: {
      tds: number;
      pf: number;
      professionalTax: number;
      other: number;
    };
    netSalary: number;
  };
  attendance: {
    present: number;
    absent: number;
    leave: number;
    late: number;
  };
  tasks: Array<{
    id: string;
    title: string;
    description: string;
    priority: 'Low' | 'Medium' | 'High' | 'Urgent';
    status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
    dueDate: string;
    assignedBy: string;
    assignedDate: string;
  }>;
  goals: Array<{
    id: string;
    title: string;
    description: string;
    target: number;
    current: number;
    unit: string;
    deadline: string;
    status: 'On Track' | 'Behind' | 'Achieved' | 'Overdue';
  }>;
  communication: Array<{
    id: string;
    type: 'message' | 'call' | 'meeting';
    subject: string;
    content: string;
    sender: string;
    timestamp: string;
    status: 'sent' | 'delivered' | 'read';
    attachments?: Array<{
      name: string;
      type: 'image' | 'video' | 'document' | 'link';
      url: string;
    }>;
  }>;
}

interface AgentState {
  agents: Agent[];
  selectedAgent: Agent | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    search: string;
    status: string;
    role: string;
    branch: string;
    department: string;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  analytics: {
    totalAgents: number;
    activeAgents: number;
    totalSalary: number;
    averagePerformance: number;
    agentsByRole: Record<string, number>;
    agentsByBranch: Record<string, number>;
  };
}

const initialState: AgentState = {
  agents: [],
  selectedAgent: null,
  isLoading: false,
  error: null,
  filters: {
    search: '',
    status: 'all',
    role: 'all',
    branch: 'all',
    department: 'all',
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  analytics: {
    totalAgents: 0,
    activeAgents: 0,
    totalSalary: 0,
    averagePerformance: 0,
    agentsByRole: {},
    agentsByBranch: {},
  },
};

// Async thunks
export const fetchAgents = createAsyncThunk(
  'agents/fetchAgents',
  async (params: { page?: number; limit?: number; filters?: AgentState['filters'] }) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data
    const mockAgents: Agent[] = [
      {
        id: '1',
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@lic.com',
        phone: '+91 98765 43210',
        address: '123, MG Road, Bangalore',
        dateOfBirth: '1985-05-15',
        aadhaar: '1234-5678-9012',
        pan: 'RAJEK1234E',
        role: 'Agent',
        branch: 'Bangalore Main',
        department: 'Sales',
        joiningDate: '2022-01-15',
        status: 'Active',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        performance: {
          policiesSold: 45,
          totalPremium: 2250000,
          commissionEarned: 225000,
          targetAchievement: 120,
          rank: 'Gold Agent',
        },
        salary: {
          basic: 25000,
          hra: 7500,
          da: 5000,
          incentives: 15000,
          deductions: {
            tds: 2000,
            pf: 1800,
            professionalTax: 200,
            other: 0,
          },
          netSalary: 43500,
        },
        attendance: {
          present: 22,
          absent: 2,
          leave: 1,
          late: 3,
        },
        tasks: [
          {
            id: '1',
            title: 'Follow up with Priya Sharma',
            description: 'Discuss policy renewal options',
            priority: 'High',
            status: 'Pending',
            dueDate: '2024-12-15',
            assignedBy: 'Manager',
            assignedDate: '2024-12-01',
          },
        ],
        goals: [
          {
            id: '1',
            title: 'Monthly Target',
            description: 'Sell 10 policies this month',
            target: 10,
            current: 7,
            unit: 'policies',
            deadline: '2024-12-31',
            status: 'On Track',
          },
        ],
        communication: [
          {
            id: '1',
            type: 'message',
            subject: 'Policy Update',
            content: 'New policy terms updated',
            sender: 'Admin',
            timestamp: '2024-12-01T10:00:00Z',
            status: 'read',
          },
        ],
      },
    ];

    return {
      agents: mockAgents,
      total: mockAgents.length,
    };
  }
);

export const createAgent = createAsyncThunk(
  'agents/createAgent',
  async (agentData: Omit<Agent, 'id'>) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newAgent: Agent = {
      ...agentData,
      id: Date.now().toString(),
    };

    return newAgent;
  }
);

export const updateAgent = createAsyncThunk(
  'agents/updateAgent',
  async ({ id, data }: { id: string; data: Partial<Agent> }) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { id, data };
  }
);

export const deleteAgent = createAsyncThunk(
  'agents/deleteAgent',
  async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return id;
  }
);

export const calculateSalary = createAsyncThunk(
  'agents/calculateSalary',
  async ({ id, month, year }: { id: string; month: number; year: number }) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock salary calculation
    const salaryData = {
      basic: 25000,
      hra: 7500,
      da: 5000,
      incentives: 15000,
      deductions: {
        tds: 2000,
        pf: 1800,
        professionalTax: 200,
        other: 0,
      },
      netSalary: 43500,
    };

    return { id, salaryData };
  }
);

export const sendMessage = createAsyncThunk(
  'agents/sendMessage',
  async ({ 
    agentId, 
    message, 
    attachments 
  }: { 
    agentId: string; 
    message: string; 
    attachments?: Array<{
      name: string;
      type: 'image' | 'video' | 'document' | 'link';
      url: string;
    }>;
  }) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newCommunication = {
      id: Date.now().toString(),
      type: 'message' as const,
      subject: 'New Message',
      content: message,
      sender: 'Admin',
      timestamp: new Date().toISOString(),
      status: 'sent' as const,
      attachments,
    };

    return { agentId, communication: newCommunication };
  }
);

export const assignTask = createAsyncThunk(
  'agents/assignTask',
  async ({ 
    agentId, 
    task 
  }: { 
    agentId: string; 
    task: Omit<Agent['tasks'][0], 'id' | 'assignedDate'>;
  }) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newTask = {
      ...task,
      id: Date.now().toString(),
      assignedDate: new Date().toISOString(),
    };

    return { agentId, task: newTask };
  }
);

export const setGoal = createAsyncThunk(
  'agents/setGoal',
  async ({ 
    agentId, 
    goal 
  }: { 
    agentId: string; 
    goal: Omit<Agent['goals'][0], 'id'>;
  }) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newGoal = {
      ...goal,
      id: Date.now().toString(),
    };

    return { agentId, goal: newGoal };
  }
);

export const fetchAgentAnalytics = createAsyncThunk(
  'agents/fetchAnalytics',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      totalAgents: 25,
      activeAgents: 22,
      totalSalary: 1087500,
      averagePerformance: 85,
      agentsByRole: {
        'Agent': 18,
        'Manager': 4,
        'Branch Head': 2,
        'Staff': 1,
      },
      agentsByBranch: {
        'Bangalore Main': 8,
        'Delhi Central': 6,
        'Mumbai Main': 7,
        'Kolkata Central': 4,
      },
    };
  }
);

const agentSlice = createSlice({
  name: 'agents',
  initialState,
  reducers: {
    setSelectedAgent: (state: AgentState, action: PayloadAction<Agent | null>) => {
      state.selectedAgent = action.payload;
    },
    setFilters: (state: AgentState, action: PayloadAction<Partial<AgentState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state: AgentState) => {
      state.error = null;
    },
  },
  extraReducers: (builder: any) => {
    builder
      // Fetch Agents
      .addCase(fetchAgents.pending, (state: AgentState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAgents.fulfilled, (state: AgentState, action: AnyAction) => {
        state.isLoading = false;
        state.agents = action.payload.agents;
        state.pagination.total = action.payload.total;
      })
      .addCase(fetchAgents.rejected, (state: AgentState, action: AnyAction) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch agents';
      })
      // Create Agent
      .addCase(createAgent.pending, (state: AgentState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createAgent.fulfilled, (state: AgentState, action: AnyAction) => {
        state.isLoading = false;
        state.agents.push(action.payload);
      })
      .addCase(createAgent.rejected, (state: AgentState, action: AnyAction) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create agent';
      })
      // Update Agent
      .addCase(updateAgent.fulfilled, (state: AgentState, action: AnyAction) => {
        const { id, data } = action.payload;
        const index = state.agents.findIndex((agent: Agent) => agent.id === id);
        if (index !== -1) {
          state.agents[index] = { ...state.agents[index], ...data };
        }
      })
      // Delete Agent
      .addCase(deleteAgent.fulfilled, (state: AgentState, action: AnyAction) => {
        state.agents = state.agents.filter((agent: Agent) => agent.id !== action.payload);
      })
      // Calculate Salary
      .addCase(calculateSalary.fulfilled, (state: AgentState, action: AnyAction) => {
        const { id, salaryData } = action.payload;
        const index = state.agents.findIndex((agent: Agent) => agent.id === id);
        if (index !== -1) {
          state.agents[index].salary = salaryData;
        }
      })
      // Send Message
      .addCase(sendMessage.fulfilled, (state: AgentState, action: AnyAction) => {
        const { agentId, communication } = action.payload;
        const index = state.agents.findIndex((agent: Agent) => agent.id === agentId);
        if (index !== -1) {
          state.agents[index].communication.unshift(communication);
        }
      })
      // Assign Task
      .addCase(assignTask.fulfilled, (state: AgentState, action: AnyAction) => {
        const { agentId, task } = action.payload;
        const index = state.agents.findIndex((agent: Agent) => agent.id === agentId);
        if (index !== -1) {
          state.agents[index].tasks.push(task);
        }
      })
      // Set Goal
      .addCase(setGoal.fulfilled, (state: AgentState, action: AnyAction) => {
        const { agentId, goal } = action.payload;
        const index = state.agents.findIndex((agent: Agent) => agent.id === agentId);
        if (index !== -1) {
          state.agents[index].goals.push(goal);
        }
      })
      // Analytics
      .addCase(fetchAgentAnalytics.fulfilled, (state: AgentState, action: AnyAction) => {
        state.analytics = action.payload;
      });
  },
});

export const { setSelectedAgent, setFilters, clearError } = agentSlice.actions;
export default agentSlice.reducer;
