# Tab Switching Session Fix - Testing Guide

## 🎯 Issue Fixed
**Problem**: Session closes when switching tabs or minimizing browser window
**Root Cause**: Browser pauses JavaScript execution, interrupting auth refresh and session heartbeat
**Solution**: Enhanced visibility change handling and session persistence

## 🔧 Fixes Applied

### 1. **AuthContext Enhancements**
- **Visibility-aware refresh**: Only refresh tokens when tab is visible
- **Session protection**: Skip auth refresh completely during active sessions
- **Smart restart**: Resume refresh when returning to non-session pages

### 2. **LiveSessionRoom Improvements**
- **Tab visibility tracking**: Monitor when tab becomes hidden/visible
- **Background persistence**: Session continues running when tab is hidden
- **Visual indicators**: Show "Background" status when tab is not active
- **Reduced heartbeat**: Skip heartbeat when tab is hidden to reduce server load

### 3. **Session Heartbeat Optimization**
- **Increased interval**: From 30s to 45s to be less aggressive
- **Smart skipping**: Skip heartbeat when tab is hidden
- **Visibility recovery**: Refresh participants when tab becomes visible again

## 🧪 Testing Steps

### **Test 1: Basic Tab Switching**
1. Join a live session
2. Switch to another tab for 2-3 minutes
3. Return to session tab
4. **Expected**: Session should still be active, no logout

### **Test 2: Window Minimization**
1. Join a live session
2. Minimize the browser window for 5+ minutes
3. Restore the window
4. **Expected**: Session remains connected, participants list updates

### **Test 3: Desktop Switching (macOS/Windows)**
1. Join a live session
2. Switch to another desktop/workspace for 10+ minutes
3. Return to the session
4. **Expected**: Session persists, heartbeat resumes automatically

### **Test 4: Long Background Duration**
1. Join a live session
2. Leave tab in background for 20+ minutes
3. Return to session tab
4. **Expected**: Session still active, no authentication errors

## 📊 Visual Indicators

### **Connection Status Indicators**
- 🟢 **Green dot**: Connected and active
- 🟡 **Yellow dot**: Connecting/reconnecting
- 🔴 **Red dot**: Disconnected
- 🟠 **Amber "Background"**: Tab running in background

### **Console Logging**
Monitor browser console for these messages:
```
[AuthContext] Tab hidden during session - pausing auth refresh
[LiveSessionRoom] Tab became hidden - session will persist in background
[LiveSessionRoom] Skipping heartbeat - tab is hidden
[LiveSessionRoom] Tab became visible - ensuring session is active
[LiveSessionRoom] Session confirmed active after tab visibility change
```

## 🎯 Success Criteria

### ✅ **Session Persistence**
- No automatic logout when switching tabs
- No "session closed" errors
- Participant count remains accurate
- Media streams continue working

### ✅ **Performance Optimization**
- Reduced server requests when tab is hidden
- No unnecessary auth refresh during sessions
- Efficient resource usage in background

### ✅ **User Experience**
- Seamless tab switching experience
- Clear visual feedback about session state
- No interruption to ongoing sessions
- Automatic recovery when returning to tab

## 🚨 Troubleshooting

### **If Session Still Closes**
1. Check browser console for auth errors
2. Verify backend token refresh is working
3. Check if participant cleanup is too aggressive
4. Monitor network requests during tab switches

### **If Performance Issues**
1. Verify heartbeat is skipping when hidden
2. Check auth refresh is paused during sessions
3. Monitor memory usage during long sessions

## 🔄 Backend Compatibility

The fixes work with the enhanced backend that includes:
- Safe token refresh with error handling
- Participant deduplication
- Session cleanup endpoints
- Enhanced logging

## 📝 Notes

- **Browser Behavior**: Different browsers handle tab visibility differently
- **Mobile Considerations**: Mobile browsers are more aggressive with background tabs
- **Network Changes**: WiFi/cellular switches may still cause brief disconnections
- **Long Sessions**: Very long sessions (hours) may still need periodic refresh

---

**🎉 The session should now remain stable when switching tabs or minimizing the browser!**
