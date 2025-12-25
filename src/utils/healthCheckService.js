/**
 * Backend Health Check Service
 * Monitors backend connectivity periodically and updates global status
 */

import axios from "axios";

const HEALTH_CHECK_INTERVAL = 30000; // 30 seconds
const HEALTH_CHECK_TIMEOUT = 5000; // 5 seconds

class HealthCheckService {
  constructor() {
    this.isHealthy = true;
    this.listeners = [];
    this.lastCheckTime = null;
    this.checkInterval = null;
    this.baseURL = process.env.REACT_APP_BACKEND_URL;
  }

  /**
   * Subscribe to health status changes
   * @param {Function} callback - Called with { isHealthy, lastCheckTime }
   */
  subscribe(callback) {
    this.listeners.push(callback);
    // Immediately notify with current status
    callback({
      isHealthy: this.isHealthy,
      lastCheckTime: this.lastCheckTime,
    });
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  /**
   * Notify all subscribers of status change
   */
  notifyListeners() {
    this.listeners.forEach((callback) => {
      try {
        callback({
          isHealthy: this.isHealthy,
          lastCheckTime: this.lastCheckTime,
        });
      } catch (error) {
        console.error("Error in health check listener:", error);
      }
    });
  }

  /**
   * Perform a single health check
   */
  async performHealthCheck() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        HEALTH_CHECK_TIMEOUT
      );

      const response = await axios.get(
        `${this.baseURL}/mockapis/health/check`,
        {
          signal: controller.signal,
          timeout: HEALTH_CHECK_TIMEOUT,
        }
      );

      clearTimeout(timeoutId);

      const wasUnhealthy = !this.isHealthy;
      this.isHealthy = response.status === 200;
      this.lastCheckTime = new Date();

      // Notify only if status changed
      if (wasUnhealthy !== !this.isHealthy) {
        this.notifyListeners();
      }

      return this.isHealthy;
    } catch (error) {
      const wasHealthy = this.isHealthy;
      this.isHealthy = false;
      this.lastCheckTime = new Date();

      // Notify only if status changed
      if (wasHealthy) {
        this.notifyListeners();
      }

      console.warn("Health check failed:", error.message);
      return false;
    }
  }

  /**
   * Start periodic health checks
   */
  start() {
    if (this.checkInterval) {
      console.warn("Health check already running");
      return;
    }

    // Perform initial check
    this.performHealthCheck();

    // Set up periodic checks
    this.checkInterval = setInterval(() => {
      this.performHealthCheck();
    }, HEALTH_CHECK_INTERVAL);
  }

  /**
   * Stop periodic health checks
   */
  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  /**
   * Get current health status
   */
  getStatus() {
    return {
      isHealthy: this.isHealthy,
      lastCheckTime: this.lastCheckTime,
    };
  }

  /**
   * Force an immediate health check
   */
  forceCheck() {
    return this.performHealthCheck();
  }
}

// Export singleton instance
export const healthCheckService = new HealthCheckService();

export default healthCheckService;
