 # Fix 403 Error on getServices

## Steps:
- [x] 1. Create token expiry validation utility in src/lib/authUtils.ts
- [x] 2. Update src/context/AuthContext.tsx: Add expiry check in initAuth and saveToStorage
- [x] 3. Update src/lib/api.ts: Enhance response interceptor for 403 + logging
- [x] 4. Update src/context/BookingContext.tsx: Add token validation before fetchServices
- [ ] 5. Test: Login → BookingPage → Select date → Check console/Network (no 403)
- [ ] 6. Update this TODO with results

**Next:** Step 5 - Ready to test
