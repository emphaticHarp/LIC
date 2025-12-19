"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, Filter } from "lucide-react";

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  entity: string;
  entityId: string;
  changes: string;
  ipAddress: string;
  status: "success" | "failed" | "pending";
}

export function AuditTrail() {
  const [logs, setLogs] = useState<AuditLog[]>([
    {
      id: "1",
      timestamp: "2024-12-06 14:30:45",
      user: "agent@example.com",
      action: "CREATE",
      entity: "Policy",
      entityId: "LIC-123456789",
      changes: "New policy created with sum assured ₹50,00,000",
      ipAddress: "192.168.1.100",
      status: "success",
    },
    {
      id: "2",
      timestamp: "2024-12-06 14:25:30",
      user: "admin@example.com",
      action: "UPDATE",
      entity: "Customer",
      entityId: "CUST-001",
      changes: "KYC status updated from pending to verified",
      ipAddress: "192.168.1.50",
      status: "success",
    },
    {
      id: "3",
      timestamp: "2024-12-06 14:20:15",
      user: "claims@example.com",
      action: "APPROVE",
      entity: "Claim",
      entityId: "CLM-123456",
      changes: "Claim approved for amount ₹25,00,000",
      ipAddress: "192.168.1.75",
      status: "success",
    },
    {
      id: "4",
      timestamp: "2024-12-06 14:15:00",
      user: "customer@example.com",
      action: "LOGIN",
      entity: "User",
      entityId: "USER-001",
      changes: "User logged in successfully",
      ipAddress: "203.0.113.45",
      status: "success",
    },
    {
      id: "5",
      timestamp: "2024-12-06 14:10:30",
      user: "agent@example.com",
      action: "DELETE",
      entity: "Document",
      entityId: "DOC-789",
      changes: "Document deleted: old_policy_draft.pdf",
      ipAddress: "192.168.1.100",
      status: "success",
    },
    {
      id: "6",
      timestamp: "2024-12-06 14:05:15",
      user: "unknown",
      action: "LOGIN",
      entity: "User",
      entityId: "USER-999",
      changes: "Failed login attempt",
      ipAddress: "203.0.113.99",
      status: "failed",
    },
    {
      id: "7",
      timestamp: "2024-12-06 14:00:00",
      user: "admin@example.com",
      action: "EXPORT",
      entity: "Report",
      entityId: "RPT-001",
      changes: "Exported policy data to Excel",
      ipAddress: "192.168.1.50",
      status: "success",
    },
    {
      id: "8",
      timestamp: "2024-12-06 13:55:45",
      user: "payments@example.com",
      action: "PROCESS",
      entity: "Payment",
      entityId: "PAY-001",
      changes: "Payment processed: ₹25,000 received",
      ipAddress: "192.168.1.80",
      status: "success",
    },
  ]);

  const [filterAction, setFilterAction] = useState("all");
  const [filterEntity, setFilterEntity] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchUser, setSearchUser] = useState("");

  const filteredLogs = logs.filter(log => {
    const actionMatch = filterAction === "all" || log.action === filterAction;
    const entityMatch = filterEntity === "all" || log.entity === filterEntity;
    const statusMatch = filterStatus === "all" || log.status === filterStatus;
    const userMatch = log.user.toLowerCase().includes(searchUser.toLowerCase());
    return actionMatch && entityMatch && statusMatch && userMatch;
  });

  const exportAuditLog = () => {
    const csv = [
      ["Timestamp", "User", "Action", "Entity", "Entity ID", "Changes", "IP Address", "Status"],
      ...filteredLogs.map(log => [
        log.timestamp,
        log.user,
        log.action,
        log.entity,
        log.entityId,
        log.changes,
        log.ipAddress,
        log.status,
      ]),
    ]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n");

    const element = document.createElement("a");
    element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csv));
    element.setAttribute("download", "audit-trail.csv");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "CREATE":
        return "bg-green-50 text-green-700 border-green-200";
      case "UPDATE":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "DELETE":
        return "bg-red-50 text-red-700 border-red-200";
      case "APPROVE":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "LOGIN":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "EXPORT":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "PROCESS":
        return "bg-cyan-50 text-cyan-700 border-cyan-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">📋</span> Audit Trail
        </CardTitle>
        <CardDescription>Complete transaction and activity logging for compliance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Search User</label>
            <Input
              placeholder="Search by user email"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Action</label>
            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="CREATE">Create</SelectItem>
                <SelectItem value="UPDATE">Update</SelectItem>
                <SelectItem value="DELETE">Delete</SelectItem>
                <SelectItem value="APPROVE">Approve</SelectItem>
                <SelectItem value="LOGIN">Login</SelectItem>
                <SelectItem value="EXPORT">Export</SelectItem>
                <SelectItem value="PROCESS">Process</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Entity</label>
            <Select value={filterEntity} onValueChange={setFilterEntity}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Entities</SelectItem>
                <SelectItem value="Policy">Policy</SelectItem>
                <SelectItem value="Customer">Customer</SelectItem>
                <SelectItem value="Claim">Claim</SelectItem>
                <SelectItem value="Payment">Payment</SelectItem>
                <SelectItem value="User">User</SelectItem>
                <SelectItem value="Document">Document</SelectItem>
                <SelectItem value="Report">Report</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={exportAuditLog} variant="outline" className="w-full">
          <Download className="w-4 h-4 mr-2" />
          Export Audit Log
        </Button>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No audit logs found matching your filters
            </div>
          ) : (
            filteredLogs.map(log => (
              <div key={log.id} className="p-4 border rounded-lg hover:bg-gray-50 transition">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className={getActionColor(log.action)}>
                        {log.action}
                      </Badge>
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                        {log.entity}
                      </Badge>
                      <Badge 
                        variant="outline"
                        className={
                          log.status === "success" ? "bg-green-50 text-green-700 border-green-200" :
                          log.status === "failed" ? "bg-red-50 text-red-700 border-red-200" :
                          "bg-yellow-50 text-yellow-700 border-yellow-200"
                        }
                      >
                        {log.status}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-gray-800">{log.changes}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>User: {log.user}</span>
                      <span>Entity ID: {log.entityId}</span>
                      <span>IP: {log.ipAddress}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-gray-600">{log.timestamp}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
          <p className="font-semibold mb-1">Audit Trail Information</p>
          <p>Total logs: {logs.length} | Filtered results: {filteredLogs.length}</p>
        </div>
      </CardContent>
    </Card>
  );
}
