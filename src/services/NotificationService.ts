// Simulated notification service for SMS and Email alerts
export const NotificationService = {
  sendAlert: (type: string, location: string, value: string, action: string) => {
    const message = `🚨 UoN Alert
Type: ${type}
Location: ${location}
Current Value: ${value}
Action Taken: ${action}
Time: ${new Date().toLocaleString()}
Recipients: supervisor@uonbi.ac.ke, facilities@uonbi.ac.ke
SMS: +254712345678`;
    
    console.log('📧 EMAIL & SMS SENT:', message);
    return { sent: true, timestamp: new Date() };
  }
};
