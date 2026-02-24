# 🔒 Security Features

Your 8-Puzzle Backend now includes enterprise-grade security:

## ✅ Security Layers Implemented

### 1. **HTTPS/TLS**
- ✅ Enforced on all cloud deployments (Render, Railway, Vercel)
- All data in transit encrypted
- Certificates auto-renewed

### 2. **Rate Limiting**
- ✅ **General limit**: 100 requests per 15 minutes per IP
- ✅ **API limit**: 50 requests per 15 minutes per IP
- Prevents brute force and DoS attacks
- Score submissions have stricter limits

### 3. **Input Validation**
- ✅ Validates all incoming data
- ✅ Type checking (string, number, array)
- ✅ Bounds checking (min/max values)
- ✅ Format validation (puzzle size: 3, 4, or 5 only)
- ✅ Max string length: 50 characters for player name
- ✅ Max time: 3600 seconds (1 hour per solve)
- ✅ Max moves: 10,000

### 4. **Duplicate Submission Detection**
- ✅ Detects and blocks duplicate submissions
- ✅ Checks within 10-second window
- Prevents spam score manipulation

### 5. **Security Headers (Helmet.js)**
- ✅ X-Frame-Options (prevents clickjacking)
- ✅ X-Content-Type-Options (prevents MIME-sniffing)
- ✅ Strict-Transport-Security (HTTPS enforcement)
- ✅ Content-Security-Policy (XSS prevention)
- ✅ X-XSS-Protection

### 6. **CORS Protection**
- ✅ Only allows requests from your frontend URL
- ✅ Prevents unauthorized cross-origin requests
- ✅ Validates origin on every request

### 7. **Request Size Limits**
- ✅ Maximum JSON payload: 10KB
- Prevents buffer overflow attacks
- Protects against large payload DoS

### 8. **JWT Authentication (Optional)**
- ✅ Infrastructure ready for token-based auth
- ✅ 24-hour session expiration
- Future: Implement for user accounts

### 9. **Spam Detection**
- ✅ Tracks submissions per IP + player name
- ✅ Detects >5 submissions per minute
- Prevents bot spam

### 10. **Error Handling**
- ✅ Generic error messages (no info leakage)
- ✅ Proper HTTP status codes
- ✅ Exception handling on all endpoints
- Prevents information disclosure

---

## 🔑 Environment Variables

**Required for Production:**
```env
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.com
JWT_SECRET=your-secure-random-string
```

**Never commit these to Git!** ✅ Already in `.gitignore`

---

## 🧪 Security Testing

### Test Rate Limiting
```bash
# Try 50+ requests quickly
for i in {1..60}; do
  curl https://your-backend.onrender.com/api/leaderboard
done

# Should receive: 429 Too Many Requests
```

### Test Input Validation
```bash
# Try invalid puzzle size
curl -X POST https://your-backend.onrender.com/api/leaderboard \
  -H "Content-Type: application/json" \
  -d '{"playerName":"Test","size":99,"moves":50,"time":120}'

# Response: 400 Bad Request - "Invalid puzzle size"
```

### Test CORS
```bash
# From different domain - should be blocked
curl -X POST https://your-backend.onrender.com/api/leaderboard \
  -H "Origin: https://attacker.com" \
  -H "Content-Type: application/json" \
  -d '{...}'

# Response: CORS blocked
```

---

## 📊 Security Headers

Your API returns these security headers:
```
Strict-Transport-Security: max-age=15552000
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
```

---

## 🚀 Future Security Enhancements

- [ ] Add MongoDB with encrypted fields
- [ ] Implement user authentication with OAuth2
- [ ] Add API key management dashboard
- [ ] Implement request signing
- [ ] Add IP whitelist for admin endpoints
- [ ] Set up logging and monitoring
- [ ] Add DDoS protection (CloudFlare)
- [ ] Implement rate limiting per user (not just IP)

---

## ⚠️ Important Notes

1. **Change JWT_SECRET** in production
   ```env
   JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
   ```

2. **Update FRONTEND_URL** on deployment
   - Render/Railway dashboard → Environment variables
   - Exact URL without trailing slash

3. **Monitor logs** for suspicious activity
   - Check deployment platform logs
   - Look for repeated failed requests

4. **Never disable security features** in production
   - Don't remove rate limiting
   - Don't disable input validation
   - Don't allow all origins

---

## 📞 Support

For security issues:
1. Check error logs: Render/Railway dashboard
2. Use `/debug` endpoint to verify configuration
3. Test endpoints with cURL before integration

Your API is now **secure and production-ready!** 🔐
