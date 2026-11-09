@echo off
netsh advfirewall firewall add rule name="Basketball 3v3 phone access" dir=in action=allow protocol=TCP localport=3456 profile=private
if errorlevel 1 (
  echo Could not add the firewall rule. Right-click this file and choose Run as administrator.
) else (
  echo Private Wi-Fi access enabled for port 3456.
)
pause
