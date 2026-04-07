SCD MCP Docs local setup

1. In Google Cloud Console, enable:
   - Google Docs API
   - Google Sheets API
   - Google Drive API
2. Create an OAuth client of type `Desktop app`.
3. Copy `credentials.template.json` to `credentials.json` in this same folder and fill in your client ID and client secret.
4. Run the auth flow:

```powershell
cd 'C:\Users\USUARIO\Desktop\GEN+ TEMP\Machine Learning\Proyecto\SCD_MCP_Docs'
node .\dist\index.js auth
```

5. Google will open the browser and save the refresh token to:

```text
%USERPROFILE%\.config\scd-mcp-docs\token.json
```

6. Restart your MCP client so `SCD MCP Docs` is available in this session.


