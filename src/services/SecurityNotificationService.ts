import { auth, db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface DeviceInfo {
  browser: string;
  os: string;
  device: string;
}

interface LocationInfo {
  city?: string;
  country?: string;
  ip: string;
}

export class SecurityNotificationService {
  private static async getDeviceInfo(): Promise<DeviceInfo> {
    const userAgent = window.navigator.userAgent;
    return {
      browser: this.getBrowserInfo(userAgent),
      os: this.getOSInfo(userAgent),
      device: this.getDeviceType(userAgent)
    };
  }

  private static getBrowserInfo(userAgent: string): string {
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown Browser';
  }

  private static getOSInfo(userAgent: string): string {
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'MacOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Unknown OS';
  }

  private static getDeviceType(userAgent: string): string {
    if (userAgent.includes('Mobile')) return 'Mobile';
    if (userAgent.includes('Tablet')) return 'Tablet';
    return 'Desktop';
  }

  private static async getLocationInfo(): Promise<LocationInfo> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const { ip } = await response.json();
      
      const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`);
      const geoData = await geoResponse.json();
      
      return {
        city: geoData.city,
        country: geoData.country_name,
        ip,
      };
    } catch (error) {
      console.error('Error getting location info:', error);
      return {
        ip: 'Unknown',
      };
    }
  }

  public static async notifyNewLogin() {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const deviceInfo = await this.getDeviceInfo();
      const locationInfo = await this.getLocationInfo();
      const timestamp = new Date().toISOString();

      // Enregistrer les informations de connexion dans Firestore
      await addDoc(collection(db, 'login_history'), {
        userId: user.uid,
        email: user.email,
        timestamp: serverTimestamp(),
        device: deviceInfo,
        location: locationInfo
      });

    } catch (error) {
      console.error('Error logging login:', error);
    }
  }
}
