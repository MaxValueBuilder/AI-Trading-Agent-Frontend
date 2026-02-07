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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminApiService } from "@/services/adminApi";
import { Search, UserCog, Shield, User, RefreshCw, Mail, Clock, Download } from "lucide-react";
import { toast } from "sonner";

interface UserData {
  firebase_uid: string;
  email: string;
  display_name?: string;
  role: string;
  is_active: boolean;
  created_at: string;
  fcm_token?: string;
}

interface InvitationData {
  id: number;
  email: string;
  role: string;
  status: string;
  invited_by_email?: string;
  created_at: string;
  expires_at: string;
  invitation_token: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [newRole, setNewRole] = useState("");
  const [reason, setReason] = useState("");
  
  // Invitation states
  const [invitations, setInvitations] = useState<InvitationData[]>([]);
  const [invitationsTotal, setInvitationsTotal] = useState(0);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("user");
  const [expirationDays, setExpirationDays] = useState(7);
  const [invitationLink, setInvitationLink] = useState("");
  const [showInvitationLinkDialog, setShowInvitationLinkDialog] = useState(false);
  const [sendingInvite, setSendingInvite] = useState(false);
  
  const pageSize = 20;

  useEffect(() => {
    loadUsers();
    loadInvitations();
  }, [page, roleFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (roleFilter !== "all") filters.role = roleFilter;
      if (search) filters.search = search;

      const result = await adminApiService.getUsers(page, pageSize, filters);
      setUsers(result.users);
      setTotal(result.total);
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const loadInvitations = async () => {
    try {
      const result = await adminApiService.getInvitations(1, 10, "pending");
      setInvitations(result.invitations);
      setInvitationsTotal(result.total);
    } catch (error) {
      console.error("Error loading invitations:", error);
    }
  };

  const handleSearch = () => {
    setPage(1);
    loadUsers();
  };

  const handleRoleChange = (user: UserData) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setReason("");
    setShowRoleDialog(true);
  };

  const confirmRoleChange = async () => {
    if (!selectedUser || !reason.trim()) {
      toast.error("Please provide a reason for the role change");
      return;
    }

    try {
      await adminApiService.updateUserRole(selectedUser.firebase_uid, newRole, reason);
      toast.success(`User role updated to ${newRole}`);
      setShowRoleDialog(false);
      loadUsers();
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update user role");
    }
  };

  const handleInviteUser = () => {
    setInviteEmail("");
    setInviteRole("user");
    setExpirationDays(7);
    setShowInviteDialog(true);
  };

  const confirmInvite = async () => {
    if (!inviteEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    setSendingInvite(true);
    try {
      const result = await adminApiService.createInvitation(inviteEmail, inviteRole, expirationDays);
      
      if (result.email_sent) {
        // Email sent successfully
        toast.success(`Invitation email sent to ${inviteEmail}!`);
      } else {
        // Email failed - show link dialog as backup
        toast.warning(`Email failed to send. Please share the link manually.`);
        setInvitationLink(result.invitation_link);
        setShowInvitationLinkDialog(true);
      }
      
      setShowInviteDialog(false);
      loadInvitations();
    } catch (error: any) {
      console.error("Error sending invitation:", error);
      toast.error(error.response?.data?.detail || "Failed to send invitation");
    } finally {
      setSendingInvite(false);
    }
  };

  const getExpirationDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + expirationDays);
    return date.toLocaleDateString();
  };

  const copyInvitationLink = () => {
    navigator.clipboard.writeText(invitationLink);
    toast.success("Invitation link copied to clipboard!");
  };

  const exportUsersToCSV = () => {
    try {
      // Prepare CSV headers
      const headers = ['Name', 'Email', 'Role', 'Status', 'FCM Token', 'Created Date', 'Firebase UID'];
      
      // Prepare CSV rows
      const rows = users.map(user => [
        user.display_name || 'No name',
        user.email,
        user.role.toUpperCase(),
        user.is_active ? 'Active' : 'Inactive',
        user.fcm_token ? 'Enabled' : 'Disabled',
        new Date(user.created_at).toLocaleDateString(),
        user.firebase_uid
      ]);
      
      // Combine headers and rows
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');
      
      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `bitiq_users_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Exported ${users.length} users to CSV!`);
    } catch (error) {
      console.error('Error exporting users:', error);
      toast.error('Failed to export users');
    }
  };

  const getRoleBadge = (role: string) => {
    if (role === "admin") {
      return (
        <Badge variant="default" className="bg-red-500">
          <Shield className="w-3 h-3 mr-1" />
          Admin
        </Badge>
      );
    }
    return (
      <Badge variant="secondary">
        <User className="w-3 h-3 mr-1" />
        User
      </Badge>
    );
  };

  return (
    <>
      <Card className="bg-crypto-card border-crypto-border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>User Management</span>
            <div className="flex gap-2">
              <Button 
                onClick={exportUsersToCSV} 
                size="sm" 
                variant="outline"
                disabled={users.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button onClick={handleInviteUser} size="sm" variant="default">
                <Mail className="w-4 h-4 mr-2" />
                Invite User
              </Button>
              <Button onClick={loadUsers} size="sm" variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch} size="icon">
                <Search className="w-4 h-4" />
              </Button>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users Table */}
          {loading ? (
            <div className="text-center py-8 text-crypto-text-secondary">
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-crypto-text-secondary">
              No users found
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>FCM Token</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.firebase_uid}>
                      <TableCell className="font-medium">
                        {user.display_name || <span className="text-crypto-text-secondary italic">No name</span>}
                      </TableCell>
                      <TableCell className="text-crypto-text-secondary">{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>
                        <Badge variant={user.is_active ? "default" : "destructive"}>
                          {user.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.fcm_token ? (
                          <Badge variant="outline" className="text-xs">
                            Enabled
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            Disabled
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-crypto-text-secondary">
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRoleChange(user)}
                        >
                          <UserCog className="w-4 h-4 mr-1" />
                          Change Role
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-crypto-text-secondary">
                  Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, total)} of {total} users
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

      {/* Pending Invitations */}
      {invitations.length > 0 && (
        <Card className="bg-crypto-card border-crypto-border mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Pending Invitations ({invitationsTotal})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Invited By</TableHead>
                  <TableHead>Expires</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations.map((invitation) => (
                  <TableRow key={invitation.id}>
                    <TableCell className="font-medium">{invitation.email}</TableCell>
                    <TableCell>{getRoleBadge(invitation.role)}</TableCell>
                    <TableCell className="text-sm text-crypto-text-secondary">
                      {invitation.invited_by_email || "N/A"}
                    </TableCell>
                    <TableCell className="text-sm text-crypto-text-secondary">
                      {new Date(invitation.expires_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Role Change Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Update the role for {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>New Role</Label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Reason (Required)</Label>
              <Textarea
                placeholder="Explain why you're changing this user's role..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmRoleChange} disabled={!reason.trim()}>
              Update Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite User Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite New User</DialogTitle>
            <DialogDescription>
              Send an invitation link to a new user
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input
                type="email"
                placeholder="user@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Initial Role</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Expiration</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={expirationDays === 1 ? "default" : "outline"}
                  onClick={() => setExpirationDays(1)}
                >
                  1 day
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={expirationDays === 3 ? "default" : "outline"}
                  onClick={() => setExpirationDays(3)}
                >
                  3 days
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={expirationDays === 7 ? "default" : "outline"}
                  onClick={() => setExpirationDays(7)}
                >
                  7 days
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={expirationDays === 14 ? "default" : "outline"}
                  onClick={() => setExpirationDays(14)}
                >
                  14 days
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={expirationDays === 30 ? "default" : "outline"}
                  onClick={() => setExpirationDays(30)}
                >
                  30 days
                </Button>
              </div>
              <p className="text-sm text-crypto-text-secondary">
                Expires on {getExpirationDate()}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowInviteDialog(false)}
              disabled={sendingInvite}
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmInvite} 
              disabled={!inviteEmail.trim() || sendingInvite}
            >
              {sendingInvite ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Invitation"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invitation Link Dialog - Only shown when email fails */}
      <Dialog open={showInvitationLinkDialog} onOpenChange={setShowInvitationLinkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>⚠️ Email Failed - Manual Link Required</DialogTitle>
            <DialogDescription>
              The invitation email couldn't be sent. Please share this link manually with the user.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Invitation Link</Label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={invitationLink}
                  className="font-mono text-sm"
                />
                <Button onClick={copyInvitationLink} variant="outline">
                  Copy
                </Button>
              </div>
              <p className="text-sm text-yellow-500">
                ⚠️ This link will expire in {expirationDays} day{expirationDays > 1 ? 's' : ''}. Please share it with the user immediately.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowInvitationLinkDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
