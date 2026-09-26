with open("src/app/property/[id].tsx", "r") as f:
    content = f.read()

# Make sure loadUserData is destructured
if "loadUserData" not in content.split("} = useGlobalState();")[0]:
    content = content.replace("setCurrentScreen", "setCurrentScreen, loadUserData")

old_log = """      await fetch(`${API_URL}/api/transactions`, { method: 'POST', headers: getAuthHeader(), body: JSON.stringify(payload) });
      router.push('/transactions');"""

new_log = """      await fetch(`${API_URL}/api/transactions`, { method: 'POST', headers: getAuthHeader(), body: JSON.stringify(payload) });
      if (currentUser?.email) {
          await loadUserData(currentUser.email);
      }
      setShowCheckout(false);
      router.push('/transactions');"""

content = content.replace(old_log, new_log)

with open("src/app/property/[id].tsx", "w") as f:
    f.write(content)
print("logTransaction fixed!")
