import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminApiService } from "@/services/adminApi";
import { Settings, RefreshCw, Edit, Save, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface ConfigData {
  id?: number;
  key: string;
  value: string;
  type: string;
  description?: string;
  category: string;
  updated_by?: string;
  updated_at?: string;
}

export default function AdminConfig() {
  const [configs, setConfigs] = useState<ConfigData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConfig, setSelectedConfig] = useState<ConfigData | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [newValue, setNewValue] = useState("");
  const [reason, setReason] = useState("");

  // Common configuration keys
  const commonConfigs = [
    {
      key: "AUTO_APPLY_MIN_SCORE",
      value: "B-",
      type: "string",
      category: "ai",
      description: "Minimum AI quality score to auto-apply adjustments"
    },
    {
      key: "GUARDRAILS_MIN_RR_RATIO",
      value: "1.3",
      type: "number",
      category: "ai",
      description: "Minimum risk-reward ratio required by guardrails"
    },
    {
      key: "GUARDRAILS_MAX_ENTRY_CHANGE_PCT",
      value: "5.0",
      type: "number",
      category: "ai",
      description: "Maximum allowed entry price change percentage"
    },
    {
      key: "GUARDRAILS_MAX_SL_CHANGE_PCT",
      value: "10.0",
      type: "number",
      category: "ai",
      description: "Maximum allowed stop loss change percentage"
    },
    {
      key: "GUARDRAILS_MAX_TP_CHANGE_PCT",
      value: "10.0",
      type: "number",
      category: "ai",
      description: "Maximum allowed take profit change percentage"
    },
    {
      key: "AI_TEMPERATURE",
      value: "0.3",
      type: "number",
      category: "ai",
      description: "AI model temperature (0-1, lower = more deterministic)"
    },
    {
      key: "ENRICHMENT_WORKER_INTERVAL",
      value: "10",
      type: "number",
      category: "worker",
      description: "Worker polling interval in seconds"
    },
    {
      key: "ENRICHMENT_TIMEOUT",
      value: "300",
      type: "number",
      category: "worker",
      description: "Maximum enrichment processing time in seconds"
    },
    {
      key: "ENABLE_FCM_NOTIFICATIONS",
      value: "true",
      type: "boolean",
      category: "notification",
      description: "Enable Firebase Cloud Messaging notifications"
    }
  ];

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    try {
      setLoading(true);
      const result = await adminApiService.getSystemConfig();
      
      // Merge with common configs if not present
      const configMap = new Map(result.configs.map((c: ConfigData) => [c.key, c]));
      const merged = commonConfigs.map(common => 
        configMap.get(common.key) || common
      );
      
      setConfigs(merged as ConfigData[]);
    } catch (error) {
      console.error("Error loading configs:", error);
      // If API fails, use common configs as default
      setConfigs(commonConfigs);
      toast.error("Failed to load some configurations, showing defaults");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (config: ConfigData) => {
    setSelectedConfig(config);
    setNewValue(config.value);
    setReason("");
    setShowEditDialog(true);
  };

  const confirmUpdate = async () => {
    if (!selectedConfig || !reason.trim()) {
      toast.error("Please provide a reason for the configuration change");
      return;
    }

    try {
      await adminApiService.updateConfig(selectedConfig.key, newValue, reason);
      toast.success(`Configuration ${selectedConfig.key} updated`);
      setShowEditDialog(false);
      loadConfigs();
    } catch (error) {
      console.error("Error updating config:", error);
      toast.error("Failed to update configuration");
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      ai: "bg-purple-500",
      enrichment: "bg-blue-500",
      notification: "bg-green-500",
      worker: "bg-orange-500",
    };
    return (
      <Badge variant="outline" className={colors[category] || "bg-gray-500"}>
        {category.toUpperCase()}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      string: "bg-cyan-500",
      number: "bg-yellow-500",
      boolean: "bg-pink-500",
      json: "bg-indigo-500",
    };
    return (
      <Badge variant="secondary" className={colors[type] || ""}>
        {type}
      </Badge>
    );
  };

  return (
    <>
      <Card className="bg-crypto-card border-crypto-border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              <span>System Configuration</span>
            </div>
            <Button onClick={loadConfigs} size="sm" variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-4 border rounded-lg bg-blue-500/10 border-blue-500/20">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium mb-1">Configuration Management</p>
                <p className="text-crypto-text-secondary">
                  Changes to these settings affect system behavior immediately. All changes are logged in the audit trail.
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-crypto-text-secondary">
              Loading configurations...
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Key</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {configs.map((config) => (
                  <TableRow key={config.key}>
                    <TableCell className="font-mono text-sm">{config.key}</TableCell>
                    <TableCell className="font-medium">{config.value}</TableCell>
                    <TableCell>{getTypeBadge(config.type)}</TableCell>
                    <TableCell>{getCategoryBadge(config.category)}</TableCell>
                    <TableCell className="text-sm text-crypto-text-secondary max-w-md">
                      {config.description || "No description"}
                    </TableCell>
                    <TableCell className="text-sm text-crypto-text-secondary">
                      {config.updated_at 
                        ? new Date(config.updated_at).toLocaleDateString()
                        : "Never"}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(config)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Configuration</DialogTitle>
            <DialogDescription>
              Editing {selectedConfig?.key}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Key</Label>
              <Input value={selectedConfig?.key || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label>Current Value</Label>
              <Input value={selectedConfig?.value || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label>New Value</Label>
              <Input
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder={`Enter new value (${selectedConfig?.type})`}
              />
              <p className="text-xs text-crypto-text-secondary">
                Type: {selectedConfig?.type} | Category: {selectedConfig?.category}
              </p>
            </div>
            <div className="space-y-2">
              <Label>Reason (Required)</Label>
              <Textarea
                placeholder="Explain why you're changing this configuration..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
            </div>
            {selectedConfig?.description && (
              <div className="p-3 bg-muted rounded-lg text-sm">
                <p className="font-medium mb-1">Description:</p>
                <p className="text-crypto-text-secondary">{selectedConfig.description}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmUpdate} disabled={!reason.trim() || !newValue.trim()}>
              <Save className="w-4 h-4 mr-2" />
              Update Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
