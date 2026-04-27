import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { owner } from '@/lib/api';
import { Users, Award, Trash2, Plus, Loader2, Save, ArrowLeft, Shield, Ticket, Check, X, Settings as SettingsIcon, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = 'overview' | 'members' | 'perks' | 'staff' | 'tickets';

export function CommunityDetails() {
  const { guildId } = useParams<{ guildId: string }>();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<any[]>([]);
  const [perks, setPerks] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null); 
  const [roles, setRoles] = useState<any[]>([]);
  
  // Staff & Tickets
  const [staffRoles, setStaffRoles] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [settings, setSettings] = useState<{ require_ticket_review: boolean }>({ require_ticket_review: false });
  const [addingRole, setAddingRole] = useState(false);
  const [selectedRoleToAdd, setSelectedRoleToAdd] = useState('');

  // Perk form
  const [editingPerk, setEditingPerk] = useState<any>(null);
  const [perkForm, setPerkForm] = useState({ 
    reward_key: '', 
    hours_required: 0, 
    tickets_required: 0,
    criteria_type: 'hours',
    description: '', 
    reward_type: 'discord_role', 
    reward_value: '' 
  });
  const [savingPerk, setSavingPerk] = useState(false);
  const [testingRole, setTestingRole] = useState<string | null>(null);

  useEffect(() => {
    if (guildId) loadData();
  }, [guildId, activeTab]);

  const loadData = async () => {
    if (!guildId) return;
    setLoading(true);
    try {
      if (activeTab === 'members') {
        const res = await owner.getMembers(guildId);
        setMembers(res.members || []);
      } else if (activeTab === 'perks') {
        const res = await owner.getPerks(guildId);
        setPerks(res.perks || []);
        try {
          const rRes = await owner.getRoles(guildId);
          setRoles(rRes.roles || []);
        } catch {} 
      } else if (activeTab === 'staff') {
        const [rRes, sRes, dRes] = await Promise.all([
            owner.getStaffRoles(guildId),
            owner.getSettings(guildId),
            owner.getRoles(guildId)
        ]);
        setStaffRoles(rRes.roles || []);
        setSettings(sRes || { require_ticket_review: false });
        setRoles(dRes.roles || []);
      } else if (activeTab === 'tickets') {
        const res = await owner.getTicketQueue(guildId);
        setTickets(res.tickets || []);
      } else {
        const mRes = await owner.getMembers(guildId);
        const mList = mRes.members || [];
        const totalHours = mList.reduce((acc: number, m: any) => acc + (m.total_hours || 0), 0);
        setStats({ member_count: mList.length, total_hours: totalHours });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPerk = (perk?: any) => {
    if (perk) {
      setEditingPerk(perk);
      setPerkForm({ 
        reward_key: perk.reward_key, 
        hours_required: perk.hours_required, 
        tickets_required: perk.tickets_required || 0,
        criteria_type: perk.criteria_type || 'hours',
        description: perk.description,
        reward_type: perk.reward_type || 'discord_role',
        reward_value: perk.reward_value || ''
      });
    } else {
      setEditingPerk({}); // new
      setPerkForm({ 
        reward_key: '', 
        hours_required: 10, 
        tickets_required: 5,
        criteria_type: 'hours',
        description: '',
        reward_type: 'discord_role',
        reward_value: ''
      });
    }
  };

  const handleSavePerk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guildId) return;
    setSavingPerk(true);
    try {
      await owner.upsertPerk(guildId, perkForm);
      setEditingPerk(null);
      loadData(); // refresh perks
    } catch (e) {
      console.error(e);
    } finally {
      setSavingPerk(false);
    }
  };

  const handleDeletePerk = async (key: string) => {
    if (!guildId || !confirm('Are you sure you want to delete this perk?')) return;
    try {
      await owner.deletePerk(guildId, key);
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddStaffRole = async () => {
    if (!guildId || !selectedRoleToAdd) return;
    try {
        const role = roles.find(r => r.id === selectedRoleToAdd);
        if (!role) return;
        await owner.addStaffRole(guildId, role.id, role.name);
        setAddingRole(false);
        setSelectedRoleToAdd('');
        loadData();
    } catch (e) {
        console.error(e);
    }
  };

  const handleRemoveStaffRole = async (roleId: string) => {
    if (!guildId) return;
    try {
        await owner.removeStaffRole(guildId, roleId);
        loadData();
    } catch (e) {
        console.error(e);
    }
  };

  const handleUpdateSettings = async (checked: boolean) => {
    if (!guildId) return;
    try {
        setSettings({ ...settings, require_ticket_review: checked });
        await owner.updateSettings(guildId, { require_ticket_review: checked });
    } catch (e) {
        console.error(e);
    }
  };

  const handleReviewTicket = async (ticketId: number, status: 'approved' | 'rejected') => {
    if (!guildId) return;
    try {
        await owner.reviewTicket(guildId, ticketId, status);
        loadData();
    } catch (e) {
        console.error(e);
    }
  };

  const handleTestRole = async (roleId: string) => {
    if (!guildId || !roleId) return;
    setTestingRole(roleId);
    try {
        const res = await owner.testRole(guildId, roleId);
        alert(res.message || 'Role assignment attempted. Check Discord.');
    } catch (e: any) {
        console.error(e);
        alert(e.message || 'Failed to test role assignment');
    } finally {
        setTestingRole(null);
    }
  };

  if (loading && !stats && members.length === 0 && perks.length === 0 && staffRoles.length === 0 && tickets.length === 0) return <div>Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/dashboard/owner" className="p-2 hover:bg-secondary rounded-full transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Community Manager</h1>
          <p className="text-muted-foreground">ID: {guildId}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-border mb-8 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: Award },
          { id: 'members', label: 'Members', icon: Users },
          { id: 'perks', label: 'Perks & Rewards', icon: Award },
          { id: 'staff', label: 'Staff Settings', icon: Shield },
          { id: 'tickets', label: 'Ticket Queue', icon: Ticket },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={cn(
              "px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap",
              activeTab === tab.id 
                ? "border-primary text-primary" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && stats && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-card border border-border p-6 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Members</p>
                <h3 className="text-2xl font-bold">{stats.member_count}</h3>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border p-6 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 text-purple-500 rounded-lg">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Hours Streamed</p>
                <h3 className="text-2xl font-bold">{stats.total_hours}</h3>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'members' && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="font-semibold text-lg">Member Leaderboard</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/50 text-muted-foreground font-medium border-b border-border">
                <tr>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Joined</th>
                  <th className="px-6 py-3 text-right">Total Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4 font-medium">
                      {m.display_name || m.email.split('@')[0]}
                      <div className="text-xs text-muted-foreground font-normal">{m.email}</div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(m.joined_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right font-mono">
                      {m.total_hours}h
                    </td>
                  </tr>
                ))}
                {members.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                      No members have joined this community yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'staff' && (
        <div className="space-y-6">
            <div className="bg-card border border-border p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <SettingsIcon className="h-5 w-5" />
                        Staff Settings
                    </h3>
                </div>
                <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg border border-border">
                    <div>
                        <div className="font-medium">Require Ticket Review</div>
                        <div className="text-sm text-muted-foreground">
                            If enabled, staff points are only awarded after you approve their tickets.
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={settings.require_ticket_review}
                            onChange={(e) => handleUpdateSettings(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                </div>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="p-6 border-b border-border flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-lg">Staff Roles</h3>
                        <p className="text-sm text-muted-foreground">Users with these Discord roles will have access to the Staff Portal.</p>
                    </div>
                    <button 
                        onClick={() => setAddingRole(true)}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Add Role
                    </button>
                </div>

                {addingRole && (
                    <div className="p-4 border-b border-border bg-secondary/20 animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center gap-2">
                            <select 
                                value={selectedRoleToAdd}
                                onChange={(e) => setSelectedRoleToAdd(e.target.value)}
                                className="flex-1 bg-background border border-input rounded-md px-3 py-2 text-sm"
                            >
                                <option value="">Select a Discord Role to add...</option>
                                {roles.filter(r => !staffRoles.find(sr => sr.role_id === r.id)).map(r => (
                                    <option key={r.id} value={r.id}>{r.name}</option>
                                ))}
                            </select>
                            <button 
                                onClick={handleAddStaffRole}
                                disabled={!selectedRoleToAdd}
                                className="bg-green-600 text-white hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Add
                            </button>
                            <button 
                                onClick={() => setAddingRole(false)}
                                className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                <div className="divide-y divide-border">
                    {staffRoles.map(role => (
                        <div key={role.id} className="p-4 flex items-center justify-between hover:bg-secondary/10">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                                    <Shield className="h-4 w-4 text-primary" />
                                </div>
                                <div className="font-medium">{role.role_name}</div>
                            </div>
                            <button 
                                onClick={() => handleRemoveStaffRole(role.role_id)}
                                className="text-muted-foreground hover:text-destructive p-2 rounded-md transition-colors"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                    {staffRoles.length === 0 && (
                        <div className="p-8 text-center text-muted-foreground">
                            No staff roles configured. Add a role to allow access.
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}

      {activeTab === 'tickets' && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-lg">Ticket Review Queue</h3>
                    <p className="text-sm text-muted-foreground">Approve logs to grant staff points.</p>
                </div>
                <div className="text-sm text-muted-foreground">
                    {tickets.filter(t => t.status === 'pending').length} pending
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-secondary/50 text-muted-foreground font-medium border-b border-border">
                        <tr>
                            <th className="px-6 py-3">Staff Member</th>
                            <th className="px-6 py-3">Ticket Ref</th>
                            <th className="px-6 py-3">Notes</th>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {tickets.map(t => (
                            <tr key={t.id} className="hover:bg-secondary/10">
                                <td className="px-6 py-4 font-medium">
                                    {t.display_name}
                                </td>
                                <td className="px-6 py-4 font-mono text-xs">
                                    {t.ticket_ref}
                                </td>
                                <td className="px-6 py-4 max-w-xs truncate text-muted-foreground" title={t.notes}>
                                    {t.notes || '—'}
                                </td>
                                <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                                    {new Date(t.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={cn(
                                        "px-2 py-1 rounded-full text-xs font-medium uppercase",
                                        t.status === 'approved' ? "bg-green-500/20 text-green-500" :
                                        t.status === 'rejected' ? "bg-red-500/20 text-red-500" :
                                        "bg-yellow-500/20 text-yellow-500"
                                    )}>
                                        {t.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {t.status === 'pending' && (
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => handleReviewTicket(t.id, 'approved')}
                                                className="p-1.5 bg-green-500/10 text-green-500 hover:bg-green-500/20 rounded-md transition-colors"
                                                title="Approve"
                                            >
                                                <Check className="h-4 w-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleReviewTicket(t.id, 'rejected')}
                                                className="p-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-md transition-colors"
                                                title="Reject"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {tickets.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                    No tickets found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      )}

      {activeTab === 'perks' && (
        <div className="space-y-6">
           <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Reward Tiers</h3>
              <p className="text-sm text-muted-foreground">Define what users unlock as they accumulate hours or tickets.</p>
            </div>
            <button 
              onClick={() => handleEditPerk()}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium flex items-center gap-2 text-sm"
            >
              <Plus className="h-4 w-4" />
              Add Tier
            </button>
          </div>

          {editingPerk && (
            <div className="bg-card border border-border p-6 rounded-xl animate-in fade-in slide-in-from-top-2">
              <h4 className="font-medium mb-4">{editingPerk.reward_key ? 'Edit Perk' : 'New Perk'}</h4>
              <form onSubmit={handleSavePerk} className="space-y-4 max-w-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1 uppercase text-muted-foreground">Unique ID (Key)</label>
                    <input
                      type="text"
                      value={perkForm.reward_key}
                      onChange={e => setPerkForm({...perkForm, reward_key: e.target.value})}
                      placeholder="e.g. role_vip"
                      className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
                      disabled={!!editingPerk.reward_key && editingPerk.reward_key !== ''} 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 uppercase text-muted-foreground">Criteria Type</label>
                    <select
                        value={perkForm.criteria_type}
                        onChange={e => setPerkForm({...perkForm, criteria_type: e.target.value})}
                        className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
                    >
                        <option value="hours">Hours Streamed</option>
                        <option value="tickets">Staff Tickets</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1 uppercase text-muted-foreground">
                        {perkForm.criteria_type === 'hours' ? 'Hours Required' : 'Tickets Required'}
                    </label>
                    <input
                      type="number"
                      value={perkForm.criteria_type === 'hours' ? perkForm.hours_required : perkForm.tickets_required}
                      onChange={e => {
                          const val = parseInt(e.target.value) || 0;
                          if (perkForm.criteria_type === 'hours') {
                              setPerkForm({...perkForm, hours_required: val});
                          } else {
                              setPerkForm({...perkForm, tickets_required: val});
                          }
                      }}
                      className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
                      required
                    />
                  </div>
                  {/* Spacer or additional settings */}
                  <div></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1 uppercase text-muted-foreground">Reward Type</label>
                    <select
                      value={perkForm.reward_type}
                      onChange={e => setPerkForm({...perkForm, reward_type: e.target.value})}
                      className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
                    >
                      <option value="discord_role">Discord Role</option>
                      <option value="game_command">Game Server Command</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 uppercase text-muted-foreground">
                      {perkForm.reward_type === 'discord_role' ? 'Select Role' : 'Command / Value'}
                    </label>
                    {perkForm.reward_type === 'discord_role' ? (
                      <select
                        value={perkForm.reward_value}
                        onChange={e => setPerkForm({...perkForm, reward_value: e.target.value})}
                        className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
                      >
                        <option value="">-- Select a Role --</option>
                        {roles.map(r => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={perkForm.reward_value}
                        onChange={e => setPerkForm({...perkForm, reward_value: e.target.value})}
                        placeholder="e.g. give_item {user} 1"
                        className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1 uppercase text-muted-foreground">Description</label>
                  <input
                    type="text"
                    value={perkForm.description}
                    onChange={e => setPerkForm({...perkForm, description: e.target.value})}
                    placeholder="e.g. VIP Discord Role"
                    className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <button 
                    type="submit" 
                    disabled={savingPerk}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2"
                  >
                    {savingPerk && <Loader2 className="h-4 w-4 animate-spin" />}
                    Save Perk
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setEditingPerk(null)}
                    className="px-4 py-2 rounded-md text-sm font-medium hover:bg-secondary transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid gap-4">
            {perks.map((perk) => (
              <div key={perk.reward_key} className="flex items-center justify-between p-4 bg-card border border-border rounded-lg group">
                <div className="flex items-center gap-6">
                  <div className="h-12 w-12 bg-secondary rounded-lg flex flex-col items-center justify-center border border-border">
                    <span className="text-lg font-bold">
                        {perk.criteria_type === 'tickets' ? perk.tickets_required : perk.hours_required}
                    </span>
                    <span className="text-[10px] uppercase text-muted-foreground font-bold">
                        {perk.criteria_type === 'tickets' ? 'TIX' : 'HRS'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold">{perk.description}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <code className="bg-secondary/50 px-1 py-0.5 rounded">{perk.reward_key}</code>
                        {perk.criteria_type === 'tickets' && (
                            <span className="flex items-center gap-1 text-blue-400">
                                <Ticket className="h-3 w-3" />
                                Staff Reward
                            </span>
                        )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {perk.reward_type === 'discord_role' && perk.reward_value && (
                    <button
                      onClick={() => handleTestRole(perk.reward_value)}
                      disabled={testingRole === perk.reward_value}
                      className="p-2 hover:bg-secondary text-muted-foreground hover:text-foreground rounded-md transition-colors"
                      title="Test Role Assignment (Assign to you)"
                    >
                      {testingRole === perk.reward_value ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                    </button>
                  )}
                  <button 
                    onClick={() => handleEditPerk(perk)}
                    className="p-2 hover:bg-secondary text-muted-foreground hover:text-foreground rounded-md transition-colors"
                  >
                    <Save className="h-4 w-4" /> 
                  </button>
                  <button 
                    onClick={() => handleDeletePerk(perk.reward_key)}
                    className="p-2 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-md transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            {perks.length === 0 && (
              <div className="text-center py-8 text-muted-foreground bg-secondary/20 rounded-xl border border-dashed border-border">
                No perks defined yet. Create one to motivate your streamers!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
