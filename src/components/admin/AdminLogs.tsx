import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { adminApiService } from "@/services/adminApi";
import { 
  RefreshCw, 
  FileText, 
  UserCog, 
  Trash2, 
  Edit, 
  Settings,
  RotateCcw,
  Eye
} from "lucide-react";
import { toast } from "sonner";

interface AuditLogData {
  id: number;
  admin_user_id: string;
  admin_user_email?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  changes?: any;
  ip_address?: string;
  created_at: string;
}

export default function AdminLogs() {
  const [logs, setLogs] = useState<AuditLogData[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [resourceFilter, setResourceFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedLog, setSelectedLog] = useState<AuditLogData | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const pageSize = 20;

  useEffect(() => {
    loadLogs();
  }, [page, actionFilter, resourceFilter]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (actionFilter !== "all") filters.action = actionFilter;
      if (resourceFilter !== "all") filters.resource_type = resourceFilter;

      const result = await adminApiService.getAuditLogs(page, pageSize, filters);
      setLogs(result.logs);
      setTotal(result.total);
    } catch (error) {
      console.error("Error loading audit logs:", error);
      toast.error("Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (log: AuditLogData) => {
    setSelectedLog(log);
    setShowDetailsDialog(true);
  };

  const getActionBadge = (action: string) => {
    const configs: Record<string, { icon: any; className: string }> = {
      user_role_change: { icon: UserCog, className: "bg-blue-500" },
      signal_delete: { icon: Trash2, className: "bg-red-500" },
      signal_edit: { icon: Edit, className: "bg-yellow-500" },
      signal_retry: { icon: RotateCcw, className: "bg-purple-500" },
      config_update: { icon: Settings, className: "bg-green-500" },
    };
    const config = configs[action] || { icon: FileText, className: "bg-gray-500" };
    const Icon = config.icon;
    
    return (
      <Badge variant="outline" className={config.className}>
        <Icon className="w-3 h-3 mr-1" />
        {action.replace(/_/g, " ").toUpperCase()}
      </Badge>
    );
  };

  const getResourceBadge = (resource: string) => {
    const colors: Record<string, string> = {
      user: "bg-blue-500",
      signal: "bg-purple-500",
      config: "bg-green-500",
    };
    return (
      <Badge variant="secondary" className={colors[resource] || "bg-gray-500"}>
        {resource.toUpperCase()}
      </Badge>
    );
  };

  return (
    <>
      <Card className="bg-crypto-card border-crypto-border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              <span>Audit Logs</span>
            </div>
            <Button onClick={loadLogs} size="sm" variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="user_role_change">User Role Change</SelectItem>
                <SelectItem value="signal_delete">Signal Delete</SelectItem>
                <SelectItem value="signal_edit">Signal Edit</SelectItem>
                <SelectItem value="signal_retry">Signal Retry</SelectItem>
                <SelectItem value="config_update">Config Update</SelectItem>
              </SelectContent>
            </Select>
            <Select value={resourceFilter} onValueChange={setResourceFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by resource" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Resources</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="signal">Signal</SelectItem>
                <SelectItem value="config">Config</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Audit Logs Table */}
          {loading ? (
            <div className="text-center py-8 text-crypto-text-secondary">
              Loading audit logs...
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8 text-crypto-text-secondary">
              No audit logs found
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Resource ID</TableHead>
                    <TableHead>Admin User</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm">
                        {new Date(log.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell>{getActionBadge(log.action)}</TableCell>
                      <TableCell>{getResourceBadge(log.resource_type)}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {log.resource_id || "N/A"}
                      </TableCell>
                      <TableCell className="text-sm text-crypto-text-secondary">
                        {log.admin_user_email || `${log.admin_user_id.substring(0, 8)}...`}
                      </TableCell>
                      <TableCell className="text-sm font-mono">
                        {log.ip_address || "N/A"}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(log)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-crypto-text-secondary">
                  Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, total)} of {total} logs
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPage(page + 1)}
                    disabled={page * pageSize >= total}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
            <DialogDescription>
              Log ID: {selectedLog?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-1">Timestamp</p>
                <p className="text-sm text-crypto-text-secondary">
                  {selectedLog && new Date(selectedLog.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Action</p>
                {selectedLog && getActionBadge(selectedLog.action)}
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Resource Type</p>
                {selectedLog && getResourceBadge(selectedLog.resource_type)}
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Resource ID</p>
                <p className="text-sm text-crypto-text-secondary font-mono">
                  {selectedLog?.resource_id || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Admin User</p>
                <p className="text-sm text-crypto-text-secondary">
                  {selectedLog?.admin_user_email || selectedLog?.admin_user_id}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">IP Address</p>
                <p className="text-sm text-crypto-text-secondary font-mono">
                  {selectedLog?.ip_address || "N/A"}
                </p>
              </div>
            </div>
            
            {selectedLog?.changes && (
              <div>
                <p className="text-sm font-medium mb-2">Changes</p>
                <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto max-h-96">
                  {JSON.stringify(selectedLog.changes, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
