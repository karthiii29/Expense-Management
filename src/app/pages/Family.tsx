import { useState } from "react";
import {
  UserPlus, Shield, Eye, Edit, Crown, CheckCircle,
  ArrowRight, ChevronDown, Users, DollarSign,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { familyMembers, settlementData, expenses } from "../data/mockData";

type Role = "Admin" | "Editor" | "Viewer";

const roleConfig: Record<Role, { icon: any; color: string; desc: string }> = {
  Admin: { icon: Crown, color: "#F59E0B", desc: "Full access to all features" },
  Editor: { icon: Edit, color: "#00D4FF", desc: "Can add and edit expenses" },
  Viewer: { icon: Eye, color: "#8B5CF6", desc: "Can only view expenses" },
};

export function Family() {
  const [members, setMembers] = useState(familyMembers);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<Role>("Viewer");
  const [activeTab, setActiveTab] = useState<"members" | "settlement">("members");

  const getOwedAmount = (memberId: string) => {
    return settlementData
      .filter((s) => s.from === memberId && s.status === "pending")
      .reduce((sum, s) => sum + s.amount, 0);
  };

  const getMemberName = (id: string) => {
    return members.find((m) => m.id === id)?.name || "Unknown";
  };

  const totalPending = settlementData
    .filter((s) => s.status === "pending")
    .reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="min-h-screen" style={{ background: "var(--iq-bg)" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-20 px-4 lg:px-8 py-4"
        style={{
          background: "var(--iq-header)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--iq-border)",
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: 700, color: "var(--iq-text-1)" }}>Family</h1>
            <p style={{ fontSize: "12px", color: "var(--iq-text-4)" }}>{members.length} members · ₹{totalPending.toLocaleString("en-IN")} to settle</p>
          </div>
          <button
            onClick={() => setAddMemberOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl"
            style={{
              background: "var(--iq-accent-grad)",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 600,
              boxShadow: "0 4px 16px var(--iq-accent-glow)",
            }}
          >
            <UserPlus className="w-4 h-4" />
            Add Member
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-4 p-1 rounded-xl" style={{ background: "var(--iq-surface)" }}>
          {(["members", "settlement"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-2 rounded-lg transition-all capitalize"
              style={{
                background: activeTab === tab ? "var(--iq-accent-s2)" : "transparent",
                border: activeTab === tab ? "1px solid var(--iq-accent-b)" : "1px solid transparent",
                color: activeTab === tab ? "var(--iq-accent)" : "var(--iq-text-3)",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              {tab === "members" ? "Members" : "Settlement"}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 lg:px-8 py-6">
        {activeTab === "members" ? (
          <div className="space-y-4">
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3 mb-2">
              {[
                { label: "Total Members", value: members.length.toString(), color: "var(--iq-accent)" },
                { label: "Admins", value: members.filter((m) => m.role === "Admin").length.toString(), color: "#F59E0B" },
                { label: "Pending", value: `₹${totalPending.toLocaleString("en-IN")}`, color: "#EF4444" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="p-3 rounded-xl text-center"
                  style={{ background: "var(--iq-surface)", border: "1px solid var(--iq-border)" }}
                >
                  <p style={{ fontSize: "16px", fontWeight: 700, color: s.color }}>{s.value}</p>
                  <p style={{ fontSize: "11px", color: "var(--iq-text-4)" }}>{s.label}</p>
                </div>
              ))}
            </div>

            {members.map((member, i) => {
              const RoleIcon = roleConfig[member.role].icon;
              const memberExpenses = expenses.filter((e) => e.paidBy === member.id);
              const totalPaid = memberExpenses.reduce((s, e) => s + e.amount, 0);
              const owes = getOwedAmount(member.id);

              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl p-5"
                  style={{
                    background: "var(--iq-surface)",
                    border: "1px solid var(--iq-border)",
                  }}
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${member.color}40, ${member.color}20)`,
                        border: `2px solid ${member.color}40`,
                        fontSize: "16px",
                        fontWeight: 700,
                        color: member.color,
                      }}
                    >
                      {member.avatar}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--iq-text-1)" }}>{member.name}</h3>
                        <div
                          className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                          style={{ background: roleConfig[member.role].color + "20" }}
                        >
                          <RoleIcon className="w-3 h-3" style={{ color: roleConfig[member.role].color }} />
                          <span style={{ fontSize: "10px", fontWeight: 600, color: roleConfig[member.role].color }}>
                            {member.role}
                          </span>
                        </div>
                      </div>
                      <p style={{ fontSize: "13px", color: "var(--iq-text-4)" }}>{member.email}</p>

                      {/* Stats */}
                      <div className="flex gap-4 mt-3">
                        <div>
                          <p style={{ fontSize: "11px", color: "var(--iq-text-4)" }}>Total Paid</p>
                          <p style={{ fontSize: "14px", fontWeight: 600, color: "#10B981" }}>
                            ₹{totalPaid.toLocaleString("en-IN")}
                          </p>
                        </div>
                        {owes > 0 && (
                          <div>
                            <p style={{ fontSize: "11px", color: "var(--iq-text-4)" }}>Owes</p>
                            <p style={{ fontSize: "14px", fontWeight: 600, color: "#EF4444" }}>
                              ₹{owes.toLocaleString("en-IN")}
                            </p>
                          </div>
                        )}
                        <div>
                          <p style={{ fontSize: "11px", color: "var(--iq-text-4)" }}>Transactions</p>
                          <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--iq-text-2)" }}>
                            {memberExpenses.length}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Change Role */}
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <div className="relative">
                        <select
                          value={member.role}
                          onChange={(e) => {
                            setMembers((prev) =>
                              prev.map((m) =>
                                m.id === member.id ? { ...m, role: e.target.value as Role } : m
                              )
                            );
                          }}
                          className="appearance-none px-3 py-2 pr-7 rounded-xl outline-none"
                          style={{
                            background: "var(--iq-surface-h)",
                            border: "1px solid var(--iq-border-s)",
                            color: "var(--iq-text-2)",
                            fontSize: "12px",
                            cursor: "pointer",
                          }}
                        >
                          <option value="Admin">Admin</option>
                          <option value="Editor">Editor</option>
                          <option value="Viewer">Viewer</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" style={{ color: "var(--iq-text-4)" }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Settlement Summary */}
            <div
              className="rounded-2xl p-5"
              style={{ background: "var(--iq-surface)", border: "1px solid var(--iq-border)" }}
            >
              <h3 style={{ fontSize: "15px", fontWeight: 600, color: "var(--iq-text-1)", marginBottom: "16px" }}>
                Settlement Summary
              </h3>
              <div className="space-y-3">
                {settlementData.map((settlement, i) => {
                  const fromMember = members.find((m) => m.id === settlement.from);
                  const toMember = members.find((m) => m.id === settlement.to);
                  if (!fromMember || !toMember) return null;

                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-4 p-4 rounded-xl"
                      style={{
                        background: "var(--iq-surface-h)",
                        border: settlement.status === "settled"
                          ? "1px solid rgba(16,185,129,0.2)"
                          : "1px solid rgba(239,68,68,0.15)",
                      }}
                    >
                      {/* From */}
                      <div className="flex items-center gap-2 flex-1">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{
                            background: fromMember.color + "30",
                            fontSize: "11px",
                            fontWeight: 700,
                            color: fromMember.color,
                          }}
                        >
                          {fromMember.avatar}
                        </div>
                        <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--iq-text-2)" }}>
                          {fromMember.name.split(" ")[0]}
                        </p>
                      </div>

                      {/* Arrow & Amount */}
                      <div className="flex flex-col items-center gap-1">
                        <p style={{ fontSize: "14px", fontWeight: 700, color: settlement.status === "settled" ? "#10B981" : "#F59E0B" }}>
                          ₹{settlement.amount.toLocaleString("en-IN")}
                        </p>
                        <ArrowRight className="w-4 h-4" style={{ color: "var(--iq-text-4)" }} />
                      </div>

                      {/* To */}
                      <div className="flex items-center gap-2 flex-1 justify-end">
                        <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--iq-text-2)" }}>
                          {toMember.name.split(" ")[0]}
                        </p>
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{
                            background: toMember.color + "30",
                            fontSize: "11px",
                            fontWeight: 700,
                            color: toMember.color,
                          }}
                        >
                          {toMember.avatar}
                        </div>
                      </div>

                      {/* Status / Action */}
                      {settlement.status === "settled" ? (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full flex-shrink-0" style={{ background: "rgba(16,185,129,0.15)" }}>
                          <CheckCircle className="w-3 h-3" style={{ color: "#10B981" }} />
                          <span style={{ fontSize: "10px", fontWeight: 600, color: "#10B981" }}>Settled</span>
                        </div>
                      ) : (
                        <button
                          className="px-3 py-1.5 rounded-xl flex-shrink-0"
                          style={{
                            background: "var(--iq-accent-grad)",
                            color: "#fff",
                            fontSize: "12px",
                            fontWeight: 600,
                          }}
                        >
                          Settle
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Settle All CTA */}
              <button
                className="w-full mt-4 py-3 rounded-xl flex items-center justify-center gap-2"
                style={{
                  background: "var(--iq-accent-grad)",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 600,
                  boxShadow: "0 4px 20px var(--iq-accent-glow)",
                }}
              >
                <DollarSign className="w-4 h-4" />
                Settle All (₹{totalPending.toLocaleString("en-IN")})
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      <AnimatePresence>
        {addMemberOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50"
              style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
              onClick={() => setAddMemberOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed inset-x-4 bottom-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[440px] z-50 rounded-2xl p-6"
              style={{
                background: "var(--iq-modal)",
                border: "1px solid var(--iq-border-s)",
                boxShadow: "0 25px 80px rgba(0,0,0,0.4)",
              }}
            >
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--iq-text-1)", marginBottom: "20px" }}>
                Add Family Member
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--iq-text-2)" }}>Full Name</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. John Johnson"
                    className="w-full px-4 py-3 rounded-xl outline-none"
                    style={{
                      background: "var(--iq-surface)",
                      border: "1px solid var(--iq-border-s)",
                      color: "var(--iq-text-1)",
                      fontSize: "14px",
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--iq-text-2)" }}>Email</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="email@family.com"
                    className="w-full px-4 py-3 rounded-xl outline-none"
                    style={{
                      background: "var(--iq-surface)",
                      border: "1px solid var(--iq-border-s)",
                      color: "var(--iq-text-1)",
                      fontSize: "14px",
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--iq-text-2)" }}>Permission</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["Admin", "Editor", "Viewer"] as Role[]).map((role) => {
                      const RoleIcon = roleConfig[role].icon;
                      return (
                        <button
                          key={role}
                          onClick={() => setNewRole(role)}
                          className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all"
                          style={{
                            background: newRole === role ? roleConfig[role].color + "20" : "var(--iq-surface)",
                            border: newRole === role ? `1px solid ${roleConfig[role].color}40` : "1px solid var(--iq-border)",
                          }}
                        >
                          <RoleIcon className="w-5 h-5" style={{ color: newRole === role ? roleConfig[role].color : "var(--iq-text-4)" }} />
                          <span style={{ fontSize: "12px", fontWeight: 600, color: newRole === role ? roleConfig[role].color : "var(--iq-text-3)" }}>
                            {role}
                          </span>
                          <span style={{ fontSize: "10px", color: "var(--iq-text-4)", textAlign: "center" }}>
                            {roleConfig[role].desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setAddMemberOpen(false)}
                    className="flex-1 py-3 rounded-xl"
                    style={{
                      background: "var(--iq-surface)",
                      color: "var(--iq-text-3)",
                      fontSize: "14px",
                      fontWeight: 600,
                      border: "1px solid var(--iq-border)",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (newName && newEmail) {
                        const initials = newName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
                        setMembers((prev) => [
                          ...prev,
                          {
                            id: Date.now().toString(),
                            name: newName,
                            email: newEmail,
                            avatar: initials,
                            role: newRole,
                            color: ["#00D4FF", "#8B5CF6", "#10B981", "#F59E0B", "#EC4899"][Math.floor(Math.random() * 5)],
                          },
                        ]);
                        setNewName("");
                        setNewEmail("");
                        setAddMemberOpen(false);
                      }
                    }}
                    className="flex-1 py-3 rounded-xl"
                    style={{
                      background: "var(--iq-accent-grad)",
                      color: "#fff",
                      fontSize: "14px",
                      fontWeight: 600,
                      boxShadow: "0 4px 20px var(--iq-accent-glow)",
                    }}
                  >
                    Add Member
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}