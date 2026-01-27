import { useState, useCallback } from "react";
import { toast } from "@/hooks/use-toast";

export interface Notification {
  id: string;
  type: "sms" | "email";
  recipient: string;
  subject: string;
  message: string;
  timestamp: Date;
  status: "sent" | "pending" | "failed";
  problem: string;
  recommendation: string;
  actionTaken: string;
}

// Simulated contacts for exam supervisors and facility managers
const CONTACTS = {
  supervisors: [
    { name: "Dr. James Ochieng", phone: "+254712345678", email: "j.ochieng@uonbi.ac.ke", role: "Chief Exam Supervisor" },
    { name: "Prof. Mary Wanjiku", phone: "+254723456789", email: "m.wanjiku@uonbi.ac.ke", role: "Deputy Supervisor" },
  ],
  facilityManagers: [
    { name: "Eng. Peter Kimani", phone: "+254734567890", email: "p.kimani@uonbi.ac.ke", role: "Facility Manager" },
    { name: "Mr. John Mwangi", phone: "+254745678901", email: "j.mwangi@uonbi.ac.ke", role: "Technical Officer" },
  ],
};

export function useAlertNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isSending, setIsSending] = useState(false);

  const sendNotification = useCallback(async (
    problem: string,
    recommendation: string,
    actionTaken: string,
    location: string,
    severity: "warning" | "critical"
  ) => {
    setIsSending(true);
    
    const allContacts = [...CONTACTS.supervisors, ...CONTACTS.facilityManagers];
    const newNotifications: Notification[] = [];

    // Simulate sending SMS and Email to all contacts
    for (const contact of allContacts) {
      const subject = `🚨 ${severity.toUpperCase()} ALERT: Environmental Issue at ${location}`;
      const message = `
ENVIRONMENTAL MONITORING ALERT
Location: ${location}
Severity: ${severity.toUpperCase()}
Time: ${new Date().toLocaleString()}

PROBLEM DETECTED:
${problem}

RECOMMENDATION:
${recommendation}

ACTION TAKEN:
${actionTaken}

Please monitor the situation and take additional measures if necessary.

- UoN C4DLab Environmental Monitoring System
      `.trim();

      // Simulate SMS notification
      newNotifications.push({
        id: `sms-${Date.now()}-${contact.phone}`,
        type: "sms",
        recipient: `${contact.name} (${contact.phone})`,
        subject: `ALERT: ${problem.substring(0, 50)}`,
        message: message.substring(0, 160), // SMS character limit
        timestamp: new Date(),
        status: "sent",
        problem,
        recommendation,
        actionTaken,
      });

      // Simulate Email notification
      newNotifications.push({
        id: `email-${Date.now()}-${contact.email}`,
        type: "email",
        recipient: `${contact.name} <${contact.email}>`,
        subject,
        message,
        timestamp: new Date(),
        status: "sent",
        problem,
        recommendation,
        actionTaken,
      });
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setNotifications(prev => [...newNotifications, ...prev]);
    setIsSending(false);

    toast({
      title: "Notifications Sent",
      description: `Sent ${newNotifications.length} alerts to supervisors and facility managers`,
    });

    return newNotifications;
  }, []);

  return {
    notifications,
    isSending,
    sendNotification,
    contacts: CONTACTS,
  };
}
