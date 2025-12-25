# Error Handling & Monitoring Implementation Guide

## Overview
This document outlines the comprehensive error handling, monitoring, and user feedback systems implemented across the application.

---

## 📋 Files Created & Modified

### New Files Created

#### 1. `src/utils/errorHandler.js`
**Purpose**: Centralized error parsing and handling utility

**Key Features**:
- Parse errors from various sources (Axios, Network, Timeout)
- Generate user-friendly error messages
- Classify errors by type (NETWORK_ERROR, UNAUTHORIZED, SERVER_ERROR, etc.)
- Validate Razorpay payment responses
- Helper functions: `parseError()`, `isAuthError()`, `isNetworkError()`, `isServerError()`

**Usage**:
```javascript
import { parseError, isAuthError } from "../utils/errorHandler";

try {
  const response = await axios.get(url);
} catch (error) {
  const parsedError = parseError(error);
  if (isAuthError(parsedError)) {
    // Handle auth error
  }
}
```

---

#### 2. `src/components/ErrorDisplayModal.js`
**Purpose**: Professional error display modal and toast components

**Key Components**:
- `ErrorDisplayModal`: Full-screen modal for detailed error display
  - Shows error icon based on error type
  - Displays error type badge
  - Shows status code if available
  - Optional expandable details section
  - Retry and Close buttons
  - Professional styling with Tailwind

- `ErrorToast`: Toast notification for non-blocking errors
  - Automatically closes after duration
  - Can be dismissed manually

**Usage**:
```javascript
<ErrorDisplayModal
  isOpen={!!errorMsg}
  message={errorMsg}
  errorType="RAZORPAY_ERROR"
  statusCode={error?.response?.status}
  onClose={() => setErrorMsg(null)}
  onRetry={handleRetry}
  showDetails={false}
/>
```

---

#### 3. `src/utils/healthCheckService.js`
**Purpose**: Backend health monitoring service

**Key Features**:
- Periodic health checks every 30 seconds
- Observable pattern for status updates
- Singleton instance
- Methods:
  - `start()`: Begin health checks
  - `stop()`: Stop health checks
  - `subscribe(callback)`: Subscribe to status changes
  - `forceCheck()`: Immediate health check
  - `getStatus()`: Get current status

**Usage**:
```javascript
import { healthCheckService } from "../utils/healthCheckService";

useEffect(() => {
  const unsubscribe = healthCheckService.subscribe((status) => {
    console.log(status.isHealthy); // true or false
  });
  return () => unsubscribe();
}, []);

// Force a check
healthCheckService.forceCheck();
```

---

#### 4. `src/components/ConnectionStatusIndicator.js`
**Purpose**: Visual indicator of backend connection status

**Features**:
- Shows only when connection is unhealthy
- Animated pulse indicator
- Expandable details section
- Troubleshooting tips
- "Try Connecting Now" button
- Displays last check time

**Integration**: Added to App component - appears on all pages when connection fails

---

#### 5. `src/utils/apiService.js`
**Purpose**: Centralized API client with interceptors and error handling

**Key Features**:
- Custom axios instance with timeout (10s)
- Request/response interceptors
- Automatic error logging
- Request queue for failed requests
- Helper methods: `apiGet()`, `apiPost()`, `apiPut()`, `apiDelete()`

**Usage**:
```javascript
import { apiGet, apiPost } from "../utils/apiService";

try {
  const response = await apiGet("/path/to/endpoint");
  const result = await apiPost("/path/to/endpoint", { data });
} catch (error) {
  // error is already parsed by errorHandler
}
```

---

### Modified Files

#### 1. `src/App.js`
**Changes**:
- Added `useEffect` to start health checks on app mount
- Integrated `ConnectionStatusIndicator` component
- Health checks stop on app unmount

---

#### 2. `src/components/Error.js`
**Changes**:
- Replaced minimal error page with professional error boundary page
- Shows error status codes
- Displays helpful navigation options
- Includes contact support information
- Proper styling matching app theme

---

#### 3. `src/components/SummaryPage.js`
**Changes**:
- Integrated `ErrorDisplayModal` for professional error display
- Enhanced Razorpay error handling with validation
- Added detailed error messages for payment failures
- Improved payment flow with step-by-step error handling:
  1. Razorpay SDK loading
  2. Order creation
  3. Payment processing
  4. Verification
- Session expiration handling with redirect to login
- Network error detection and user feedback

---

#### 4. `src/components/APIDocumentationGeneralPage.js`
**Changes**:
- Added comprehensive API Authentication section
- Explains x-api-key and x-secret-key requirements
- Postman integration instructions
- Security warnings about secret key protection
- Download button loading states
- Error notification toast
- Enhanced error handling for:
  - API documentation fetch
  - File downloads
  - Session expiration

---

#### 5. `src/components/WalletAndRechargesPage.js`
**Changes**:
- Fixed invoice download function with proper error handling
- Added try-catch for network errors
- Better error messages for different failure scenarios
- Timeout handling for downloads

---

## 🔄 Error Handling Flow

### 1. **API Request Flow**
```
Request → API Service → Error Handler → Parsed Error → Component Error Handler → UI Display
```

### 2. **Error Classification**
```
Error Source
├── Axios Response Error (400, 401, 403, 404, 500, etc.)
├── Network Error (ERR_NETWORK, ENOTFOUND)
├── Timeout Error (ECONNABORTED)
├── Validation Error (400)
├── Auth Error (401)
├── Server Error (500-504)
└── Unknown Error
```

### 3. **User Notification**
- **Critical Errors**: ErrorDisplayModal (blocks interaction)
- **Non-blocking Errors**: ErrorToast (auto-dismiss)
- **Connection Issues**: ConnectionStatusIndicator (banner)

---

## 🛡️ Razorpay Error Handling

### Error Scenarios Covered
1. **SDK Load Failure**: Clear message, no payment attempt
2. **Order Creation Failure**: User can retry with same data
3. **Payment Modal Dismissal**: Graceful handling
4. **Verification Failure**: Detailed error with support info
5. **Network Errors**: Timeout detection and recovery

### Response Validation
```javascript
const validation = validateRazorpayResponse(response);
if (!validation.success) {
  setErrorMsg(validation.message);
  // Handle error
}
```

---

## 📡 Health Check System

### How It Works
1. **Interval**: Every 30 seconds
2. **Endpoint**: `GET ${process.env.REACT_APP_BACKEND_URL}/mockapis/health/check`
3. **Timeout**: 5 seconds
4. **Status Updates**: Notify subscribers on change
5. **No Alerts**: Only show banner if unhealthy

### Subscription Example
```javascript
const unsubscribe = healthCheckService.subscribe(({ isHealthy, lastCheckTime }) => {
  if (!isHealthy) {
    // Show banner
  } else {
    // Hide banner
  }
});
```

---

## 🔐 API Authentication Information

### Required Headers
```
x-api-key: Your unique API key (get from Dashboard)
x-secret-key: Your secret key (keep confidential!)
```

### Postman Setup
1. Download collection from API Documentation page
2. Create environment variables:
   - `api_key` = your x-api-key
   - `secret_key` = your x-secret-key
3. All requests automatically include headers

### Security Best Practices
- ❌ Never commit secrets to Git
- ❌ Never expose x-secret-key in client-side code
- ❌ Never log sensitive keys
- ✅ Rotate keys regularly
- ✅ Use environment variables
- ✅ Server-to-server communication only for secrets

---

## 📊 Error Types Reference

| Type | Status Code | User Message | Action |
|------|------------|--------------|--------|
| VALIDATION_ERROR | 400 | Invalid input fields shown | Correct and retry |
| UNAUTHORIZED | 401 | Session expired, redirect login | Go to login |
| FORBIDDEN | 403 | Permission denied | Contact support |
| NOT_FOUND | 404 | Resource not found | Navigate elsewhere |
| SERVER_ERROR | 500+ | Server error, try later | Retry or contact |
| NETWORK_ERROR | - | Connection failed | Check internet |
| TIMEOUT | - | Request too slow | Retry operation |
| RAZORPAY_ERROR | - | Payment failed | Retry or support |

---

## 🎯 Component Integration Checklist

- [x] App.js - Health check integration
- [x] Error.js - Professional error page
- [x] SummaryPage.js - Razorpay error handling
- [x] APIDocumentationGeneralPage.js - API key docs
- [x] WalletAndRechargesPage.js - Download error handling
- [x] ConnectionStatusIndicator.js - Connection monitoring
- [x] ErrorDisplayModal.js - Error UI components
- [x] errorHandler.js - Error utilities
- [x] apiService.js - Centralized API client
- [x] healthCheckService.js - Health monitoring

---

## 🚀 Best Practices

### 1. Error Handling Template
```javascript
const [error, setError] = useState(null);
const [isLoading, setIsLoading] = useState(false);

const handleAction = async () => {
  setIsLoading(true);
  setError(null);
  try {
    // API call
    const response = await axios.get(url);
    // Success handling
  } catch (error) {
    const parsedError = parseError(error);
    
    if (isAuthError(parsedError)) {
      dispatch(removeloggedInUser());
      navigate("/user-login");
    } else {
      setError(parsedError.message);
    }
  } finally {
    setIsLoading(false);
  }
};
```

### 2. Timeout Configuration
All API calls have 10-second default timeout
For long operations, specify custom timeout:
```javascript
axios.get(url, { timeout: 30000 }); // 30 seconds
```

### 3. Logging
- Development: Detailed request/response logs
- Production: Errors only
- Format: `[ERROR_TYPE] Status Code: Message`

---

## 📝 Testing Scenarios

### Test Cases
1. ✓ Network disconnection → ConnectionStatusIndicator shows
2. ✓ 401 Unauthorized → Redirect to login
3. ✓ 500 Server error → Show error modal with retry
4. ✓ Razorpay SDK fail → Graceful error message
5. ✓ Payment timeout → Timeout error, suggest retry
6. ✓ Form validation → Field-level errors shown
7. ✓ Download failure → Toast error notification
8. ✓ Session timeout → Redirect + notify user

---

## 🔧 Configuration

### Environment Variables Required
```env
REACT_APP_BACKEND_URL=http://localhost:8888
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key
```

### Health Check Parameters
- Interval: 30 seconds (can adjust in healthCheckService.js)
- Timeout: 5 seconds
- Endpoint: `${process.env.REACT_APP_BACKEND_URL}/mockapis/health/check`

---

## 📚 Additional Resources

### Related Files
- Error messages: `src/utils/errorHandler.js`
- UI Components: `src/components/ErrorDisplayModal.js`
- Services: `src/utils/healthCheckService.js`, `src/utils/apiService.js`
- Styling: Tailwind CSS (all components)

### Modification Guide
To add error handling to new components:
1. Import `parseError`, `isAuthError` from errorHandler
2. Import `ErrorDisplayModal` or `ErrorToast`
3. Add error state management
4. Wrap API calls in try-catch
5. Display errors with appropriate modal/toast

---

## ✅ Summary

This implementation provides:
- **Robust Error Handling**: Comprehensive error parsing and user feedback
- **Real-time Monitoring**: Backend health checks with visual indicators
- **Payment Security**: Detailed Razorpay error handling and validation
- **User Experience**: Professional error messages and recovery options
- **Developer Experience**: Centralized error utilities and API service
- **Security**: API key documentation and best practices
- **Scalability**: Reusable error patterns for new components

All errors are handled professionally, displayed to users clearly, and logged for debugging.
