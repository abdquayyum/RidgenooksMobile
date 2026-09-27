---
name: vps_safety
description: Crucial safety protocols for the Ridgenooks VPS (185.113.249.25)
trigger: always_on
---
# STRICT VPS SAFETY RULES

1. **NEVER use global kill commands**: DO NOT run `pkill -f uvicorn` or `killall python` or any broad termination commands on the VPS (`185.113.249.25`).
2. **Multiple Services Context**: The VPS hosts MULTIPLE separate services (like `ridgenooks-backend` on port 8002 and `refandearn` on port 8000). 
3. **Safe Restarts**: If you need to restart the Ridgenooks backend, use ONLY targeted commands:
   - `pm2 restart ridgenooks-backend`
   - Or restart via systemd: `systemctl restart ridgenooks-backend`
4. **DO NOT take down refandearn**: The `refandearn` service must remain online at all times. If it accidentally goes down, IMMEDIATELY run `systemctl start refandearn`.
