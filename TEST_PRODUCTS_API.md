# Testing Products API

## Backend Test:
```bash
curl http://localhost:5000/api/products
```

**Expected:** Should return 45 products with populated categories

## Frontend Test:

1. Open browser console (F12)
2. Go to Admin → Products page
3. Check console for errors
4. Run this in console:
```javascript
fetch('http://localhost:5000/api/products')
  .then(r => r.json())
  .then(d => console.log('Products:', d.data.length, 'items'))
```

## Common Issues:

### Issue 1: Frontend not refreshing
**Solution:** Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Issue 2: CORS error
**Check:** Backend should show CORS enabled for localhost:3000

### Issue 3: Products array empty
**Check:** Run `applyFilters()` is being called after products load

### Issue 4: Browser cache
**Solution:** Clear browser cache or open incognito window

## Debug Steps:

1. Check if backend is running: `curl http://localhost:5000/api/products`
2. Check if frontend can reach backend: Open Network tab, refresh page
3. Check console for JavaScript errors
4. Check if `filteredProducts` state is being set

## Quick Fix:

If products still don't show:
1. Stop frontend (Ctrl+C)
2. Clear browser cache
3. Restart frontend: `npm run dev`
4. Hard refresh browser (Ctrl+Shift+R)
